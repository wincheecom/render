// 抑制 AWS SDK 弃用警告
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// 动态加载数据库模块
let db;

// 初始化 Cloudflare R2 客户端
const r2Config = {
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: false, // Cloudflare R2 使用虚拟托管样式
};

console.log('R2 配置状态检查:');
console.log('R2_ENABLED:', process.env.R2_ENABLED);
console.log('R2_ENDPOINT:', process.env.R2_ENDPOINT);
console.log('R2_ACCESS_KEY_ID:', process.env.R2_ACCESS_KEY_ID ? '已设置' : '未设置');
console.log('R2_BUCKET_NAME:', process.env.R2_BUCKET_NAME);

// 检查所有必需的 R2 环境变量是否已设置
const requiredR2Vars = [
  'R2_ENABLED',
  'R2_ENDPOINT', 
  'R2_ACCESS_KEY_ID', 
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL'
];

const missingR2Vars = requiredR2Vars.filter(varName => !process.env[varName]);

if (missingR2Vars.length > 0) {
  console.log('警告: 缺少以下 R2 环境变量:', missingR2Vars);
}

let r2Client = null;

// 验证凭证是否有效
const isValidCredentials = process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY;

try {
  if (process.env.R2_ENABLED === 'true' && missingR2Vars.length === 0 && isValidCredentials) {
    r2Client = new S3Client(r2Config);
    console.log('R2 客户端初始化成功');
  } else {
    console.log('R2 未启用、缺少必要环境变量或凭证无效，跳过 R2 客户端初始化');
    if (!isValidCredentials) {
      console.log('凭证无效: R2_ACCESS_KEY_ID 或 R2_SECRET_ACCESS_KEY 未设置');
    }
  }
} catch (error) {
  console.error('R2 客户端初始化失败:', error.message);
  r2Client = null;
}

console.log('R2 客户端初始化完成:', !!r2Client);

// 尝试使用 PostgreSQL 数据库，失败则降级到简化数据库（为了开发便利性）
const initDB = async () => {
  try {
    // 导入 PostgreSQL 数据库模块
    const pgDb = require('./db');
    
    // 测试连接
    await pgDb.query('SELECT NOW()');
    db = pgDb;
    console.log('使用 PostgreSQL 数据库');
  } catch (error) {
    console.warn('PostgreSQL 连接失败，将使用简化数据库:', error.message);
    
    // 使用简化数据库
    db = require('./simple_db');
    console.log('已切换到简化数据库');
  }
};

// 初始化数据库连接
initDB().catch(error => {
  console.error('数据库初始化失败:', error);
  process.exit(1); // 如果数据库初始化失败，退出应用
});

// 强制确保管理员账户存在（在应用启动后稍等片刻执行）
setTimeout(async () => {
  try {
    // 检查当前使用的数据库类型
    if (db && typeof db.query === 'function') {
      // 简单判断是否为简化数据库（通过检查是否包含特定方法）
      if (!(db.constructor && db.constructor.toString().includes('SimpleDB'))) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const adminPasswordHash = await bcrypt.hash('123456', saltRounds);
        
        // 检查是否已存在管理员账户
        const result = await db.query('SELECT id, email FROM users WHERE email = $1', ['admin@example.com']);
        if (result.rows.length === 0) {
          // 如果不存在，插入默认管理员账户
          await db.query(
            `INSERT INTO users (email, password_hash, name, role, company_name) 
             VALUES ($1, $2, $3, $4, $5)` ,
            ['admin@example.com', adminPasswordHash, '管理员1', 'admin', '公司名称']
          );
          console.log('已添加默认管理员账户 admin@example.com');
        }
        
        // 检查第二个管理员账户
        const result2 = await db.query('SELECT id, email FROM users WHERE email = $1', ['admin2@example.com']);
        if (result2.rows.length === 0) {
          // 如果不存在，插入第二个管理员账户
          await db.query(
            `INSERT INTO users (email, password_hash, name, role, company_name) 
             VALUES ($1, $2, $3, $4, $5)` ,
            ['admin2@example.com', adminPasswordHash, '管理员2', 'admin', '公司名称']
          );
          console.log('已添加默认管理员账户 admin2@example.com');
        }
        
        console.log('管理员账户检查完成');
      }
    }
  } catch (error) {
    console.error('确保管理员账户存在时出错:', error);
  }
}, 3000); // 3秒后执行，确保数据库连接已建立

// 初始化数据库表（仅在使用 PostgreSQL 时）
setTimeout(async () => {
  // 检查当前使用的数据库类型
  if (db && typeof db.query === 'function') {
    // 简单判断是否为简化数据库（通过检查是否包含特定方法）
    if (db.constructor && db.constructor.toString().includes('SimpleDB')) {
      console.log('使用简化数据库，跳过表创建');
    } else {
      try {
        // Create tables individually to avoid any parsing issues
        await db.query(
          `CREATE TABLE IF NOT EXISTS products (
            "id" SERIAL PRIMARY KEY,
            "product_code" VARCHAR(255) NOT NULL,
            "product_name" VARCHAR(255) NOT NULL,
            "product_supplier" VARCHAR(255),
            "quantity" INTEGER DEFAULT 0,
            "purchase_price" DECIMAL(10, 2),
            "sale_price" DECIMAL(10, 2),
            "image" TEXT,
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`
        );
        
        // 检查并添加 image 列（如果不存在）
        try {
          // 首先检查列是否存在
          const result = await db.query(
            "SELECT column_name FROM information_schema.columns " +
            "WHERE table_name='products' AND column_name='image';"
          );
          
          if (result.rows.length === 0) {
            // 如果列不存在，则添加它
            await db.query('ALTER TABLE products ADD COLUMN image TEXT;');
            console.log('Image column added to products table');
          } else {
            console.log('Image column already exists in products table');
          }
        } catch (err) {
          console.log('Error checking/adding image column:', err.message);
        }
        
        await db.query(
          `CREATE TABLE IF NOT EXISTS tasks (
            "id" SERIAL PRIMARY KEY,
            "task_number" VARCHAR(255) NOT NULL,
            "status" VARCHAR(50) DEFAULT 'pending',
            "items" JSONB,
            "body_code_image" TEXT,
            "barcode_image" TEXT,
            "warning_code_image" TEXT,
            "label_image" TEXT,
            "manual_image" TEXT,
            "other_image" TEXT,
            "creator_name" VARCHAR(255),
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "completed_at" TIMESTAMP
          )`
        );
        
        await db.query(
          `CREATE TABLE IF NOT EXISTS history (
            "id" SERIAL PRIMARY KEY,
            "task_number" VARCHAR(255) NOT NULL,
            "status" VARCHAR(50),
            "items" JSONB,
            "body_code_image" TEXT,
            "barcode_image" TEXT,
            "warning_code_image" TEXT,
            "label_image" TEXT,
            "manual_image" TEXT,
            "other_image" TEXT,
            "creator_name" VARCHAR(255),
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "completed_at" TIMESTAMP
          )`
        );
        
        await db.query(
          `CREATE TABLE IF NOT EXISTS activities (
            "id" SERIAL PRIMARY KEY,
            "time" VARCHAR(255),
            "type" VARCHAR(50),
            "details" TEXT,
            "actor" VARCHAR(255),
            "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`
        );
        
        console.log('数据库表初始化完成');
      } catch (err) {
        console.error('数据库表初始化错误:', err);
      }
    }
  }
}, 2000);

const app = express();
const PORT = process.env.PORT || 3002;

// JWT 配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
// 增加请求大小限制以支持图片上传
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Adminer route for database management
app.get('/adminer', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Adminer - Database Management</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; text-align: center; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            .info { background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: left; }
            .btn { background-color: #4a6cf7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 5px; }
            .btn:hover { background-color: #3a5ce5; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Adminer Database Management</h1>
            <div class="info">
                <p><strong>Database Connection Info:</strong></p>
                <p><strong>Host:</strong> ${process.env.DB_HOST || 'localhost'}</p>
                <p><strong>Database:</strong> ${process.env.DB_NAME || 'funseek'}</p>
                <p><strong>Username:</strong> ${process.env.DB_USER || 'postgres'}</p>
                <p><strong>Password:</strong> ${process.env.DB_PASSWORD || 'postgres'}</p>
                <p><strong>Port:</strong> ${process.env.DB_PORT || '5432'}</p>
            </div>
            <p>Click the button below to access Adminer for database management:</p>
            <a href="https://www.adminer.org/" target="_blank" class="btn">Open Adminer</a>
            <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
                Note: For security reasons, this application doesn't host Adminer directly. 
                You'll be redirected to the official Adminer website. Use the connection 
                details above to connect to your database.
            </p>
        </div>
    </body>
    </html>
  `);
});

// Route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 权限中间件
function requireRole(requiredRoles) {
  return (req, res, next) => {
    // 首先检查Authorization头中的JWT令牌
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      // 如果没有令牌，仍支持旧的x-user-role头用于兼容性
      const userRole = req.headers['x-user-role'] || 'admin'; // 默认为admin用于测试
      
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ error: '权限不足', message: `需要 ${requiredRoles.join(' 或 ')} 角色才能访问此资源` });
      }
      
      next();
      return;
    }
    
    // 使用JWT令牌验证用户身份
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: '令牌无效' });
      }
      
      // 检查用户角色是否在所需角色列表中
      if (!requiredRoles.includes(user.role)) {
        return res.status(403).json({ error: '权限不足', message: `需要 ${requiredRoles.join(' 或 ')} 角色才能访问此资源` });
      }
      
      req.user = user; // 将用户信息附加到请求对象
      next();
    });
  };
}

// 验证 JWT Token 的中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: '访问被拒绝，缺少令牌' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效' });
    }
    req.user = user; // 将用户信息附加到请求对象
    next();
  });
}

// 用户认证相关 API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证输入参数
    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码都是必填项' });
    }
    
    // 查询用户
    const result = await db.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
    
    if (result.rows.length === 0) {
      console.log(`登录失败: 用户 ${email} 不存在`);
      return res.status(401).json({ error: '邮箱或密码错误' });
    }
    
    const user = result.rows[0];
    
    // 验证密码
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      console.log(`登录失败: 用户 ${email} 密码错误`);
      return res.status(401).json({ error: '邮箱或密码错误' });
    }
    
    // 生成 JWT Token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // 更新最后登录时间
    await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    
    // 返回用户信息和令牌（不包含密码）
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.company_name,
        currency: user.currency,
        language: user.language,
        settings: user.settings
      }
    });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, companyName, role } = req.body;
    
    // 验证输入参数
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: '邮箱、密码、姓名和角色都是必填项' });
    }
    
    // 验证角色是否为允许的角色
    if (!['sales', 'warehouse'].includes(role)) {
      return res.status(400).json({ error: '角色必须是 sales 或 warehouse' });
    }
    
    // 检查邮箱是否已存在
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }
    
    // 密码长度验证
    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少为6位' });
    }
    
    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建新用户
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name, role, company_name) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, name, role, company_name, currency, language, settings, created_at`,
      [email, hashedPassword, name, role, companyName || '']
    );
    
    const user = result.rows[0];
    
    // 生成 JWT Token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.company_name,
        currency: user.currency,
        language: user.language,
        settings: user.settings
      }
    });
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

// 重置管理员密码的API（仅在开发环境或紧急情况下使用）
app.post('/api/auth/reset-admin-password', async (req, res) => {
  try {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const newPassword = '123456'; // 默认密码
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // 重置所有管理员账户的密码
    const result = await db.query(
      'UPDATE users SET password_hash = $1 WHERE role = $2 RETURNING email',
      [hashedPassword, 'admin']
    );
    
    console.log(`重置了 ${result.rowCount} 个管理员账户的密码`);
    
    res.json({ 
      message: `成功重置了 ${result.rowCount} 个管理员账户的密码`,
      count: result.rowCount
    });
  } catch (err) {
    console.error('重置管理员密码错误:', err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

// 重置管理员密码的GET端点（用于浏览器访问）
app.get('/api/auth/reset-admin-password', async (req, res) => {
  try {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const newPassword = '123456'; // 默认密码
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // 重置所有管理员账户的密码
    const result = await db.query(
      'UPDATE users SET password_hash = $1 WHERE role = $2 RETURNING email',
      [hashedPassword, 'admin']
    );
    
    console.log(`重置了 ${result.rowCount} 个管理员账户的密码`);
    
    res.send(`
      <html>
      <head><title>重置管理员密码</title></head>
      <body>
        <h2>重置管理员密码</h2>
        <p>成功重置了 ${result.rowCount} 个管理员账户的密码</p>
        <p>默认密码: 123456</p>
        <ul>
          ${result.rows.map(row => `<li>${row.email}</li>`).join('')}
        </ul>
        <a href="/">返回首页</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('重置管理员密码错误:', err);
    res.status(500).send(`<h2>服务器错误</h2><p>${err.message}</p><a href="/">返回首页</a>`);
  }
});

// 获取当前用户信息
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, role, company_name, currency, language, settings, is_active, last_login, created_at, updated_at FROM users WHERE id = $1', 
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    const user = result.rows[0];
    
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyName: user.company_name,
      currency: user.currency,
      language: user.language,
      settings: user.settings,
      isActive: user.is_active,
      lastLogin: user.last_login,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });
  } catch (err) {
    console.error('获取用户信息错误:', err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

// API routes for products
app.get('/api/products', requireRole(['admin', 'sales']), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.post('/api/products', requireRole(['admin']), async (req, res) => {
  try {
    const { product_code, product_name, product_supplier, quantity, purchase_price, sale_price, image } = req.body;
    
    // 如果有图片，上传到 R2
    let imageUrl = image;
    if (image && image.startsWith('data:image')) {
      imageUrl = await uploadImageToR2(image, `${product_code}_product.jpg`);
    }
    
    const result = await db.query(
      'INSERT INTO products ("product_code", "product_name", "product_supplier", "quantity", "purchase_price", "sale_price", "image", "created_at") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [product_code, product_name, product_supplier, quantity, purchase_price, sale_price, imageUrl]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

// API routes for tasks
app.get('/api/tasks', requireRole(['admin', 'sales', 'warehouse']), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.post('/api/tasks', requireRole(['admin', 'sales']), async (req, res) => {
  try {
    const { task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image, manual_image, other_image, creator_name } = req.body;
    
    // 如果有图片，上传到 R2
    let bodyCodeImageUrl = body_code_image || null;
    let barcodeImageUrl = barcode_image || null;
    let warningCodeImageUrl = warning_code_image || null;
    let labelImageUrl = label_image || null;
    let manualImageUrl = manual_image || null;
    let otherImageUrl = other_image || null;
    
    if (body_code_image && body_code_image.startsWith('data:image')) {
      bodyCodeImageUrl = await uploadImageToR2(body_code_image, `${task_number}_body_code.jpg`);
    }
    if (barcode_image && barcode_image.startsWith('data:image')) {
      barcodeImageUrl = await uploadImageToR2(barcode_image, `${task_number}_barcode.jpg`);
    }
    if (warning_code_image && warning_code_image.startsWith('data:image')) {
      warningCodeImageUrl = await uploadImageToR2(warning_code_image, `${task_number}_warning_code.jpg`);
    }
    if (label_image && label_image.startsWith('data:image')) {
      labelImageUrl = await uploadImageToR2(label_image, `${task_number}_label.jpg`);
    }
    if (manual_image && manual_image.startsWith('data:image')) {
      manualImageUrl = await uploadImageToR2(manual_image, `${task_number}_manual.jpg`);
    }
    if (other_image && other_image.startsWith('data:image')) {
      otherImageUrl = await uploadImageToR2(other_image, `${task_number}_other.jpg`);
    }
    
    // 在事务中进行验证和创建任务，防止并发冲突
    await db.query('BEGIN');
    
    // 验证购物车中的所有商品是否真实存在并检查库存
    for (const item of items) {
      const productCheck = await db.query('SELECT * FROM products WHERE "id" = $1 FOR UPDATE', [item.productId]);
      if (productCheck.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(400).json({ error: `商品 ${item.productName || '未知商品'} (ID: ${item.productId}) 不存在或已被删除` });
      }
      
      // 检查库存是否足够
      const product = productCheck.rows[0];
      if (product.quantity < item.quantity) {
        await db.query('ROLLBACK');
        return res.status(400).json({ error: `商品 ${product.product_name} 库存不足 (需要: ${item.quantity}, 库存: ${product.quantity})` });
      }
    }
    
    const result = await db.query(
      'INSERT INTO tasks ("task_number", "status", "items", "body_code_image", "barcode_image", "warning_code_image", "label_image", "manual_image", "other_image", "creator_name", "created_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [task_number, status, items ? JSON.stringify(items) : '[]', bodyCodeImageUrl, barcodeImageUrl, warningCodeImageUrl, labelImageUrl, manualImageUrl, otherImageUrl, creator_name || null, new Date()]
    );
    
    // 更新相关产品的库存
    for (const item of items) {
      await db.query(
        'UPDATE products SET "quantity" = "quantity" - $1 WHERE "id" = $2',
        [item.quantity, item.productId]
      );
    }
    
    await db.query('COMMIT');
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('创建任务错误:', err);
    
    // 检查错误是否与商品不存在相关
    if (err.message && (err.message.includes('商品') || err.message.includes('product'))) {
      res.status(400).json({ error: '商品不存在或库存不足，请刷新页面重试', message: err.message });
    } else {
      res.status(500).json({ error: '服务器错误', message: err.message });
    }
  }
});

app.put('/api/tasks/:id', requireRole(['admin', 'warehouse']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // 如果有图片，上传到 R2
    const imageFields = ['body_code_image', 'barcode_image', 'warning_code_image', 'label_image', 'manual_image', 'other_image'];
    for (const field of imageFields) {
      if (updates[field] && updates[field].startsWith('data:image')) {
        updates[field] = await uploadImageToR2(updates[field], `${id}_${field}.jpg`);
      }
    }
    
    // 构建动态更新查询
    const updateFields = [];
    const values = [];
    let paramIndex = 2;
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id') {
        updateFields.push(`"${key}" = $${paramIndex}`);
        if (key === 'items') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
        paramIndex++;
      }
    }
    
    values.unshift(id); // id is the first parameter
    
    const query = `UPDATE tasks SET ${updateFields.join(', ')} WHERE "id" = $1 RETURNING *`;
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '任务未找到' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.delete('/api/tasks/:id', requireRole(['admin', 'sales']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // 开始事务
    await db.query('BEGIN');
    
    // 获取任务数据
    const taskResult = await db.query('SELECT * FROM tasks WHERE "id" = $1', [id]);
    
    if (taskResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: '任务未找到' });
    }
    
    const task = taskResult.rows[0];
    
    // 将任务数据移动到历史表
    await db.query(
      `INSERT INTO history ("task_number", "status", "items", "body_code_image", "barcode_image", "warning_code_image", "label_image", "manual_image", "other_image", "creator_name", "created_at", "completed_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)` ,
      [task.task_number, task.status, task.items ? JSON.stringify(task.items) : (task.items_str || '[]'), task.body_code_image, task.barcode_image, task.warning_code_image, task.label_image, task.manual_image, task.other_image, task.creator_name, new Date(), task.completed_at || new Date().toISOString()]
    );
    
    // 从任务表中删除
    await db.query('DELETE FROM tasks WHERE "id" = $1', [id]);
    
    // 提交事务
    await db.query('COMMIT');
    
    res.json({ message: '任务已移动到历史记录' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

// API routes for products
app.get('/api/products/:id', requireRole(['admin', 'sales']), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE "id" = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '产品未找到' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.put('/api/products/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // 如果有图片，上传到 R2
    if (updates.image && updates.image.startsWith('data:image')) {
      // 获取当前产品信息以获取产品代码
      const currentProduct = await db.query('SELECT product_code FROM products WHERE "id" = $1', [id]);
      if (currentProduct.rows.length > 0) {
        updates.image = await uploadImageToR2(updates.image, `${currentProduct.rows[0].product_code}_product.jpg`);
      }
    }
    
    // 构建动态更新查询
    const updateFields = [];
    const values = [];
    let paramIndex = 2;
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id') {
        updateFields.push(`"${key}" = $${paramIndex}`);
        if (key === 'items') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
        paramIndex++;
      }
    }
    
    values.unshift(id); // id is the first parameter
    
    const query = `UPDATE products SET ${updateFields.join(', ')} WHERE "id" = $1 RETURNING *`;
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '产品未找到' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.delete('/api/products/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    console.log('准备删除产品，ID:', id);
    const result = await db.query('SELECT id FROM products WHERE "id" = $1', [id]);
    console.log('查询结果:', result.rows);
    
    if (result.rows.length === 0) {
      console.log('产品未找到，ID:', id);
      return res.status(404).json({ error: '产品未找到' });
    }
    
    console.log('开始删除产品，ID:', id);
    await db.query('DELETE FROM products WHERE "id" = $1', [id]);
    console.log('产品已删除，ID:', id);
    
    res.json({ message: '产品删除成功' });
  } catch (err) {
    console.error('删除产品时发生错误:', err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

// API routes for history
app.get('/api/history', requireRole(['admin', 'sales', 'warehouse']), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM history ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.post('/api/history', requireRole(['admin', 'warehouse']), async (req, res) => {
  try {
    const { task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image, manual_image, other_image, creator_name, completed_at } = req.body;
    
    // 如果有图片，上传到 R2
    let bodyCodeImageUrl = body_code_image;
    let barcodeImageUrl = barcode_image;
    let warningCodeImageUrl = warning_code_image;
    let labelImageUrl = label_image;
    let manualImageUrl = manual_image;
    let otherImageUrl = other_image;
    
    if (body_code_image && body_code_image.startsWith('data:image')) {
      bodyCodeImageUrl = await uploadImageToR2(body_code_image, `${task_number}_body_code_history.jpg`);
    }
    if (barcode_image && barcode_image.startsWith('data:image')) {
      barcodeImageUrl = await uploadImageToR2(barcode_image, `${task_number}_barcode_history.jpg`);
    }
    if (warning_code_image && warning_code_image.startsWith('data:image')) {
      warningCodeImageUrl = await uploadImageToR2(warning_code_image, `${task_number}_warning_code_history.jpg`);
    }
    if (label_image && label_image.startsWith('data:image')) {
      labelImageUrl = await uploadImageToR2(label_image, `${task_number}_label_history.jpg`);
    }
    if (manual_image && manual_image.startsWith('data:image')) {
      manualImageUrl = await uploadImageToR2(manual_image, `${task_number}_manual_history.jpg`);
    }
    if (other_image && other_image.startsWith('data:image')) {
      otherImageUrl = await uploadImageToR2(other_image, `${task_number}_other_history.jpg`);
    }
    
    const result = await db.query(
      'INSERT INTO history ("task_number", "status", "items", "body_code_image", "barcode_image", "warning_code_image", "label_image", "manual_image", "other_image", "creator_name", "created_at", "completed_at") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [task_number, status, JSON.stringify(items), bodyCodeImageUrl, barcodeImageUrl, warningCodeImageUrl, labelImageUrl, manualImageUrl, otherImageUrl, creator_name, new Date(), completed_at || new Date().toISOString()]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

// API routes for activities
app.get('/api/activities', requireRole(['admin', 'sales', 'warehouse']), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM activities ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.post('/api/activities', requireRole(['admin', 'sales', 'warehouse']), async (req, res) => {
  try {
    const { time, type, details, actor } = req.body;
    const result = await db.query(
      'INSERT INTO activities ("time", "type", "details", "actor", "created_at") VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [time, type, details, actor]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

// 辅助函数：将图片上传到 R2 存储
async function uploadImageToR2(imageBase64, filename) {
  console.log('uploadImageToR2 被调用，R2_ENABLED:', process.env.R2_ENABLED);
  console.log('r2Client 是否存在:', !!r2Client);
  if (!r2Client || process.env.R2_ENABLED !== 'true') {
    console.log('R2 未启用或配置不正确，返回 base64 数据');
    // 如果 R2 未启用，返回原始 base64 数据
    return imageBase64;
  }

  try {
    // 从 base64 数据中提取 MIME 类型
    const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid base64 image string');
    
    const mimeType = matches[1];
    const imageData = Buffer.from(matches[2], 'base64');
    
    // 生成唯一文件名
    const uniqueFilename = `${Date.now()}-${filename}`;
    
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `images/${uniqueFilename}`,
      Body: imageData,
      ContentType: mimeType,
    };
    
    const command = new PutObjectCommand(params);
    await r2Client.send(command);
    
    // 返回 R2 存储的 URL
    const imageUrl = `${process.env.R2_PUBLIC_URL}/images/${uniqueFilename}`;
    return imageUrl;
  } catch (error) {
    console.error('上传到 R2 失败:', error);
    // 如果 R2 上传失败，返回原始 base64 数据
    return imageBase64;
  }
}

// 辅助函数：从 R2 删除图片
async function deleteImageFromR2(url) {
  console.log('deleteImageFromR2 被调用，R2_ENABLED:', process.env.R2_ENABLED);
  if (!r2Client || process.env.R2_ENABLED !== 'true') {
    console.log('R2 未启用或配置不正确，跳过删除');
    return;
  }

  try {
    // 从 URL 提取文件键
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (url.startsWith(publicUrl)) {
      const key = url.substring(publicUrl.length + 1); // +1 for leading slash
      
      const deleteParams = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      };
      
      const command = new DeleteObjectCommand(deleteParams);
      await r2Client.send(command);
    }
  } catch (error) {
    console.error('从 R2 删除图片失败:', error);
  }
}

// R2 连接测试 API
app.get('/api/r2-test', async (req, res) => {
  if (!r2Client || process.env.R2_ENABLED !== 'true') {
    return res.status(400).json({ success: false, error: 'R2 未启用或配置不正确' });
  }
  
  try {
    // 1. 测试列出文件
    const listCmd = new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET_NAME });
    const listResult = await r2Client.send(listCmd);
    
    // 2. 生成一个测试上传URL
    const testFileName = `test-${Date.now()}.txt`;
    const uploadCmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: testFileName,
      ContentType: 'text/plain',
    });
    
    const signedUrl = await getSignedUrl(r2Client, uploadCmd, { expiresIn: 60 });
    
    res.json({
      success: true,
      message: 'R2 配置成功！',
      existingFiles: listResult.Contents?.map(f => f.Key) || [],
      testUploadUrl: signedUrl,
      testFileUrl: `${process.env.R2_PUBLIC_URL}/${testFileName}`,
    });
  } catch (error) {
    console.error('R2 测试失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to clear demo data (only for development)
app.post('/api/clear-demo-data', async (req, res) => {
  if (process.env.NODE_ENV !== 'development' && !process.env.CLEAR_DATA_ENABLED) {
    return res.status(403).json({ error: '此接口仅在开发环境中启用' });
  }
  
  try {
    await db.query('BEGIN');
    
    // Clear all demo data
    await db.query('DELETE FROM activities');
    await db.query('DELETE FROM history');
    await db.query('DELETE FROM tasks');
    await db.query('DELETE FROM products');
    
    await db.query('COMMIT');
    
    res.json({ message: '演示数据已清除' });
  } catch (err) {
    console.error('清除演示数据失败:', err);
    res.status(500).json({ error: '清除演示数据失败' });
  }
});

let attempts = 0;
const maxAttempts = 10;
const startServer = (port) => {
  if (attempts >= maxAttempts) {
    console.log(`已尝试 ${maxAttempts} 次端口，无法找到可用端口，请手动指定端口`);
    process.exit(1);
  }
  
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Visit http://localhost:${port} to access the application`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`端口 ${port} 已被占用，尝试下一个端口...`);
      attempts++;
      const nextPort = port + 1;
      startServer(nextPort);
    } else {
      console.log('服务器启动错误', err);
      process.exit(1);
    }
  });
};

startServer(PORT);

// Initialize database tables if they don't exist

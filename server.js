require('dotenv').config();
// 抑制 AWS SDK 弃用警告
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';
const express = require('express');
const path = require('path');
const cors = require('cors');
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
  forcePathStyle: true, // 确保使用路径样式而不是子域名
  signatureVersion: 'v4', // 明确指定签名版本
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

// 尝试连接到 PostgreSQL，如果失败则使用简化数据库
const initDB = async () => {
  try {
    // 尝试导入 PostgreSQL 数据库模块
    const pgDb = require('./db');
    
    // 测试连接
    await pgDb.query('SELECT NOW()');
    db = pgDb;
    console.log('使用 PostgreSQL 数据库');
  } catch (error) {
    // 如果 PostgreSQL 不可用，则使用简化数据库
    console.log('PostgreSQL 不可用，使用简化数据库');
    db = require('./simple_db');
  }
};

// 初始化数据库连接
initDB();

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
const PORT = process.env.PORT || 3000;

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

// API routes for products
app.get('/api/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
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
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image } = req.body;
    
    // 如果有图片，上传到 R2
    let bodyCodeImageUrl = body_code_image;
    let barcodeImageUrl = barcode_image;
    let warningCodeImageUrl = warning_code_image;
    let labelImageUrl = label_image;
    
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
    
    // 在事务中进行验证和创建任务，防止并发冲突
    await db.query('BEGIN');
    
    // 验证购物车中的所有商品是否真实存在并检查库存
    for (const item of items) {
      const productCheck = await db.query('SELECT * FROM products WHERE "id" = $1 FOR UPDATE', [item.productId]);
      if (productCheck.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(400).json({ error: `商品 ${item.productName || '未知商品'} (ID: ${item.productId}) 不存在` });
      }
      
      // 检查库存是否足够
      const product = productCheck.rows[0];
      if (product.quantity < item.quantity) {
        await db.query('ROLLBACK');
        return res.status(400).json({ error: `商品 ${product.product_name} 库存不足 (需要: ${item.quantity}, 库存: ${product.quantity})` });
      }
    }
    
    const result = await db.query(
      'INSERT INTO tasks ("task_number", "status", "items", "body_code_image", "barcode_image", "warning_code_image", "label_image", "created_at") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [task_number, status, JSON.stringify(items), bodyCodeImageUrl, barcodeImageUrl, warningCodeImageUrl, labelImageUrl]
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
    console.error(err);
    try {
      await db.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('回滚失败:', rollbackErr);
    }
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // 如果有图片，上传到 R2
    const imageFields = ['body_code_image', 'barcode_image', 'warning_code_image', 'label_image'];
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

app.delete('/api/tasks/:id', async (req, res) => {
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
      `INSERT INTO history ("task_number", "status", "items", "body_code_image", "barcode_image", "warning_code_image", "label_image", "created_at", "completed_at")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)`,
      [task.task_number, task.status, JSON.stringify(task.items), task.body_code_image, task.barcode_image, task.warning_code_image, task.label_image, task.completed_at || new Date().toISOString()]
    );
    
    // 从任务表中删除
    await db.query('DELETE FROM tasks WHERE "id" = $1', [id]);
    
    // 提交事务
    await db.query('COMMIT');
    
    res.json({ message: '任务已移动到历史记录' });
  } catch (err) {
    console.error(err);
    try {
      await db.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('回滚失败:', rollbackErr);
    }
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

// API routes for products
app.put('/api/products/:id', async (req, res) => {
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

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT id FROM products WHERE "id" = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '产品未找到' });
    }
    
    await db.query('DELETE FROM products WHERE "id" = $1', [id]);
    
    res.json({ message: '产品删除成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

// API routes for history
app.get('/api/history', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM history ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.post('/api/history', async (req, res) => {
  try {
    const { task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image, completed_at } = req.body;
    
    // 如果有图片，上传到 R2
    let bodyCodeImageUrl = body_code_image;
    let barcodeImageUrl = barcode_image;
    let warningCodeImageUrl = warning_code_image;
    let labelImageUrl = label_image;
    
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
    
    const result = await db.query(
      'INSERT INTO history ("task_number", "status", "items", "body_code_image", "barcode_image", "warning_code_image", "label_image", "created_at", "completed_at") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8) RETURNING *',
      [task_number, status, JSON.stringify(items), bodyCodeImageUrl, barcodeImageUrl, warningCodeImageUrl, labelImageUrl, completed_at || new Date().toISOString()]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

// API routes for activities
app.get('/api/activities', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM activities ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误', message: err.message });
  }
});

app.post('/api/activities', async (req, res) => {
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
    try {
      await db.query('ROLLBACK');
    } catch (rollbackErr) {
      console.error('回滚失败:', rollbackErr);
    }
    res.status(500).json({ error: '清除演示数据失败' });
  }
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`端口 ${PORT} 已被占用，请使用不同的端口`);
  } else {
    console.log('服务器启动错误', err);
  }
});

// Initialize database tables if they don't exist
setTimeout(async () => {
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
    console.error('数据库初始化错误:', err);
    // 如果是数据库不存在的错误，给出更明确的提示
    if (err.code === '3D000') {
      console.log('提示：错误代码 3D000 表示数据库不存在，请检查数据库配置');
    } else if (err.code === 'ENOTFOUND') {
      console.log('提示：无法解析数据库主机地址，请检查网络连接和数据库配置');
    }
  }
}, 2000);
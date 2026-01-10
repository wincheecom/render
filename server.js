require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { product_code, product_name, product_supplier, quantity, purchase_price, sale_price } = req.body;
    const result = await db.query(
      'INSERT INTO products ("product_code", "product_name", "product_supplier", "quantity", "purchase_price", "sale_price", "created_at") VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
      [product_code, product_name, product_supplier, quantity, purchase_price, sale_price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// API routes for tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image } = req.body;
    const result = await db.query(
      'INSERT INTO tasks ("task_number", "status", "items", "body_code_image", "barcode_image", "warning_code_image", "label_image", "created_at") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [task_number, status, JSON.stringify(items), body_code_image, barcode_image, warning_code_image, label_image]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // 构建动态更新查询
    const updateFields = [];
    const values = [];
    let paramIndex = 2;
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id') {
        updateFields.push(`"${key}" = $${paramIndex}`);
        values.push(key === 'items' ? JSON.stringify(value) : value);
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
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 获取任务数据
    const taskResult = await db.query('SELECT * FROM tasks WHERE "id" = $1', [id]);
    
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: '任务未找到' });
    }
    
    const task = taskResult.rows[0];
    
    // 将任务数据移动到历史表
    await db.query(
      `INSERT INTO history ("task_number", "status", "items", "body_code_image", "barcode_image", "warning_code_image", "label_image", "created_at", "completed_at")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [task.task_number, task.status, task.items, task.body_code_image, task.barcode_image, task.warning_code_image, task.label_image, task.created_at, task.completed_at || new Date().toISOString()]
    );
    
    // 从任务表中删除
    await db.query('DELETE FROM tasks WHERE "id" = $1', [id]);
    
    res.json({ message: '任务已移动到历史记录' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// API routes for products
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // 构建动态更新查询
    const updateFields = [];
    const values = [];
    let paramIndex = 2;
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id') {
        updateFields.push(`"${key}" = $${paramIndex}`);
        values.push(value);
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
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM products WHERE "id" = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '产品未找到' });
    }
    
    res.json({ message: '产品删除成功' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// API routes for history
app.get('/api/history', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM history ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/history', async (req, res) => {
  try {
    const { task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image, completed_at } = req.body;
    const result = await db.query(
      'INSERT INTO history ("task_number", "status", "items", "body_code_image", "barcode_image", "warning_code_image", "label_image", "created_at", "completed_at") VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8) RETURNING *',
      [task_number, status, JSON.stringify(items), body_code_image, barcode_image, warning_code_image, label_image, completed_at || new Date().toISOString()]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// API routes for activities
app.get('/api/activities', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM activities ORDER BY "created_at" DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
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
    res.status(500).json({ error: '服务器错误' });
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
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
        
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
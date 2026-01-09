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
                details above to connect to your PostgreSQL database.
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
    const [rows] = await db.query('SELECT * FROM products ORDER BY `created_at` DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { product_code, product_name, product_supplier, quantity, purchase_price, sale_price } = req.body;
    const [result] = await db.query(
      'INSERT INTO products (product_code, product_name, product_supplier, quantity, purchase_price, sale_price, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [product_code, product_name, product_supplier, quantity, purchase_price, sale_price]
    );
    // 获取插入的记录
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// API routes for tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY `created_at` DESC');
    res.json(rows);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image } = req.body;
    const [result] = await db.query(
      'INSERT INTO tasks (task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [task_number, status, JSON.stringify(items), body_code_image, barcode_image, warning_code_image, label_image]
    );
    // 获取插入的记录
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.json(rows[0]);
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
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id') {
        updateFields.push(`${key} = ?`);
        values.push(key === 'items' ? JSON.stringify(value) : value);
      }
    }
    
    values.push(id); // id is the last parameter
    
    const query = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`;
    const [result] = await db.query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '任务未找到' });
    }
    
    // 获取更新后的记录
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 获取任务数据
    const [taskResult] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    
    if (taskResult.length === 0) {
      return res.status(404).json({ error: '任务未找到' });
    }
    
    const task = taskResult[0];
    
    // 将任务数据移动到历史表
    await db.query(
      `INSERT INTO history (task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image, created_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [task.task_number, task.status, task.items, task.body_code_image, task.barcode_image, task.warning_code_image, task.label_image]
    );
    
    // 从任务表中删除
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    
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
    
    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id') {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    values.push(id); // id is the last parameter
    
    const query = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;
    const [result] = await db.query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '产品未找到' });
    }
    
    // 获取更新后的记录
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
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
    const [rows] = await db.query('SELECT * FROM history ORDER BY `created_at` DESC');
    res.json(rows);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/history', async (req, res) => {
  try {
    const { task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image, completed_at } = req.body;
    const [result] = await db.query(
      'INSERT INTO history (task_number, status, items, body_code_image, barcode_image, warning_code_image, label_image, created_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [task_number, status, JSON.stringify(items), body_code_image, barcode_image, warning_code_image, label_image]
    );
    // 获取插入的记录
    const [rows] = await db.query('SELECT * FROM history WHERE id = ?', [result.insertId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// API routes for activities
app.get('/api/activities', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM activities ORDER BY `created_at` DESC');
    res.json(rows);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/activities', async (req, res) => {
  try {
    const { time, type, details, username } = req.body;
    const [result] = await db.query(
      'INSERT INTO activities (time, type, details, actor, created_at) VALUES (?, ?, ?, ?, NOW())',
      [time, type, details, username]
    );
    // 获取插入的记录
    const [rows] = await db.query('SELECT * FROM activities WHERE id = ?', [result.insertId]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
  
  // Initialize database tables if they don't exist
  try {
    // Create tables individually to avoid any parsing issues
    await db.query(
      `CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_code VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_supplier VARCHAR(255),
        quantity INT DEFAULT 0,
        purchase_price DECIMAL(10, 2),
        sale_price DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
    
    await db.query(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_number VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        items TEXT,
        body_code_image LONGTEXT,
        barcode_image LONGTEXT,
        warning_code_image LONGTEXT,
        label_image LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL
      )`
    );
    
    await db.query(
      `CREATE TABLE IF NOT EXISTS history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_number VARCHAR(255) NOT NULL,
        status VARCHAR(50),
        items TEXT,
        body_code_image LONGTEXT,
        barcode_image LONGTEXT,
        warning_code_image LONGTEXT,
        label_image LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL
      )`
    );
    
    await db.query(
      `CREATE TABLE IF NOT EXISTS activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        time VARCHAR(255),
        type VARCHAR(50),
        details TEXT,
        actor VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
    
    console.log('数据库表初始化完成');
  } catch (err) {
    console.error('数据库初始化错误:', err);
  }
});
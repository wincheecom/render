const mysql = require('mysql2/promise');

// MySQL/MariaDB 连接池配置
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
pool.getConnection(async (err, connection) => {
  if (err) {
    console.error('数据库连接失败:', err.stack);
  } else {
    console.log('数据库连接成功');
    connection.release(); // 释放连接回连接池
    await initializeDatabase();
  }
});

// 初始化数据库，添加示例数据
async function initializeDatabase() {
  try {
    // 检查 products 表是否为空
    const productsResult = await pool.execute('SELECT COUNT(*) AS count FROM products');
    if (parseInt(productsResult[0][0].count) === 0) {
      // 插入示例产品数据
      await pool.execute(
        `INSERT INTO products (product_code, product_name, product_supplier, quantity, purchase_price, sale_price, created_at) 
         VALUES 
         (?, ?, ?, ?, ?, ?, NOW()),
         (?, ?, ?, ?, ?, ?, NOW()),
         (?, ?, ?, ?, ?, ?, NOW())`,
        ['PRD001', '示例产品1', '供应商A', 50, 10.99, 19.99,
         'PRD002', '示例产品2', '供应商B', 30, 15.50, 25.99,
         'PRD003', '示例产品3', '供应商A', 20, 8.75, 16.50]
      );
      console.log('已添加示例产品数据');
    }
    
    // 检查 tasks 表是否为空
    const tasksResult = await pool.execute('SELECT COUNT(*) AS count FROM tasks');
    if (parseInt(tasksResult[0][0].count) === 0) {
      // 插入示例任务数据
      await pool.execute(
        `INSERT INTO tasks (task_number, status, items, created_at) 
         VALUES 
         (?, ?, ?, NOW()),
         (?, ?, ?, NOW())`,
        ['TASK001', 'pending', '[{"product_code":"PRD001", "quantity":10}]',
         'TASK002', 'completed', '[{"product_code":"PRD002", "quantity":5}]']
      );
      console.log('已添加示例任务数据');
    }
    
    // 检查 history 表是否为空
    const historyResult = await pool.execute('SELECT COUNT(*) AS count FROM history');
    if (parseInt(historyResult[0][0].count) === 0) {
      // 插入示例历史数据
      await pool.execute(
        `INSERT INTO history (task_number, status, items, created_at, completed_at) 
         VALUES 
         (?, ?, ?, NOW(), NOW())`,
        ['HIST001', 'completed', '[{"product_code":"PRD003", "quantity":8}]']
      );
      console.log('已添加示例历史数据');
    }
    
    // 检查 activities 表是否为空
    const activitiesResult = await pool.execute('SELECT COUNT(*) AS count FROM activities');
    if (parseInt(activitiesResult[0][0].count) === 0) {
      // 插入示例活动数据
      await pool.execute(
        `INSERT INTO activities (time, type, details, actor, created_at) 
         VALUES 
         (NOW(), ?, ?, ?, NOW())`,
        ['system', '系统初始化', 'admin']
      );
      console.log('已添加示例活动数据');
    }
    
    console.log('数据库初始化完成');
  } catch (err) {
    console.error('数据库初始化错误:', err);
  }
}

module.exports = {
  query: (sql, params) => pool.execute(sql, params),
};
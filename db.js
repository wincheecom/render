const { Pool } = require('pg');

// PostgreSQL 连接池配置
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 测试数据库连接
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('数据库连接失败:', err.stack);
  } else {
    console.log('数据库连接成功');
    initializeDatabase();
  }
});

// 初始化数据库，添加示例数据
async function initializeDatabase() {
  try {
    // 检查 products 表是否为空
    const productsResult = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(productsResult.rows[0].count) === 0) {
      // 插入示例产品数据
      await pool.query(
        `INSERT INTO products (product_code, product_name, product_supplier, quantity, purchase_price, sale_price, created_at) 
         VALUES 
         ('PRD001', '示例产品1', '供应商A', 50, 10.99, 19.99, NOW()),
         ('PRD002', '示例产品2', '供应商B', 30, 15.50, 25.99, NOW()),
         ('PRD003', '示例产品3', '供应商A', 20, 8.75, 16.50, NOW());`
      );
      console.log('已添加示例产品数据');
    }
    
    // 检查 tasks 表是否为空
    const tasksResult = await pool.query('SELECT COUNT(*) FROM tasks');
    if (parseInt(tasksResult.rows[0].count) === 0) {
      // 插入示例任务数据
      await pool.query(
        `INSERT INTO tasks (task_number, status, items, created_at) 
         VALUES 
         ('TASK001', 'pending', '[{"product_code":"PRD001", "quantity":10}]', NOW()),
         ('TASK002', 'completed', '[{"product_code":"PRD002", "quantity":5}]', NOW());`
      );
      console.log('已添加示例任务数据');
    }
    
    // 检查 history 表是否为空
    const historyResult = await pool.query('SELECT COUNT(*) FROM history');
    if (parseInt(historyResult.rows[0].count) === 0) {
      // 插入示例历史数据
      await pool.query(
        `INSERT INTO history (task_number, status, items, created_at, completed_at) 
         VALUES 
         ('HIST001', 'completed', '[{"product_code":"PRD003", "quantity":8}]', NOW(), NOW());`
      );
      console.log('已添加示例历史数据');
    }
    
    // 检查 activities 表是否为空
    const activitiesResult = await pool.query('SELECT COUNT(*) FROM activities');
    if (parseInt(activitiesResult.rows[0].count) === 0) {
      // 插入示例活动数据
      await pool.query(
        `INSERT INTO activities (time, type, details, username, created_at) 
         VALUES 
         (NOW(), 'system', '系统初始化', 'admin', NOW());`
      );
      console.log('已添加示例活动数据');
    }
    
    console.log('数据库初始化完成');
  } catch (err) {
    console.error('数据库初始化错误:', err);
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
};
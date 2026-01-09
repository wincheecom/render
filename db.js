const { Pool } = require('pg');

// PostgreSQL 连接池配置
const pool = new Pool({
  connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});

// 测试数据库连接
setTimeout(async () => {
  let attempts = 0;
  const maxAttempts = 5;
  
  while (attempts < maxAttempts) {
    try {
      const res = await pool.query('SELECT NOW()');
      console.log('数据库连接成功');
      await initializeDatabase();
      break; // 成功则退出循环
    } catch (err) {
      attempts++;
      console.error(`数据库连接失败 (尝试 ${attempts}/${maxAttempts}):`, err.stack);
      
      // 检查错误类型
      if (err.code === 'ENOTFOUND') {
        console.log('无法解析数据库主机地址，请检查网络连接和数据库配置');
      } else if (err.code === '3D000' || err.message.includes('does not exist')) {
        console.log('数据库不存在，请确保数据库已正确创建');
      } else {
        console.log('数据库连接失败，错误详情：', err.message);
      }
      
      if (attempts >= maxAttempts) {
        console.log('已达到最大重试次数，放弃连接');
        break;
      }
      
      // 等待一段时间再重试
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}, 1000);

// 初始化数据库，添加示例数据
async function initializeDatabase() {
  try {
    // 检查 products 表是否为空
    const productsResult = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(productsResult.rows[0].count) === 0) {
      // 插入示例产品数据
      await pool.query(
        `INSERT INTO products ("product_code", "product_name", "product_supplier", "quantity", "purchase_price", "sale_price", "created_at") 
         VALUES 
         ($1, $2, $3, $4, $5, $6, NOW()),
         ($7, $8, $9, $10, $11, $12, NOW()),
         ($13, $14, $15, $16, $17, $18, NOW());`,
        ['PRD001', '示例产品1', '供应商A', 50, 10.99, 19.99,
         'PRD002', '示例产品2', '供应商B', 30, 15.50, 25.99,
         'PRD003', '示例产品3', '供应商A', 20, 8.75, 16.50]
      );
      console.log('已添加示例产品数据');
    }
    
    // 检查 tasks 表是否为空
    const tasksResult = await pool.query('SELECT COUNT(*) FROM tasks');
    if (parseInt(tasksResult.rows[0].count) === 0) {
      // 插入示例任务数据
      await pool.query(
        `INSERT INTO tasks ("task_number", "status", "items", "created_at") 
         VALUES 
         ($1, $2, $3, NOW()),
         ($4, $5, $6, NOW());`,
        ['TASK001', 'pending', '[{"product_code":"PRD001", "quantity":10}]',
         'TASK002', 'completed', '[{"product_code":"PRD002", "quantity":5}]']
      );
      console.log('已添加示例任务数据');
    }
    
    // 检查 history 表是否为空
    const historyResult = await pool.query('SELECT COUNT(*) FROM history');
    if (parseInt(historyResult.rows[0].count) === 0) {
      // 插入示例历史数据
      await pool.query(
        `INSERT INTO history ("task_number", "status", "items", "created_at", "completed_at") 
         VALUES 
         ($1, $2, $3, NOW(), NOW());`,
        ['HIST001', 'completed', '[{"product_code":"PRD003", "quantity":8}]']
      );
      console.log('已添加示例历史数据');
    }
    
    // 检查 activities 表是否为空
    const activitiesResult = await pool.query('SELECT COUNT(*) FROM activities');
    if (parseInt(activitiesResult.rows[0].count) === 0) {
      // 插入示例活动数据
      await pool.query(
        `INSERT INTO activities ("time", "type", "details", "actor", "created_at") 
         VALUES 
         (NOW(), $1, $2, $3, NOW());`,
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
  query: (text, params) => pool.query(text, params),
};
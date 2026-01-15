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

// 仅导出查询方法，数据库连接测试由 server.js 控制
// 如果需要连接测试，将在 server.js 中处理

// 初始化数据库，添加示例数据
async function initializeDatabase() {
  try {
    // 首先创建用户表（如果不存在）
    await pool.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
    );
    
    await pool.query(
      `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'sales', 'warehouse')),
        company_name VARCHAR(255),
        currency VARCHAR(10) DEFAULT 'USD',
        language VARCHAR(10) DEFAULT 'en',
        settings JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
    
    // 检查是否已有用户
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(usersResult.rows[0].count);
    
    if (userCount === 0) {
      // 添加默认用户
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      
      // 为不同角色创建默认用户
      const adminPasswordHash = await bcrypt.hash('123456', saltRounds);
      const salesPasswordHash = await bcrypt.hash('123456', saltRounds);
      const warehousePasswordHash = await bcrypt.hash('123456', saltRounds);
      
      await pool.query(
        `INSERT INTO users (email, password_hash, name, role, company_name) 
         VALUES 
         ($1, $2, $3, $4, $5),
         ($6, $7, $8, $9, $10),
         ($11, $12, $13, $14, $15),
         ($16, $17, $18, $19, $20);`,
        [
          'admin@example.com', adminPasswordHash, '管理员1', 'admin', '公司名称',
          'admin2@example.com', adminPasswordHash, '管理员2', 'admin', '公司名称',
          'sales@example.com', salesPasswordHash, '销售运营', 'sales', '公司名称',
          'warehouse@example.com', warehousePasswordHash, '仓库管理', 'warehouse', '公司名称'
        ]
      );
      
      console.log('已添加默认用户数据');
    } else {
      // 如果用户表已存在，确保至少有一个管理员账户
      const adminResult = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['admin']);
      const adminCount = parseInt(adminResult.rows[0].count);
      
      if (adminCount === 0) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const adminPasswordHash = await bcrypt.hash('123456', saltRounds);
        
        // 插入默认管理员账户
        await pool.query(
          `INSERT INTO users (email, password_hash, name, role, company_name)
           VALUES ($1, $2, $3, $4, $5)`,
          ['admin@example.com', adminPasswordHash, '管理员1', 'admin', '公司名称']
        );
        
        console.log('已添加默认管理员账户');
      }
    }
    
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
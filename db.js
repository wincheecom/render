const { Pool } = require('pg');

// PostgreSQL 连接池配置
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  // 如果没有 DATABASE_URL，则使用本地配置
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER || 'postgres',
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST || 'localhost',
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME || 'funseek',
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD || 'postgres',
  port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT || 5432,
});

// 测试数据库连接
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('数据库连接失败:', err.stack);
  } else {
    console.log('数据库连接成功');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
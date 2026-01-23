/**
 * 数据库表清理脚本
 * 用于删除所有现有的数据库表
 */

require('dotenv').config();
const { Pool } = require('pg');

// 创建数据库连接池
const pool = new Pool({
  connectionString: `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}${process.env.DB_NAME ? '/' + process.env.DB_NAME : '/funseek'}`,
  ssl: false, // 禁用 SSL 连接
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000
});

async function dropAllTables() {
  try {
    console.log('正在连接到 PostgreSQL 数据库...');
    
    // 测试连接
    await pool.query('SELECT NOW()');
    console.log('✓ PostgreSQL 数据库连接成功');
    
    // 开始事务
    await pool.query('BEGIN');
    
    // 按依赖关系的逆序删除表（避免外键约束问题）
    console.log('正在删除历史表...');
    await pool.query('DROP TABLE IF EXISTS history CASCADE;');
    console.log('✓ 历史表已删除');
    
    console.log('正在删除任务表...');
    await pool.query('DROP TABLE IF EXISTS tasks CASCADE;');
    console.log('✓ 任务表已删除');
    
    console.log('正在删除产品表...');
    await pool.query('DROP TABLE IF EXISTS products CASCADE;');
    console.log('✓ 产品表已删除');
    
    console.log('正在删除活动表...');
    await pool.query('DROP TABLE IF EXISTS activities CASCADE;');
    console.log('✓ 活动表已删除');
    
    console.log('正在删除用户表...');
    await pool.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('✓ 用户表已删除');
    
    // 提交事务
    await pool.query('COMMIT');
    console.log('\n✅ 所有数据库表已成功删除！');
    
  } catch (err) {
    console.error('❌ 数据库表删除失败:', err);
    try {
      await pool.query('ROLLBACK');
      console.log('已回滚事务');
    } catch (rollbackErr) {
      console.error('回滚事务时出错:', rollbackErr);
    }
    throw err;
  } finally {
    await pool.end();
  }
}

// 执行表删除
if (require.main === module) {
  dropAllTables().catch(err => {
    console.error('删除表过程中发生错误:', err);
    process.exit(1);
  });
}

module.exports = {
  dropAllTables
};
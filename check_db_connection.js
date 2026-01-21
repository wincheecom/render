/**
 * PostgreSQL 数据库连接检查脚本
 * 用于测试数据库连接状态
 */

require('dotenv').config();
const { Pool } = require('pg');

// 创建数据库连接池，优先使用 DATABASE_URL（如 Render 环境），否则使用单独的连接参数
const pool = new Pool({
  // 在 Render 环境中使用 DATABASE_URL，否则使用单独的连接参数
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'funseek'}`,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000
});

async function checkConnection() {
  try {
    console.log('正在检查 PostgreSQL 数据库连接...');
    console.log('当前环境配置:');
    console.log('- DATABASE_URL:', process.env.DATABASE_URL ? '已设置' : '未设置');
    console.log('- DB_HOST:', process.env.DB_HOST || 'localhost');
    console.log('- DB_PORT:', process.env.DB_PORT || '5432');
    console.log('- DB_USER:', process.env.DB_USER || 'postgres');
    console.log('- DB_NAME:', process.env.DB_NAME || 'funseek');
    
    console.log('\n正在尝试连接...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL 数据库连接成功!');
    console.log('当前时间:', result.rows[0].now);
    
    // 尝试查询表信息
    try {
      const tableResult = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      console.log('\n存在的表:', tableResult.rows.map(row => row.table_name).join(', ') || '无');
    } catch (tableErr) {
      console.log('\n⚠️ 无法查询表信息:', tableErr.message);
    }
    
    return true;
  } catch (err) {
    console.error('❌ PostgreSQL 数据库连接失败:', err.message);
    
    if (err.code === 'ECONNREFUSED') {
      console.log('💡 提示: 本地 PostgreSQL 服务可能未启动或数据库不存在');
      console.log('💡 解决方案: 请确保 PostgreSQL 服务正在运行，并已创建相应的数据库');
    } else if (err.code === '28P01') {
      console.log('💡 提示: 用户名或密码错误');
    } else if (err.code === '3D000') {
      console.log('💡 提示: 数据库不存在');
    }
    
    return false;
  } finally {
    await pool.end();
  }
}

// 执行连接检查
if (require.main === module) {
  checkConnection().then(success => {
    if (success) {
      console.log('\n🎉 数据库连接正常');
    } else {
      console.log('\n❌ 数据库连接异常');
      process.exit(1);
    }
  });
}

module.exports = checkConnection;
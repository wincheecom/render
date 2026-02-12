/**
 * 清空统计分析数据脚本
 * 用于清空数据库中与统计分析相关的数据
 */

const { Pool } = require('pg');

// PostgreSQL 连接池配置
const pool = new Pool({
  // 在 Render 环境中使用 DATABASE_URL，否则使用单独的连接参数
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'funseek'}`,
  ssl: false, // 禁用 SSL 连接
  connectionTimeoutMillis: 10000, // 增加连接超时时间
  idleTimeoutMillis: 30000
});

async function clearStatisticsData() {
  try {
    console.log('开始清空统计分析数据...');
    
    // 测试数据库连接
    await pool.query('SELECT NOW()');
    console.log('数据库连接成功');
    
    // 开始事务
    await pool.query('BEGIN');
    
    // 清空统计分析相关的核心数据表
    console.log('正在清空 tasks 表数据...');
    const tasksCount = await pool.query('SELECT COUNT(*) as count FROM tasks');
    await pool.query('DELETE FROM tasks');
    console.log(`已删除 ${tasksCount.rows[0].count} 条任务数据`);
    
    console.log('正在清空 history 表数据...');
    const historyCount = await pool.query('SELECT COUNT(*) as count FROM history');
    await pool.query('DELETE FROM history');
    console.log(`已删除 ${historyCount.rows[0].count} 条历史数据`);
    
    console.log('正在清空 activities 表数据...');
    const activitiesCount = await pool.query('SELECT COUNT(*) as count FROM activities');
    await pool.query('DELETE FROM activities');
    console.log(`已删除 ${activitiesCount.rows[0].count} 条活动日志数据`);
    
    // 可选：清空产品数据（如果需要完全重置）
    // console.log('正在清空 products 表数据...');
    // const productsResult = await pool.query('DELETE FROM products RETURNING COUNT(*) as count');
    // console.log(`已删除 ${productsResult.rows[0].count} 条产品数据`);
    
    // 提交事务
    await pool.query('COMMIT');
    
    console.log('✅ 统计分析数据清空完成！');
    console.log('\n清空的数据包括：');
    console.log('- 所有任务数据 (tasks 表)');
    console.log('- 所有历史记录数据 (history 表)');
    console.log('- 所有活动日志数据 (activities 表)');
    console.log('\n保留的数据：');
    console.log('- 用户数据 (users 表)');
    console.log('- 产品数据 (products 表) - 如需清空请取消注释相关代码');
    
  } catch (error) {
    console.error('❌ 清空统计分析数据失败:', error.message);
    
    // 尝试回滚事务
    try {
      await pool.query('ROLLBACK');
      console.log('事务已回滚');
    } catch (rollbackError) {
      console.error('事务回滚失败:', rollbackError.message);
    }
    
    process.exit(1);
  } finally {
    // 关闭数据库连接
    await pool.end();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  console.log('=== 统计分析数据清空工具 ===\n');
  
  // 确认操作
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('⚠️  此操作将永久删除所有统计分析数据，是否继续？(输入 YES 确认): ', (answer) => {
    if (answer.trim().toUpperCase() === 'YES') {
      rl.close();
      clearStatisticsData();
    } else {
      console.log('操作已取消');
      rl.close();
      process.exit(0);
    }
  });
}

module.exports = { clearStatisticsData };
/**
 * 检查数据库中用户表的内容
 */

require('dotenv').config();

// 尝试连接数据库
let db;
async function checkUsers() {
  try {
    // 导入 PostgreSQL 数据库模块
    const pgDb = require('./db');
    
    // 测试连接
    await pgDb.query('SELECT NOW()');
    db = pgDb;
    console.log('✓ PostgreSQL 数据库连接成功');
  } catch (error) {
    console.warn('PostgreSQL 连接失败，将使用简化数据库:', error.message);
    
    // 使用简化数据库
    db = require('./simple_db');
    console.log('已切换到简化数据库');
  }

  try {
    // 查询所有用户
    const result = await db.query('SELECT id, email, name, role FROM users ORDER BY created_at DESC');
    
    console.log(`找到 ${result.rowCount} 个用户:`);
    console.log('----------------------------------------');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. Email: ${row.email}`);
      console.log(`   ID: ${row.id}`);
      console.log(`   Name: ${row.name}`);
      console.log(`   Role: ${row.role}`);
      console.log('----------------------------------------');
    });

    if (result.rowCount === 0) {
      console.log('数据库中没有用户，请重启服务器以创建默认管理员账户。');
    }

    // 特别检查是否有 admin@example.com 账户
    const adminResult = await db.query('SELECT id, email, name, role FROM users WHERE email = $1', ['admin@example.com']);
    if (adminResult.rowCount > 0) {
      console.log(`\n✓ 发现 admin@example.com 账户 (${adminResult.rowCount} 个):`);
      adminResult.rows.forEach(row => {
        console.log(`  - ID: ${row.id}, Name: ${row.name}, Role: ${row.role}`);
      });
    } else {
      console.log('\n❌ 未发现 admin@example.com 账户');
    }
    
  } catch (err) {
    console.error('查询用户数据时出错:', err);
  }
}

checkUsers().catch(console.error);
require('dotenv').config();
const { Client } = require('pg');

async function checkTaskData() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}${process.env.DB_NAME ? '/' + process.env.DB_NAME : '/funseek'}`,
    ssl: false
  });

  try {
    await client.connect();
    console.log('已连接到数据库');
    
    // 查询包含图片的任务
    const result = await client.query("SELECT id, task_number, body_code_image FROM tasks WHERE body_code_image IS NOT NULL LIMIT 5");
    
    if (result.rows.length > 0) {
      console.log('\n包含图片的任务数据:');
      result.rows.forEach(row => {
        console.log(`任务ID: ${row.id}, 任务号: ${row.task_number}`);
        console.log(`  body_code_image 类型: ${typeof row.body_code_image}`);
        console.log(`  body_code_image 长度: ${row.body_code_image ? row.body_code_image.length : 'NULL'}`);
        console.log(`  body_code_image 开头: ${row.body_code_image ? row.body_code_image.substring(0, 100) : 'NULL'}`);
        console.log('');
      });
    } else {
      console.log('\n数据库中没有包含图片的任务数据');
      // 检查所有任务
      const allTasks = await client.query("SELECT id, task_number FROM tasks ORDER BY created_at DESC LIMIT 5");
      console.log('最近的几个任务:');
      allTasks.rows.forEach(task => {
        console.log(`  任务ID: ${task.id}, 任务号: ${task.task_number}`);
      });
    }
    
  } catch (err) {
    console.log('无法连接到PostgreSQL数据库或查询失败');
    console.log('错误信息:', err.message);
  } finally {
    await client.end();
  }
}

checkTaskData();
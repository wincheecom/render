const { Client } = require('pg');
require('dotenv').config();

// PostgreSQL 连接配置
const client = new Client({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'funseek'}`,
});

async function checkTaskData() {
  try {
    await client.connect();
    console.log('数据库连接成功');
    
    // 查询任务24
    const result24 = await client.query('SELECT * FROM tasks WHERE id = $1', [24]);
    console.log('任务24查询结果:', result24.rows.length > 0 ? '存在' : '不存在');
    
    if (result24.rows.length > 0) {
      console.log('任务24详情:', {
        id: result24.rows[0].id,
        task_number: result24.rows[0].task_number,
        status: result24.rows[0].status,
        body_code_image_exists: !!result24.rows[0].body_code_image,
        body_code_image_length: result24.rows[0].body_code_image ? result24.rows[0].body_code_image.length : 0,
        barcode_image_exists: !!result24.rows[0].barcode_image,
        warning_code_image_exists: !!result24.rows[0].warning_code_image,
        label_image_exists: !!result24.rows[0].label_image,
        manual_image_exists: !!result24.rows[0].manual_image,
        other_image_exists: !!result24.rows[0].other_image
      });
    }
    
    // 查询任务25
    const result25 = await client.query('SELECT * FROM tasks WHERE id = $1', [25]);
    console.log('任务25查询结果:', result25.rows.length > 0 ? '存在' : '不存在');
    
    if (result25.rows.length > 0) {
      console.log('任务25详情:', {
        id: result25.rows[0].id,
        task_number: result25.rows[0].task_number,
        status: result25.rows[0].status,
        body_code_image_exists: !!result25.rows[0].body_code_image,
        body_code_image_length: result25.rows[0].body_code_image ? result25.rows[0].body_code_image.length : 0,
        barcode_image_exists: !!result25.rows[0].barcode_image,
        warning_code_image_exists: !!result25.rows[0].warning_code_image,
        label_image_exists: !!result25.rows[0].label_image,
        manual_image_exists: !!result25.rows[0].manual_image,
        other_image_exists: !!result25.rows[0].other_image
      });
    }
    
    // 查询任务26
    const result26 = await client.query('SELECT * FROM tasks WHERE id = $1', [26]);
    console.log('任务26查询结果:', result26.rows.length > 0 ? '存在' : '不存在');
    
    if (result26.rows.length > 0) {
      console.log('任务26详情:', {
        id: result26.rows[0].id,
        task_number: result26.rows[0].task_number,
        status: result26.rows[0].status,
        body_code_image_exists: !!result26.rows[0].body_code_image,
        body_code_image_length: result26.rows[0].body_code_image ? result26.rows[0].body_code_image.length : 0,
        barcode_image_exists: !!result26.rows[0].barcode_image,
        warning_code_image_exists: !!result26.rows[0].warning_code_image,
        label_image_exists: !!result26.rows[0].label_image,
        manual_image_exists: !!result26.rows[0].manual_image,
        other_image_exists: !!result26.rows[0].other_image
      });
    }

    // 查询所有任务的ID
    const allTasks = await client.query('SELECT id FROM tasks ORDER BY id');
    console.log('所有任务ID:', allTasks.rows.map(r => r.id));
    
    await client.end();
    console.log('数据库连接已关闭');
  } catch (err) {
    console.error('错误:', err);
  }
}

checkTaskData();
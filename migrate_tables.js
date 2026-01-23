/**
 * 数据库迁移脚本：为表添加缺失的字段
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

async function migrate() {
  try {
    console.log('开始检查并更新表结构...');

    // 检查 manual_image 列是否存在 (history 表)
    const manualImageCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='history' AND column_name='manual_image';
    `);

    if (manualImageCheck.rows.length === 0) {
      // 添加 manual_image 列
      await pool.query('ALTER TABLE history ADD COLUMN manual_image TEXT;');
      console.log('✓ 已添加 manual_image 列到 history 表');
    } else {
      console.log('✓ history 表已包含 manual_image 列');
    }

    // 检查 other_image 列是否存在 (history 表)
    const otherImageCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='history' AND column_name='other_image';
    `);

    if (otherImageCheck.rows.length === 0) {
      // 添加 other_image 列
      await pool.query('ALTER TABLE history ADD COLUMN other_image TEXT;');
      console.log('✓ 已添加 other_image 列到 history 表');
    } else {
      console.log('✓ history 表已包含 other_image 列');
    }

    // 检查 creator_name 列是否存在 (history 表)
    const historyCreatorNameCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='history' AND column_name='creator_name';
    `);

    if (historyCreatorNameCheck.rows.length === 0) {
      // 添加 creator_name 列
      await pool.query('ALTER TABLE history ADD COLUMN creator_name VARCHAR(255);');
      console.log('✓ 已添加 creator_name 列到 history 表');
    } else {
      console.log('✓ history 表已包含 creator_name 列');
    }

    // 检查 creator_name 列是否存在 (tasks 表)
    const tasksCreatorNameCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='tasks' AND column_name='creator_name';
    `);

    if (tasksCreatorNameCheck.rows.length === 0) {
      // 添加 creator_name 列到 tasks 表
      await pool.query('ALTER TABLE tasks ADD COLUMN creator_name VARCHAR(255);');
      console.log('✓ 已添加 creator_name 列到 tasks 表');
    } else {
      console.log('✓ tasks 表已包含 creator_name 列');
    }

    // 检查 manual_image 列是否存在 (tasks 表)
    const tasksManualImageCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='tasks' AND column_name='manual_image';
    `);

    if (tasksManualImageCheck.rows.length === 0) {
      // 添加 manual_image 列到 tasks 表
      await pool.query('ALTER TABLE tasks ADD COLUMN manual_image TEXT;');
      console.log('✓ 已添加 manual_image 列到 tasks 表');
    } else {
      console.log('✓ tasks 表已包含 manual_image 列');
    }

    // 检查 other_image 列是否存在 (tasks 表)
    const tasksOtherImageCheck = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name='tasks' AND column_name='other_image';
    `);

    if (tasksOtherImageCheck.rows.length === 0) {
      // 添加 other_image 列到 tasks 表
      await pool.query('ALTER TABLE tasks ADD COLUMN other_image TEXT;');
      console.log('✓ 已添加 other_image 列到 tasks 表');
    } else {
      console.log('✓ tasks 表已包含 other_image 列');
    }

    console.log('\n✅ 数据库迁移完成！');

  } catch (err) {
    console.error('❌ 数据库迁移失败:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 执行迁移
migrate();
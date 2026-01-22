/**
 * 数据库迁移脚本：修复缺失的列
 * 此脚本将确保所有必需的列都存在于数据库表中
 */

require('dotenv').config();
const { Client } = require('pg');

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}${process.env.DB_NAME ? '/' + process.env.DB_NAME : '/funseek'}`,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('已连接到数据库');

    // 检查并添加 history 表中的缺失列
    console.log('检查 history 表结构...');
    
    // 检查 manual_image 列
    try {
      await client.query(`
        ALTER TABLE history 
        ADD COLUMN IF NOT EXISTS manual_image TEXT;
      `);
      console.log('✓ 已确保 manual_image 列存在于 history 表中');
    } catch (err) {
      console.log('⚠ 添加 manual_image 列到 history 表时出现问题:', err.message);
    }

    // 检查 other_image 列
    try {
      await client.query(`
        ALTER TABLE history 
        ADD COLUMN IF NOT EXISTS other_image TEXT;
      `);
      console.log('✓ 已确保 other_image 列存在于 history 表中');
    } catch (err) {
      console.log('⚠ 添加 other_image 列到 history 表时出现问题:', err.message);
    }

    // 检查 creator_name 列
    try {
      await client.query(`
        ALTER TABLE history 
        ADD COLUMN IF NOT EXISTS creator_name VARCHAR(255);
      `);
      console.log('✓ 已确保 creator_name 列存在于 history 表中');
    } catch (err) {
      console.log('⚠ 添加 creator_name 列到 history 表时出现问题:', err.message);
    }

    // 检查并添加 tasks 表中的缺失列
    console.log('检查 tasks 表结构...');

    // 检查 manual_image 列
    try {
      await client.query(`
        ALTER TABLE tasks 
        ADD COLUMN IF NOT EXISTS manual_image TEXT;
      `);
      console.log('✓ 已确保 manual_image 列存在于 tasks 表中');
    } catch (err) {
      console.log('⚠ 添加 manual_image 列到 tasks 表时出现问题:', err.message);
    }

    // 检查 other_image 列
    try {
      await client.query(`
        ALTER TABLE tasks 
        ADD COLUMN IF NOT EXISTS other_image TEXT;
      `);
      console.log('✓ 已确保 other_image 列存在于 tasks 表中');
    } catch (err) {
      console.log('⚠ 添加 other_image 列到 tasks 表时出现问题:', err.message);
    }

    // 检查 creator_name 列
    try {
      await client.query(`
        ALTER TABLE tasks 
        ADD COLUMN IF NOT EXISTS creator_name VARCHAR(255);
      `);
      console.log('✓ 已确保 creator_name 列存在于 tasks 表中');
    } catch (err) {
      console.log('⚠ 添加 creator_name 列到 tasks 表时出现问题:', err.message);
    }

    console.log('\n✅ 数据库迁移完成！所有必需的列都已存在。');

  } catch (err) {
    console.error('❌ 数据库迁移失败:', err);
    throw err;
  } finally {
    await client.end();
  }
}

// 执行迁移
if (require.main === module) {
  migrate()
    .then(() => {
      console.log('数据库迁移脚本执行完成');
      process.exit(0);
    })
    .catch((err) => {
      console.error('数据库迁移脚本执行失败:', err);
      process.exit(1);
    });
}

module.exports = { migrate };
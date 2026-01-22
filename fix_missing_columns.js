/**
 * 数据库修复脚本：确保所有必要的列都存在于表中
 * 此脚本会检查并添加缺失的列
 */

require('dotenv').config();
const { Pool } = require('pg');

// 创建数据库连接池
const pool = new Pool({
  connectionString: `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}${process.env.DB_NAME ? '/' + process.env.DB_NAME : '/funseek'}`,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000
});

async function fixMissingColumns() {
  try {
    console.log('开始检查并修复缺失的数据库列...');

    // 检查并修复 history 表
    console.log('\n检查 history 表...');
    
    // 检查 manual_image 列
    try {
      const manualImageCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name='history' AND column_name='manual_image';
      `);
      
      if (manualImageCheck.rows.length === 0) {
        await pool.query('ALTER TABLE history ADD COLUMN manual_image TEXT;');
        console.log('✓ 已添加 manual_image 列到 history 表');
      } else {
        console.log('✓ history 表已包含 manual_image 列');
      }
    } catch (err) {
      console.log('⚠ 检查 history.manual_image 列时出错:', err.message);
    }
    
    // 检查 other_image 列
    try {
      const otherImageCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name='history' AND column_name='other_image';
      `);
      
      if (otherImageCheck.rows.length === 0) {
        await pool.query('ALTER TABLE history ADD COLUMN other_image TEXT;');
        console.log('✓ 已添加 other_image 列到 history 表');
      } else {
        console.log('✓ history 表已包含 other_image 列');
      }
    } catch (err) {
      console.log('⚠ 检查 history.other_image 列时出错:', err.message);
    }
    
    // 检查 creator_name 列
    try {
      const creatorNameCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name='history' AND column_name='creator_name';
      `);
      
      if (creatorNameCheck.rows.length === 0) {
        await pool.query('ALTER TABLE history ADD COLUMN creator_name VARCHAR(255);');
        console.log('✓ 已添加 creator_name 列到 history 表');
      } else {
        console.log('✓ history 表已包含 creator_name 列');
      }
    } catch (err) {
      console.log('⚠ 检查 history.creator_name 列时出错:', err.message);
    }

    // 检查并修复 tasks 表
    console.log('\n检查 tasks 表...');
    
    // 检查 manual_image 列
    try {
      const tasksManualImageCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name='tasks' AND column_name='manual_image';
      `);
      
      if (tasksManualImageCheck.rows.length === 0) {
        await pool.query('ALTER TABLE tasks ADD COLUMN manual_image TEXT;');
        console.log('✓ 已添加 manual_image 列到 tasks 表');
      } else {
        console.log('✓ tasks 表已包含 manual_image 列');
      }
    } catch (err) {
      console.log('⚠ 检查 tasks.manual_image 列时出错:', err.message);
    }
    
    // 检查 other_image 列
    try {
      const tasksOtherImageCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name='tasks' AND column_name='other_image';
      `);
      
      if (tasksOtherImageCheck.rows.length === 0) {
        await pool.query('ALTER TABLE tasks ADD COLUMN other_image TEXT;');
        console.log('✓ 已添加 other_image 列到 tasks 表');
      } else {
        console.log('✓ tasks 表已包含 other_image 列');
      }
    } catch (err) {
      console.log('⚠ 检查 tasks.other_image 列时出错:', err.message);
    }
    
    // 检查 creator_name 列
    try {
      const tasksCreatorNameCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name='tasks' AND column_name='creator_name';
      `);
      
      if (tasksCreatorNameCheck.rows.length === 0) {
        await pool.query('ALTER TABLE tasks ADD COLUMN creator_name VARCHAR(255);');
        console.log('✓ 已添加 creator_name 列到 tasks 表');
      } else {
        console.log('✓ tasks 表已包含 creator_name 列');
      }
    } catch (err) {
      console.log('⚠ 检查 tasks.creator_name 列时出错:', err.message);
    }

    // 检查并修复 products 表
    console.log('\n检查 products 表...');
    
    // 检查 image 列
    try {
      const imageCheck = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name='products' AND column_name='image';
      `);
      
      if (imageCheck.rows.length === 0) {
        await pool.query('ALTER TABLE products ADD COLUMN image TEXT;');
        console.log('✓ 已添加 image 列到 products 表');
      } else {
        console.log('✓ products 表已包含 image 列');
      }
    } catch (err) {
      console.log('⚠ 检查 products.image 列时出错:', err.message);
    }

    console.log('\n✅ 数据库列修复完成！');

  } catch (err) {
    console.error('❌ 数据库列修复失败:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 执行修复
if (require.main === module) {
  fixMissingColumns();
}

module.exports = {
  fixMissingColumns
};
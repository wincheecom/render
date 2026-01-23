/**
 * 数据库表重建脚本
 * 用于重新创建所有必要的数据库表
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

async function createAllTables() {
  try {
    console.log('正在连接到 PostgreSQL 数据库...');
    
    // 测试连接
    await pool.query('SELECT NOW()');
    console.log('✓ PostgreSQL 数据库连接成功');
    
    // 创建扩展
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('✓ UUID 扩展已准备');
    
    // 创建用户表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'sales', 'warehouse')),
        company_name VARCHAR(255),
        currency VARCHAR(10) DEFAULT 'USD',
        language VARCHAR(10) DEFAULT 'en',
        settings JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ 用户表已创建');
    
    // 创建产品表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        "id" SERIAL PRIMARY KEY,
        "product_code" VARCHAR(255) NOT NULL,
        "product_name" VARCHAR(255) NOT NULL,
        "product_supplier" VARCHAR(255),
        "quantity" INTEGER DEFAULT 0,
        "purchase_price" DECIMAL(10, 2),
        "sale_price" DECIMAL(10, 2),
        "image" TEXT,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ 产品表已创建');
    
    // 创建任务表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        "id" SERIAL PRIMARY KEY,
        "task_number" VARCHAR(255) NOT NULL,
        "status" VARCHAR(50),
        "items" JSONB,
        "body_code_image" TEXT,
        "barcode_image" TEXT,
        "warning_code_image" TEXT,
        "label_image" TEXT,
        "manual_image" TEXT,
        "other_image" TEXT,
        "creator_name" VARCHAR(255),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "completed_at" TIMESTAMP
      )
    `);
    console.log('✓ 任务表已创建');
    
    // 创建历史表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS history (
        "id" SERIAL PRIMARY KEY,
        "task_number" VARCHAR(255) NOT NULL,
        "status" VARCHAR(50),
        "items" JSONB,
        "body_code_image" TEXT,
        "barcode_image" TEXT,
        "warning_code_image" TEXT,
        "label_image" TEXT,
        "manual_image" TEXT,
        "other_image" TEXT,
        "creator_name" VARCHAR(255),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "completed_at" TIMESTAMP
      )
    `);
    console.log('✓ 历史表已创建');
    
    // 创建活动表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        "id" SERIAL PRIMARY KEY,
        "time" VARCHAR(255),
        "type" VARCHAR(50),
        "details" TEXT,
        "actor" VARCHAR(255),
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ 活动表已创建');
    
    console.log('\n✅ 所有数据库表已成功重建！');
    
  } catch (err) {
    console.error('❌ 数据库表重建失败:', err);
    throw err;
  } finally {
    await pool.end();
  }
}

// 执行表创建
if (require.main === module) {
  createAllTables().catch(err => {
    console.error('创建表过程中发生错误:', err);
    process.exit(1);
  });
}

module.exports = {
  createAllTables
};
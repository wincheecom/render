/**
 * PostgreSQL 数据库初始化脚本
 * 用于确保 PostgreSQL 数据库连接正常并初始化表结构
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

async function initializeDatabase() {
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
    console.log('✓ 用户表已创建或已存在');
    
    // 检查用户表中是否已有数据
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(usersResult.rows[0].count);
    
    if (userCount === 0) {
      console.log('检测到空用户表，正在添加默认用户...');
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      
      // 为不同角色创建默认用户
      const adminPasswordHash = await bcrypt.hash('123456', saltRounds);
      const salesPasswordHash = await bcrypt.hash('123456', saltRounds);
      const warehousePasswordHash = await bcrypt.hash('123456', saltRounds);
      
      await pool.query(
        `INSERT INTO users (email, password_hash, name, role, company_name) 
         VALUES 
         ($1, $2, $3, $4, $5),
         ($6, $7, $8, $9, $10),
         ($11, $12, $13, $14, $15);`,
        [
          'admin@example.com', adminPasswordHash, '管理员1', 'admin', '公司名称',
          'sales@example.com', salesPasswordHash, '销售运营', 'sales', '公司名称',
          'warehouse@example.com', warehousePasswordHash, '仓库管理', 'warehouse', '公司名称'
        ]
      );
      
      console.log('✓ 已添加默认用户数据');
    } else {
      console.log(`用户表中已有 ${userCount} 条记录`);
    }
    
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
    
    // 检查并添加 image 列（如果不存在）
    try {
      const result = await pool.query(
        "SELECT column_name FROM information_schema.columns " +
        "WHERE table_name='products' AND column_name='image';"
      );
      
      if (result.rows.length === 0) {
        await pool.query('ALTER TABLE products ADD COLUMN image TEXT;');
        console.log('✓ Image 列已添加到 products 表');
      } else {
        console.log('✓ Products 表已包含 image 列');
      }
    } catch (err) {
      console.log('检查/添加 image 列时出错:', err.message);
    }
    
    console.log('✓ 产品表已创建或已存在');
    
    // 创建任务表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        "id" SERIAL PRIMARY KEY,
        "task_number" VARCHAR(255) NOT NULL,
        "status" VARCHAR(50) DEFAULT 'pending',
        "items" JSONB,
        "body_code_image" TEXT,
        "barcode_image" TEXT,
        "warning_code_image" TEXT,
        "label_image" TEXT,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "completed_at" TIMESTAMP
      )
    `);
    console.log('✓ 任务表已创建或已存在');
    
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
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "completed_at" TIMESTAMP
      )
    `);
    console.log('✓ 历史表已创建或已存在');
    
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
    console.log('✓ 活动表已创建或已存在');
    
    console.log('\n✅ PostgreSQL 数据库初始化完成！');
    
  } catch (err) {
    console.error('❌ 数据库初始化失败:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 执行初始化
if (require.main === module) {
  initializeDatabase();
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  initializeDatabase
};
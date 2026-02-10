/**
 * 添加测试数据脚本
 * 快速添加一些基础产品和任务用于测试
 */

const { Pool } = require('pg');
require('dotenv').config();

// 数据库连接配置
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'funseek',
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

async function addTestData() {
    console.log('🧪 添加测试数据...\n');
    
    let client;
    try {
        client = await pool.connect();
        console.log('✅ 数据库连接成功\n');
        
        // 添加测试产品
        console.log('📦 添加测试产品...');
        const testProducts = [
            {
                product_code: 'P001',
                product_name: 'iPhone 15 Pro',
                product_supplier: '苹果官方',
                quantity: 50,
                purchase_price: 7999.00,
                sale_price: 8999.00
            },
            {
                product_code: 'P002', 
                product_name: 'MacBook Air M2',
                product_supplier: '苹果官方',
                quantity: 30,
                purchase_price: 8999.00,
                sale_price: 9999.00
            },
            {
                product_code: 'P003',
                product_name: 'AirPods Pro',
                product_supplier: '苹果官方',
                quantity: 100,
                purchase_price: 1899.00,
                sale_price: 2199.00
            }
        ];
        
        for (const product of testProducts) {
            const result = await client.query(
                `INSERT INTO products (product_code, product_name, product_supplier, quantity, purchase_price, sale_price)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id, product_name`,
                [
                    product.product_code,
                    product.product_name,
                    product.product_supplier,
                    product.quantity,
                    product.purchase_price,
                    product.sale_price
                ]
            );
            console.log(`✅ 添加产品: ${result.rows[0].product_name} (ID: ${result.rows[0].id})`);
        }
        
        // 获取用户信息用于创建任务
        console.log('\n👤 获取用户信息...');
        const users = await client.query('SELECT id, name, email FROM users LIMIT 1');
        const user = users.rows[0];
        console.log(`使用用户: ${user.name} (${user.email})`);
        
        // 添加测试任务
        console.log('\n📋 添加测试任务...');
        const testTasks = [
            {
                task_number: 'T001',
                items: JSON.stringify([
                    { productId: 1, quantity: 2, productName: 'iPhone 15 Pro' },
                    { productId: 3, quantity: 1, productName: 'AirPods Pro' }
                ]),
                status: 'completed',
                creator_name: user.name
            },
            {
                task_number: 'T002',
                items: JSON.stringify([
                    { productId: 2, quantity: 1, productName: 'MacBook Air M2' }
                ]),
                status: 'completed',
                creator_name: user.name
            }
        ];
        
        for (const task of testTasks) {
            const result = await client.query(
                `INSERT INTO tasks (task_number, items, status, creator_name, created_at, completed_at)
                 VALUES ($1, $2, $3, $4, NOW(), NOW())
                 RETURNING id, task_number`,
                [
                    task.task_number,
                    task.items,
                    task.status,
                    task.creator_name
                ]
            );
            console.log(`✅ 添加任务: ${result.rows[0].task_number} (ID: ${result.rows[0].id})`);
        }
        
        // 显示最终状态
        console.log('\n📊 最终数据统计:');
        const finalStats = await getDataStats(client);
        console.log(`   产品: ${finalStats.products} 条`);
        console.log(`   任务: ${finalStats.tasks} 条`);
        console.log(`   用户: ${finalStats.users} 条`);
        
        console.log('\n🎉 测试数据添加完成！');
        console.log('💡 现在可以测试统计数据功能了');
        
    } catch (error) {
        console.error('❌ 添加测试数据失败:', error.message);
    } finally {
        if (client) {
            await client.release();
        }
        await pool.end();
    }
}

async function getDataStats(client) {
    try {
        const [products, tasks, users] = await Promise.all([
            client.query('SELECT COUNT(*) as count FROM products'),
            client.query('SELECT COUNT(*) as count FROM tasks'),
            client.query('SELECT COUNT(*) as count FROM users')
        ]);
        
        return {
            products: parseInt(products.rows[0].count),
            tasks: parseInt(tasks.rows[0].count),
            users: parseInt(users.rows[0].count)
        };
    } catch (error) {
        console.error('获取统计失败:', error);
        return { products: 0, tasks: 0, users: 0 };
    }
}

// 直接执行
if (require.main === module) {
    addTestData();
}

module.exports = { addTestData };
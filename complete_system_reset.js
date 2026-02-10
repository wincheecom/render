/**
 * 彻底清理和重置系统数据
 * 解决数据关联和缓存问题
 */

const { Pool } = require('pg');
require('dotenv').config();

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

async function completeSystemReset() {
    console.log('🔄 执行系统彻底重置...\n');
    
    let client;
    try {
        client = await pool.connect();
        console.log('✅ 数据库连接成功\n');
        
        // 1. 清理所有数据表
        console.log('🗑️ 清理所有数据...');
        await client.query('DELETE FROM tasks;');
        await client.query('DELETE FROM products;');
        await client.query('DELETE FROM history;');
        console.log('✅ 所有数据已清空\n');
        
        // 2. 重新插入标准测试数据
        console.log('➕ 插入标准测试产品...');
        
        const products = [
            {
                product_code: 'TOOL001',
                product_name: '专业工具套装',
                product_supplier: '优质工具厂商',
                quantity: 100,
                purchase_price: 150.00,
                sale_price: 200.00
            },
            {
                product_code: 'PHONE001', 
                product_name: '智能手机Pro',
                product_supplier: '知名电子品牌',
                quantity: 50,
                purchase_price: 2500.00,
                sale_price: 3200.00
            },
            {
                product_code: 'LAPTOP001',
                product_name: '轻薄笔记本电脑',
                product_supplier: '国际电脑品牌',
                quantity: 30,
                purchase_price: 4500.00,
                sale_price: 5800.00
            },
            {
                product_code: 'ACCESS001',
                product_name: '无线蓝牙耳机',
                product_supplier: '音频设备专家',
                quantity: 200,
                purchase_price: 180.00,
                sale_price: 299.00
            }
        ];
        
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const result = await client.query(
                'INSERT INTO products (product_code, product_name, product_supplier, quantity, purchase_price, sale_price, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id',
                [product.product_code, product.product_name, product.product_supplier, product.quantity, product.purchase_price, product.sale_price]
            );
            console.log(`✅ 产品${i + 1}创建成功: ${product.product_name} (ID: ${result.rows[0].id})`);
        }
        
        // 3. 创建标准任务数据
        console.log('\n➕ 创建标准任务数据...');
        
        const tasks = [
            {
                task_number: 'TASK001',
                status: 'completed',
                items: [
                    {
                        quantity: 2,
                        productId: 1,
                        productCode: 'TOOL001',
                        productName: '专业工具套装',
                        unitPrice: 200.00,
                        totalPrice: 400.00,
                        productImage: ''
                    },
                    {
                        quantity: 1,
                        productId: 2,
                        productCode: 'PHONE001',
                        productName: '智能手机Pro',
                        unitPrice: 3200.00,
                        totalPrice: 3200.00,
                        productImage: ''
                    }
                ]
            },
            {
                task_number: 'TASK002',
                status: 'processing',
                items: [
                    {
                        quantity: 1,
                        productId: 3,
                        productCode: 'LAPTOP001',
                        productName: '轻薄笔记本电脑',
                        unitPrice: 5800.00,
                        totalPrice: 5800.00,
                        productImage: ''
                    }
                ]
            },
            {
                task_number: 'TASK003',
                status: 'pending',
                items: [
                    {
                        quantity: 3,
                        productId: 4,
                        productCode: 'ACCESS001',
                        productName: '无线蓝牙耳机',
                        unitPrice: 299.00,
                        totalPrice: 897.00,
                        productImage: ''
                    },
                    {
                        quantity: 1,
                        productId: 1,
                        productCode: 'TOOL001',
                        productName: '专业工具套装',
                        unitPrice: 200.00,
                        totalPrice: 200.00,
                        productImage: ''
                    }
                ]
            }
        ];
        
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const result = await client.query(
                'INSERT INTO tasks (task_number, items, status, creator_name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
                [task.task_number, JSON.stringify(task.items), task.status, '系统管理员']
            );
            console.log(`✅ 任务${i + 1}创建成功: ${task.task_number} (ID: ${result.rows[0].id})`);
        }
        
        // 4. 验证数据完整性
        console.log('\n🔍 验证数据完整性...');
        
        const finalProducts = await client.query('SELECT id, product_name, sale_price FROM products ORDER BY id');
        const finalTasks = await client.query('SELECT id, task_number, items FROM tasks ORDER BY id');
        
        let totalItems = 0;
        let matchedItems = 0;
        
        finalTasks.rows.forEach(task => {
            const items = JSON.parse(task.items);
            totalItems += items.length;
            
            items.forEach(item => {
                const productId = item.productId;
                if (productId && finalProducts.rows.find(p => p.id === productId)) {
                    matchedItems++;
                }
            });
        });
        
        console.log(`\n📊 最终验证结果:`);
        console.log(`产品总数: ${finalProducts.rows.length}`);
        console.log(`任务总数: ${finalTasks.rows.length}`);
        console.log(`总Items数: ${totalItems}`);
        console.log(`正确匹配Items数: ${matchedItems}`);
        console.log(`数据完整性: ${(matchedItems / totalItems * 100).toFixed(2)}%`);
        
        if (matchedItems === totalItems) {
            console.log('🎉 系统数据重置完成，所有关联正常！');
        } else {
            console.log('⚠️ 数据关联仍存在问题');
        }
        
    } catch (error) {
        console.error('❌ 重置过程中出错:', error.message);
    } finally {
        if (client) {
            await client.release();
        }
        await pool.end();
    }
}

// 执行重置
if (require.main === module) {
    completeSystemReset();
}

module.exports = { completeSystemReset };
/**
 * 数据关联问题诊断脚本
 * 检查任务items与产品数据的匹配问题
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

async function diagnoseDataAssociation() {
    console.log('🔍 数据关联问题诊断...\n');
    
    let client;
    try {
        client = await pool.connect();
        console.log('✅ 数据库连接成功\n');
        
        // 获取产品数据
        console.log('=== 产品数据检查 ===');
        const products = await client.query('SELECT id, product_code, product_name, product_supplier, sale_price, purchase_price FROM products ORDER BY id');
        console.log(`产品总数: ${products.rows.length}`);
        products.rows.forEach((product, index) => {
            console.log(`${index + 1}. ID:${product.id} Code:${product.product_code} Name:${product.product_name} 供应商:${product.product_supplier} 售价:¥${product.sale_price}`);
        });
        
        console.log('\n=== 任务数据检查 ===');
        const tasks = await client.query('SELECT id, task_number, items FROM tasks ORDER BY id');
        console.log(`任务总数: ${tasks.rows.length}`);
        
        tasks.rows.forEach((task, taskIndex) => {
            console.log(`\n任务 ${taskIndex + 1} (ID:${task.id}, 编号:${task.task_number}):`);
            
            try {
                // 如果items已经是对象，则直接使用；否则尝试解析JSON
                const items = typeof task.items === 'string' ? JSON.parse(task.items) : task.items;
                console.log(`  Items数组长度: ${items.length}`);
                
                items.forEach((item, itemIndex) => {
                    console.log(`  Item ${itemIndex + 1}:`, {
                        productId: item.productId,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        productName: item.productName
                    });
                    
                    // 检查产品匹配
                    const productId = item.productId || item.product_id;
                    if (productId) {
                        const matchedProduct = products.rows.find(p => p.id === productId);
                        if (matchedProduct) {
                            console.log(`    ✅ 找到匹配产品: ${matchedProduct.product_name}`);
                        } else {
                            console.log(`    ❌ 未找到ID为${productId}的产品`);
                            console.log(`    可用产品IDs: [${products.rows.map(p => p.id).join(', ')}]`);
                        }
                    } else {
                        console.log(`    ⚠️  Item中没有productId字段`);
                    }
                });
            } catch (parseError) {
                console.log(`  ❌ Items数据解析失败:`, parseError.message);
                console.log(`  原始数据:`, task.items);
            }
        });
        
        // 分析问题
        console.log('\n=== 问题分析 ===');
        let totalItems = 0;
        let matchedItems = 0;
        let unmatchedItems = 0;
        
        tasks.rows.forEach(task => {
            try {
                const items = typeof task.items === 'string' ? JSON.parse(task.items) : task.items;
                totalItems += items.length;
                
                items.forEach(item => {
                    const productId = item.productId || item.product_id;
                    if (productId && products.rows.find(p => p.id === productId)) {
                        matchedItems++;
                    } else {
                        unmatchedItems++;
                    }
                });
            } catch (e) {
                // 解析失败的items也算作不匹配
                unmatchedItems++;
            }
        });
        
        console.log(`总Items数: ${totalItems}`);
        console.log(`匹配Items数: ${matchedItems}`);
        console.log(`不匹配Items数: ${unmatchedItems}`);
        console.log(`匹配率: ${totalItems > 0 ? ((matchedItems / totalItems) * 100).toFixed(2) : 0}%`);
        
        if (unmatchedItems > 0) {
            console.log('\n💡 建议解决方案:');
            console.log('1. 检查任务items中的productId是否与产品表ID匹配');
            console.log('2. 可能需要重新创建任务数据，确保productId正确');
            console.log('3. 或者更新产品ID以匹配现有任务数据');
        }
        
    } catch (error) {
        console.error('❌ 诊断过程中出错:', error.message);
    } finally {
        if (client) {
            await client.release();
        }
        await pool.end();
    }
}

// 执行诊断
if (require.main === module) {
    diagnoseDataAssociation();
}

module.exports = { diagnoseDataAssociation };
/**
 * 快速清除测试数据脚本
 * 直接清除所有产品和任务数据，保留用户信息
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

async function quickClearData() {
    console.log('⚡ 快速清理测试数据...\n');
    
    let client;
    try {
        // 连接数据库
        client = await pool.connect();
        console.log('✅ 数据库连接成功\n');
        
        // 显示清理前状态
        console.log('📋 清理前数据统计:');
        const beforeStats = await getDataStats(client);
        console.log(`   产品: ${beforeStats.products} 条`);
        console.log(`   任务: ${beforeStats.tasks} 条`);
        console.log(`   用户: ${beforeStats.users} 条\n`);
        
        // 执行清理
        console.log('🔥 开始清理数据...');
        
        // 清理任务数据
        const taskResult = await client.query('DELETE FROM tasks RETURNING id');
        console.log(`✅ 已删除 ${taskResult.rowCount} 条任务记录`);
        
        // 清理产品数据
        const productResult = await client.query('DELETE FROM products RETURNING id');
        console.log(`✅ 已删除 ${productResult.rowCount} 条产品记录`);
        
        // 重置自增ID
        await client.query('SELECT setval(\'products_id_seq\', 1, false)');
        await client.query('SELECT setval(\'tasks_id_seq\', 1, false)');
        console.log('✅ 数据序列已重置\n');
        
        // 显示清理后状态
        console.log('📋 清理后数据统计:');
        const afterStats = await getDataStats(client);
        console.log(`   产品: ${afterStats.products} 条`);
        console.log(`   任务: ${afterStats.tasks} 条`);
        console.log(`   用户: ${afterStats.users} 条\n`);
        
        console.log('🎉 数据清理完成！');
        console.log('💡 现在可以重新添加测试数据了');
        
    } catch (error) {
        console.error('❌ 清理失败:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 请确保PostgreSQL服务正在运行');
        }
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
    quickClearData();
}

module.exports = { quickClearData };
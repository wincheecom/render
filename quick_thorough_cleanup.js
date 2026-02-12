/**
 * 快速彻底清理所有业务数据
 * 直接清理所有相关表，保留用户数据
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

async function quickThoroughCleanup() {
    console.log('🧨 快速彻底清理所有业务数据...\n');
    
    let client;
    try {
        client = await pool.connect();
        console.log('✅ 数据库连接成功\n');
        
        // 显示清理前状态
        console.log('📋 清理前数据统计:');
        const beforeStats = await getAllStats(client);
        displayStats(beforeStats, '清理前');
        
        // 执行清理
        console.log('\n🔥 开始彻底清理...');
        
        // 按依赖关系顺序清理表
        const cleanupOperations = [
            { sql: 'DELETE FROM activities', desc: '活动记录' },
            { sql: 'DELETE FROM history', desc: '历史记录' },
            { sql: 'DELETE FROM tasks', desc: '任务记录' },
            { sql: 'DELETE FROM products', desc: '产品数据' }
        ];
        
        for (const op of cleanupOperations) {
            try {
                const result = await client.query(`${op.sql} RETURNING id`);
                console.log(`✅ 已删除 ${result.rowCount} 条${op.desc}`);
            } catch (error) {
                console.warn(`⚠ ${op.desc}清理警告:`, error.message);
            }
        }
        
        // 重置序列
        console.log('\n🔧 重置自增序列...');
        const sequences = [
            'products_id_seq',
            'tasks_id_seq', 
            'activities_id_seq',
            'history_id_seq'
        ];
        
        for (const seq of sequences) {
            try {
                await client.query(`SELECT setval('${seq}', 1, false)`);
            } catch (error) {
                console.warn(`⚠ 序列${seq}重置失败:`, error.message);
            }
        }
        console.log('✅ 序列重置完成');
        
        // 显示清理后状态
        console.log('\n📋 清理后数据统计:');
        const afterStats = await getAllStats(client);
        displayStats(afterStats, '清理后');
        
        console.log('\n🎉 数据彻底清理完成！');
        console.log('💡 所有业务数据已清空，用户账户保留');
        
    } catch (error) {
        console.error('❌ 清理失败:', error.message);
    } finally {
        if (client) {
            await client.release();
        }
        await pool.end();
    }
}

async function getAllStats(client) {
    try {
        const queries = [
            client.query('SELECT COUNT(*) as count FROM products'),
            client.query('SELECT COUNT(*) as count FROM tasks'),
            client.query('SELECT COUNT(*) as count FROM activities'),
            client.query('SELECT COUNT(*) as count FROM history'),
            client.query('SELECT COUNT(*) as count FROM users')
        ];
        
        const [products, tasks, activities, history, users] = await Promise.all(queries);
        
        return {
            products: parseInt(products.rows[0].count),
            tasks: parseInt(tasks.rows[0].count),
            activities: parseInt(activities.rows[0].count),
            history: parseInt(history.rows[0].count),
            users: parseInt(users.rows[0].count)
        };
    } catch (error) {
        console.error('获取统计失败:', error);
        return { products: 0, tasks: 0, activities: 0, history: 0, users: 0 };
    }
}

function displayStats(stats, label) {
    console.log(`   ${label}状态:`);
    console.log(`     产品: ${stats.products} 条`);
    console.log(`     任务: ${stats.tasks} 条`);
    console.log(`     活动: ${stats.activities} 条`);
    console.log(`     历史: ${stats.history} 条`);
    console.log(`     用户: ${stats.users} 条`);
}

// 直接执行
if (require.main === module) {
    quickThoroughCleanup();
}

module.exports = { quickThoroughCleanup };
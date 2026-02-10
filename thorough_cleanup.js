/**
 * 彻底清理所有统计数据相关表
 * 清理 activities 和 history 表中的数据
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

async function thoroughDataCleanup() {
    console.log('🧨 彻底清理所有统计数据...\n');
    
    let client;
    try {
        client = await pool.connect();
        console.log('✅ 数据库连接成功\n');
        
        // 显示清理前状态
        console.log('📋 清理前数据统计:');
        const beforeStats = await getAllTableStats(client);
        displayAllStats(beforeStats, '清理前');
        
        // 确认操作
        console.log('\n⚠️  警告：此操作将删除所有业务数据！');
        console.log('   包括：产品、任务、活动记录、历史记录');
        console.log('   用户账户信息将被保留');
        
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('确认要继续吗？请输入 CLEAN_ALL 确认: ', async (answer) => {
            if (answer !== 'CLEAN_ALL') {
                console.log('❌ 操作已取消');
                rl.close();
                await client.release();
                await pool.end();
                return;
            }
            
            rl.close();
            
            try {
                // 执行彻底清理
                console.log('\n🔥 开始彻底清理数据...');
                
                // 清理顺序很重要：先清理依赖表
                const cleanupTables = [
                    { name: 'activities', desc: '活动记录' },
                    { name: 'history', desc: '历史记录' },
                    { name: 'tasks', desc: '任务记录' },
                    { name: 'products', desc: '产品数据' }
                ];
                
                for (const table of cleanupTables) {
                    try {
                        const result = await client.query(`DELETE FROM ${table.name} RETURNING id`);
                        console.log(`✅ 已删除 ${result.rowCount} 条${table.desc}`);
                    } catch (error) {
                        console.warn(`⚠ ${table.desc}清理警告:`, error.message);
                    }
                }
                
                // 重置所有相关序列
                console.log('\n🔧 重置数据序列...');
                const sequences = ['products_id_seq', 'tasks_id_seq', 'activities_id_seq', 'history_id_seq'];
                for (const seq of sequences) {
                    try {
                        await client.query(`SELECT setval('${seq}', 1, false)`);
                    } catch (error) {
                        console.warn(`⚠ 序列${seq}重置警告:`, error.message);
                    }
                }
                console.log('✅ 序列重置完成');
                
                // 显示清理后状态
                console.log('\n📋 清理后数据统计:');
                const afterStats = await getAllTableStats(client);
                displayAllStats(afterStats, '清理后');
                
                console.log('\n🎉 数据彻底清理完成！');
                console.log('💡 现在可以重新开始添加全新的测试数据');
                
            } catch (error) {
                console.error('❌ 清理过程中发生错误:', error);
            } finally {
                await client.release();
                await pool.end();
            }
        });
        
    } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
        await pool.end();
    }
}

// 获取所有相关表的统计信息
async function getAllTableStats(client) {
    try {
        const tables = ['products', 'tasks', 'activities', 'history', 'users'];
        const stats = {};
        
        for (const table of tables) {
            try {
                const result = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
                stats[table] = parseInt(result.rows[0].count);
            } catch (error) {
                stats[table] = -1; // 表不存在或访问失败
            }
        }
        
        return stats;
    } catch (error) {
        console.error('获取统计信息失败:', error);
        return { products: 0, tasks: 0, activities: 0, history: 0, users: 0 };
    }
}

// 显示所有表的统计信息
function displayAllStats(stats, label) {
    console.log(`   ${label}状态:`);
    console.log(`     产品表: ${stats.products} 条`);
    console.log(`     任务表: ${stats.tasks} 条`);
    console.log(`     活动表: ${stats.activities} 条`);
    console.log(`     历史表: ${stats.history} 条`);
    console.log(`     用户表: ${stats.users} 条`);
}

// 如果直接运行此脚本
if (require.main === module) {
    thoroughDataCleanup();
}

module.exports = { thoroughDataCleanup, getAllTableStats };
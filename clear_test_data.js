/**
 * 安全清除数据库测试数据脚本
 * 注意：这将清除所有产品、任务和历史数据，仅保留用户账户
 */

const { Pool } = require('pg');
require('dotenv').config();

// 数据库连接配置
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

async function clearTestData() {
    console.log('🧹 开始清理测试数据...\n');
    
    try {
        // 测试数据库连接
        console.log('1. 测试数据库连接...');
        const client = await pool.connect();
        console.log('✅ 数据库连接成功\n');
        
        // 显示当前数据统计（清理前）
        console.log('2. 当前数据状态:');
        const beforeStats = await getDatabaseStats(client);
        displayStats(beforeStats, '清理前');
        
        // 确认操作
        console.log('\n⚠️  警告：此操作将删除所有产品和任务数据！');
        console.log('   用户账户信息将被保留');
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('确认要继续吗？请输入 YES 确认: ', async (answer) => {
            if (answer !== 'YES') {
                console.log('❌ 操作已取消');
                rl.close();
                await client.release();
                await pool.end();
                return;
            }
            
            rl.close();
            
            try {
                // 执行清理操作
                console.log('\n3. 执行数据清理...');
                
                // 删除任务数据
                console.log('   🔥 清理任务历史数据...');
                const taskResult = await client.query('DELETE FROM tasks RETURNING id');
                console.log(`   已删除 ${taskResult.rowCount} 条任务记录`);
                
                // 删除产品数据
                console.log('   🔥 清理产品数据...');
                const productResult = await client.query('DELETE FROM products RETURNING id');
                console.log(`   已删除 ${productResult.rowCount} 条产品记录`);
                
                // 重置自增序列
                console.log('   🔧 重置数据序列...');
                await client.query('SELECT setval(\'products_id_seq\', 1, false)');
                await client.query('SELECT setval(\'tasks_id_seq\', 1, false)');
                console.log('   序列已重置');
                
                // 显示清理后状态
                console.log('\n4. 清理后数据状态:');
                const afterStats = await getDatabaseStats(client);
                displayStats(afterStats, '清理后');
                
                console.log('\n✅ 数据清理完成！');
                console.log('💡 现在您可以重新添加产品和创建任务进行测试');
                
            } catch (error) {
                console.error('❌ 清理过程中发生错误:', error);
            } finally {
                await client.release();
                await pool.end();
            }
        });
        
    } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 请确保PostgreSQL服务正在运行');
        }
        await pool.end();
    }
}

// 获取数据库统计信息
async function getDatabaseStats(client) {
    try {
        const [productCount, taskCount, userCount] = await Promise.all([
            client.query('SELECT COUNT(*) as count FROM products'),
            client.query('SELECT COUNT(*) as count FROM tasks'),
            client.query('SELECT COUNT(*) as count FROM users')
        ]);
        
        return {
            products: parseInt(productCount.rows[0].count),
            tasks: parseInt(taskCount.rows[0].count),
            users: parseInt(userCount.rows[0].count)
        };
    } catch (error) {
        console.error('获取统计信息失败:', error);
        return { products: 0, tasks: 0, users: 0 };
    }
}

// 显示统计信息
function displayStats(stats, label) {
    console.log(`   ${label}状态:`);
    console.log(`     产品数量: ${stats.products}`);
    console.log(`     任务数量: ${stats.tasks}`);
    console.log(`     用户数量: ${stats.users}`);
}

// 如果直接运行此脚本
if (require.main === module) {
    clearTestData();
}

module.exports = { clearTestData, getDatabaseStats };
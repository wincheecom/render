// 实时监控任务创建过程
const { Pool } = require('pg');

// 数据库连接配置
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'funseek'}`,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

async function monitorTaskCreation() {
    const client = await pool.connect();
    
    try {
        console.log('🔍 开始监控任务创建过程...\n');
        
        // 获取当前最大任务ID
        const maxIdResult = await client.query('SELECT MAX(id) as max_id FROM tasks');
        const currentMaxId = maxIdResult.rows[0].max_id || 0;
        console.log(`📊 当前最大任务ID: ${currentMaxId}\n`);
        
        console.log('请现在创建一个新的发货任务并在备注中填写内容...');
        console.log('监控将在30秒后停止\n');
        
        // 每2秒检查一次新任务
        const interval = setInterval(async () => {
            try {
                const newTasksResult = await client.query(`
                    SELECT id, task_number, remark, created_at, creator_name
                    FROM tasks 
                    WHERE id > $1 
                    ORDER BY created_at DESC
                `, [currentMaxId]);
                
                if (newTasksResult.rows.length > 0) {
                    console.log('🎉 发现新任务创建!');
                    console.log('─'.repeat(50));
                    
                    newTasksResult.rows.forEach((task, index) => {
                        console.log(`\n新任务 #${index + 1}:`);
                        console.log(`  ID: ${task.id}`);
                        console.log(`  任务号: ${task.task_number}`);
                        console.log(`  创建者: ${task.creator_name || '未知'}`);
                        console.log(`  创建时间: ${task.created_at}`);
                        console.log(`  备注内容: ${task.remark ? `"${task.remark}"` : '【无备注】'}`);
                        console.log(`  备注长度: ${task.remark ? task.remark.length : 0} 字符`);
                        console.log(`  备注状态: ${task.remark ? '✅ 有备注' : '❌ 无备注'}`);
                    });
                    
                    clearInterval(interval);
                    console.log('\n✅ 监控完成');
                }
            } catch (error) {
                console.error('监控过程中出现错误:', error.message);
            }
        }, 2000);
        
        // 30秒后停止监控
        setTimeout(() => {
            clearInterval(interval);
            console.log('\n⏰ 监控时间结束');
            client.release();
            pool.end();
        }, 30000);
        
    } catch (error) {
        console.error('❌ 监控启动失败:', error.message);
        client.release();
        pool.end();
    }
}

// 执行监控
if (require.main === module) {
    monitorTaskCreation();
}

module.exports = { monitorTaskCreation };
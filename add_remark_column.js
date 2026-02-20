const { Pool } = require('pg');

// 数据库连接配置
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'funseek'}`,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
});

async function addRemarkColumn() {
    const client = await pool.connect();
    
    try {
        console.log('🔍 检查当前表结构...');
        
        // 检查 tasks 表是否有 remark 字段
        const tasksCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'tasks' AND column_name = 'remark'
        `);
        
        // 检查 history 表是否有 remark 字段
        const historyCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'history' AND column_name = 'remark'
        `);
        
        console.log(`📋 tasks表remark字段状态: ${tasksCheck.rows.length > 0 ? '存在' : '不存在'}`);
        console.log(`📋 history表remark字段状态: ${historyCheck.rows.length > 0 ? '存在' : '不存在'}`);
        
        // 如果字段不存在，则添加
        if (tasksCheck.rows.length === 0) {
            console.log('➕ 正在为tasks表添加remark字段...');
            await client.query('ALTER TABLE tasks ADD COLUMN IF NOT EXISTS remark TEXT');
            console.log('✅ tasks表remark字段添加成功');
        } else {
            console.log('✅ tasks表remark字段已存在');
        }
        
        if (historyCheck.rows.length === 0) {
            console.log('➕ 正在为history表添加remark字段...');
            await client.query('ALTER TABLE history ADD COLUMN IF NOT EXISTS remark TEXT');
            console.log('✅ history表remark字段添加成功');
        } else {
            console.log('✅ history表remark字段已存在');
        }
        
        // 验证字段添加结果
        console.log('\n🔍 验证字段添加结果...');
        const verifyTasks = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'tasks' AND column_name = 'remark'
        `);
        
        const verifyHistory = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'history' AND column_name = 'remark'
        `);
        
        if (verifyTasks.rows.length > 0) {
            console.log(`✅ tasks表remark字段: ${verifyTasks.rows[0].data_type}`);
        }
        
        if (verifyHistory.rows.length > 0) {
            console.log(`✅ history表remark字段: ${verifyHistory.rows[0].data_type}`);
        }
        
        console.log('\n🎉 备注字段添加完成！');
        
    } catch (error) {
        console.error('❌ 执行过程中出现错误:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// 执行脚本
if (require.main === module) {
    addRemarkColumn()
        .then(() => {
            console.log('✨ 脚本执行完成');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 脚本执行失败:', error);
            process.exit(1);
        });
}

module.exports = { addRemarkColumn };
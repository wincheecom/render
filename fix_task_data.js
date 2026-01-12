/**
 * 修复任务数据结构错误的脚本
 * 此脚本将修正 data.json 中任务数据的字段错位问题
 */

const fs = require('fs').promises;
const path = require('path');

async function fixTaskData() {
    const dataFilePath = path.join(__dirname, 'data.json');
    
    try {
        // 读取现有数据
        const rawData = await fs.readFile(dataFilePath, 'utf8');
        const data = JSON.parse(rawData);
        
        console.log('原始数据结构检查:');
        console.log('- 任务总数:', data.tasks.length);
        
        let fixedCount = 0;
        
        // 修复每个任务的数据结构
        data.tasks = data.tasks.map(task => {
            let fixedTask = { ...task };
            
            // 检查是否需要修复字段错位
            if (typeof task.status === 'string' && task.status.startsWith('[{')) {
                // 说明 status 字段包含了 items 的数据
                const temp = fixedTask.status;
                fixedTask.status = fixedTask.task_number; // 原来的 task_number 可能是 "pending"
                fixedTask.task_number = generateTaskNumber(); // 生成新的任务号
                fixedTask.items = temp; // 将原来放在 status 的内容移到 items
                
                // 如果 items 是字符串，尝试解析为 JSON
                if (typeof fixedTask.items === 'string') {
                    try {
                        fixedTask.items = JSON.parse(fixedTask.items);
                    } catch (e) {
                        console.warn(`无法解析 items JSON:`, fixedTask.items);
                        fixedTask.items = [];
                    }
                }
                
                fixedCount++;
                console.log(`修复任务: ${fixedTask.id}`);
            }
            
            return fixedTask;
        });
        
        // 重新生成任务号，确保它们是唯一的
        data.tasks.forEach((task, index) => {
            if (!task.task_number || task.task_number === 'pending') {
                task.task_number = `TK${String(index + 1).padStart(3, '0')}`;
            }
            
            // 确保有 label_image 字段
            if (!task.hasOwnProperty('label_image')) {
                task.label_image = '';
            }
        });
        
        // 保存修复后的数据
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        
        console.log(`\n修复完成!`);
        console.log(`- 修复了 ${fixedCount} 个任务的字段错位`);
        console.log(`- 总共 ${data.tasks.length} 个任务已更新`);
        
        // 输出修复后的统计信息
        const statusCounts = data.tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});
        
        console.log('\n修复后任务状态分布:');
        Object.keys(statusCounts).forEach(status => {
            console.log(`- ${status}: ${statusCounts[status]} 个`);
        });
        
    } catch (error) {
        console.error('修复任务数据时出错:', error);
    }
}

// 生成任务号的辅助函数
function generateTaskNumber() {
    const now = new Date();
    const timestamp = now.getTime();
    return `TK${timestamp}`;
}

// 运行修复函数
fixTaskData();
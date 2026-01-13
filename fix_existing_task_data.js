/**
 * 修复现有的任务数据，解决字段错位问题
 */
const fs = require('fs');

// 读取现有数据
const dataFilePath = './data.json';

try {
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log('开始修复任务数据...');
    console.log(`总共 ${data.tasks.length} 个任务需要检查`);
    
    let fixedCount = 0;
    
    // 修复任务数据
    data.tasks = data.tasks.map(task => {
        let fixedTask = { ...task }; // 创建副本避免直接修改原数据
        
        // 检查是否发生了字段错位
        const isTaskNumberStatus = fixedTask.task_number === 'pending' || 
                                  fixedTask.task_number === 'processing' || 
                                  fixedTask.task_number === 'completed';
        const isStatusJson = typeof fixedTask.status === 'string' && fixedTask.status.startsWith('[{');
        
        if (isTaskNumberStatus && isStatusJson) {
            // 发生了字段错位，交换这两个字段
            console.log(`修复任务 ${fixedTask.id}: 交换 task_number 和 status 字段`);
            const originalTaskNumber = fixedTask.task_number;
            fixedTask.task_number = fixedTask.status;
            fixedTask.status = originalTaskNumber;
            
            // 尝试解析原来的task_number内容到items字段
            try {
                fixedTask.items = JSON.parse(originalTaskNumber);
            } catch (e) {
                console.warn(`无法解析错位的items数据:`, originalTaskNumber);
                fixedTask.items = [];
            }
            
            fixedCount++;
        }
        
        // 再检查另一种可能的错位情况
        const isStatusStatus = fixedTask.status === 'pending' || 
                              fixedTask.status === 'processing' || 
                              fixedTask.status === 'completed';
        const isTaskNumberJson = typeof fixedTask.task_number === 'string' && fixedTask.task_number.startsWith('[{');
        
        if (isTaskNumberJson && isStatusStatus) {
            // 发生了字段错位，交换这两个字段
            console.log(`修复任务 ${fixedTask.id}: 交换 task_number 和 status 字段`);
            const originalStatus = fixedTask.status;
            fixedTask.status = fixedTask.task_number;
            fixedTask.task_number = originalStatus;
            
            // 尝试解析原来的status内容到items字段
            try {
                fixedTask.items = JSON.parse(fixedTask.status);
            } catch (e) {
                console.warn(`无法解析错位的items数据:`, fixedTask.status);
                fixedTask.items = [];
            }
            
            fixedCount++;
        }
        
        // 检查第三种情况：status是JSON字符串但task_number是另一个状态字符串
        else if (typeof fixedTask.status === 'string' && fixedTask.status.startsWith('[{') &&
               typeof fixedTask.task_number === 'string' && fixedTask.task_number.startsWith('[{')) {
            // 如果两者都是JSON字符串，可能是都错位了，将status设置为pending状态
            const originalStatus = fixedTask.status;
            fixedTask.status = 'pending';
            
            // 尝试解析items数据
            try {
                fixedTask.items = JSON.parse(originalStatus);
            } catch (e) {
                console.warn(`无法解析items数据:`, originalStatus);
                fixedTask.items = [];
            }
            
            fixedCount++;
        }
        
        return fixedTask;
    });
    
    // 修复历史记录数据
    console.log(`总共修复了 ${data.history.length} 个历史记录`);
    
    data.history = data.history.map(record => {
        let fixedRecord = { ...record }; // 创建副本避免直接修改原数据
        
        // 检查历史记录中的字段错位
        const isTaskNumberJson = typeof fixedRecord.task_number === 'string' && fixedRecord.task_number.startsWith('[{');
        const isStatusEmptyOrJson = fixedRecord.status === '""' || 
                                   (typeof fixedRecord.status === 'string' && fixedRecord.status.startsWith('[{'));
        
        if (isTaskNumberJson && isStatusEmptyOrJson) {
            // 发生了字段错位，交换这两个字段
            console.log(`修复历史记录 ${fixedRecord.id}: 交换 task_number 和 status 字段`);
            const originalTaskNumber = fixedRecord.task_number;
            fixedRecord.task_number = fixedRecord.status;
            fixedRecord.status = originalTaskNumber;
            
            // 尝试解析原来的task_number内容到items字段
            try {
                fixedRecord.items = JSON.parse(originalTaskNumber);
            } catch (e) {
                console.warn(`无法解析错位的items数据:`, originalTaskNumber);
                fixedRecord.items = [];
            }
        }
        
        return fixedRecord;
    });
    
    // 为任务生成正确的任务号（如果需要）
    data.tasks.forEach((task, index) => {
        if (typeof task.task_number === 'string' && task.task_number.startsWith('[{')) {
            // 如果task_number仍然是JSON字符串，生成一个新的任务号
            const newTaskNumber = `TK${String(Date.now() + index).slice(-8)}`;
            console.log(`为任务 ${task.id} 生成新任务号: ${newTaskNumber}`);
            task.task_number = newTaskNumber;
        }
    });
    
    // 保存修复后的数据
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    console.log(`\n修复完成!`);
    console.log(`- 修复了 ${fixedCount} 个任务的字段错位`);
    console.log(`- 总共 ${data.tasks.length} 个任务已更新`);
    
    // 输出修复后的统计信息
    const statusCounts = data.tasks.reduce((acc, task) => {
        const status = task.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    
    console.log('\n修复后任务状态分布:');
    Object.keys(statusCounts).forEach(status => {
        console.log(`- ${status}: ${statusCounts[status]} 个`);
    });
    
} catch (error) {
    console.error('修复任务数据时出错:', error);
}
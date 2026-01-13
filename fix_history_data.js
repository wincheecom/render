/**
 * 修复历史记录数据，解决字段错位问题
 */
const fs = require('fs');

// 读取现有数据
const dataFilePath = './data.json';

try {
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log('开始修复历史记录数据...');
    console.log(`总共 ${data.history.length} 个历史记录需要检查`);
    
    let fixedCount = 0;
    
    // 修复历史记录数据
    data.history = data.history.map(record => {
        let fixedRecord = { ...record }; // 创建副本避免直接修改原数据
        
        // 检查历史记录中的字段错位
        const isTaskNumberJson = typeof fixedRecord.task_number === 'string' && 
                                fixedRecord.task_number.startsWith('[{');
        const isStatusEmptyOrJson = fixedRecord.status === '""' || 
                                   (typeof fixedRecord.status === 'string' && fixedRecord.status.startsWith('[{'));
        
        if (isTaskNumberJson && isStatusEmptyOrJson) {
            // 发生了字段错位，交换这两个字段
            console.log(`修复历史记录 ${fixedRecord.id}: 交换 task_number 和 status 字段`);
            const originalTaskNumber = fixedRecord.task_number;
            fixedRecord.task_number = fixedRecord.status;
            fixedRecord.status = originalTaskNumber;
            
            // 尝试解析原来的task_number内容到items字段（如果items为空或不正确）
            if (!Array.isArray(fixedRecord.items) || fixedRecord.items.length === 0) {
                try {
                    fixedRecord.items = JSON.parse(originalTaskNumber);
                } catch (e) {
                    console.warn(`无法解析items数据:`, originalTaskNumber);
                    fixedRecord.items = [];
                }
            }
            
            fixedCount++;
        }
        
        // 还需要处理另一种情况：status是JSON字符串而task_number是空字符串或错误格式
        else if (typeof fixedRecord.status === 'string' && fixedRecord.status.startsWith('[{') &&
                (typeof fixedRecord.task_number === 'string' && fixedRecord.task_number === '""')) {
            // 发生了字段错位，交换这两个字段
            console.log(`修复历史记录 ${fixedRecord.id}: 交换 task_number 和 status 字段`);
            const originalStatus = fixedRecord.status;
            fixedRecord.status = fixedRecord.task_number;
            fixedRecord.task_number = originalStatus;
            
            // 尝试解析原来的status内容到items字段
            if (!Array.isArray(fixedRecord.items) || fixedRecord.items.length === 0) {
                try {
                    fixedRecord.items = JSON.parse(originalStatus);
                } catch (e) {
                    console.warn(`无法解析items数据:`, originalStatus);
                    fixedRecord.items = [];
                }
            }
            
            fixedCount++;
        }
        
        return fixedRecord;
    });
    
    // 为历史记录生成正确的任务号（如果需要）
    data.history.forEach((record, index) => {
        if (typeof record.task_number === 'string' && record.task_number === '""') {
            // 如果task_number是空字符串，生成一个合理的任务号
            const newTaskNumber = `HIST${String(Date.now() + index).slice(-8)}`;
            console.log(`为历史记录 ${record.id} 生成新任务号: ${newTaskNumber}`);
            record.task_number = newTaskNumber;
        } else if (typeof record.task_number === 'string' && record.task_number.startsWith('[{')) {
            // 如果task_number仍然是JSON字符串，生成一个新的任务号
            const newTaskNumber = `HIST${String(Date.now() + index).slice(-8)}`;
            console.log(`为历史记录 ${record.id} 生成新任务号: ${newTaskNumber}`);
            record.task_number = newTaskNumber;
        }
    });
    
    // 保存修复后的数据
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    console.log(`\n修复完成!`);
    console.log(`- 修复了 ${fixedCount} 个历史记录的字段错位`);
    console.log(`- 总共 ${data.history.length} 个历史记录已更新`);
    
    // 输出修复后的统计信息
    const statusCounts = data.history.reduce((acc, record) => {
        const status = record.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    
    console.log('\n修复后历史记录状态分布:');
    Object.keys(statusCounts).forEach(status => {
        console.log(`- ${status}: ${statusCounts[status]} 个`);
    });
    
} catch (error) {
    console.error('修复历史记录数据时出错:', error);
}
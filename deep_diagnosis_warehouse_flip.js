/**
 * 仓库发货任务卡翻转功能深度诊断脚本
 * 专门用于诊断"首次发货后第二张卡片翻转失效"的问题
 */

class WarehouseFlipDeepDiagnosis {
    constructor() {
        this.diagnosisResults = [];
        this.testStartTime = Date.now();
        this.eventListenerStatus = {
            bound: false,
            tasks: [],
            flipContainers: []
        };
    }

    logDiagnosis(category, message, details = '') {
        const timestamp = new Date().toLocaleTimeString();
        const result = {
            timestamp,
            category,
            message,
            details,
            status: 'INFO'
        };
        
        this.diagnosisResults.push(result);
        console.log(`[${timestamp}] ${category}: ${message}${details ? ` - ${details}` : ''}`);
    }

    // 诊断1: 状态管理机制分析
    async diagnoseStateManagement() {
        this.logDiagnosis('状态管理', '开始分析翻转状态管理机制');
        
        // 检查全局防抖Map
        if (typeof flipCooldown !== 'undefined') {
            const cooldownSize = flipCooldown.size;
            const cooldownEntries = Array.from(flipCooldown.entries());
            
            this.logDiagnosis('状态管理', `防抖Map状态`, 
                `大小: ${cooldownSize}, 条目: ${JSON.stringify(cooldownEntries)}`);
            
            // 检查是否有过期的冷却记录
            const now = Date.now();
            const expiredEntries = cooldownEntries.filter(([id, timestamp]) => 
                now - timestamp > 5000
            );
            
            if (expiredEntries.length > 0) {
                this.logDiagnosis('状态管理', '发现过期冷却记录', 
                    `数量: ${expiredEntries.length}, 应该被清理`);
            }
        } else {
            this.logDiagnosis('状态管理', '警告: flipCooldown未定义', '可能存在初始化问题');
        }

        // 检查翻转函数定义
        if (typeof toggleTaskCardFlip === 'function') {
            this.logDiagnosis('状态管理', '翻转函数存在', 'toggleTaskCardFlip函数已定义');
        } else {
            this.logDiagnosis('状态管理', '错误: 翻转函数缺失', 'toggleTaskCardFlip函数未定义');
        }
    }

    // 诊断2: DOM结构和元素查找
    async diagnoseDOMStructure() {
        this.logDiagnosis('DOM结构', '开始分析DOM结构和元素查找');
        
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) {
            this.logDiagnosis('DOM结构', '错误: 仓库容器未找到', 'ID为warehouseTasks的元素不存在');
            return;
        }

        // 查找所有任务卡片容器
        const flipContainers = warehouseContainer.querySelectorAll('.task-flip-container');
        this.logDiagnosis('DOM结构', '任务卡片容器统计', 
            `总数: ${flipContainers.length}个`);
        
        flipContainers.forEach((container, index) => {
            const taskId = container.getAttribute('data-task-id');
            const hasFront = container.querySelector('.task-front');
            const hasBack = container.querySelector('.task-back');
            const isFlipped = container.classList.contains('flipped');
            
            this.logDiagnosis('DOM结构', `卡片${index + 1}`, 
                `ID: ${taskId}, 有正面: ${!!hasFront}, 有背面: ${!!hasBack}, 已翻转: ${isFlipped}`);
        });

        // 检查通过ID查找的元素
        flipContainers.forEach(container => {
            const taskId = container.getAttribute('data-task-id');
            if (taskId) {
                const frontElement = document.querySelector(`#task-${taskId}-front`);
                const alternativeFind = container.querySelector('.task-front');
                
                if (frontElement && alternativeFind && frontElement !== alternativeFind) {
                    this.logDiagnosis('DOM结构', '警告: 元素查找不一致', 
                        `任务${taskId}通过两种方式找到的元素不同`);
                }
                
                if (!frontElement) {
                    this.logDiagnosis('DOM结构', '警告: ID查找失败', 
                        `任务${taskId}无法通过#task-${taskId}-front找到元素`);
                }
            }
        });
    }

    // 诊断3: 事件监听器状态
    async diagnoseEventListeners() {
        this.logDiagnosis('事件监听', '开始分析事件监听器状态');
        
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) return;

        const hasEventListener = warehouseContainer.hasAttribute('data-event-listener-bound');
        this.logDiagnosis('事件监听', '事件监听器标记', 
            `已绑定: ${hasEventListener}`);

        // 检查事件处理函数
        if (typeof warehouseTaskEventHandler === 'function') {
            this.logDiagnosis('事件监听', '事件处理器存在', 'warehouseTaskEventHandler函数已定义');
        } else {
            this.logDiagnosis('事件监听', '错误: 事件处理器缺失', 'warehouseTaskEventHandler函数未定义');
        }

        if (typeof bindWarehouseTaskEvents === 'function') {
            this.logDiagnosis('事件监听', '绑定函数存在', 'bindWarehouseTaskEvents函数已定义');
        } else {
            this.logDiagnosis('事件监听', '错误: 绑定函数缺失', 'bindWarehouseTaskEvents函数未定义');
        }

        // 检查具体的事件绑定元素
        const flipButtons = warehouseContainer.querySelectorAll('[data-action="flip"]');
        const shipmentButtons = warehouseContainer.querySelectorAll('[data-action="complete-shipment"]');
        
        this.logDiagnosis('事件监听', '按钮统计', 
            `翻转按钮: ${flipButtons.length}个, 发货按钮: ${shipmentButtons.length}个`);

        flipButtons.forEach((button, index) => {
            const taskId = button.getAttribute('data-task-id');
            const buttonText = button.textContent.trim();
            const isDisabled = button.disabled;
            
            this.logDiagnosis('事件监听', `翻转按钮${index + 1}`, 
                `任务ID: ${taskId}, 文本: "${buttonText}", 禁用: ${isDisabled}`);
        });
    }

    // 诊断4: CSS样式和变换状态
    async diagnoseCSSStyles() {
        this.logDiagnosis('CSS样式', '开始分析CSS样式和变换状态');
        
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) return;

        const flipContainers = warehouseContainer.querySelectorAll('.task-flip-container');
        
        flipContainers.forEach((container, index) => {
            const taskId = container.getAttribute('data-task-id');
            const styles = getComputedStyle(container);
            
            const perspective = styles.perspective;
            const transformStyle = styles.transformStyle;
            const isFlipped = container.classList.contains('flipped');
            
            this.logDiagnosis('CSS样式', `卡片${index + 1} (${taskId})`, 
                `perspective: ${perspective}, transform-style: ${transformStyle}, 已翻转: ${isFlipped}`);
            
            // 检查背面元素的样式
            const backElement = container.querySelector('.task-back');
            if (backElement) {
                const backStyles = getComputedStyle(backElement);
                const backfaceVisibility = backStyles.backfaceVisibility;
                const transform = backStyles.transform;
                
                this.logDiagnosis('CSS样式', `背面元素${index + 1}`, 
                    `backface-visibility: ${backfaceVisibility}, transform: ${transform}`);
            }
        });

        // 检查布局相关的CSS
        const gallery = warehouseContainer.querySelector('.warehouse-tasks-gallery');
        if (gallery) {
            const galleryStyles = getComputedStyle(gallery);
            const display = galleryStyles.display;
            const gridTemplate = galleryStyles.gridTemplateColumns;
            
            this.logDiagnosis('CSS样式', '画廊布局', 
                `display: ${display}, grid-template-columns: ${gridTemplate}`);
        }
    }

    // 诊断5: 模拟完整的发货流程
    async diagnoseCompleteWorkflow() {
        this.logDiagnosis('工作流', '开始模拟完整的发货工作流');
        
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) {
            this.logDiagnosis('工作流', '错误: 无法进行工作流测试', '仓库容器不存在');
            return;
        }

        const flipContainers = Array.from(warehouseContainer.querySelectorAll('.task-flip-container'));
        if (flipContainers.length < 2) {
            this.logDiagnosis('工作流', '警告: 任务数量不足', '至少需要2个任务才能测试完整流程');
            return;
        }

        // 选择前两个任务进行测试
        const firstTask = flipContainers[0];
        const secondTask = flipContainers[1];
        
        const firstTaskId = firstTask.getAttribute('data-task-id');
        const secondTaskId = secondTask.getAttribute('data-task-id');
        
        this.logDiagnosis('工作流', '测试任务选择', 
            `第一任务: ${firstTaskId}, 第二任务: ${secondTaskId}`);

        // 测试第一个任务的翻转
        this.logDiagnosis('工作流', '步骤1: 测试第一张卡片翻转');
        try {
            toggleTaskCardFlip(firstTaskId);
            await this.delay(500);
            
            const isFirstFlipped = firstTask.classList.contains('flipped');
            this.logDiagnosis('工作流', '第一张卡片翻转结果', `翻转状态: ${isFirstFlipped}`);
            
            // 测试返回
            toggleTaskCardFlip(firstTaskId);
            await this.delay(500);
            
            const isFirstReturned = firstTask.classList.contains('flipped');
            this.logDiagnosis('工作流', '第一张卡片返回结果', `翻转状态: ${isFirstReturned}`);
            
        } catch (error) {
            this.logDiagnosis('工作流', '错误: 第一张卡片测试失败', error.message);
        }

        // 模拟发货完成（不真正调用API）
        this.logDiagnosis('工作流', '步骤2: 模拟第一张卡片发货完成');
        try {
            // 直接修改DOM来模拟发货完成
            const statusBadge = firstTask.querySelector('.badge');
            if (statusBadge) {
                statusBadge.textContent = '已发货';
                statusBadge.classList.remove('badge-warning');
                statusBadge.classList.add('badge-success');
            }
            
            const flipButton = firstTask.querySelector('[data-action="flip"]');
            if (flipButton) {
                flipButton.disabled = true;
                flipButton.textContent = '已发货';
            }
            
            this.logDiagnosis('工作流', '模拟发货完成', 'DOM状态已更新');
            
        } catch (error) {
            this.logDiagnosis('工作流', '错误: 模拟发货失败', error.message);
        }

        // 测试第二张卡片翻转（关键测试点）
        this.logDiagnosis('工作流', '步骤3: 测试第二张卡片翻转（关键测试）');
        try {
            toggleTaskCardFlip(secondTaskId);
            await this.delay(500);
            
            const isSecondFlipped = secondTask.classList.contains('flipped');
            this.logDiagnosis('工作流', '第二张卡片翻转结果', 
                `翻转状态: ${isSecondFlipped} ${isSecondFlipped ? '✅ 正常' : '❌ 失效'}`);
            
            // 测试返回
            toggleTaskCardFlip(secondTaskId);
            await this.delay(500);
            
            const isSecondReturned = secondTask.classList.contains('flipped');
            this.logDiagnosis('工作流', '第二张卡片返回结果', `翻转状态: ${isSecondReturned}`);
            
        } catch (error) {
            this.logDiagnosis('工作流', '错误: 第二张卡片测试失败', error.message);
        }
    }

    // 辅助函数：延迟
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 生成诊断报告
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 仓库发货任务卡翻转功能深度诊断报告');
        console.log('='.repeat(60));
        
        const endTime = Date.now();
        const duration = endTime - this.testStartTime;
        
        console.log(`诊断时间: ${new Date(this.testStartTime).toLocaleString()}`);
        console.log(`诊断耗时: ${duration}ms`);
        console.log(`诊断项目: ${this.diagnosisResults.length}项`);
        
        // 按类别分组显示结果
        const categories = {};
        this.diagnosisResults.forEach(result => {
            if (!categories[result.category]) {
                categories[result.category] = [];
            }
            categories[result.category].push(result);
        });
        
        Object.keys(categories).forEach(category => {
            console.log(`\n📋 ${category}诊断:`);
            categories[category].forEach(result => {
                const statusIcon = {
                    'INFO': '🔵',
                    'WARN': '🟡',
                    'ERROR': '🔴',
                    'SUCCESS': '🟢'
                }[result.status] || '⚪';
                
                console.log(`  ${statusIcon} ${result.message}`);
                if (result.details) {
                    console.log(`     详情: ${result.details}`);
                }
            });
        });
        
        // 总结关键发现
        console.log('\n🔍 关键发现:');
        const errors = this.diagnosisResults.filter(r => r.status === 'ERROR');
        const warnings = this.diagnosisResults.filter(r => r.status === 'WARN');
        
        if (errors.length > 0) {
            console.log(`  ❌ 发现 ${errors.length} 个严重错误`);
        }
        if (warnings.length > 0) {
            console.log(`  ⚠️  发现 ${warnings.length} 个警告`);
        }
        if (errors.length === 0 && warnings.length === 0) {
            console.log('  ✅ 未发现明显问题');
        }
        
        console.log('\n💡 建议:');
        if (errors.length > 0) {
            console.log('  1. 优先解决标记为ERROR的问题');
        }
        if (warnings.length > 0) {
            console.log('  2. 关注标记为WARN的潜在问题');
        }
        console.log('  3. 根据诊断结果制定针对性修复方案');
        
        console.log('='.repeat(60));
    }

    // 运行完整诊断
    async runFullDiagnosis() {
        console.log('🔬 开始仓库发货任务卡翻转功能深度诊断...');
        
        try {
            await this.diagnoseStateManagement();
            await this.delay(100);
            
            await this.diagnoseDOMStructure();
            await this.delay(100);
            
            await this.diagnoseEventListeners();
            await this.delay(100);
            
            await this.diagnoseCSSStyles();
            await this.delay(100);
            
            await this.diagnoseCompleteWorkflow();
            
            this.generateReport();
            
        } catch (error) {
            console.error('诊断过程中发生错误:', error);
        }
    }
}

// 全局访问函数
window.runWarehouseFlipDeepDiagnosis = function() {
    const diagnostician = new WarehouseFlipDeepDiagnosis();
    diagnostician.runFullDiagnosis();
};

console.log('🔬 仓库发货任务卡翻转深度诊断工具已加载');
console.log('💡 调用 runWarehouseFlipDeepDiagnosis() 开始诊断');
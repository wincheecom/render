/**
 * 全面任务元素查找和修复工具
 * 用于深度扫描页面中所有可能的任务相关元素
 */

(function() {
    'use strict';
    
    console.log('🔍 启动全面任务元素诊断...');
    
    function comprehensiveTaskScan() {
        console.log('\n=== 全面任务元素扫描报告 ===');
        
        // 1. 查找所有可能的相关元素
        const allElements = document.querySelectorAll('*');
        const taskElements = [];
        const potentialTaskIds = new Set();
        
        console.log('📊 正在扫描页面元素...');
        
        allElements.forEach(element => {
            // 检查ID中包含task的元素
            if (element.id && element.id.includes('task')) {
                taskElements.push({
                    element: element,
                    id: element.id,
                    classes: element.className,
                    tagName: element.tagName,
                    dataset: {...element.dataset}
                });
                // 提取可能的任务ID
                const idMatch = element.id.match(/task-(\d+)/);
                if (idMatch) {
                    potentialTaskIds.add(idMatch[1]);
                }
            }
            
            // 检查包含task相关类名的元素
            let elementClasses = '';
            if (element.className) {
                // 处理SVG元素和其他特殊元素
                if (typeof element.className === 'string') {
                    elementClasses = element.className;
                } else if (element.className.baseVal) {
                    // SVG元素的情况
                    elementClasses = element.className.baseVal;
                } else if (element.className.toString) {
                    elementClasses = element.className.toString();
                }
            }
            
            if (elementClasses && (
                elementClasses.includes('task') || 
                elementClasses.includes('gallery') ||
                elementClasses.includes('front') ||
                elementClasses.includes('back')
            )) {
                taskElements.push({
                    element: element,
                    id: element.id || '无ID',
                    classes: element.className,
                    tagName: element.tagName,
                    dataset: {...element.dataset}
                });
            }
        });
        
        console.log(`✅ 扫描完成，找到 ${taskElements.length} 个潜在任务相关元素`);
        console.log(`🎯 识别出可能的任务ID: [${Array.from(potentialTaskIds).join(', ')}]`);
        
        // 2. 详细分析找到的元素
        if (taskElements.length > 0) {
            console.log('\n📋 详细元素分析:');
            taskElements.forEach((item, index) => {
                console.log(`\n--- 元素 ${index + 1} ---`);
                console.log(`   标签: ${item.tagName}`);
                console.log(`   ID: ${item.id}`);
                console.log(`   类名: ${item.classes}`);
                console.log(`   data属性:`, item.dataset);
                console.log(`   父元素: ${item.element.parentElement ? item.element.parentElement.tagName + '.' + (item.element.parentElement.className || '无类名') : '无父元素'}`);
                
                // 检查是否包含图片容器
                const imgContainer = item.element.querySelector('.task-gallery-img') || 
                                   item.element.querySelector('[class*="img"]') ||
                                   item.element.querySelector('img');
                console.log(`   图片容器: ${imgContainer ? '✅ 存在' : '❌ 不存在'}`);
                
                // 检查文本内容线索
                const textContent = item.element.textContent || '';
                if (textContent.length < 100) { // 避免输出过长内容
                    console.log(`   文本内容: "${textContent.trim()}"`);
                }
            });
        }
        
        // 3. 查找具体的任务卡片结构
        console.log('\n🎯 任务卡片结构分析:');
        
        // 查找所有可能的卡片容器
        const cardSelectors = [
            '.task-flip-container',
            '.task-front',
            '.task-back',
            '.task-gallery-img',
            '[id*="task"]',
            '[class*="task"]',
            '.published-tasks-gallery > *',
            '.sales-operations-container *'
        ];
        
        cardSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`   ${selector}: ${elements.length} 个元素`);
            }
        });
        
        // 4. 检查销售运营模块
        console.log('\n🏪 销售运营模块检查:');
        const salesSections = document.querySelectorAll('.sales-operations-container, [class*="sales"], [class*="operation"]');
        salesSections.forEach((section, index) => {
            console.log(`\n--- 销售模块 ${index + 1} ---`);
            console.log(`   类名: ${section.className}`);
            console.log(`   ID: ${section.id || '无ID'}`);
            
            // 查找其中的任务元素
            const taskChildren = section.querySelectorAll('[id*="task"], [class*="task"]');
            console.log(`   包含任务相关元素: ${taskChildren.length} 个`);
            
            taskChildren.forEach((child, childIndex) => {
                console.log(`     子元素 ${childIndex + 1}: ${child.tagName}.${child.className}#${child.id || '无ID'}`);
            });
        });
        
        // 5. 尝试构建可用的任务ID列表
        console.log('\n🔧 任务修复建议:');
        
        if (potentialTaskIds.size > 0) {
            console.log('   发现以下可能的任务ID:');
            potentialTaskIds.forEach(taskId => {
                console.log(`   - 任务 ${taskId}`);
            });
            
            console.log('\n   可以尝试修复这些任务:');
            potentialTaskIds.forEach(taskId => {
                console.log(`   diagnoseAndFixTask('${taskId}')`);
            });
        } else {
            console.log('   ⚠️ 未识别出明确的任务ID');
            console.log('   💡 建议手动检查页面结构');
        }
        
        // 6. 提供修复函数
        window.diagnoseAndFixTask = function(taskId) {
            console.log(`🔧 尝试修复任务 ${taskId}...`);
            
            // 更广泛的元素查找
            const possibleSelectors = [
                `#task-${taskId}`,
                `#task-${taskId}-front`,
                `[data-task-id="${taskId}"]`,
                `[id*="${taskId}"]`,
                `.task-front[data-task-id="${taskId}"]`
            ];
            
            let targetElement = null;
            let usedSelector = '';
            
            for (const selector of possibleSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    targetElement = element;
                    usedSelector = selector;
                    console.log(`✅ 使用选择器 "${selector}" 找到元素`);
                    break;
                }
            }
            
            if (!targetElement) {
                console.error(`❌ 仍未找到任务 ${taskId} 的元素`);
                return false;
            }
            
            // 执行修复
            if (typeof window.fixSpecificTaskCard === 'function') {
                return window.fixSpecificTaskCard(taskId);
            } else {
                console.error('❌ 修复函数不可用');
                return false;
            }
        };
        
        console.log('\n=== 扫描完成 ===');
        return {
            taskElements: taskElements,
            potentialTaskIds: Array.from(potentialTaskIds),
            elementCount: taskElements.length
        };
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(comprehensiveTaskScan, 1500);
        });
    } else {
        setTimeout(comprehensiveTaskScan, 1500);
    }
    
    // 暴露到全局
    window.comprehensiveTaskScan = comprehensiveTaskScan;
    
    console.log('🔍 全面任务扫描工具已加载');
    console.log('💡 使用 comprehensiveTaskScan() 执行完整扫描');
    console.log('💡 使用 diagnoseAndFixTask("任务ID") 修复特定任务');
    
})();
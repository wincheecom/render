/**
 * 仓库发货任务卡返回按钮移除脚本
 * 目标：移除仓库任务卡背面的返回按钮，不影响其他页面功能
 */

(function() {
    'use strict';
    
    console.log('🔧 开始移除仓库发货任务卡返回按钮...');
    
    // 定义需要移除返回按钮的选择器
    const RETURN_BUTTON_SELECTORS = [
        // 仓库任务卡背面的返回按钮
        '.warehouse-tasks-gallery .task-back .btn-outline-secondary[data-action="flip"]',
        '#warehouseTasks .task-back .btn-outline-secondary[data-action="flip"]',
        // 包含"返回"文本的按钮
        '.warehouse-tasks-gallery .task-back button:contains("返回")',
        '#warehouseTasks .task-back button:contains("返回")'
    ];
    
    // 安全的文本内容检查函数
    function containsText(element, text) {
        return element.textContent.trim() === text || 
               element.innerText.trim() === text ||
               element.innerHTML.includes(text);
    }
    
    // 移除返回按钮的主要函数
    function removeWarehouseReturnButtons() {
        let removedCount = 0;
        
        // 方法1：通过data-action属性查找
        const dataActionButtons = document.querySelectorAll('[data-action="flip"]');
        dataActionButtons.forEach(button => {
            // 检查是否在仓库任务区域内
            const isInWarehouse = button.closest('.warehouse-tasks-gallery') || 
                                 button.closest('#warehouseTasks');
            
            // 检查是否是返回按钮（btn-outline-secondary类且文本为"返回"）
            const isReturnButton = button.classList.contains('btn-outline-secondary') &&
                                  containsText(button, '返回');
            
            if (isInWarehouse && isReturnButton) {
                console.log('🗑️ 移除仓库返回按钮:', button);
                button.remove();
                removedCount++;
            }
        });
        
        // 方法2：通过CSS选择器直接查找
        RETURN_BUTTON_SELECTORS.forEach(selector => {
            try {
                const buttons = document.querySelectorAll(selector);
                buttons.forEach(button => {
                    // 额外验证确保只移除仓库相关的按钮
                    const isInWarehouse = button.closest('.warehouse-tasks-gallery') || 
                                         button.closest('#warehouseTasks');
                    
                    if (isInWarehouse) {
                        console.log('🗑️ 移除仓库返回按钮 (CSS选择器):', button);
                        button.remove();
                        removedCount++;
                    }
                });
            } catch (error) {
                console.warn('CSS选择器执行出错:', selector, error);
            }
        });
        
        // 方法3：遍历所有仓库任务卡片，查找返回按钮
        const warehouseContainers = document.querySelectorAll('.warehouse-tasks-gallery, #warehouseTasks');
        warehouseContainers.forEach(container => {
            const returnButtons = container.querySelectorAll('.task-back .btn-outline-secondary');
            returnButtons.forEach(button => {
                if (containsText(button, '返回')) {
                    console.log('🗑️ 移除仓库返回按钮 (遍历方式):', button);
                    button.remove();
                    removedCount++;
                }
            });
        });
        
        return removedCount;
    }
    
    // 应用CSS隐藏规则作为备用方案
    function applyCSSHideRules() {
        const cssRules = `
            /* 隐藏仓库任务卡背面的返回按钮 */
            .warehouse-tasks-gallery .task-back .btn-outline-secondary[data-action="flip"],
            #warehouseTasks .task-back .btn-outline-secondary[data-action="flip"],
            .warehouse-tasks-gallery .task-back button:contains("返回"),
            #warehouseTasks .task-back button:contains("返回") {
                display: none !important;
            }
            
            /* 确保其他页面的返回按钮不受影响 */
            :not(.warehouse-tasks-gallery):not(#warehouseTasks) .btn-outline-secondary[data-action="flip"] {
                display: inline-block !important;
            }
        `;
        
        // 创建或更新样式标签
        let styleTag = document.getElementById('warehouse-return-button-hide');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'warehouse-return-button-hide';
            styleTag.type = 'text/css';
            document.head.appendChild(styleTag);
        }
        
        styleTag.textContent = cssRules;
        console.log('🎨 应用CSS隐藏规则完成');
    }
    
    // 监听DOM变化，动态移除新出现的返回按钮
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            let shouldRemove = false;
            
            mutations.forEach(function(mutation) {
                // 检查是否有新的仓库任务卡片添加
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是仓库任务相关元素
                            if (node.matches && 
                                (node.matches('.warehouse-tasks-gallery') || 
                                 node.matches('#warehouseTasks') ||
                                 node.closest('.warehouse-tasks-gallery') ||
                                 node.closest('#warehouseTasks'))) {
                                shouldRemove = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldRemove) {
                setTimeout(function() {
                    const count = removeWarehouseReturnButtons();
                    if (count > 0) {
                        console.log(`🔄 动态移除了 ${count} 个新出现的返回按钮`);
                    }
                }, 100);
            }
        });
        
        // 观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ 已启动DOM变化监听器');
    }
    
    // 主执行函数
    function executeRemoval() {
        // 立即执行一次移除
        const initialRemoved = removeWarehouseReturnButtons();
        console.log(`✅ 初始移除完成，共移除 ${initialRemoved} 个返回按钮`);
        
        // 应用CSS隐藏规则
        applyCSSHideRules();
        
        // 设置动态监听
        setupMutationObserver();
        
        // 定期检查（作为保险措施）
        setInterval(function() {
            const periodicRemoved = removeWarehouseReturnButtons();
            if (periodicRemoved > 0) {
                console.log(`⏰ 定期检查移除了 ${periodicRemoved} 个返回按钮`);
            }
        }, 3000);
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeRemoval);
    } else {
        // 如果页面已经加载完成
        setTimeout(executeRemoval, 100);
    }
    
    // 同时立即尝试执行
    if (document.body) {
        setTimeout(executeRemoval, 500);
    }
    
    console.log('🚀 仓库发货任务卡返回按钮移除脚本已启动');
    
})();
// 移除仓库任务容器中间层脚本
// 目标：移除 .task-gallery.warehouse-tasks-gallery 容器，让任务卡片直接在 #warehouseTasks 中显示

(function() {
    'use strict';
    
    console.log('🧹 开始移除仓库任务容器中间层...');
    
    // 主要修复函数
    function removeWarehouseContainerLayer() {
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) {
            console.warn('⚠️ 未找到仓库任务主容器 #warehouseTasks');
            return false;
        }
        
        // 查找中间容器层
        const middleContainer = warehouseContainer.querySelector('.task-gallery.warehouse-tasks-gallery');
        if (!middleContainer) {
            console.log('✅ 中间容器层已不存在或已被移除');
            return true;
        }
        
        console.log('🔍 发现中间容器层，准备移除...');
        console.log('📦 中间容器内容节点数:', middleContainer.children.length);
        
        // 获取中间容器中的所有任务卡片
        const taskCards = Array.from(middleContainer.querySelectorAll('.task-flip-container'));
        console.log('📋 需要移动的任务卡片数量:', taskCards.length);
        
        // 将任务卡片移动到主容器中
        taskCards.forEach((card, index) => {
            warehouseContainer.appendChild(card);
            console.log(`➡️ 已移动任务卡片 ${index + 1}:`, card.getAttribute('data-task-id'));
        });
        
        // 移除空的中间容器
        middleContainer.remove();
        console.log('🗑️ 已移除中间容器层');
        
        // 应用直接的网格样式到主容器
        applyDirectGridStyles();
        
        console.log('✅ 仓库任务容器中间层移除完成！');
        return true;
    }
    
    // 应用直接网格样式到主容器
    function applyDirectGridStyles() {
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) return;
        
        // 移除可能存在的旧样式
        const existingStyle = document.getElementById('direct-grid-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // 创建新的样式
        const style = document.createElement('style');
        style.id = 'direct-grid-styles';
        style.textContent = `
            /* 直接网格样式 - 移除了中间容器层 */
            #warehouseTasks.published-tasks-gallery.task-gallery {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
                gap: 15px !important;
                margin-top: 15px !important;
                align-content: start !important;
                justify-content: stretch !important;
                width: 100% !important;
                grid-auto-rows: minmax(250px, auto) !important;
                min-height: 300px !important;
                padding: 0 !important;
                border: none !important;
                background: transparent !important;
            }
            
            /* 直接子元素样式 */
            #warehouseTasks.published-tasks-gallery.task-gallery > .task-flip-container {
                display: block !important;
                width: 100% !important;
                min-height: 250px !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* 响应式断点 */
            @media (max-width: 1200px) {
                #warehouseTasks.published-tasks-gallery.task-gallery {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            
            @media (max-width: 768px) {
                #warehouseTasks.published-tasks-gallery.task-gallery {
                    grid-template-columns: 1fr !important;
                    gap: 12px !important;
                }
            }
            
            /* 确保任务卡片样式正确 */
            #warehouseTasks .task-flip-container {
                perspective: 1000px !important;
                transform-style: preserve-3d !important;
                transition: transform 0.6s !important;
                cursor: pointer !important;
                border-radius: 10px !important;
                overflow: hidden !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
            }
            
            #warehouseTasks .task-front,
            #warehouseTasks .task-back {
                backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                border-radius: 10px !important;
                display: flex !important;
                flex-direction: column !important;
            }
            
            #warehouseTasks .task-front {
                background: white !important;
                z-index: 2 !important;
                transform: rotateY(0deg) !important;
            }
            
            #warehouseTasks .task-back {
                background: white !important;
                transform: rotateY(180deg) !important;
                z-index: 1 !important;
            }
            
            #warehouseTasks .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 已应用直接网格样式');
    }
    
    // 监控DOM变化，防止中间容器重新出现
    function setupMutationObserver() {
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) return;
        
        const observer = new MutationObserver(function(mutations) {
            let shouldRemoveLayer = false;
            
            mutations.forEach(function(mutation) {
                // 检查是否有新的中间容器被添加
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否添加了中间容器
                            if (node.classList && 
                                node.classList.contains('task-gallery') && 
                                node.classList.contains('warehouse-tasks-gallery')) {
                                console.log('⚠️ 检测到中间容器重新出现，准备移除...');
                                shouldRemoveLayer = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldRemoveLayer) {
                setTimeout(removeWarehouseContainerLayer, 100);
            }
        });
        
        observer.observe(warehouseContainer, {
            childList: true,
            subtree: false
        });
        
        console.log('👀 已启动DOM变化监控');
    }
    
    // 修复现有的中间容器结构
    function fixExistingStructure() {
        console.log('🔧 开始修复现有结构...');
        
        // 先尝试移除中间层
        const removed = removeWarehouseContainerLayer();
        
        if (removed) {
            // 重新绑定事件监听器
            if (typeof bindWarehouseTaskEvents === 'function') {
                setTimeout(() => {
                    bindWarehouseTaskEvents();
                    console.log('🔗 已重新绑定事件监听器');
                }, 300);
            }
            
            // 验证修复结果
            setTimeout(verifyStructure, 500);
        }
    }
    
    // 验证结构修复结果
    function verifyStructure() {
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) return;
        
        const middleContainers = warehouseContainer.querySelectorAll('.task-gallery.warehouse-tasks-gallery');
        const directTaskCards = warehouseContainer.querySelectorAll(':scope > .task-flip-container');
        
        console.log('=== 结构验证结果 ===');
        console.log('中间容器数量:', middleContainers.length);
        console.log('直接任务卡片数量:', directTaskCards.length);
        console.log('主容器显示模式:', window.getComputedStyle(warehouseContainer).display);
        console.log('====================');
        
        if (middleContainers.length === 0 && directTaskCards.length > 0) {
            console.log('✅ 结构修复验证通过！');
        } else {
            console.log('❌ 结构修复验证失败，需要进一步处理');
        }
    }
    
    // 初始化函数
    function initializeRemoval() {
        console.log('🚀 开始初始化容器层移除...');
        
        try {
            // 立即执行修复
            fixExistingStructure();
            
            // 设置持续监控
            setupMutationObserver();
            
            console.log('🎉 容器层移除初始化完成！');
            
        } catch (error) {
            console.error('❌ 容器层移除初始化失败:', error);
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRemoval);
    } else {
        initializeRemoval();
    }
    
    // 对外暴露主要函数（用于调试）
    window.removeWarehouseContainerLayer = removeWarehouseContainerLayer;
    window.verifyWarehouseStructure = verifyStructure;
    
})();
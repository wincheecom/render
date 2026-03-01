// 仓库任务卡样式统一脚本
// 将 #warehouseTasks.tasks-container 的样式统一到 #publishedTasksBody.published-tasks-gallery 的标准

(function() {
    'use strict';
    
    console.log('📦 启动仓库任务卡样式统一修复...');
    
    // 样式统一的核心函数
    function unifyWarehouseTaskStyles() {
        // 确保目标容器存在
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) {
            console.warn('⚠️ 未找到仓库任务容器 #warehouseTasks');
            return false;
        }
        
        // 检查是否已经是正确的样式结构
        const isAlreadyUnified = warehouseContainer.classList.contains('published-tasks-gallery') && 
                               warehouseContainer.classList.contains('task-gallery');
        
        if (isAlreadyUnified) {
            console.log('✅ 仓库任务样式已经是统一状态');
            return true;
        }
        
        // 应用样式类
        warehouseContainer.classList.add('published-tasks-gallery', 'task-gallery');
        warehouseContainer.classList.remove('tasks-container');
        
        console.log('🎨 已应用统一样式类: published-tasks-gallery, task-gallery');
        return true;
    }
    
    // 处理仓库任务容器内容变化的函数
    function handleWarehouseContentChanges() {
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) return;
        
        // 监听容器内容变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // 检查是否有新的内容被添加
                    if (mutation.addedNodes.length > 0) {
                        // 重新应用样式统一
                        setTimeout(unifyWarehouseTaskStyles, 50);
                    }
                }
            });
        });
        
        observer.observe(warehouseContainer, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ 已启动仓库任务内容变化监听');
    }
    
    // 监听DOM变化，确保样式持续统一
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否有新的仓库任务容器被添加
                            if (node.id === 'warehouseTasks' || 
                                (node.classList && node.classList.contains('tasks-container'))) {
                                setTimeout(unifyWarehouseTaskStyles, 100);
                            }
                        }
                    });
                }
                
                // 检查属性变化
                if (mutation.type === 'attributes' && mutation.target.id === 'warehouseTasks') {
                    setTimeout(unifyWarehouseTaskStyles, 50);
                }
            });
        });
        
        // 观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'id']
        });
        
        console.log('👁️ 已启动DOM变化监听器');
        return observer;
    }
    
    // 应用必要的CSS样式覆盖
    function applyCSSOverrides() {
        // 检查是否已经添加过样式
        if (document.getElementById('warehouse-style-unification-css')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'warehouse-style-unification-css';
        style.textContent = `
            /* 仓库任务容器样式统一 */
            #warehouseTasks.published-tasks-gallery.task-gallery {
                display: grid !important;
                grid-template-columns: 1fr !important;
                gap: 8px !important;
                margin-top: 8px !important;
                align-content: start !important;
                width: 100% !important;
            }
            
            /* 响应式断点 - 平板及以上 */
            @media (min-width: 768px) {
                #warehouseTasks.published-tasks-gallery.task-gallery {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            
            /* 响应式断点 - 桌面及以上 */
            @media (min-width: 1200px) {
                #warehouseTasks.published-tasks-gallery.task-gallery {
                    grid-template-columns: repeat(3, 1fr) !important;
                }
            }
            
            /* 仓库任务卡片样式统一 */
            #warehouseTasks.published-tasks-gallery .task-flip-container {
                width: 100% !important;
                height: 100% !important;
                display: block !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-front,
            #warehouseTasks.published-tasks-gallery .task-back {
                width: 100% !important;
                height: 100% !important;
                min-width: 302.66px !important;
                min-height: 302.66px !important;
                aspect-ratio: 1 / 1 !important;
                backface-visibility: hidden !important;
                border-radius: var(--card-radius) !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                text-align: center !important;
                padding: 8px 12px !important;
                overflow: auto !important;
                position: relative !important;
                background-color: white !important;
                box-shadow: var(--shadow) !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-back {
                transform: rotateY(180deg) !important;
                background-color: white !important;
                overflow: auto !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            /* 图片容器统一样式 */
            #warehouseTasks.published-tasks-gallery .task-gallery-img {
                width: 100% !important;
                height: 120px !important;
                object-fit: cover !important;
                border-radius: 6px !important;
                margin-bottom: 8px !important;
                background-color: #f8f9fa !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-gallery-img img {
                max-width: 100% !important;
                max-height: 100% !important;
                object-fit: contain !important;
            }
            
            /* 文字信息统一样式 */
            #warehouseTasks.published-tasks-gallery .task-gallery-name {
                font-weight: 600 !important;
                font-size: 0.9rem !important;
                margin-bottom: 4px !important;
                word-break: break-word !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-gallery-code {
                font-size: 0.8rem !important;
                color: #666 !important;
                margin-bottom: 4px !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-gallery-qty {
                font-weight: 600 !important;
                color: var(--warning) !important;
                margin-bottom: 4px !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-gallery-creator {
                font-size: 0.7rem !important;
                color: #999 !important;
                margin-bottom: 4px !important;
            }
            
            /* 操作按钮统一样式 */
            #warehouseTasks.published-tasks-gallery .task-gallery-actions {
                display: flex !important;
                gap: 6px !important;
                width: 100% !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-gallery-actions .btn {
                flex: 1 !important;
                padding: 6px 8px !important;
                font-size: 0.8rem !important;
            }
            
            /* 背面内容统一样式 */
            #warehouseTasks.published-tasks-gallery .task-back-content {
                width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                gap: 15px !important;
                justify-content: center !important;
                flex: 1 !important;
                min-height: 0 !important;
                padding: 10px 0 !important;
            }
            
            /* 仓库任务文件容器往下调整3px */
            #warehouseTasks .task-files-container {
                margin-top: 3px !important; /* 往下调整3px */
            }
            
            /* 仓库任务备注显示区域往上调整3px */
            #warehouseTasks .task-remark-display.warehouse-remark-display {
                margin-top: -3px !important; /* 往上调整3px */
            }
            
            #warehouseTasks.published-tasks-gallery .task-back-actions {
                width: 100% !important;
                padding: 0 !important;
                flex-shrink: 0 !important;
                margin-top: auto !important;
                margin-bottom: 0 !important;
                align-self: flex-end !important;
                flex: 0 0 auto !important;
            }
            
            /* 确保不与其他模块冲突 */
            .sales-operations-container #warehouseTasks.published-tasks-gallery {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            
            @media (max-width: 767px) {
                .sales-operations-container #warehouseTasks.published-tasks-gallery {
                    grid-template-columns: 1fr !important;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 已应用CSS样式覆盖');
    }
    
    // 主初始化函数
    function initializeStyleUnification() {
        console.log('🚀 开始仓库任务样式统一初始化...');
        
        try {
            // 应用CSS覆盖
            applyCSSOverrides();
            
            // 统一样式类
            const unified = unifyWarehouseTaskStyles();
            
            if (unified) {
                console.log('✅ 仓库任务样式统一初始化完成');
                
                // 设置观察器保持样式统一
                setupMutationObserver();
                
                // 监听内容变化
                handleWarehouseContentChanges();
                
                // 触发一次仓库任务重新加载以应用新样式
                if (typeof loadWarehouseTasksList === 'function') {
                    setTimeout(() => {
                        loadWarehouseTasksList();
                        console.log('🔄 已触发仓库任务列表重新加载');
                    }, 300);
                }
            }
            
        } catch (error) {
            console.error('❌ 仓库任务样式统一初始化失败:', error);
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeStyleUnification);
    } else {
        // 如果页面已经加载完成，立即执行
        setTimeout(initializeStyleUnification, 100);
    }
    
    // 对外暴露函数供调试使用
    window.WarehouseStyleUnification = {
        unifyStyles: unifyWarehouseTaskStyles,
        applyCSS: applyCSSOverrides,
        initialize: initializeStyleUnification
    };
    
    console.log('📦 仓库任务样式统一脚本加载完成');
})();
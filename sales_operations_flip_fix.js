/**
 * 销售运营任务卡翻转功能修复脚本
 * 修复 div#task-95-front.task-front 等销售任务卡片的翻转功能
 */

(function() {
    'use strict';
    
    console.log('🚀 启动销售运营任务卡翻转功能修复...');
    
    // 修复1: 确保翻转功能的核心样式存在
    function fixFlipCoreStyles() {
        console.log('🔧 正在修复翻转核心样式...');
        
        const style = document.createElement('style');
        style.id = 'sales-flip-core-fix';
        style.textContent = `
            /* 销售运营任务卡片翻转核心样式 */
            .sales-operations-container .published-tasks-gallery .task-flip-container {
                perspective: 1500px !important;
                transform-style: preserve-3d !important;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                position: relative !important;
                cursor: pointer !important;
                width: 100% !important;
                height: 100% !important;
                min-height: 307.46px !important;
                max-width: 282.66px !important;
                max-height: 307.46px !important;
                display: block !important;
            }
            
            /* 翻转状态样式 */
            .sales-operations-container .published-tasks-gallery .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
            
            /* 正面卡片样式 */
            .sales-operations-container .published-tasks-gallery .task-front {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                position: relative !important;
                width: 100% !important;
                height: 100% !important;
                min-height: 307.46px !important;
                max-width: 282.66px !important;
                box-sizing: border-box !important;
                z-index: 2 !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 10px !important;
            }
            
            /* 背面卡片样式 */
            .sales-operations-container .published-tasks-gallery .task-back {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                min-height: 307.46px !important;
                max-width: 282.66px !important;
                box-sizing: border-box !important;
                z-index: 1 !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 15px !important;
                transform: rotateY(180deg) !important;
            }
            
            /* 文件预览区域样式 */
            .sales-operations-container .published-tasks-gallery .task-files-container {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px !important;
                width: 100% !important;
                margin-bottom: 15px !important;
            }
            
            .sales-operations-container .published-tasks-gallery .task-file-item {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                gap: 6px !important;
                padding: 8px !important;
                border: 1px solid #e9ecef !important;
                border-radius: 6px !important;
                background-color: #f8f9fa !important;
                text-align: center !important;
            }
            
            .sales-operations-container .published-tasks-gallery .file-label {
                font-size: 0.8rem !important;
                font-weight: 600 !important;
                color: #495057 !important;
                margin-bottom: 4px !important;
            }
            
            .sales-operations-container .published-tasks-gallery .file-preview {
                max-width: 80px !important;
                max-height: 80px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
            }
            
            .sales-operations-container .published-tasks-gallery .file-preview:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
            }
            
            .sales-operations-container .published-tasks-gallery .pdf-preview {
                width: 80px !important;
                height: 80px !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                background-color: #dc3545 !important;
                color: white !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
            }
            
            .sales-operations-container .published-tasks-gallery .pdf-preview:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3) !important;
            }
            
            .sales-operations-container .published-tasks-gallery .pdf-filename {
                font-size: 0.7rem !important;
                margin-top: 4px !important;
                text-align: center !important;
                word-break: break-all !important;
            }
            
            .sales-operations-container .published-tasks-gallery .no-file {
                font-size: 0.8rem !important;
                color: #6c757d !important;
                font-style: italic !important;
            }
            
            /* 删除按钮样式 */
            .sales-operations-container .published-tasks-gallery .task-back-actions {
                width: 100% !important;
                display: flex !important;
                justify-content: center !important;
                margin-top: auto !important;
                padding-top: 15px !important;
                border-top: 1px solid #e9ecef !important;
            }
            
            .sales-operations-container .published-tasks-gallery .back-action-buttons {
                display: flex !important;
                gap: 10px !important;
            }
            
            .sales-operations-container .published-tasks-gallery .btn-danger {
                background-color: #dc3545 !important;
                border-color: #dc3545 !important;
                color: white !important;
                padding: 8px 16px !important;
                font-size: 0.85rem !important;
                border-radius: 4px !important;
                transition: all 0.2s ease !important;
            }
            
            .sales-operations-container .published-tasks-gallery .btn-danger:hover {
                background-color: #c82333 !important;
                border-color: #bd2130 !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3) !important;
            }
            
            /* 悬停效果 */
            .sales-operations-container .published-tasks-gallery .task-flip-container:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1) !important;
            }
            
            .sales-operations-container .published-tasks-gallery .task-flip-container.flipped:hover {
                transform: translateY(-3px) rotateY(180deg) !important;
            }
            
            /* 响应式调整 */
            @media (max-width: 768px) {
                .sales-operations-container .published-tasks-gallery .task-flip-container {
                    max-width: 100% !important;
                    min-height: 280px !important;
                }
                
                .sales-operations-container .published-tasks-gallery .task-front,
                .sales-operations-container .published-tasks-gallery .task-back {
                    min-height: 280px !important;
                    max-width: 100% !important;
                }
                
                .sales-operations-container .published-tasks-gallery .task-files-container {
                    grid-template-columns: 1fr !important;
                    gap: 8px !important;
                }
            }
        `;
        
        // 移除旧样式
        const existingStyle = document.getElementById('sales-flip-core-fix');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
        console.log('✅ 翻转核心样式已应用');
    }
    
    // 修复2: 增强翻转功能逻辑
    function enhanceFlipFunctionality() {
        console.log('🔄 正在增强翻转功能逻辑...');
        
        // 确保翻转函数存在且正确
        if (typeof window.toggleTaskCardFlip !== 'function') {
            window.toggleTaskCardFlip = function(taskId) {
                console.log(`🔄 执行翻转任务: ${taskId}`);
                
                // 查找翻转容器
                let flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                
                if (!flipContainer) {
                    console.error(`❌ 未找到任务ID为 ${taskId} 的翻转容器`);
                    return;
                }
                
                // 执行翻转
                flipContainer.classList.toggle('flipped');
                const isFlipped = flipContainer.classList.contains('flipped');
                
                console.log(`✅ 任务 ${taskId} 翻转状态: ${isFlipped ? '背面' : '正面'}`);
                
                // 触发自定义事件
                const flipEvent = new CustomEvent('salesTaskCardFlipped', {
                    detail: {
                        taskId: taskId,
                        flipped: isFlipped,
                        element: flipContainer
                    }
                });
                document.dispatchEvent(flipEvent);
            };
        }
        
        // 为销售运营区域的任务卡片添加点击事件监听器
        function bindSalesTaskEvents() {
            const salesGallery = document.querySelector('.sales-operations-container .published-tasks-gallery');
            if (!salesGallery) {
                console.warn('⚠️ 未找到销售运营任务画廊');
                return;
            }
            
            // 使用事件委托
            salesGallery.addEventListener('click', function(e) {
                // 检查是否点击了翻转容器
                const flipContainer = e.target.closest('.task-flip-container');
                if (flipContainer && flipContainer.dataset.taskId) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.toggleTaskCardFlip(flipContainer.dataset.taskId);
                }
                
                // 检查是否点击了删除按钮
                const deleteButton = e.target.closest('.btn-danger');
                if (deleteButton) {
                    e.preventDefault();
                    e.stopPropagation();
                    // 删除按钮的原有逻辑应该已经存在
                }
            });
            
            console.log('✅ 销售任务事件监听器已绑定');
        }
        
        // 初始化事件绑定
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bindSalesTaskEvents);
        } else {
            bindSalesTaskEvents();
        }
        
        // 观察DOM变化，自动绑定新添加的任务卡片
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否有新的任务卡片被添加
                            const newTaskContainers = node.querySelectorAll ?
                                node.querySelectorAll('.task-flip-container') :
                                (node.matches && node.matches('.task-flip-container') ? [node] : []);
                            
                            if (newTaskContainers.length > 0) {
                                console.log(`🔍 检测到 ${newTaskContainers.length} 个新任务卡片`);
                                bindSalesTaskEvents(); // 重新绑定事件
                            }
                        }
                    });
                }
            });
        });
        
        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ DOM观察器已启动');
    }
    
    // 修复3: 确保任务卡片结构正确
    function ensureTaskCardStructure() {
        console.log('🏗️ 正在检查任务卡片结构...');
        
        // 检查现有的任务卡片
        const taskContainers = document.querySelectorAll('.sales-operations-container .task-flip-container');
        
        taskContainers.forEach(function(container, index) {
            const taskId = container.dataset.taskId;
            if (!taskId) {
                console.warn(`⚠️ 第 ${index + 1} 个任务容器缺少 taskId`);
                return;
            }
            
            // 确保正面和背面元素存在
            let frontCard = container.querySelector('.task-front');
            let backCard = container.querySelector('.task-back');
            
            if (!frontCard) {
                console.warn(`⚠️ 任务 ${taskId} 缺少正面卡片`);
                // 可以在这里尝试重建结构
            }
            
            if (!backCard) {
                console.warn(`⚠️ 任务 ${taskId} 缺少背面卡片`);
                // 可以在这里尝试重建结构
            }
            
            // 确保正面卡片有正确的ID
            if (frontCard && !frontCard.id) {
                frontCard.id = `task-${taskId}-front`;
                console.log(`✅ 为任务 ${taskId} 的正面卡片设置了ID`);
            }
        });
        
        console.log(`✅ 检查完成，共发现 ${taskContainers.length} 个任务容器`);
    }
    
    // 修复4: 添加视觉反馈和调试信息
    function addVisualFeedback() {
        console.log('🎨 正在添加视觉反馈...');
        
        const debugStyle = document.createElement('style');
        debugStyle.id = 'sales-flip-debug-style';
        debugStyle.textContent = `
            /* 调试用的视觉反馈 */
            .sales-operations-container .task-flip-container.debug-mode {
                outline: 2px solid #007bff !important;
            }
            
            .sales-operations-container .task-front.debug-mode {
                outline: 2px solid #28a745 !important;
            }
            
            .sales-operations-container .task-back.debug-mode {
                outline: 2px solid #dc3545 !important;
            }
            
            /* 翻转动画调试 */
            .sales-operations-container .task-flip-container.debug-flip {
                animation: debugFlipPulse 2s infinite !important;
            }
            
            @keyframes debugFlipPulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.4) !important; }
                50% { box-shadow: 0 0 0 10px rgba(0, 123, 255, 0) !important; }
            }
        `;
        
        const existingDebugStyle = document.getElementById('sales-flip-debug-style');
        if (existingDebugStyle) {
            existingDebugStyle.remove();
        }
        
        document.head.appendChild(debugStyle);
        console.log('✅ 视觉反馈样式已添加');
    }
    
    // 主初始化函数
    function initializeFlipFix() {
        console.log('⚡ 开始初始化销售运营翻转功能修复...');
        
        // 按顺序执行各项修复
        fixFlipCoreStyles();
        enhanceFlipFunctionality();
        ensureTaskCardStructure();
        addVisualFeedback();
        
        // 添加全局状态跟踪
        window.salesFlipStates = new Map();
        
        // 监听翻转事件
        document.addEventListener('salesTaskCardFlipped', function(e) {
            const { taskId, flipped } = e.detail;
            window.salesFlipStates.set(taskId, flipped);
            console.log(`📊 翻转状态更新 - 任务 ${taskId}: ${flipped ? '背面' : '正面'}`);
        });
        
        console.log('🎉 销售运营任务卡翻转功能修复完成！');
        console.log('💡 提示: 点击任务卡片可翻转，再次点击可返回正面');
        console.log('💡 背面显示: 本体码、条码、警示码、说明书、箱唛、其他文件和删除按钮');
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFlipFix);
    } else {
        initializeFlipFix();
    }
    
    // 导出修复函数供外部调用
    window.SalesOperationsFlipFix = {
        reinitialize: initializeFlipFix,
        getStatus: function() {
            return {
                initialized: true,
                taskCount: document.querySelectorAll('.sales-operations-container .task-flip-container').length,
                flipStates: Array.from(window.salesFlipStates.entries())
            };
        }
    };
    
})();
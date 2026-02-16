/**
 * 任务卡片尺寸调整脚本
 * 将任务卡尺寸从 302.66px 调整为 282.66px x 307.46px
 * 针对 div#task-88-front.task-front 及相关元素
 */

(function() {
    'use strict';
    
    console.log('📏 开始调整任务卡片尺寸...');
    
    // 新的目标尺寸
    const TARGET_WIDTH = '282.66px';
    const TARGET_HEIGHT = '307.46px';
    
    // 创建样式覆盖
    function adjustTaskCardSizes() {
        const style = document.createElement('style');
        style.id = 'task-card-size-adjustment';
        style.textContent = `
            /* 调整任务翻转容器尺寸 */
            .task-flip-container {
                width: ${TARGET_WIDTH} !important;
                max-width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                max-height: ${TARGET_HEIGHT} !important;
            }
            
            /* 调整任务卡片正面尺寸 */
            .task-flip-container .task-front {
                width: ${TARGET_WIDTH} !important;
                max-width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                min-height: ${TARGET_HEIGHT} !important;
            }
            
            /* 调整任务卡片背面尺寸 */
            .task-flip-container .task-back {
                width: ${TARGET_WIDTH} !important;
                max-width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                min-height: ${TARGET_HEIGHT} !important;
            }
            
            /* 特定针对任务88的调整 */
            #task-88-front.task-front {
                width: ${TARGET_WIDTH} !important;
                max-width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                min-height: ${TARGET_HEIGHT} !important;
            }
            
            /* 调整网格布局以适应新尺寸 */
            .published-tasks-gallery {
                grid-template-columns: repeat(auto-fit, minmax(${TARGET_WIDTH}, 1fr)) !important;
                gap: 12px !important;
            }
            
            /* 响应式调整 */
            @media (max-width: 1200px) {
                .published-tasks-gallery {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            
            @media (max-width: 768px) {
                .published-tasks-gallery {
                    grid-template-columns: 1fr !important;
                }
                
                .task-flip-container,
                .task-flip-container .task-front,
                .task-flip-container .task-back {
                    width: calc(100% - 20px) !important;
                    max-width: ${TARGET_WIDTH} !important;
                    height: auto !important;
                    min-height: 250px !important;
                }
            }
            
            /* 确保内容适配新尺寸 */
            .task-card-content {
                width: 100% !important;
                box-sizing: border-box !important;
            }
            
            .task-info-inline {
                flex-wrap: wrap !important;
                justify-content: center !important;
            }
        `;
        
        // 移除旧的样式调整
        const existingStyle = document.getElementById('task-card-size-adjustment');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
        console.log(`✅ 任务卡片尺寸已调整为 ${TARGET_WIDTH} x ${TARGET_HEIGHT}`);
    }
    
    // 应用即时调整
    function applyImmediateAdjustments() {
        // 直接调整现有的元素
        const taskContainers = document.querySelectorAll('.task-flip-container');
        taskContainers.forEach(container => {
            container.style.width = TARGET_WIDTH;
            container.style.maxWidth = TARGET_WIDTH;
            container.style.height = TARGET_HEIGHT;
            container.style.maxHeight = TARGET_HEIGHT;
            
            const frontCard = container.querySelector('.task-front');
            const backCard = container.querySelector('.task-back');
            
            if (frontCard) {
                frontCard.style.width = TARGET_WIDTH;
                frontCard.style.maxWidth = TARGET_WIDTH;
                frontCard.style.height = TARGET_HEIGHT;
                frontCard.style.minHeight = TARGET_HEIGHT;
            }
            
            if (backCard) {
                backCard.style.width = TARGET_WIDTH;
                backCard.style.maxWidth = TARGET_WIDTH;
                backCard.style.height = TARGET_HEIGHT;
                backCard.style.minHeight = TARGET_HEIGHT;
            }
        });
        
        // 特殊处理任务88
        const task88 = document.querySelector('#task-88-front.task-front');
        if (task88) {
            task88.style.width = TARGET_WIDTH;
            task88.style.maxWidth = TARGET_WIDTH;
            task88.style.height = TARGET_HEIGHT;
            task88.style.minHeight = TARGET_HEIGHT;
            console.log('✅ 任务88卡片尺寸已特别调整');
        }
        
        console.log('✅ 即时尺寸调整完成');
    }
    
    // 初始化调整
    function initializeSizeAdjustment() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                adjustTaskCardSizes();
                setTimeout(applyImmediateAdjustments, 100);
            });
        } else {
            adjustTaskCardSizes();
            setTimeout(applyImmediateAdjustments, 100);
        }
        
        // 监听动态添加的内容
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是任务卡片相关元素
                            if (node.classList && 
                                (node.classList.contains('task-flip-container') || 
                                 node.classList.contains('task-front') || 
                                 node.classList.contains('task-back'))) {
                                applyImmediateAdjustments();
                            }
                            
                            // 检查子元素
                            const taskElements = node.querySelectorAll('.task-flip-container, .task-front, .task-back');
                            if (taskElements.length > 0) {
                                setTimeout(applyImmediateAdjustments, 50);
                            }
                        }
                    });
                }
            });
        });
        
        function startObserving() {
            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                console.log('🔍 尺寸调整监控已启动');
            } else {
                // 如果body还不存在，等待它出现
                const bodyObserver = new MutationObserver(() => {
                    if (document.body) {
                        bodyObserver.disconnect();
                        startObserving();
                    }
                });
                bodyObserver.observe(document.documentElement, {
                    childList: true
                });
            }
        }
        
        startObserving();
    }
    
    // 执行初始化
    initializeSizeAdjustment();
    
    // 提供全局函数供手动调用
    window.adjustTaskCardSize = function(width = '282.66px', height = '307.46px') {
        const style = document.getElementById('task-card-size-adjustment');
        if (style) {
            style.textContent = style.textContent
                .replace(/282\.66px/g, width)
                .replace(/307\.46px/g, height);
        }
        console.log(`🔄 任务卡片尺寸已更新为 ${width} x ${height}`);
    };
    
    console.log('✨ 任务卡片尺寸调整脚本已加载');
    
})();
/**
 * 任务卡片92尺寸专项调整脚本
 * 专门为 div#task-92-front.task-front 调整尺寸为 282.66px x 307.46px
 */

(function() {
    'use strict';
    
    console.log('📏 开始调整任务卡片92尺寸...');
    
    // 目标尺寸
    const TARGET_WIDTH = '282.66px';
    const TARGET_HEIGHT = '307.46px';
    
    // 创建专门针对任务92的样式
    function adjustTask92Size() {
        const style = document.createElement('style');
        style.id = 'task-92-size-adjustment';
        style.textContent = `
            /* 专门针对任务92的尺寸调整 */
            #task-92-front.task-front {
                width: ${TARGET_WIDTH} !important;
                max-width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                min-height: ${TARGET_HEIGHT} !important;
                position: relative !important;
                box-sizing: border-box !important;
            }
            
            /* 确保任务92所在的容器也适配 */
            #task-92-front.task-front ~ .task-back {
                width: ${TARGET_WIDTH} !important;
                max-width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                min-height: ${TARGET_HEIGHT} !important;
            }
            
            /* 调整父容器 */
            #task-92-front.task-front.closest('.task-flip-container') {
                width: ${TARGET_WIDTH} !important;
                max-width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                min-height: ${TARGET_HEIGHT} !important;
            }
            
            /* 响应式适配 */
            @media (max-width: 768px) {
                #task-92-front.task-front {
                    width: calc(100% - 20px) !important;
                    max-width: ${TARGET_WIDTH} !important;
                    height: auto !important;
                    min-height: 250px !important;
                }
            }
        `;
        
        // 移除旧的样式
        const existingStyle = document.getElementById('task-92-size-adjustment');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
        console.log(`✅ 任务92尺寸调整样式已应用 (${TARGET_WIDTH} x ${TARGET_HEIGHT})`);
    }
    
    // 直接调整DOM元素
    function applyDirectAdjustment() {
        const task92 = document.querySelector('#task-92-front.task-front');
        if (task92) {
            task92.style.cssText = `
                width: ${TARGET_WIDTH} !important;
                max-width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                min-height: ${TARGET_HEIGHT} !important;
                position: relative !important;
                box-sizing: border-box !important;
            `;
            
            // 调整父容器
            const container = task92.closest('.task-flip-container');
            if (container) {
                container.style.cssText = `
                    width: ${TARGET_WIDTH} !important;
                    max-width: ${TARGET_WIDTH} !important;
                    height: ${TARGET_HEIGHT} !important;
                    min-height: ${TARGET_HEIGHT} !important;
                    display: block !important;
                `;
            }
            
            console.log('✅ 任务92卡片已直接调整尺寸');
        } else {
            console.log('⚠️ 未找到任务92卡片元素');
        }
    }
    
    // 验证调整结果
    function verifyAdjustment() {
        setTimeout(() => {
            const task92 = document.querySelector('#task-92-front.task-front');
            if (task92) {
                const computedStyle = window.getComputedStyle(task92);
                const width = computedStyle.width;
                const height = computedStyle.height;
                
                console.log(`📊 任务92当前尺寸: ${width} x ${height}`);
                console.log(`🎯 目标尺寸: ${TARGET_WIDTH} x ${TARGET_HEIGHT}`);
                
                if (width === TARGET_WIDTH && height === TARGET_HEIGHT) {
                    console.log('✅ 任务92尺寸调整成功！');
                } else {
                    console.log('⚠️ 任务92尺寸仍有偏差，可能需要进一步调整');
                }
            }
        }, 500);
    }
    
    // 初始化调整
    function initializeAdjustment() {
        // 等待DOM加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                adjustTask92Size();
                setTimeout(() => {
                    applyDirectAdjustment();
                    verifyAdjustment();
                }, 200);
            });
        } else {
            adjustTask92Size();
            setTimeout(() => {
                applyDirectAdjustment();
                verifyAdjustment();
            }, 200);
        }
        
        // 监听动态内容
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否包含任务92
                            if (node.id === 'task-92-front' || 
                                (node.querySelector && node.querySelector('#task-92-front'))) {
                                setTimeout(() => {
                                    applyDirectAdjustment();
                                    verifyAdjustment();
                                }, 100);
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
                console.log('🔍 任务92尺寸调整监控已启动');
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
    initializeAdjustment();
    
    // 提供全局函数
    window.adjustTask92Size = function() {
        adjustTask92Size();
        applyDirectAdjustment();
        verifyAdjustment();
        console.log('🔄 任务92尺寸已重新调整');
    };
    
    console.log('✨ 任务92尺寸调整脚本已加载');
    
})();
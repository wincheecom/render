/**
 * 任务卡片重叠问题修复脚本
 * 专门解决 div#task-88-front.task-front 和 div#task-93-front.task-front 重叠问题
 */

(function() {
    'use strict';
    
    console.log('🔧 开始修复任务卡片重叠问题...');
    
    // 修复函数
    function fixTaskCardOverlap() {
        // 创建专门的CSS样式来解决重叠问题
        const style = document.createElement('style');
        style.id = 'task-overlap-fix';
        style.textContent = `
            /* 修复任务卡片重叠问题 - 针对性解决方案 */
            
            /* 确保所有任务卡片都有正确的网格定位 */
            .published-tasks-gallery {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(282.66px, 1fr)) !important;
                gap: 15px !important;
                margin-top: 15px !important;
                align-content: start !important;
                justify-content: stretch !important;
                width: 100% !important;
                grid-auto-rows: minmax(307.46px, auto) !important;
            }
            
            /* 确保每个任务翻转容器正确放置 */
            .published-tasks-gallery .task-flip-container {
                display: block !important;
                width: 100% !important;
                min-height: 307.46px !important;
                margin: 0 !important;
                padding: 0 !important;
                grid-column: auto !important;
                grid-row: auto !important;
                align-self: start !important;
            }
            
            /* 特别处理任务卡片正面 */
            .published-tasks-gallery .task-front {
                position: relative !important;
                width: 100% !important;
                max-width: 282.66px !important;
                height: auto !important;
                min-height: 307.46px !important;
                margin: 0 !important;
                padding: 10px !important;
                box-sizing: border-box !important;
                z-index: 1 !important;
            }
            
            /* 特别针对任务88和93 */
            #task-88-front.task-front,
            #task-93-front.task-front {
                position: relative !important;
                z-index: auto !important;
                grid-column: auto !important;
                grid-row: auto !important;
            }
            
            /* 确保没有绝对定位干扰网格布局 */
            div[id^="task-"][id$="-front"].task-front,
            div[id^="task-"][id$="-back"].task-back {
                position: relative !important;
                top: auto !important;
                left: auto !important;
            }
            
            /* 清理可能的冲突样式 */
            .published-tasks-gallery .task-front,
            .published-tasks-gallery .task-back {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                transform-style: preserve-3d !important;
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
                    gap: 12px !important;
                }
                
                .published-tasks-gallery .task-front {
                    min-height: 250px !important;
                    width: calc(100% - 20px) !important;
                    max-width: 282.66px !important;
                }
            }
        `;
        
        // 移除可能存在的旧样式
        const existingStyle = document.getElementById('task-overlap-fix');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
        console.log('✅ 已应用任务卡片重叠修复样式');
    }
    
    // 动态调整现有元素
    function adjustExistingTaskCards() {
        const taskCards = document.querySelectorAll('.published-tasks-gallery .task-flip-container');
        
        taskCards.forEach((container, index) => {
            // 确保每个容器都有正确的样式
            container.style.cssText = `
                display: block !important;
                width: 100% !important;
                min-height: 307.46px !important;
                margin: 0 !important;
                padding: 0 !important;
                grid-column: auto !important;
                grid-row: auto !important;
                align-self: start !important;
            `;
            
            // 处理内部的正面和背面卡片
            const frontCard = container.querySelector('.task-front');
            const backCard = container.querySelector('.task-back');
            
            if (frontCard) {
                frontCard.style.cssText = `
                    position: relative !important;
                    width: 100% !important;
                    max-width: 282.66px !important;
                    height: auto !important;
                    min-height: 307.46px !important;
                    margin: 0 !important;
                    padding: 10px !important;
                    box-sizing: border-box !important;
                    z-index: 1 !important;
                `;
            }
            
            if (backCard) {
                backCard.style.cssText = `
                    position: relative !important;
                    width: 100% !important;
                    max-width: 282.66px !important;
                    height: auto !important;
                    min-height: 307.46px !important;
                    margin: 0 !important;
                    padding: 10px !important;
                    box-sizing: border-box !important;
                    z-index: 1 !important;
                `;
            }
            
            console.log(`🔧 已调整任务卡片 ${index + 1}`);
        });
        
        console.log(`✅ 已调整 ${taskCards.length} 个任务卡片`);
    }
    
    // 验证修复效果
    function verifyFix() {
        setTimeout(() => {
            const gallery = document.querySelector('.published-tasks-gallery');
            if (!gallery) return;
            
            const computedStyle = window.getComputedStyle(gallery);
            const display = computedStyle.display;
            const gridTemplate = computedStyle.gridTemplateColumns;
            const gap = computedStyle.gap;
            
            console.log('🔍 修复验证结果:');
            console.log(`   Display: ${display}`);
            console.log(`   Grid Template: ${gridTemplate}`);
            console.log(`   Gap: ${gap}`);
            
            const taskCards = gallery.querySelectorAll('.task-flip-container');
            console.log(`   任务卡片数量: ${taskCards.length}`);
            
            // 检查是否有重叠
            let hasOverlap = false;
            const positions = [];
            
            taskCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                positions.push({
                    index: index,
                    left: rect.left,
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom
                });
            });
            
            // 简单的重叠检测
            for (let i = 0; i < positions.length - 1; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    const pos1 = positions[i];
                    const pos2 = positions[j];
                    
                    // 检查是否在同一个网格位置
                    if (Math.abs(pos1.left - pos2.left) < 10 && Math.abs(pos1.top - pos2.top) < 10) {
                        hasOverlap = true;
                        console.log(`⚠️ 检测到可能的重叠: 卡片${pos1.index + 1} 和 卡片${pos2.index + 1}`);
                    }
                }
            }
            
            if (!hasOverlap) {
                console.log('🎉 任务卡片重叠问题已解决！');
            } else {
                console.log('❌ 仍存在重叠问题，需要进一步调整');
            }
        }, 500);
    }
    
    // 主执行函数
    function executeFix() {
        console.log('🚀 开始执行任务卡片重叠修复...');
        
        // 1. 应用CSS修复
        fixTaskCardOverlap();
        
        // 2. 调整现有元素
        adjustExistingTaskCards();
        
        // 3. 验证修复效果
        verifyFix();
        
        console.log('✅ 任务卡片重叠修复完成！');
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeFix);
    } else {
        executeFix();
    }
    
    // 监听DOM变化，持续修复新添加的任务卡片
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // 元素节点
                        if (node.classList && 
                            (node.classList.contains('task-flip-container') || 
                             node.querySelector('.task-flip-container'))) {
                            console.log('🔄 检测到新任务卡片，正在应用修复...');
                            setTimeout(() => {
                                adjustExistingTaskCards();
                                verifyFix();
                            }, 100);
                        }
                    }
                });
            }
        });
    });
    
    // 开始观察
    function startObserving() {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            console.log('🔍 任务重叠修复监控已启动');
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
    
})();
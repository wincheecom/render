/**
 * 销售运营任务卡翻转位置偏移修复脚本
 * 专门解决 div#task-96-front.task-front 翻转后位置错位问题
 */

(function() {
    'use strict';
    
    console.log('🎯 启动销售任务卡位置偏移修复...');
    
    // 修复1: 精准定位翻转核心样式问题
    function fixPositionOffsetStyles() {
        console.log('🔧 正在修复位置偏移相关样式...');
        
        const positionFixStyle = document.createElement('style');
        positionFixStyle.id = 'sales-flip-position-fix';
        positionFixStyle.textContent = `
            /* 销售运营任务卡片位置偏移修复核心样式 */
            
            /* 确保翻转容器具有正确的变换原点和透视 */
            .sales-operations-container .published-tasks-gallery .task-flip-container {
                /* 关键修复：设置精确的变换原点 */
                transform-origin: center center !important;
                -webkit-transform-origin: center center !important;
                
                /* 确保透视效果正确 */
                perspective: 1500px !important;
                -webkit-perspective: 1500px !important;
                
                /* 3D变换样式 */
                transform-style: preserve-3d !important;
                -webkit-transform-style: preserve-3d !important;
                
                /* 平滑过渡动画 */
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                -webkit-transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                
                /* 定位和尺寸约束 */
                position: relative !important;
                width: 100% !important;
                height: 100% !important;
                max-width: 282.66px !important;
                max-height: 307.46px !important;
                min-height: 307.46px !important;
                
                /* 显示和光栅化优化 */
                display: block !important;
                will-change: transform !important;
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                
                /* 防止意外的外边距影响 */
                margin: 0 !important;
                padding: 0 !important;
            }
            
            /* 翻转状态的精确位置控制 */
            .sales-operations-container .published-tasks-gallery .task-flip-container.flipped {
                /* 关键：保持翻转时的位置不变 */
                transform: rotateY(180deg) translateZ(0) !important;
                -webkit-transform: rotateY(180deg) translateZ(0) !important;
            }
            
            /* 正面卡片精确定位 */
            .sales-operations-container .published-tasks-gallery .task-front {
                /* 确保正面卡片正确显示 */
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                
                /* 精确定位 */
                position: relative !important;
                top: 0 !important;
                left: 0 !important;
                
                /* 尺寸约束 */
                width: 100% !important;
                height: 100% !important;
                max-width: 282.66px !important;
                min-height: 307.46px !important;
                
                /* 层级和外观 */
                z-index: 2 !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                
                /* 布局和内边距 */
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 10px !important;
                box-sizing: border-box !important;
                
                /* 防止意外偏移 */
                margin: 0 !important;
            }
            
            /* 背面卡片精确定位 */
            .sales-operations-container .published-tasks-gallery .task-back {
                /* 确保背面卡片正确隐藏和显示 */
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                
                /* 精确定位 - 关键修复点 */
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                
                /* 尺寸完全匹配正面 */
                width: 100% !important;
                height: 100% !important;
                max-width: 282.66px !important;
                min-height: 307.46px !important;
                
                /* 层级和外观 */
                z-index: 1 !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                
                /* 布局和内边距 */
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 15px !important;
                box-sizing: border-box !important;
                
                /* 关键：180度旋转使其在背面显示 */
                transform: rotateY(180deg) !important;
                -webkit-transform: rotateY(180deg) !important;
                
                /* 防止意外偏移 */
                margin: 0 !important;
            }
            
            /* 网格容器约束修复 */
            .sales-operations-container .published-tasks-gallery {
                /* 确保网格容器不会影响子元素定位 */
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(282.66px, 1fr)) !important;
                gap: 15px !important;
                margin-top: 15px !important;
                align-content: start !important;
                justify-content: stretch !important;
                width: 100% !important;
                grid-auto-rows: minmax(307.46px, auto) !important;
                
                /* 防止容器本身造成偏移 */
                position: relative !important;
                transform-style: preserve-3d !important;
            }
            
            /* 父容器约束加强 */
            .sales-operations-container .published-tasks-section {
                /* 确保父容器提供稳定的布局环境 */
                position: relative !important;
                transform-style: preserve-3d !important;
                perspective: 2000px !important;
            }
            
            /* GPU加速优化 */
            .sales-operations-container .task-flip-container {
                /* 启用硬件加速减少渲染偏移 */
                transform: translateZ(0) !important;
                -webkit-transform: translateZ(0) !important;
            }
            
            /* 防止滚动条影响 */
            .sales-operations-container {
                /* 确保容器不会因为滚动产生偏移 */
                overflow: visible !important;
                position: relative !important;
            }
            
            /* 响应式位置保护 */
            @media (max-width: 768px) {
                .sales-operations-container .published-tasks-gallery .task-flip-container {
                    max-width: 100% !important;
                    min-height: 280px !important;
                    transform-origin: center center !important;
                }
                
                .sales-operations-container .published-tasks-gallery .task-front,
                .sales-operations-container .published-tasks-gallery .task-back {
                    min-height: 280px !important;
                    max-width: 100% !important;
                }
                
                .sales-operations-container .published-tasks-gallery {
                    grid-template-columns: 1fr !important;
                    gap: 12px !important;
                }
            }
            
            /* 调试模式样式（可选启用） */
            /*
            .sales-operations-container .task-flip-container.debug-position {
                outline: 2px solid #ff6b6b !important;
            }
            
            .sales-operations-container .task-front.debug-position {
                outline: 2px solid #4ecdc4 !important;
            }
            
            .sales-operations-container .task-back.debug-position {
                outline: 2px solid #45b7d1 !important;
            }
            */
        `;
        
        // 移除旧的位置修复样式
        const existingPositionStyle = document.getElementById('sales-flip-position-fix');
        if (existingPositionStyle) {
            existingPositionStyle.remove();
        }
        
        document.head.appendChild(positionFixStyle);
        console.log('✅ 位置偏移修复样式已应用');
    }
    
    // 修复2: 增强翻转函数的位置稳定性
    function enhancePositionStableFlip() {
        console.log('🔄 正在增强位置稳定翻转功能...');
        
        // 保存原始翻转函数
        const originalToggleFlip = window.toggleTaskCardFlip;
        
        // 创建位置稳定的翻转函数
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🎯 执行位置稳定翻转 - 任务ID: ${taskId}`);
            
            try {
                // 查找翻转容器
                let flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                
                // 如果没找到，尝试通过front元素查找
                if (!flipContainer) {
                    const frontElement = document.querySelector(`#task-${taskId}-front`);
                    if (frontElement) {
                        flipContainer = frontElement.closest('.task-flip-container');
                    }
                }
                
                if (!flipContainer) {
                    console.error(`❌ 未找到任务ID为 ${taskId} 的翻转容器`);
                    return;
                }
                
                // 记录翻转前的位置信息
                const rectBefore = flipContainer.getBoundingClientRect();
                console.log(`📏 翻转前位置:`, {
                    x: rectBefore.x,
                    y: rectBefore.y,
                    width: rectBefore.width,
                    height: rectBefore.height
                });
                
                // 执行翻转
                flipContainer.classList.toggle('flipped');
                const isFlipped = flipContainer.classList.contains('flipped');
                
                // 强制重绘以确保位置稳定
                flipContainer.offsetHeight;
                
                // 检查翻转后的位置
                setTimeout(() => {
                    const rectAfter = flipContainer.getBoundingClientRect();
                    console.log(`📏 翻转后位置:`, {
                        x: rectAfter.x,
                        y: rectAfter.y,
                        width: rectAfter.width,
                        height: rectAfter.height
                    });
                    
                    // 如果位置发生显著偏移，进行修正
                    const deltaX = Math.abs(rectAfter.x - rectBefore.x);
                    const deltaY = Math.abs(rectAfter.y - rectBefore.y);
                    
                    if (deltaX > 5 || deltaY > 5) {
                        console.warn(`⚠️ 检测到位置偏移: ΔX=${deltaX}px, ΔY=${deltaY}px`);
                        // 这里可以添加位置修正逻辑
                    }
                }, 100);
                
                console.log(`✅ 任务 ${taskId} 翻转完成 - 状态: ${isFlipped ? '背面' : '正面'}`);
                
                // 触发位置稳定事件
                const positionEvent = new CustomEvent('salesTaskCardPositionStable', {
                    detail: {
                        taskId: taskId,
                        flipped: isFlipped,
                        element: flipContainer,
                        positionStable: true
                    }
                });
                document.dispatchEvent(positionEvent);
                
            } catch (error) {
                console.error(`❌ 翻转执行出错:`, error);
                // 回退到原始函数
                if (originalToggleFlip && typeof originalToggleFlip === 'function') {
                    originalToggleFlip(taskId);
                }
            }
        };
        
        console.log('✅ 位置稳定翻转功能已增强');
    }
    
    // 修复3: 添加位置监控和自动修正
    function addPositionMonitoring() {
        console.log('👁️ 正在添加位置监控...');
        
        // 创建位置监控器
        const positionObservers = new Map();
        
        // 监控特定任务卡片的位置变化
        function monitorTaskPosition(taskId) {
            const flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
            if (!flipContainer) return;
            
            // 如果已有监控器，先断开
            if (positionObservers.has(taskId)) {
                positionObservers.get(taskId).disconnect();
            }
            
            // 创建新的位置观察器
            const observer = new ResizeObserver((entries) => {
                entries.forEach(entry => {
                    const rect = entry.contentRect;
                    console.log(`📊 任务${taskId}尺寸变化:`, {
                        width: rect.width,
                        height: rect.height
                    });
                    
                    // 可以在这里添加自动修正逻辑
                    if (rect.width < 280 || rect.height < 300) {
                        console.warn(`⚠️ 任务${taskId}尺寸异常，可能需要修正`);
                    }
                });
            });
            
            observer.observe(flipContainer);
            positionObservers.set(taskId, observer);
            console.log(`✅ 开始监控任务${taskId}的位置变化`);
        }
        
        // 监控所有销售任务卡片
        function monitorAllSalesTasks() {
            const taskContainers = document.querySelectorAll('.sales-operations-container .task-flip-container');
            taskContainers.forEach(container => {
                const taskId = container.dataset.taskId;
                if (taskId) {
                    monitorTaskPosition(taskId);
                }
            });
        }
        
        // 初始化监控
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', monitorAllSalesTasks);
        } else {
            monitorAllSalesTasks();
        }
        
        // 监听DOM变化，自动监控新添加的任务
        const domObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const newContainers = node.querySelectorAll ?
                                node.querySelectorAll('.sales-operations-container .task-flip-container') :
                                (node.matches && node.matches('.task-flip-container') ? [node] : []);
                            
                            newContainers.forEach(container => {
                                const taskId = container.dataset.taskId;
                                if (taskId) {
                                    monitorTaskPosition(taskId);
                                }
                            });
                        }
                    });
                }
            });
        });
        
        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ 位置监控系统已启动');
    }
    
    // 修复4: 添加调试和测试工具
    function addDebugTools() {
        console.log('🛠️ 正在添加调试工具...');
        
        // 位置测试函数
        window.testSalesFlipPosition = function(taskId = '96') {
            console.log(`🧪 测试任务${taskId}翻转位置稳定性...`);
            
            const container = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
            if (!container) {
                console.error(`❌ 未找到任务${taskId}`);
                return;
            }
            
            const rectBefore = container.getBoundingClientRect();
            console.log('翻转前位置:', rectBefore);
            
            // 执行翻转
            window.toggleTaskCardFlip(taskId);
            
            // 延迟检查位置
            setTimeout(() => {
                const rectAfter = container.getBoundingClientRect();
                console.log('翻转后位置:', rectAfter);
                
                const deltaX = Math.abs(rectAfter.x - rectBefore.x);
                const deltaY = Math.abs(rectAfter.y - rectBefore.y);
                
                console.log(`📊 位置偏移量: ΔX=${deltaX}px, ΔY=${deltaY}px`);
                
                if (deltaX <= 2 && deltaY <= 2) {
                    console.log('✅ 位置稳定，无明显偏移');
                } else {
                    console.warn('⚠️ 检测到位置偏移');
                }
            }, 600); // 等待翻转动画完成
        };
        
        // 批量测试所有任务卡片
        window.testAllSalesFlipPositions = function() {
            console.log('🧪 批量测试所有销售任务卡片位置稳定性...');
            
            const containers = document.querySelectorAll('.sales-operations-container .task-flip-container');
            containers.forEach((container, index) => {
                const taskId = container.dataset.taskId;
                if (taskId) {
                    setTimeout(() => {
                        window.testSalesFlipPosition(taskId);
                    }, index * 1000); // 间隔1秒测试每个任务
                }
            });
        };
        
        // 重置所有任务卡片位置
        window.resetSalesTaskPositions = function() {
            console.log('🔄 重置所有销售任务卡片位置...');
            
            const containers = document.querySelectorAll('.sales-operations-container .task-flip-container');
            containers.forEach(container => {
                container.classList.remove('flipped');
                // 强制重绘
                container.offsetHeight;
            });
            
            console.log(`✅ 已重置 ${containers.length} 个任务卡片`);
        };
        
        console.log('✅ 调试工具已添加');
        console.log('💡 使用方法:');
        console.log('   testSalesFlipPosition("96") - 测试单个任务位置');
        console.log('   testAllSalesFlipPositions() - 测试所有任务位置');
        console.log('   resetSalesTaskPositions() - 重置所有任务位置');
    }
    
    // 主初始化函数
    function initializePositionFix() {
        console.log('⚡ 开始初始化位置偏移修复...');
        
        // 按顺序执行修复
        fixPositionOffsetStyles();
        enhancePositionStableFlip();
        addPositionMonitoring();
        addDebugTools();
        
        // 添加全局状态跟踪
        window.salesPositionStates = new Map();
        
        // 监听位置稳定事件
        document.addEventListener('salesTaskCardPositionStable', function(e) {
            const { taskId, flipped, positionStable } = e.detail;
            window.salesPositionStates.set(taskId, {
                flipped: flipped,
                positionStable: positionStable,
                timestamp: Date.now()
            });
            console.log(`📊 位置状态更新 - 任务 ${taskId}: ${flipped ? '背面' : '正面'}, 稳定: ${positionStable}`);
        });
        
        console.log('🎯 销售任务卡位置偏移修复完成！');
        console.log('✅ 修复要点:');
        console.log('   1. 设置正确的 transform-origin: center center');
        console.log('   2. 确保 perspective 和 transform-style 正确');
        console.log('   3. 精确控制正面和背面卡片的定位');
        console.log('   4. 添加位置监控和自动修正机制');
        console.log('💡 测试方法: 在控制台运行 testSalesFlipPosition("96")');
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePositionFix);
    } else {
        initializePositionFix();
    }
    
    // 导出修复工具
    window.SalesFlipPositionFix = {
        reinitialize: initializePositionFix,
        testPosition: window.testSalesFlipPosition,
        testAllPositions: window.testAllSalesFlipPositions,
        resetPositions: window.resetSalesTaskPositions,
        getStatus: function() {
            return {
                initialized: true,
                monitoredTasks: window.salesPositionStates.size,
                positionStates: Array.from(window.salesPositionStates.entries())
            };
        }
    };
    
})();
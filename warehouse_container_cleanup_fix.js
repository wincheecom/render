/**
 * 仓库任务容器清理修复脚本
 * 解决 #warehouseTasks.published-tasks-gallery.task-gallery 容器内的样式冲突问题
 */

(function() {
    'use strict';
    
    console.log('🧹 开始清理仓库任务容器样式冲突...');
    
    // 修复1: 清理冲突的CSS样式
    function cleanupConflictingStyles() {
        // 移除可能存在的重复样式元素
        const conflictingStyles = [
            'task-card-dimension-fix',
            'task-card-debug-style', 
            'task-gallery-img-adjustment',
            'task-overlap-fix',
            'warehouse-grid-layout-fix'
        ];
        
        conflictingStyles.forEach(styleId => {
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                existingStyle.remove();
                console.log(`🗑️ 已移除冲突样式: ${styleId}`);
            }
        });
        
        // 特别处理任务卡片95的样式冲突
        const task95 = document.getElementById('task-95-front');
        if (task95) {
            console.log('🔍 检测到任务卡片95，正在进行专项清理...');
            
            // 清理任务卡片95的内联样式冲突
            if (task95.style.length > 0) {
                console.log('🧹 清理任务卡片95的内联样式冲突');
                const originalStyles = task95.getAttribute('style') || '';
                console.log('原始内联样式:', originalStyles);
                
                // 移除所有内联样式
                task95.removeAttribute('style');
                
                // 重新应用干净的标准样式
                task95.style.cssText = `
                    position: relative !important;
                    width: 100% !important;
                    max-width: 282.66px !important;
                    height: auto !important;
                    min-height: 307.46px !important;
                    margin: 0px !important;
                    padding: 10px !important;
                    box-sizing: border-box !important;
                    z-index: 1 !important;
                `;
                
                console.log('✅ 任务卡片95样式清理完成');
            }
        }
        
        // 创建统一的清理样式
        const cleanupStyle = document.createElement('style');
        cleanupStyle.id = 'warehouse-container-cleanup';
        cleanupStyle.textContent = `
            /* === 仓库任务容器样式清理 === */
            
            /* 重置容器基础样式 */
            #warehouseTasks.published-tasks-gallery.task-gallery {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 15px !important;
                margin-top: 15px !important;
                align-content: start !important;
                justify-content: stretch !important;
                width: 100% !important;
                grid-auto-rows: minmax(300px, auto) !important;
                min-height: 300px !important;
                padding: 0 !important;
                border: none !important;
                background: transparent !important;
            }
            
            /* 确保直接子元素正确布局 */
            #warehouseTasks.published-tasks-gallery.task-gallery > .task-flip-container {
                display: block !important;
                width: 100% !important;
                min-height: 300px !important;
                margin: 0 !important;
                padding: 0 !important;
                grid-column: auto !important;
                grid-row: auto !important;
            }
            
            /* 任务卡片基础样式 */
            #warehouseTasks.published-tasks-gallery .task-flip-container {
                position: relative !important;
                perspective: 1500px !important;
                transform-style: preserve-3d !important;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            /* 卡片正面和背面样式 */
            #warehouseTasks.published-tasks-gallery .task-front,
            #warehouseTasks.published-tasks-gallery .task-back {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                backface-visibility: hidden !important;
                box-sizing: border-box !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                padding: 15px !important;
                display: flex !important;
                flex-direction: column !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-front {
                background-color: white !important;
                z-index: 2 !important;
                transform: rotateY(0deg) !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-back {
                background-color: #f8f9fa !important;
                z-index: 1 !important;
                transform: rotateY(180deg) !important;
            }
            
            /* 图片容器样式 */
            #warehouseTasks.published-tasks-gallery .task-gallery-img {
                width: 100% !important;
                height: 220px !important;
                object-fit: cover !important;
                border-radius: 6px !important;
                margin-bottom: 12px !important;
                background-color: #f8f9fa !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            /* 翻转状态控制 */
            #warehouseTasks.published-tasks-gallery .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
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
                
                #warehouseTasks.published-tasks-gallery .task-gallery-img {
                    height: 180px !important;
                }
            }
            
            @media (max-width: 576px) {
                #warehouseTasks.published-tasks-gallery .task-front,
                #warehouseTasks.published-tasks-gallery .task-back {
                    padding: 12px !important;
                }
                
                #warehouseTasks.published-tasks-gallery .task-gallery-img {
                    height: 160px !important;
                }
            }
            
            /* 悬停效果 */
            #warehouseTasks.published-tasks-gallery .task-flip-container:hover {
                transform: translateY(-5px) !important;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-flip-container.flipped:hover {
                transform: translateY(-5px) rotateY(180deg) !important;
            }
            
            /* 确保不被其他模块影响 */
            .sales-operations-container #warehouseTasks.published-tasks-gallery.task-gallery {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            
            @media (max-width: 767px) {
                .sales-operations-container #warehouseTasks.published-tasks-gallery.task-gallery {
                    grid-template-columns: 1fr !important;
                }
            }
            
            /* 调试辅助 - 可选启用 */
            /*
            #warehouseTasks.published-tasks-gallery .task-flip-container:nth-child(1) { outline: 2px solid #007bff !important; }
            #warehouseTasks.published-tasks-gallery .task-flip-container:nth-child(2) { outline: 2px solid #28a745 !important; }
            #warehouseTasks.published-tasks-gallery .task-flip-container:nth-child(3) { outline: 2px solid #ffc107 !important; }
            */
        `;
        
        document.head.appendChild(cleanupStyle);
        console.log('✅ 已应用仓库容器清理样式');
    }
    
    // 修复2: 重新绑定事件监听器
    function rebindEventListeners() {
        // 移除现有的事件监听器
        const containers = document.querySelectorAll('#warehouseTasks.published-tasks-gallery .task-flip-container');
        containers.forEach(container => {
            // 移除可能的重复事件监听器标记
            container.removeAttribute('data-event-listener-bound');
        });
        
        // 重新绑定点击事件
        function bindFlipEvents() {
            const taskContainers = document.querySelectorAll('#warehouseTasks.published-tasks-gallery .task-flip-container');
            
            taskContainers.forEach(container => {
                if (!container.hasAttribute('data-event-listener-bound')) {
                    container.addEventListener('click', function(e) {
                        // 防止事件冒泡到父元素
                        e.stopPropagation();
                        
                        // 切换翻转状态
                        this.classList.toggle('flipped');
                        
                        console.log(`🔄 任务卡片 ${this.dataset.taskId} 翻转状态已切换`);
                    });
                    
                    container.setAttribute('data-event-listener-bound', 'true');
                    console.log(`🔗 已为任务卡片 ${container.dataset.taskId} 绑定翻转事件`);
                }
            });
        }
        
        // 立即执行绑定
        bindFlipEvents();
        
        // 设置观察器监控DOM变化
        const observer = new MutationObserver(function(mutations) {
            let shouldRebind = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && 
                                (node.classList.contains('task-flip-container') || 
                                 node.querySelector('.task-flip-container'))) {
                                shouldRebind = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldRebind) {
                setTimeout(bindFlipEvents, 100);
            }
        });
        
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (warehouseContainer) {
            observer.observe(warehouseContainer, {
                childList: true,
                subtree: true
            });
        }
        
        console.log('✅ 事件监听器重新绑定完成');
    }
    
    // 修复3: 验证功能（无调试面板）
    function setupVerification() {
        // 控制台验证信息
        function logVerificationInfo() {
            const container = document.getElementById('warehouseTasks');
            if (container) {
                const taskContainers = container.querySelectorAll('.task-flip-container');
                const flippedTasks = Array.from(taskContainers).filter(t => t.classList.contains('flipped')).length;
                
                console.log('📊 仓库任务验证信息:');
                console.log(`   总任务数: ${taskContainers.length}`);
                console.log(`   已翻转任务: ${flippedTasks}`);
                console.log(`   Grid显示状态: ${getComputedStyle(container).display === 'grid' ? '正常' : '异常'}`);
                console.log(`   网格列数: ${getComputedStyle(container).gridTemplateColumns.split(' ').length}列`);
            }
        }
        
        // 定期记录验证信息
        setInterval(logVerificationInfo, 5000);
        logVerificationInfo(); // 立即记录一次
        
        console.log('✅ 验证功能已设置（无调试面板）');
    }
    
    // 主初始化函数
    function initializeCleanup() {
        console.log('🚀 开始执行仓库任务容器清理修复...');
        
        try {
            // 按顺序执行修复
            cleanupConflictingStyles();
            console.log('✅ 样式清理完成');
            
            rebindEventListeners();
            console.log('✅ 事件监听器修复完成');
            
            setupVerification();
            console.log('✅ 验证功能设置完成');
            
            console.log('🎉 仓库任务容器清理修复全部完成！');
            
            // 最终验证
            setTimeout(() => {
                const container = document.getElementById('warehouseTasks');
                if (container) {
                    const computedStyle = window.getComputedStyle(container);
                    console.log('📊 最终验证结果:');
                    console.log(`   Display: ${computedStyle.display}`);
                    console.log(`   Grid Template: ${computedStyle.gridTemplateColumns}`);
                    console.log(`   Task Count: ${container.querySelectorAll('.task-flip-container').length}`);
                }
            }, 500);
            
        } catch (error) {
            console.error('❌ 清理修复过程中发生错误:', error);
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCleanup);
    } else {
        initializeCleanup();
    }
    
})();
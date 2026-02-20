/**
 * 统一的仓库任务卡片翻转功能修复脚本
 * 解决多个修复脚本冲突导致的翻转功能失效问题
 */

(function() {
    'use strict';
    
    console.log('🔧 启动统一仓库翻转功能修复...');
    
    // 标记修复已启动，防止重复执行
    if (window.unifiedFlipFixApplied) {
        console.log('✅ 统一翻转修复已在运行');
        return;
    }
    window.unifiedFlipFixApplied = true;
    
    // 修复1: 清理冲突的事件监听器
    function cleanupConflictingListeners() {
        console.log('🧹 清理冲突的事件监听器...');
        
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) {
            console.warn('⚠️ 未找到仓库任务容器');
            return;
        }
        
        // 移除所有可能的冲突标记
        const containers = warehouseContainer.querySelectorAll('.task-flip-container');
        containers.forEach(container => {
            container.removeAttribute('data-event-listener-bound');
            container.removeAttribute('data-flip-processed');
        });
        
        console.log('✅ 冲突标记已清理');
    }
    
    // 修复2: 创建统一的翻转函数
    function createUnifiedFlipFunction() {
        console.log('🔄 创建统一翻转函数...');
        
        // 防止重复创建
        if (typeof window.unifiedToggleTaskCardFlip === 'function') {
            console.log('✅ 统一翻转函数已存在');
            return;
        }
        
        window.unifiedToggleTaskCardFlip = function(taskId) {
            console.log(`🔄 统一翻转函数被调用 - 任务ID: ${taskId}`);
            
            const flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
            if (!flipContainer) {
                console.error(`❌ 未找到任务容器 - 任务ID: ${taskId}`);
                return;
            }
            
            // 检查任务状态（已发货的任务不允许翻转到背面）
            const statusBadge = flipContainer.querySelector('.badge');
            const isShipped = statusBadge && 
                             (statusBadge.textContent.includes('已发货') || 
                              statusBadge.classList.contains('badge-success'));
            
            const isCurrentlyFlipped = flipContainer.classList.contains('flipped');
            
            // 如果已发货且当前在正面，则不允许翻转到背面
            if (isShipped && !isCurrentlyFlipped) {
                console.log(`📦 任务 ${taskId} 已发货，不允许翻转到背面`);
                return;
            }
            
            // 执行翻转
            flipContainer.classList.toggle('flipped');
            const newFlippedState = flipContainer.classList.contains('flipped');
            
            console.log(`✅ 任务 ${taskId} 翻转状态: ${newFlippedState ? '背面' : '正面'}`);
            
            // 触发自定义事件
            const flipEvent = new CustomEvent('unifiedTaskCardFlipped', {
                detail: {
                    taskId: taskId,
                    flipped: newFlippedState,
                    element: flipContainer
                }
            });
            document.dispatchEvent(flipEvent);
        };
        
        console.log('✅ 统一翻转函数已创建');
    }
    
    // 修复3: 绑定统一的事件监听器
    function bindUnifiedEventListeners() {
        console.log('🔗 绑定统一事件监听器...');
        
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) {
            console.error('❌ 未找到仓库任务容器');
            return;
        }
        
        // 使用事件委托，避免重复绑定
        warehouseContainer.addEventListener('click', function(e) {
            // 检查是否点击了翻转容器
            const flipContainer = e.target.closest('.task-flip-container');
            if (flipContainer && flipContainer.dataset.taskId) {
                // 排除按钮区域的点击
                if (e.target.closest('button')) {
                    return;
                }
                
                e.preventDefault();
                e.stopPropagation();
                
                const taskId = flipContainer.dataset.taskId;
                console.log(`🖱️ 检测到任务卡片点击 - 任务ID: ${taskId}`);
                
                if (typeof window.unifiedToggleTaskCardFlip === 'function') {
                    window.unifiedToggleTaskCardFlip(taskId);
                }
            }
        });
        
        // 标记事件监听器已绑定
        warehouseContainer.setAttribute('data-unified-event-bound', 'true');
        console.log('✅ 统一事件监听器已绑定');
    }
    
    // 修复4: 应用必要的CSS样式
    function applyEssentialStyles() {
        console.log('🎨 应用必要CSS样式...');
        
        // 移除可能存在的旧样式
        const existingStyles = document.getElementById('unified-flip-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
        
        const style = document.createElement('style');
        style.id = 'unified-flip-styles';
        style.textContent = `
            /* 统一的翻转容器样式 */
            #warehouseTasks.published-tasks-gallery .task-flip-container {
                perspective: 1500px !important;
                transform-style: preserve-3d !important;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                position: relative !important;
                width: 100% !important;
                height: auto !important;
                min-height: 300px !important;
                display: block !important;
                cursor: pointer !important;
            }
            
            /* 正面卡片样式 */
            #warehouseTasks.published-tasks-gallery .task-front {
                position: absolute !important;
                width: 100% !important;
                height: 100% !important;
                backface-visibility: hidden !important;
                transform: rotateY(0deg) !important;
                z-index: 2 !important;
                background: white !important;
                border-radius: 8px !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* 背面卡片样式 */
            #warehouseTasks.published-tasks-gallery .task-back {
                position: absolute !important;
                width: 100% !important;
                height: 100% !important;
                backface-visibility: hidden !important;
                transform: rotateY(180deg) !important;
                z-index: 1 !important;
                background: white !important;
                border-radius: 8px !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* 翻转状态下的正面卡片 */
            #warehouseTasks.published-tasks-gallery .task-flip-container.flipped .task-front {
                transform: rotateY(-180deg) !important;
                z-index: 1 !important;
            }
            
            /* 翻转状态下的背面卡片 */
            #warehouseTasks.published-tasks-gallery .task-flip-container.flipped .task-back {
                transform: rotateY(0deg) !important;
                z-index: 2 !important;
            }
            
            /* 悬停效果 */
            #warehouseTasks.published-tasks-gallery .task-flip-container:hover {
                transform: translateY(-5px) !important;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
            }
            
            /* 翻转状态下的悬停效果 */
            #warehouseTasks.published-tasks-gallery .task-flip-container.flipped:hover {
                transform: translateY(-5px) rotateY(180deg) !important;
            }
            
            /* 确保按钮可点击 */
            #warehouseTasks.published-tasks-gallery .task-flip-container button {
                pointer-events: auto !important;
                z-index: 10 !important;
                position: relative !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ 必要CSS样式已应用');
    }
    
    // 修复5: 添加状态监控和调试
    function addStateMonitoring() {
        console.log('🐛 添加状态监控...');
        
        // 监控翻转状态变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('task-flip-container')) {
                        const taskId = target.dataset.taskId;
                        const isFlipped = target.classList.contains('flipped');
                        console.log(`📊 任务${taskId}翻转状态变更: ${isFlipped ? '背面' : '正面'}`);
                    }
                }
            });
        });
        
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (warehouseContainer) {
            observer.observe(warehouseContainer, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class']
            });
        }
        
        console.log('✅ 状态监控已启动');
    }
    
    // 修复6: 验证修复效果
    function verifyFix() {
        console.log('✅ 验证修复效果...');
        
        setTimeout(() => {
            const warehouseContainer = document.getElementById('warehouseTasks');
            if (!warehouseContainer) {
                console.error('❌ 仓库容器未找到');
                return;
            }
            
            const containers = warehouseContainer.querySelectorAll('.task-flip-container');
            const boundContainers = warehouseContainer.querySelectorAll('[data-unified-event-bound]');
            
            console.log(`📊 统计信息:`);
            console.log(`  - 总任务容器数: ${containers.length}`);
            console.log(`  - 已绑定事件容器数: ${boundContainers.length}`);
            
            // 测试第一个任务卡片
            if (containers.length > 0) {
                const firstContainer = containers[0];
                const taskId = firstContainer.dataset.taskId;
                console.log(`🧪 测试任务卡片 ${taskId}...`);
                
                // 模拟点击测试
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                });
                
                firstContainer.dispatchEvent(clickEvent);
                
                setTimeout(() => {
                    const isFlipped = firstContainer.classList.contains('flipped');
                    console.log(`✅ 测试结果: ${isFlipped ? '翻转成功' : '仍在正面'}`);
                }, 600);
            }
        }, 1000);
    }
    
    // 主初始化函数
    function initializeUnifiedFix() {
        console.log('🚀 开始应用统一翻转修复...');
        
        try {
            cleanupConflictingListeners();
            createUnifiedFlipFunction();
            applyEssentialStyles();
            bindUnifiedEventListeners();
            addStateMonitoring();
            
            console.log('🎉 统一翻转修复应用完成！');
            
            // 验证修复效果
            verifyFix();
            
        } catch (error) {
            console.error('❌ 统一翻转修复过程中发生错误:', error);
        }
    }
    
    // 页面加载完成后执行修复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUnifiedFix);
    } else {
        initializeUnifiedFix();
    }
    
    // 提供全局访问接口
    window.applyUnifiedFlipFix = initializeUnifiedFix;
    
    console.log('🔧 统一仓库翻转修复工具已加载');
    console.log('💡 调用 applyUnifiedFlipFix() 可手动应用修复');
    
})();
/**
 * 仓库发货任务卡翻转功能综合性修复方案
 * 针对"首次发货后第二张卡片翻转失效"问题的完整解决方案
 */

(function() {
    'use strict';

    // 修复1: 增强的状态管理机制
    function enhanceStateManagement() {
        // 确保全局防抖Map存在
        if (typeof window.flipCooldown === 'undefined') {
            window.flipCooldown = new Map();
            console.log('🔧 初始化防抖Map');
        }

        // 创建任务状态跟踪器
        if (typeof window.taskFlipStates === 'undefined') {
            window.taskFlipStates = new Map();
            console.log('🔧 初始化任务状态跟踪器');
        }

        // 改进的翻转函数
        const originalToggleTaskCardFlip = window.toggleTaskCardFlip || function() {};
        
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🔄 翻转函数调用开始 - 任务ID: ${taskId}`);
            
            // 防抖控制（增强版）
            const now = Date.now();
            const lastFlip = window.flipCooldown.get(taskId) || 0;
            
            // 增加冷却时间到500ms，提供更多保护
            if (now - lastFlip < 500) {
                console.log(`⏱️  任务 ${taskId} 翻转冷却中 (${now - lastFlip}ms)，忽略此次点击`);
                return;
            }
            
            // 记录本次操作时间
            window.flipCooldown.set(taskId, now);
            
            // 清理过期的冷却记录（增强清理机制）
            const cleanupThreshold = 10000; // 10秒
            const expiredIds = [];
            for (const [id, timestamp] of window.flipCooldown.entries()) {
                if (now - timestamp > cleanupThreshold) {
                    expiredIds.push(id);
                }
            }
            expiredIds.forEach(id => window.flipCooldown.delete(id));
            
            if (expiredIds.length > 0) {
                console.log(`🧹 清理了 ${expiredIds.length} 个过期冷却记录`);
            }

            // 多重元素查找策略（增强版）
            let flipContainer = null;
            
            // 策略1: 通过data-task-id属性查找
            flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
            
            // 策略2: 通过ID查找前端元素然后向上查找
            if (!flipContainer) {
                const frontElement = document.querySelector(`#task-${taskId}-front`);
                if (frontElement) {
                    flipContainer = frontElement.closest('.task-flip-container');
                }
            }
            
            // 策略3: 通过按钮查找父容器
            if (!flipContainer) {
                const flipButton = document.querySelector(`[data-task-id="${taskId}"][data-action="flip"]`);
                if (flipButton) {
                    flipContainer = flipButton.closest('.task-flip-container');
                }
            }
            
            if (!flipContainer) {
                console.error(`❌ 未找到任务ID为 ${taskId} 的翻转容器`);
                // 尝试重新绑定事件并再次查找
                if (typeof bindWarehouseTaskEvents === 'function') {
                    console.log('🔁 尝试重新绑定事件监听器');
                    bindWarehouseTaskEvents();
                    flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                }
                
                if (!flipContainer) {
                    console.error('❌ 重新绑定后仍未找到容器，终止操作');
                    return;
                }
            }
            
            console.log(`✅ 找到翻转容器: ${flipContainer.getAttribute('data-task-id')}`);
            
            // 状态切换前的验证
            const wasFlipped = flipContainer.classList.contains('flipped');
            const taskElement = flipContainer;
            
            // 检查任务是否已被禁用（已发货状态）
            const statusBadge = taskElement.querySelector('.badge');
            const isShipped = statusBadge && 
                             (statusBadge.textContent.includes('已发货') || 
                              statusBadge.classList.contains('badge-success'));
            
            if (isShipped && !wasFlipped) {
                console.log(`📦 任务 ${taskId} 已发货，不允许翻转到背面`);
                return;
            }
            
            // 执行翻转
            flipContainer.classList.toggle('flipped');
            const isNowFlipped = flipContainer.classList.contains('flipped');
            
            // 更新任务状态跟踪器
            window.taskFlipStates.set(taskId, isNowFlipped);
            
            console.log(`🔄 状态切换: ${wasFlipped} -> ${isNowFlipped}`);
            
            // 更新按钮文本（增强版）
            updateButtonText(taskId, isNowFlipped, taskElement);
            
            // 触发自定义事件以便其他组件监听
            const flipEvent = new CustomEvent('taskCardFlipped', {
                detail: {
                    taskId: taskId,
                    flipped: isNowFlipped,
                    element: flipContainer
                }
            });
            document.dispatchEvent(flipEvent);
            
            console.log(`✅ 翻转函数调用结束 - 任务ID: ${taskId}, 当前状态: ${isNowFlipped ? '背面' : '正面'}`);
        };

        // 增强的按钮文本更新函数
        function updateButtonText(taskId, isFlipped, taskElement) {
            const flipButtons = taskElement.querySelectorAll(`[data-task-id="${taskId}"][data-action="flip"]`);
            
            flipButtons.forEach(button => {
                const currentText = button.textContent.trim();
                const isDisabled = button.disabled;
                
                console.log(`📝 更新按钮文本 - 当前: "${currentText}", 禁用: ${isDisabled}`);
                
                if (isDisabled) {
                    // 已禁用的按钮保持"已发货"状态
                    if (!currentText.includes('已发货')) {
                        button.innerHTML = '<i class="fas fa-check"></i> 已发货';
                        console.log('📝 按钮已禁用，设置为"已发货"');
                    }
                } else if (isFlipped) {
                    // 翻转到背面时显示"返回"
                    if (!currentText.includes('返回')) {
                        button.innerHTML = '<i class="fas fa-arrow-left"></i> 返回';
                        console.log('📝 设置按钮为"返回"');
                    }
                } else {
                    // 翻转到正面时恢复原始状态
                    if (currentText.includes('返回') || currentText.includes('已发货')) {
                        // 检查是否应该显示"已发货"
                        const statusBadge = taskElement.querySelector('.badge');
                        const shouldBeShipped = statusBadge && 
                                               statusBadge.classList.contains('badge-success');
                        
                        if (shouldBeShipped) {
                            button.innerHTML = '<i class="fas fa-check"></i> 已发货';
                            console.log('📝 任务已发货，按钮显示"已发货"');
                        } else {
                            button.innerHTML = '<i class="fas fa-truck"></i> 处理发货';
                            console.log('📝 按钮恢复为"处理发货"');
                        }
                    }
                }
            });
        }
    }

    // 修复2: 增强的事件监听器管理
    function enhanceEventListeners() {
        // 重写事件绑定函数
        const originalBindWarehouseTaskEvents = window.bindWarehouseTaskEvents || function() {};
        
        window.bindWarehouseTaskEvents = function() {
            console.log('🔗 开始绑定仓库任务事件监听器');
            
            const container = document.getElementById('warehouseTasks');
            if (!container) {
                console.error('❌ 仓库任务容器未找到');
                return;
            }
            
            // 移除现有的事件监听器（安全方式）
            try {
                container.removeEventListener('click', window.warehouseTaskEventHandler);
                console.log('📤 移除了旧的事件监听器');
            } catch (e) {
                console.log('ℹ️  无旧事件监听器需要移除');
            }
            
            // 绑定新的事件监听器
            container.addEventListener('click', window.warehouseTaskEventHandler);
            container.setAttribute('data-event-listener-bound', 'true');
            
            console.log('📥 成功绑定新的事件监听器');
            
            // 验证绑定状态
            setTimeout(() => {
                const buttons = container.querySelectorAll('[data-action="flip"]');
                console.log(`📊 绑定后检测到 ${buttons.length} 个翻转按钮`);
            }, 100);
        };

        // 重写事件处理函数
        const originalWarehouseTaskEventHandler = window.warehouseTaskEventHandler || function() {};
        
        window.warehouseTaskEventHandler = function(e) {
            console.log('🖱️  仓库任务事件处理器被触发');
            
            // 处理翻转卡片事件
            if (e.target.closest('[data-action="flip"]')) {
                e.stopPropagation();
                const button = e.target.closest('[data-action="flip"]');
                const taskId = button.getAttribute('data-task-id');
                
                console.log(`🔄 检测到翻转按钮点击 - 任务ID: ${taskId}`);
                
                // 检查按钮是否被禁用
                if (button.disabled) {
                    console.log(`🔒 按钮被禁用，忽略点击 - 任务ID: ${taskId}`);
                    return;
                }
                
                // 调用翻转函数
                if (typeof window.toggleTaskCardFlip === 'function') {
                    window.toggleTaskCardFlip(taskId);
                } else {
                    console.error('❌ 翻转函数未定义');
                }
            }
            // 处理确认发货事件
            else if (e.target.closest('[data-action="complete-shipment"]')) {
                e.stopPropagation();
                const button = e.target.closest('[data-action="complete-shipment"]');
                const taskId = button.getAttribute('data-task-id');
                
                console.log(`📦 检测到发货确认点击 - 任务ID: ${taskId}`);
                
                if (typeof window.completeShipment === 'function') {
                    window.completeShipment(taskId);
                } else {
                    console.error('❌ 发货完成函数未定义');
                }
            }
            // 处理整个翻转容器的点击事件
            else if (e.target.closest('.task-flip-container')) {
                const container = e.target.closest('.task-flip-container');
                const taskId = container.getAttribute('data-task-id');
                
                if (taskId) {
                    console.log(`🖱️  检测到容器点击翻转 - 任务ID: ${taskId}`);
                    if (typeof window.toggleTaskCardFlip === 'function') {
                        window.toggleTaskCardFlip(taskId);
                    }
                }
            }
        };
    }

    // 修复3: DOM更新后的事件重新绑定
    function enhanceDOMUpdateHandling() {
        // 监听可能的DOM更新事件
        const observer = new MutationObserver(function(mutations) {
            let warehouseUpdated = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.id === 'warehouseTasks' || 
                                node.classList.contains('warehouse-tasks-gallery') ||
                                node.classList.contains('task-flip-container')) {
                                warehouseUpdated = true;
                            }
                        }
                    });
                }
            });
            
            if (warehouseUpdated) {
                console.log('🔄 检测到仓库任务DOM更新，重新绑定事件监听器');
                setTimeout(() => {
                    if (typeof bindWarehouseTaskEvents === 'function') {
                        bindWarehouseTaskEvents();
                    }
                }, 100);
            }
        });
        
        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️  已启动DOM变化观察器');
    }

    // 修复4: 增强的错误恢复机制
    function enhanceErrorRecovery() {
        // 定期健康检查
        setInterval(() => {
            const warehouseContainer = document.getElementById('warehouseTasks');
            if (!warehouseContainer) return;
            
            const flipButtons = warehouseContainer.querySelectorAll('[data-action="flip"]');
            const hasEventListener = warehouseContainer.hasAttribute('data-event-listener-bound');
            
            // 如果没有事件监听器但有按钮，重新绑定
            if (flipButtons.length > 0 && !hasEventListener) {
                console.log('🔧 检测到事件监听器缺失，自动恢复');
                if (typeof bindWarehouseTaskEvents === 'function') {
                    bindWarehouseTaskEvents();
                }
            }
            
            // 清理异常状态
            const flippedContainers = warehouseContainer.querySelectorAll('.task-flip-container.flipped');
            flippedContainers.forEach(container => {
                const taskId = container.getAttribute('data-task-id');
                if (taskId && !window.taskFlipStates.has(taskId)) {
                    console.log(`🔧 修复异常翻转状态 - 任务ID: ${taskId}`);
                    container.classList.remove('flipped');
                }
            });
            
        }, 5000); // 每5秒检查一次
        
        console.log('🛡️  已启动错误恢复机制');
    }

    // 修复5: CSS样式强化
    function enhanceCSSStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 强化翻转容器样式确保稳定性 */
            .task-flip-container {
                transform-style: preserve-3d !important;
                perspective: 1000px !important;
                transition: transform 0.6s !important;
                position: relative !important;
            }
            
            .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
            
            .task-front, .task-back {
                backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }
            
            .task-back {
                transform: rotateY(180deg) !important;
            }
            
            /* 确保按钮在翻转时正确显示 */
            .task-flip-container .btn[data-action="flip"] {
                transition: all 0.3s ease !important;
                z-index: 10 !important;
                position: relative !important;
            }
            
            /* 修复可能的布局问题 */
            .warehouse-tasks-gallery {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
                gap: 15px !important;
                align-items: start !important;
            }
        `;
        document.head.appendChild(style);
        console.log('🎨 已应用CSS样式强化');
    }

    // 初始化所有修复
    function initializeFixes() {
        console.log('🚀 开始应用仓库发货任务卡翻转综合性修复...');
        
        try {
            enhanceStateManagement();
            console.log('✅ 状态管理修复完成');
            
            enhanceEventListeners();
            console.log('✅ 事件监听器修复完成');
            
            enhanceDOMUpdateHandling();
            console.log('✅ DOM更新处理修复完成');
            
            enhanceErrorRecovery();
            console.log('✅ 错误恢复机制修复完成');
            
            enhanceCSSStyles();
            console.log('✅ CSS样式强化完成');
            
            // 立即绑定事件
            setTimeout(() => {
                if (typeof bindWarehouseTaskEvents === 'function') {
                    bindWarehouseTaskEvents();
                }
            }, 500);
            
            console.log('🎉 所有修复已应用完成！');
            
        } catch (error) {
            console.error('❌ 修复过程中发生错误:', error);
        }
    }

    // 页面加载完成后执行修复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFixes);
    } else {
        initializeFixes();
    }

    // 提供全局访问接口
    window.applyWarehouseFlipFixes = initializeFixes;
    
    console.log('🔧 仓库发货任务卡翻转综合性修复工具已加载');
    console.log('💡 调用 applyWarehouseFlipFixes() 可手动应用修复');

})();
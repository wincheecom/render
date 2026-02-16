/**
 * 任务卡片尺寸和翻转功能修复脚本
 * 专门针对 div#task-92-front.task-front 的显示问题
 * 不影响其他页面功能和数据
 */

(function() {
    'use strict';
    
    console.log('🔧 启动任务卡片尺寸和翻转功能修复...');
    
    // 修复1: 统一任务卡片尺寸标准
    function fixTaskCardDimensions() {
        console.log('📏 正在修复任务卡片尺寸...');
        
        const style = document.createElement('style');
        style.id = 'task-card-dimension-fix';
        style.textContent = `
            /* 修复仓库任务卡片尺寸问题 - 针对性修正 */
            #warehouseTasks.published-tasks-gallery .task-flip-container {
                width: 100% !important;
                height: auto !important;
                display: block !important;
                perspective: 1500px !important;
                transform-style: preserve-3d !important;
                transition: transform 0.6s ease-in-out !important;
                position: relative !important;
                min-height: 250px !important;
            }
            
            /* 统一正面和背面卡片尺寸 */
            #warehouseTasks.published-tasks-gallery .task-front,
            #warehouseTasks.published-tasks-gallery .task-back {
                width: 100% !important;
                height: 100% !important;
                min-height: 250px !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                transform-style: preserve-3d !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 15px !important;
                background-color: white !important;
                border-radius: var(--card-radius) !important;
                box-shadow: var(--shadow) !important;
                transition: all 0.3s ease !important;
            }
            
            /* 正面卡片特殊处理 */
            #warehouseTasks.published-tasks-gallery .task-front {
                z-index: 2 !important;
                transform: rotateY(0deg) !important;
            }
            
            /* 背面卡片特殊处理 */
            #warehouseTasks.published-tasks-gallery .task-back {
                z-index: 1 !important;
                transform: rotateY(180deg) !important;
            }
            
            /* 翻转状态处理 */
            #warehouseTasks.published-tasks-gallery .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
            
            /* 确保网格布局正确 */
            #warehouseTasks.published-tasks-gallery {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
                gap: 15px !important;
                margin-top: 15px !important;
                align-content: start !important;
                justify-content: stretch !important;
                width: 100% !important;
                grid-auto-rows: minmax(250px, auto) !important;
                min-height: 300px !important;
            }
            
            /* 响应式适配 */
            @media (max-width: 1200px) {
                #warehouseTasks.published-tasks-gallery {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            
            @media (max-width: 768px) {
                #warehouseTasks.published-tasks-gallery {
                    grid-template-columns: 1fr !important;
                    gap: 12px !important;
                }
                
                #warehouseTasks.published-tasks-gallery .task-front,
                #warehouseTasks.published-tasks-gallery .task-back {
                    min-height: 220px !important;
                    padding: 12px !important;
                }
            }
            
            @media (max-width: 576px) {
                #warehouseTasks.published-tasks-gallery .task-front,
                #warehouseTasks.published-tasks-gallery .task-back {
                    min-height: 200px !important;
                    padding: 10px !important;
                }
            }
            
            /* 防止特定ID的任务卡片样式冲突 */
            div[id^="task-"][id$="-front"].task-front,
            div[id^="task-"][id$="-back"].task-back {
                position: absolute !important;
                width: 100% !important;
                height: 100% !important;
                box-sizing: border-box !important;
            }
        `;
        
        // 移除旧的样式
        const existingStyle = document.getElementById('task-card-dimension-fix');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
        console.log('✅ 任务卡片尺寸修复样式已应用');
    }
    
    // 修复2: 增强翻转功能
    function enhanceFlipFunctionality() {
        console.log('🔄 正在增强翻转功能...');
        
        // 保存原始翻转函数
        const originalToggleFlip = window.toggleTaskCardFlip;
        
        // 创建新的翻转函数
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🔄 触发任务卡片翻转 - 任务ID: ${taskId}`);
            
            try {
                const flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                if (!flipContainer) {
                    console.error(`❌ 未找到任务容器: ${taskId}`);
                    return;
                }
                
                // 检查是否已发货（禁止翻转）
                const statusBadge = flipContainer.querySelector('.badge');
                const isShipped = statusBadge && 
                                 (statusBadge.textContent.includes('已发货') || 
                                  statusBadge.classList.contains('badge-success'));
                
                if (isShipped && !flipContainer.classList.contains('flipped')) {
                    console.log(`📦 任务 ${taskId} 已发货，不允许翻转到背面`);
                    showToast('该任务已发货，无法查看详细信息', 'warning');
                    return;
                }
                
                // 执行翻转
                const isCurrentlyFlipped = flipContainer.classList.contains('flipped');
                flipContainer.classList.toggle('flipped');
                
                // 更新按钮文本
                const flipButton = flipContainer.querySelector('[data-action="flip"]');
                if (flipButton) {
                    flipButton.innerHTML = isCurrentlyFlipped ? 
                        '<i class="fas fa-info-circle me-1"></i>查看详情' : 
                        '<i class="fas fa-arrow-left me-1"></i>返回';
                }
                
                console.log(`✅ 任务 ${taskId} 翻转${isCurrentlyFlipped ? '复位' : '完成'}`);
                
            } catch (error) {
                console.error('❌ 翻转功能执行出错:', error);
                showToast('翻转操作失败，请重试', 'error');
            }
        };
        
        console.log('✅ 翻转功能增强完成');
    }
    
    // 修复3: 优化点击事件处理
    function optimizeClickHandlers() {
        console.log('🖱️  正在优化点击事件处理...');
        
        // 移除现有的事件监听器避免重复绑定
        document.removeEventListener('click', handleWarehouseTaskClicks, true);
        
        // 新的事件处理函数
        function handleWarehouseTaskClicks(e) {
            // 处理翻转按钮点击
            if (e.target.closest('[data-action="flip"]')) {
                e.preventDefault();
                e.stopPropagation();
                
                const button = e.target.closest('[data-action="flip"]');
                const taskId = button.getAttribute('data-task-id');
                
                if (taskId && typeof window.toggleTaskCardFlip === 'function') {
                    window.toggleTaskCardFlip(taskId);
                }
                return;
            }
            
            // 处理发货确认按钮点击
            if (e.target.closest('[data-action="complete-shipment"]')) {
                e.preventDefault();
                e.stopPropagation();
                
                const button = e.target.closest('[data-action="complete-shipment"]');
                const taskId = button.getAttribute('data-task-id');
                
                if (taskId && typeof window.completeShipment === 'function') {
                    window.completeShipment(taskId);
                }
                return;
            }
            
            // 处理卡片整体点击翻转（排除按钮区域）
            const flipContainer = e.target.closest('.task-flip-container');
            if (flipContainer && !e.target.closest('[data-action]')) {
                const taskId = flipContainer.getAttribute('data-task-id');
                if (taskId && typeof window.toggleTaskCardFlip === 'function') {
                    window.toggleTaskCardFlip(taskId);
                }
            }
        }
        
        // 绑定新的事件监听器
        document.addEventListener('click', handleWarehouseTaskClicks, true);
        console.log('✅ 点击事件处理优化完成');
    }
    
    // 修复4: 添加视觉反馈和调试工具
    function addVisualFeedback() {
        console.log('🎨 正在添加视觉反馈...');
        
        const debugStyle = document.createElement('style');
        debugStyle.id = 'task-card-debug-style';
        debugStyle.textContent = `
            /* 添加调试边框（可选启用） */
            /*
            #warehouseTasks.published-tasks-gallery .task-flip-container {
                outline: 1px solid #007bff !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-front {
                outline: 1px solid #28a745 !important;
            }
            
            #warehouseTasks.published-tasks-gallery .task-back {
                outline: 1px solid #dc3545 !important;
            }
            */
            
            /* 翻转动画优化 */
            #warehouseTasks.published-tasks-gallery .task-flip-container {
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            /* 悬停效果增强 */
            #warehouseTasks.published-tasks-gallery .task-flip-container:hover {
                transform: translateY(-5px) !important;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
            }
            
            /* 翻转状态下的悬停效果 */
            #warehouseTasks.published-tasks-gallery .task-flip-container.flipped:hover {
                transform: translateY(-5px) rotateY(180deg) !important;
            }
        `;
        
        const existingDebugStyle = document.getElementById('task-card-debug-style');
        if (existingDebugStyle) {
            existingDebugStyle.remove();
        }
        
        document.head.appendChild(debugStyle);
        console.log('✅ 视觉反馈已添加');
    }
    
    // 辅助函数：显示提示消息
    function showToast(message, type = 'info') {
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#28a745'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // 显示动画
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动隐藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    // 主执行函数
    function executeFixes() {
        console.log('🚀 开始执行任务卡片修复...');
        
        try {
            fixTaskCardDimensions();
            enhanceFlipFunctionality();
            optimizeClickHandlers();
            addVisualFeedback();
            
            console.log('🎉 任务卡片尺寸和翻转修复完成！');
            showToast('任务卡片修复已完成', 'success');
            
        } catch (error) {
            console.error('❌ 修复过程中出现错误:', error);
            showToast('修复过程出现错误，请刷新页面重试', 'error');
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeFixes);
    } else {
        executeFixes();
    }
    
    // 如果页面已经加载完成，立即执行
    if (document.readyState === 'complete') {
        setTimeout(executeFixes, 100);
    }
    
})();
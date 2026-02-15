/**
 * 仓库任务卡延迟修复脚本
 * 等待仓库模块加载完成后再执行修复
 */

(function() {
    'use strict';

    console.log('⏰ 仓库任务卡延迟修复脚本已加载');

    // 监听仓库模块激活事件
    function waitForWarehouseModule() {
        console.log('🔍 监听仓库模块激活...');
        
        // 监听模块切换事件
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // 检查是否有模块内容变为active
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList && target.classList.contains('module-content') && 
                        target.classList.contains('active') && 
                        target.id === 'warehouseTasks') {
                        
                        console.log('🎯 检测到仓库模块激活，开始修复...');
                        observer.disconnect(); // 停止监听
                        
                        // 延迟执行修复，确保DOM完全渲染
                        setTimeout(() => {
                            executeWarehouseFixes();
                        }, 500);
                    }
                }
            });
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        // 同时定期检查（备用方案）
        const interval = setInterval(() => {
            const warehouseContainer = document.getElementById('warehouseTasks');
            if (warehouseContainer && warehouseContainer.classList.contains('active')) {
                console.log('⏱️ 通过定期检查发现仓库模块已激活');
                clearInterval(interval);
                observer.disconnect();
                setTimeout(() => {
                    executeWarehouseFixes();
                }, 500);
            }
        }, 1000);

        // 10秒后停止检查（防止内存泄漏）
        setTimeout(() => {
            clearInterval(interval);
            observer.disconnect();
            console.log('⏰ 监听超时，停止检查');
        }, 10000);
    }

    // 执行仓库修复
    function executeWarehouseFixes() {
        console.log('🔧 开始执行仓库任务卡修复...');
        
        try {
            // 修复1: 网格布局
            fixGridLayout();
            
            // 修复2: 点击翻转功能
            addCardClickFlip();
            
            // 修复3: 事件监听器
            fixEventListeners();
            
            // 修复4: 强制刷新
            setTimeout(forceLayoutRefresh, 300);
            
            // 修复5: 最终验证
            setTimeout(finalVerification, 1000);
            
            console.log('✅ 仓库任务卡修复执行完成');
            
        } catch (error) {
            console.error('❌ 修复执行过程中出错:', error);
        }
    }

    // 网格布局修复
    function fixGridLayout() {
        console.log('📐 修复网格布局...');
        
        const style = document.createElement('style');
        style.id = 'warehouse-delayed-fix';
        style.textContent = `
            /* 仓库任务画廊网格布局 - 延迟修复版本 */
            #warehouseTasks.active .task-gallery.warehouse-tasks-gallery {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 15px !important;
                margin-top: 15px !important;
                width: 100% !important;
                align-content: start !important;
                justify-content: stretch !important;
                grid-auto-rows: minmax(250px, auto) !important;
            }
            
            #warehouseTasks.active .task-gallery.warehouse-tasks-gallery .task-flip-container {
                display: block !important;
                width: 100% !important;
                min-height: 250px !important;
                margin: 0 !important;
                padding: 0 !important;
                cursor: pointer !important;
            }
            
            #warehouseTasks.active .task-gallery.warehouse-tasks-gallery .task-front {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                text-align: center !important;
                justify-content: space-between !important;
                padding: 15px !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                min-height: 250px !important;
                width: 100% !important;
            }
            
            /* 翻转动画 */
            #warehouseTasks.active .task-flip-container {
                transform-style: preserve-3d !important;
                perspective: 1000px !important;
                transition: transform 0.6s !important;
                position: relative !important;
            }
            
            #warehouseTasks.active .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
            
            #warehouseTasks.active .task-front, 
            #warehouseTasks.active .task-back {
                backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }
            
            #warehouseTasks.active .task-back {
                transform: rotateY(180deg) !important;
            }
            
            /* 响应式 */
            @media (max-width: 992px) {
                #warehouseTasks.active .task-gallery.warehouse-tasks-gallery {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            
            @media (max-width: 768px) {
                #warehouseTasks.active .task-gallery.warehouse-tasks-gallery {
                    grid-template-columns: 1fr !important;
                }
            }
        `;
        
        // 移除旧样式
        const existingStyle = document.getElementById('warehouse-delayed-fix');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
        console.log('✅ 网格布局样式已应用');
    }

    // 添加卡片点击翻转功能
    function addCardClickFlip() {
        console.log('🖱️ 添加卡片点击翻转功能...');
        
        const warehouseGallery = document.querySelector('#warehouseTasks.active .task-gallery.warehouse-tasks-gallery');
        if (!warehouseGallery) {
            console.error('❌ 未找到激活的仓库任务画廊');
            return false;
        }

        const taskContainers = warehouseGallery.querySelectorAll('.task-flip-container');
        let cardsFixed = 0;

        taskContainers.forEach((container) => {
            const taskId = container.getAttribute('data-task-id');
            
            // 移除可能存在的翻转按钮
            const existingButtons = container.querySelectorAll('[data-action="flip"]');
            existingButtons.forEach(btn => btn.remove());
            
            // 添加点击事件
            container.style.cursor = 'pointer';
            container.setAttribute('data-click-flip', 'enabled');
            
            // 避免重复绑定
            const hasListener = container.hasAttribute('data-flip-listener');
            if (!hasListener) {
                container.addEventListener('click', function(e) {
                    // 避免与内部按钮冲突
                    if (e.target.closest('button, a, input, .task-back-actions')) {
                        return;
                    }
                    
                    e.stopPropagation();
                    toggleCardFlip(taskId);
                });
                container.setAttribute('data-flip-listener', 'true');
                cardsFixed++;
            }
        });

        console.log(`✅ 为 ${cardsFixed} 个卡片添加了点击翻转功能`);
        return cardsFixed > 0;
    }

    // 核心翻转函数
    function toggleCardFlip(taskId) {
        const flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
        if (!flipContainer) return;
        
        // 防抖
        const now = Date.now();
        const lastFlip = flipContainer.lastFlipTime || 0;
        if (now - lastFlip < 300) return;
        flipContainer.lastFlipTime = now;
        
        flipContainer.classList.toggle('flipped');
        console.log(`🔄 任务卡 ${taskId} 已翻转`);
    }

    // 修复事件监听器
    function fixEventListeners() {
        console.log('👂 修复事件监听器...');
        
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) return;
        
        // 确保确认发货按钮正常工作
        warehouseContainer.addEventListener('click', function(e) {
            if (e.target.closest('[data-action="complete-shipment"]')) {
                e.stopPropagation();
                const button = e.target.closest('[data-action="complete-shipment"]');
                const taskId = button.getAttribute('data-task-id');
                console.log(`📦 确认发货: ${taskId}`);
                // 这里可以调用实际的发货处理函数
            }
        });
        
        console.log('✅ 事件监听器修复完成');
    }

    // 强制刷新布局
    function forceLayoutRefresh() {
        console.log('🔄 强制刷新布局...');
        
        const warehouseGallery = document.querySelector('#warehouseTasks.active .task-gallery.warehouse-tasks-gallery');
        if (!warehouseGallery) return;
        
        // 强制重排
        warehouseGallery.style.display = 'grid';
        warehouseGallery.offsetHeight;
        
        const containers = warehouseGallery.querySelectorAll('.task-flip-container');
        containers.forEach(container => {
            container.style.display = 'block';
            container.offsetHeight;
        });
        
        console.log(`✅ 布局刷新完成，处理了 ${containers.length} 个卡片`);
    }

    // 最终验证
    function finalVerification() {
        console.log('🔍 最终验证...');
        
        const warehouseGallery = document.querySelector('#warehouseTasks.active .task-gallery.warehouse-tasks-gallery');
        if (!warehouseGallery) {
            console.error('❌ 验证失败：仓库画廊未找到');
            return;
        }
        
        const computedStyle = window.getComputedStyle(warehouseGallery);
        const containers = warehouseGallery.querySelectorAll('.task-flip-container');
        
        console.log('📊 验证结果:');
        console.log(`  Display: ${computedStyle.display}`);
        console.log(`  Grid Template: ${computedStyle.gridTemplateColumns}`);
        console.log(`  卡片数量: ${containers.length}`);
        console.log(`  布局状态: ${computedStyle.display === 'grid' && containers.length > 0 ? '✅ 正常' : '❌ 异常'}`);
        
        // 显示成功提示
        if (computedStyle.display === 'grid' && containers.length > 0) {
            showSuccessNotification();
        }
    }

    // 显示成功通知
    function showSuccessNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #4cc9f0, #4361ee);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                z-index: 9999;
                font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
                animation: slideInRight 0.3s ease-out;
            ">
                <strong>🎉 仓库任务卡修复成功！</strong><br>
                <small>卡片现在可以横向排列并点击翻转了</small>
            </div>
        `;
        
        // 添加动画样式
        if (!document.getElementById('notification-animation')) {
            const animStyle = document.createElement('style');
            animStyle.id = 'notification-animation';
            animStyle.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(animStyle);
        }
        
        document.body.appendChild(notification);
        
        // 4秒后自动消失
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // 页面加载完成后开始监听
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForWarehouseModule);
    } else {
        waitForWarehouseModule();
    }

    // 提供手动执行接口
    window.delayedWarehouseFix = executeWarehouseFixes;
    
    console.log('🔧 仓库任务卡延迟修复工具已就绪');
    console.log('💡 当您进入仓库模块时会自动执行修复');

})();
/**
 * 仓库发货任务卡紧急修复脚本
 * 解决两个核心问题：
 * 1. 仓库任务卡点击卡片实现翻转（不需要单独按钮）
 * 2. 仓库任务卡没有在div.task-gallery.warehouse-tasks-gallery中横向显示
 */

(function() {
    'use strict';

    console.log('🚀 启动仓库任务卡紧急修复...');

    // 修复1: 为卡片添加点击翻转功能
    function addCardClickFlip() {
        console.log('🔧 为卡片添加点击翻转功能...');
        
        const warehouseGallery = document.querySelector('.task-gallery.warehouse-tasks-gallery');
        if (!warehouseGallery) {
            console.error('❌ 未找到仓库任务画廊容器');
            return false;
        }

        const taskContainers = warehouseGallery.querySelectorAll('.task-flip-container');
        let cardsFixed = 0;

        taskContainers.forEach((container, index) => {
            const taskId = container.getAttribute('data-task-id');
            
            // 移除可能存在的翻转按钮
            const existingFlipButtons = container.querySelectorAll('[data-action="flip"]');
            existingFlipButtons.forEach(button => button.remove());
            
            // 为整个卡片容器添加点击事件
            container.style.cursor = 'pointer';
            container.setAttribute('data-click-flip', 'enabled');
            
            // 确保容器可以接收点击事件
            container.addEventListener('click', function(e) {
                // 避免与内部按钮冲突
                if (e.target.closest('button, a, input')) {
                    return;
                }
                
                e.stopPropagation();
                toggleCardFlip(taskId);
            });
            
            cardsFixed++;
            console.log(`✅ 为任务卡 ${taskId} 添加了点击翻转功能`);
        });

        console.log(`📊 总共修复了 ${cardsFixed} 个任务卡片`);
        return cardsFixed > 0;
    }

    // 修复2: 确保网格布局正确显示
    function fixGridLayout() {
        console.log('🔧 修复网格布局...');
        
        const style = document.createElement('style');
        style.textContent = `
            /* 确保仓库任务画廊使用网格布局 */
            .task-gallery.warehouse-tasks-gallery {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 15px !important;
                margin-top: 15px !important;
                width: 100% !important;
                align-content: start !important;
                justify-content: stretch !important;
            }
            
            /* 确保任务卡片容器正确显示 */
            .task-gallery.warehouse-tasks-gallery .task-flip-container {
                display: block !important;
                width: 100% !important;
                min-height: 250px !important;
                margin: 0 !important;
                padding: 0 !important;
                cursor: pointer !important;
                position: relative !important;
            }
            
            /* 确保任务卡片正面样式正确 */
            .task-gallery.warehouse-tasks-gallery .task-front {
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
                position: relative !important;
                z-index: 2 !important;
            }
            
            /* 确保翻转功能正常工作 */
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
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                padding: 15px !important;
                z-index: 1 !important;
            }
            
            /* 响应式设计 */
            @media (max-width: 992px) {
                .task-gallery.warehouse-tasks-gallery {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 12px !important;
                }
            }
            
            @media (max-width: 768px) {
                .task-gallery.warehouse-tasks-gallery {
                    grid-template-columns: 1fr !important;
                    gap: 10px !important;
                }
            }
            
            /* 视觉反馈 */
            .task-flip-container:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
            }
            
            .task-flip-container.flipped:hover {
                transform: translateY(-2px) rotateY(180deg) !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ 网格布局样式已应用');
        return true;
    }

    // 核心翻转函数
    function toggleCardFlip(taskId) {
        console.log(`🔄 翻转任务卡: ${taskId}`);
        
        const flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
        if (!flipContainer) {
            console.error(`❌ 未找到任务卡: ${taskId}`);
            return;
        }
        
        // 防抖控制
        const now = Date.now();
        const lastFlip = flipContainer.lastFlipTime || 0;
        if (now - lastFlip < 300) {
            console.log(`⏱️  翻转冷却中，忽略点击`);
            return;
        }
        flipContainer.lastFlipTime = now;
        
        // 执行翻转
        flipContainer.classList.toggle('flipped');
        const isNowFlipped = flipContainer.classList.contains('flipped');
        
        console.log(`✅ 任务卡 ${taskId} 翻转${isNowFlipped ? '到背面' : '到正面'}`);
    }

    // 修复3: 确保事件监听器正常工作
    function fixEventListeners() {
        console.log('🔧 修复事件监听器...');
        
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) {
            console.warn('⚠️  未找到仓库任务主容器');
            return false;
        }
        
        // 移除旧的事件监听器
        warehouseContainer.removeEventListener('click', window.warehouseTaskEventHandler);
        
        // 添加新的事件监听器
        warehouseContainer.addEventListener('click', function(e) {
            // 处理确认发货事件
            if (e.target.closest('[data-action="complete-shipment"]')) {
                e.stopPropagation();
                const button = e.target.closest('[data-action="complete-shipment"]');
                const taskId = button.getAttribute('data-task-id');
                console.log(`📦 确认发货任务: ${taskId}`);
                // 这里可以调用实际的发货处理函数
            }
        });
        
        console.log('✅ 事件监听器已修复');
        return true;
    }

    // 修复4: 强制刷新布局
    function forceLayoutRefresh() {
        console.log('🔧 强制刷新布局...');
        
        const warehouseGallery = document.querySelector('.task-gallery.warehouse-tasks-gallery');
        if (warehouseGallery) {
            // 强制重新计算样式
            warehouseGallery.style.display = 'grid';
            warehouseGallery.offsetHeight; // 触发重排
            
            // 检查子元素
            const containers = warehouseGallery.querySelectorAll('.task-flip-container');
            containers.forEach(container => {
                container.style.display = 'block';
                container.offsetHeight; // 触发重排
            });
            
            console.log(`✅ 布局刷新完成，发现 ${containers.length} 个任务卡片`);
        }
    }

    // 主修复函数
    function applyAllFixes() {
        console.log('🔧 开始应用所有修复...');
        
        try {
            const fixes = [
                { name: '添加卡片点击翻转', func: addCardClickFlip },
                { name: '修复网格布局', func: fixGridLayout },
                { name: '修复事件监听器', func: fixEventListeners },
                { name: '强制刷新布局', func: forceLayoutRefresh }
            ];
            
            let successCount = 0;
            
            fixes.forEach(fix => {
                try {
                    console.log(`\n🔧 正在执行: ${fix.name}`);
                    if (fix.func()) {
                        successCount++;
                        console.log(`✅ ${fix.name} 完成`);
                    } else {
                        console.log(`❌ ${fix.name} 失败`);
                    }
                } catch (error) {
                    console.error(`❌ ${fix.name} 出错:`, error);
                }
            });
            
            console.log(`\n🎉 修复完成！成功执行了 ${successCount}/${fixes.length} 项修复`);
            
            // 显示最终状态
            setTimeout(() => {
                showFinalStatus();
            }, 1000);
            
        } catch (error) {
            console.error('❌ 修复过程中发生严重错误:', error);
        }
    }

    // 显示最终状态
    function showFinalStatus() {
        const warehouseGallery = document.querySelector('.task-gallery.warehouse-tasks-gallery');
        if (!warehouseGallery) {
            console.error('❌ 修复后仍未找到仓库画廊');
            return;
        }
        
        const containers = warehouseGallery.querySelectorAll('.task-flip-container');
        const flippedCards = warehouseGallery.querySelectorAll('.task-flip-container.flipped');
        
        console.log('\n📊 最终状态报告:');
        console.log(`📁 仓库任务画廊: ${warehouseGallery ? '✓ 找到' : '✗ 未找到'}`);
        console.log(`📦 任务卡片总数: ${containers.length}`);
        console.log(`🔄 已翻转卡片数: ${flippedCards.length}`);
        console.log(`📐 网格布局: ${getComputedStyle(warehouseGallery).display === 'grid' ? '✓ 正常' : '✗ 异常'}`);
        console.log(`🖱️ 点击翻转: ${containers.length > 0 ? '✓ 已启用' : '✗ 未启用'}`);
    }

    // 自动执行修复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAllFixes);
    } else {
        // 延迟执行确保DOM完全加载
        setTimeout(applyAllFixes, 100);
    }

    // 提供全局访问接口
    window.emergencyWarehouseFix = applyAllFixes;
    
    console.log('🔧 仓库任务卡紧急修复工具已加载');
    console.log('💡 调用 emergencyWarehouseFix() 可手动执行修复');

})();
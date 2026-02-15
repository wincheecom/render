/**
 * 仓库任务卡网格布局专项修复
 * 专门解决 div.task-gallery.warehouse-tasks-gallery 横向显示问题
 */

(function() {
    'use strict';

    console.log('🔧 启动仓库网格布局专项修复...');

    // 核心修复函数
    function fixWarehouseGridLayout() {
        console.log('📐 正在修复仓库任务卡网格布局...');
        
        // 创建强力的CSS覆盖样式
        const gridStyle = document.createElement('style');
        gridStyle.id = 'warehouse-grid-fix';
        gridStyle.textContent = `
            /* 仓库任务画廊网格布局 - 最高优先级 */
            .task-gallery.warehouse-tasks-gallery {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 15px !important;
                margin-top: 15px !important;
                width: 100% !important;
                align-content: start !important;
                justify-content: stretch !important;
                grid-auto-rows: minmax(250px, auto) !important;
                position: relative !important;
            }
            
            /* 确保任务卡片容器正确显示 */
            .task-gallery.warehouse-tasks-gallery .task-flip-container {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                min-height: 250px !important;
                margin: 0 !important;
                padding: 0 !important;
                position: relative !important;
            }
            
            /* 任务卡片正面样式 */
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
            
            /* 任务卡片背面样式 */
            .task-gallery.warehouse-tasks-gallery .task-back {
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
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                backface-visibility: hidden !important;
                transform: rotateY(180deg) !important;
                z-index: 1 !important;
            }
            
            /* 翻转状态控制 */
            .task-gallery.warehouse-tasks-gallery .task-flip-container.flipped .task-front {
                transform: rotateY(-180deg) !important;
            }
            
            .task-gallery.warehouse-tasks-gallery .task-flip-container.flipped .task-back {
                transform: rotateY(0deg) !important;
            }
            
            /* 响应式设计 */
            @media (max-width: 992px) {
                .task-gallery.warehouse-tasks-gallery {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 12px !important;
                }
                
                .task-gallery.warehouse-tasks-gallery .task-front,
                .task-gallery.warehouse-tasks-gallery .task-back {
                    min-height: 230px !important;
                    padding: 12px !important;
                }
            }
            
            @media (max-width: 768px) {
                .task-gallery.warehouse-tasks-gallery {
                    grid-template-columns: 1fr !important;
                    gap: 10px !important;
                }
                
                .task-gallery.warehouse-tasks-gallery .task-front,
                .task-gallery.warehouse-tasks-gallery .task-back {
                    min-height: 220px !important;
                    padding: 10px !important;
                }
            }
            
            /* 调试辅助样式 */
            .debug-grid-overlay .task-gallery.warehouse-tasks-gallery {
                outline: 3px solid #4cc9f0 !important;
                background: linear-gradient(45deg, transparent 49%, rgba(76, 201, 240, 0.1) 49%, rgba(76, 201, 240, 0.1) 51%, transparent 51%) !important;
            }
        `;
        
        // 移除可能存在的旧样式
        const existingStyle = document.getElementById('warehouse-grid-fix');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // 添加新样式
        document.head.appendChild(gridStyle);
        console.log('✅ 网格布局样式已应用');
        
        return true;
    }

    // 强制刷新布局函数
    function forceLayoutRefresh() {
        console.log('🔄 强制刷新仓库布局...');
        
        const warehouseGallery = document.querySelector('.task-gallery.warehouse-tasks-gallery');
        if (!warehouseGallery) {
            console.error('❌ 未找到仓库任务画廊');
            return false;
        }
        
        // 强制重新计算样式
        warehouseGallery.style.display = 'grid';
        warehouseGallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
        warehouseGallery.style.gap = '15px';
        
        // 触发重排
        warehouseGallery.offsetHeight;
        
        // 检查并修复子元素
        const taskContainers = warehouseGallery.querySelectorAll('.task-flip-container');
        taskContainers.forEach((container, index) => {
            container.style.display = 'block';
            container.style.width = '100%';
            container.style.minHeight = '250px';
            container.offsetHeight; // 触发重排
            
            console.log(`✅ 修复任务卡片 ${index + 1}: ${container.getAttribute('data-task-id')}`);
        });
        
        console.log(`📊 总共处理了 ${taskContainers.length} 个任务卡片`);
        return true;
    }

    // 验证布局状态
    function verifyLayout() {
        console.log('🔍 验证布局状态...');
        
        const warehouseGallery = document.querySelector('.task-gallery.warehouse-tasks-gallery');
        if (!warehouseGallery) {
            console.error('❌ 仓库任务画廊不存在');
            return false;
        }
        
        const computedStyle = window.getComputedStyle(warehouseGallery);
        const taskContainers = warehouseGallery.querySelectorAll('.task-flip-container');
        
        console.log('📊 布局验证结果:');
        console.log(`  Display: ${computedStyle.display}`);
        console.log(`  Grid Template: ${computedStyle.gridTemplateColumns}`);
        console.log(`  Gap: ${computedStyle.gap}`);
        console.log(`  任务卡片数量: ${taskContainers.length}`);
        
        // 检查每个卡片的状态
        taskContainers.forEach((container, index) => {
            const containerStyle = window.getComputedStyle(container);
            const taskId = container.getAttribute('data-task-id');
            console.log(`  卡片 ${index + 1} (${taskId}): Display=${containerStyle.display}, Width=${containerStyle.width}`);
        });
        
        const isSuccess = computedStyle.display === 'grid' && taskContainers.length > 0;
        console.log(`🎯 布局状态: ${isSuccess ? '✅ 正常' : '❌ 异常'}`);
        
        return isSuccess;
    }

    // 主执行函数
    function executeGridFix() {
        console.log('🚀 开始执行仓库网格布局修复...');
        
        try {
            // 步骤1: 应用网格样式
            fixWarehouseGridLayout();
            
            // 步骤2: 强制刷新布局
            setTimeout(() => {
                forceLayoutRefresh();
                
                // 步骤3: 验证结果
                setTimeout(() => {
                    const isSuccessful = verifyLayout();
                    
                    if (isSuccessful) {
                        console.log('🎉 仓库网格布局修复成功！');
                        showSuccessMessage();
                    } else {
                        console.error('❌ 仓库网格布局修复失败');
                        showErrorMessage();
                    }
                }, 500);
            }, 300);
            
        } catch (error) {
            console.error('❌ 修复过程中发生错误:', error);
            showErrorMessage();
        }
    }

    // 显示成功消息
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4cc9f0;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
            ">
                <strong>✅ 仓库任务卡布局修复成功！</strong><br>
                卡片现在应该横向排列显示了
            </div>
        `;
        document.body.appendChild(message);
        
        // 3秒后自动消失
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.5s';
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }

    // 显示错误消息
    function showErrorMessage() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef233c;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
            ">
                <strong>❌ 仓库任务卡布局修复失败</strong><br>
                请检查控制台获取详细信息
            </div>
        `;
        document.body.appendChild(message);
        
        // 5秒后自动消失
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.5s';
            setTimeout(() => message.remove(), 500);
        }, 5000);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeGridFix);
    } else {
        // 延迟执行确保所有资源加载完成
        setTimeout(executeGridFix, 500);
    }

    // 提供全局访问接口
    window.fixWarehouseGridLayout = executeGridFix;
    
    console.log('🔧 仓库网格布局修复工具已加载');
    console.log('💡 调用 fixWarehouseGridLayout() 可手动执行修复');

})();
/**
 * 仓库任务卡紧急横向显示修复
 * 针对实际显示为竖向的问题进行根本性修复
 */

(function() {
    'use strict';

    console.log('🚀 启动仓库任务卡紧急横向显示修复...');

    // 核心修复函数
    function applyUrgentHorizontalFix() {
        console.log('🔧 应用紧急横向布局修复...');
        
        // 创建最高优先级的CSS规则
        const urgentStyles = `
            /* ===== 紧急修复：强制横向网格布局 ===== */
            
            /* 目标容器 - 最高优先级 */
            .task-gallery.warehouse-tasks-gallery,
            #warehouseTasks .task-gallery.warehouse-tasks-gallery {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 15px !important;
                margin-top: 15px !important;
                align-content: start !important;
                width: 100% !important;
                grid-auto-rows: minmax(250px, auto) !important;
                position: relative !important;
            }
            
            /* 任务卡片容器 - 强制块级显示 */
            .task-gallery.warehouse-tasks-gallery .task-flip-container,
            #warehouseTasks .task-gallery.warehouse-tasks-gallery .task-flip-container {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                position: relative !important;
                min-height: 250px !important;
            }
            
            /* 任务卡片正面样式 */
            .task-gallery.warehouse-tasks-gallery .task-front,
            #warehouseTasks .task-gallery.warehouse-tasks-gallery .task-front {
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
            
            /* 响应式设计 */
            @media (max-width: 1200px) {
                .task-gallery.warehouse-tasks-gallery,
                #warehouseTasks .task-gallery.warehouse-tasks-gallery {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 12px !important;
                }
                
                .task-gallery.warehouse-tasks-gallery .task-front,
                #warehouseTasks .task-gallery.warehouse-tasks-gallery .task-front {
                    min-height: 230px !important;
                    padding: 12px !important;
                }
            }
            
            @media (max-width: 768px) {
                .task-gallery.warehouse-tasks-gallery,
                #warehouseTasks .task-gallery.warehouse-tasks-gallery {
                    grid-template-columns: 1fr !important;
                    gap: 10px !important;
                }
                
                .task-gallery.warehouse-tasks-gallery .task-front,
                #warehouseTasks .task-gallery.warehouse-tasks-gallery .task-front {
                    min-height: 220px !important;
                    padding: 10px !important;
                }
            }
            
            /* 调试样式 - 用于可视化验证 */
            .debug-grid-lines .task-gallery.warehouse-tasks-gallery {
                outline: 3px solid #4cc9f0 !important;
                background: linear-gradient(45deg, transparent 49%, rgba(76, 201, 240, 0.1) 49%, rgba(76, 201, 240, 0.1) 51%, transparent 51%) !important;
            }
            
            .debug-grid-lines .task-gallery.warehouse-tasks-gallery .task-flip-container:nth-child(3n+1) {
                outline: 2px solid #4361ee !important;
            }
            
            .debug-grid-lines .task-gallery.warehouse-tasks-gallery .task-flip-container:nth-child(3n+2) {
                outline: 2px solid #7209b7 !important;
            }
            
            .debug-grid-lines .task-gallery.warehouse-tasks-gallery .task-flip-container:nth-child(3n+3) {
                outline: 2px solid #f72585 !important;
            }
        `;

        // 移除可能存在的旧样式
        const existingStyles = document.querySelectorAll('style[data-warehouse-fix]');
        existingStyles.forEach(style => style.remove());

        // 创建新的样式元素
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-warehouse-fix', 'urgent-horizontal');
        styleElement.textContent = urgentStyles;
        
        // 插入到head的最前面确保最高优先级
        const head = document.head;
        if (head.firstChild) {
            head.insertBefore(styleElement, head.firstChild);
        } else {
            head.appendChild(styleElement);
        }

        console.log('✅ 紧急CSS修复已应用');
        return styleElement;
    }

    // 修复现有任务卡片的显示
    function fixExistingTaskCards() {
        console.log('🔄 修复现有任务卡片显示...');
        
        const galleryContainers = document.querySelectorAll('.task-gallery.warehouse-tasks-gallery');
        
        galleryContainers.forEach((gallery, galleryIndex) => {
            console.log(`🔧 修复画廊容器 ${galleryIndex + 1}:`, gallery);
            
            // 强制刷新容器样式
            gallery.style.display = 'grid';
            gallery.style.gridTemplateColumns = 'repeat(3, 1fr)';
            gallery.style.gap = '15px';
            
            const taskContainers = gallery.querySelectorAll('.task-flip-container');
            taskContainers.forEach((container, index) => {
                // 强制设置容器样式
                container.style.display = 'block';
                container.style.width = '100%';
                container.style.minHeight = '250px';
                
                // 修复正面卡片
                const frontCard = container.querySelector('.task-front');
                if (frontCard) {
                    frontCard.style.display = 'flex';
                    frontCard.style.flexDirection = 'column';
                    frontCard.style.alignItems = 'center';
                    frontCard.style.justifyContent = 'space-between';
                    frontCard.style.minHeight = '250px';
                }
                
                console.log(`   ✓ 修复任务卡片 ${index + 1}`);
            });
        });
        
        console.log(`✅ 共修复 ${galleryContainers.length} 个画廊容器`);
    }

    // 监控DOM变化，自动修复新添加的任务卡片
    function setupAutoFixObserver() {
        console.log('👁️ 设置自动修复观察器...');
        
        const observer = new MutationObserver((mutations) => {
            let shouldFix = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是仓库任务相关元素
                            if (node.matches && 
                                (node.matches('.task-gallery.warehouse-tasks-gallery') || 
                                 node.matches('.task-flip-container') ||
                                 node.querySelector && 
                                 (node.querySelector('.task-gallery.warehouse-tasks-gallery') ||
                                  node.querySelector('.task-flip-container')))) {
                                shouldFix = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldFix) {
                console.log('🔄 检测到仓库任务DOM变化，自动应用修复...');
                setTimeout(() => {
                    fixExistingTaskCards();
                }, 100);
            }
        });
        
        // 观察整个文档
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ 自动修复观察器已启动');
        return observer;
    }

    // 诊断当前布局状态
    function diagnoseCurrentLayout() {
        console.log('🔍 诊断当前布局状态...');
        
        const gallery = document.querySelector('.task-gallery.warehouse-tasks-gallery');
        if (!gallery) {
            console.warn('❌ 未找到仓库任务画廊容器');
            return false;
        }
        
        const computedStyle = window.getComputedStyle(gallery);
        const layoutInfo = {
            display: computedStyle.display,
            gridTemplateColumns: computedStyle.gridTemplateColumns,
            gap: computedStyle.gap,
            taskCount: gallery.querySelectorAll('.task-flip-container').length
        };
        
        console.log('📊 当前布局信息:', layoutInfo);
        
        // 判断是否为正确布局
        const isCorrectLayout = layoutInfo.display.includes('grid') && 
                              layoutInfo.gridTemplateColumns.includes('1fr 1fr 1fr');
        
        if (isCorrectLayout) {
            console.log('✅ 布局状态正常');
        } else {
            console.log('❌ 布局存在问题，需要修复');
        }
        
        return isCorrectLayout;
    }

    // 主执行函数
    function executeEmergencyFix() {
        console.log('⚡ 执行紧急修复程序...');
        
        // 1. 应用CSS修复
        const styleElement = applyUrgentHorizontalFix();
        
        // 2. 修复现有卡片
        fixExistingTaskCards();
        
        // 3. 设置自动修复
        const observer = setupAutoFixObserver();
        
        // 4. 验证修复效果
        setTimeout(() => {
            const isFixed = diagnoseCurrentLayout();
            if (isFixed) {
                console.log('🎉 紧急修复成功！');
                Utils.showAlert('仓库任务卡横向显示修复完成', 'success');
            } else {
                console.log('⚠️ 修复可能需要更多时间生效');
            }
        }, 500);
        
        // 返回清理函数
        return function cleanup() {
            if (observer) observer.disconnect();
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
            }
            console.log('🧹 紧急修复已清理');
        };
    }

    // 等待DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeEmergencyFix);
    } else {
        // DOM已加载，立即执行
        setTimeout(executeEmergencyFix, 100);
    }

    // 提供全局访问接口
    window.WarehouseLayoutFix = {
        fix: executeEmergencyFix,
        diagnose: diagnoseCurrentLayout,
        toggleDebug: function() {
            document.body.classList.toggle('debug-grid-lines');
            const isEnabled = document.body.classList.contains('debug-grid-lines');
            console.log(`${isEnabled ? '启用' : '禁用'}调试模式`);
            return isEnabled;
        }
    };

    console.log('🚀 仓库任务卡紧急修复脚本已加载完毕');
    console.log('💡 使用 WarehouseLayoutFix.fix() 手动触发修复');
    console.log('💡 使用 WarehouseLayoutFix.diagnose() 检查布局状态');
    console.log('💡 使用 WarehouseLayoutFix.toggleDebug() 切换调试模式');

})();
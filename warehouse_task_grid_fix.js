/**
 * 仓库任务卡网格布局根本性修复方案
 * 解决任务卡片无法横向显示的核心问题
 */

(function() {
    'use strict';

    console.log('🔧 启动仓库任务卡网格布局根本性修复...');

    // 核心修复函数
    function applyFundamentalGridFix() {
        // 创建新的样式规则
        const fundamentalStyles = `
            /* ===== 根本性网格布局修复 ===== */
            
            /* 主容器 - 确保正确的网格显示 */
            .task-gallery.warehouse-tasks-gallery {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 15px !important;
                margin-top: 15px !important;
                align-content: start !important;
                width: 100% !important;
                grid-auto-rows: minmax(250px, auto) !important;
            }
            
            /* 任务卡片容器 - 确保正确显示 */
            .task-gallery.warehouse-tasks-gallery .task-flip-container {
                display: block !important;
                width: 100% !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                position: relative !important;
                transform-style: preserve-3d !important;
                perspective: 1000px !important;
            }
            
            /* 任务卡片正面样式 */
            .task-gallery.warehouse-tasks-gallery .task-front {
                display: flex !important;
                flex-direction: column !important;
                width: 100% !important;
                min-height: 250px !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                padding: 15px !important;
                transition: all 0.3s ease !important;
                align-items: center !important;
                text-align: center !important;
                position: relative !important;
                z-index: 1 !important;
            }
            
            /* 任务卡片背面样式 */
            .task-gallery.warehouse-tasks-gallery .task-back {
                display: flex !important;
                flex-direction: column !important;
                width: 100% !important;
                min-height: 250px !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                padding: 15px !important;
                transition: all 0.3s ease !important;
                align-items: center !important;
                text-align: center !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                backface-visibility: hidden !important;
                transform: rotateY(180deg) !important;
                z-index: 2 !important;
            }
            
            /* 翻转状态控制 */
            .task-gallery.warehouse-tasks-gallery .task-flip-container.flipped .task-front {
                transform: rotateY(-180deg) !important;
            }
            
            .task-gallery.warehouse-tasks-gallery .task-flip-container.flipped .task-back {
                transform: rotateY(0deg) !important;
            }
            
            /* 图片容器样式 */
            .task-gallery.warehouse-tasks-gallery .task-gallery-img {
                width: 100% !important;
                height: 140px !important;
                background: #f8f9fa !important;
                border-radius: 6px !important;
                margin-bottom: 12px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                overflow: hidden !important;
            }
            
            .task-gallery.warehouse-tasks-gallery .task-gallery-img img {
                max-width: 100% !important;
                max-height: 100% !important;
                object-fit: cover !important;
            }
            
            /* 信息容器样式 */
            .task-gallery.warehouse-tasks-gallery .task-info-container {
                width: 100% !important;
                text-align: center !important;
            }
            
            .task-gallery.warehouse-tasks-gallery .task-gallery-name {
                font-weight: 600 !important;
                font-size: 0.95rem !important;
                margin-bottom: 6px !important;
                color: #333 !important;
                word-break: break-word !important;
            }
            
            .task-gallery.warehouse-tasks-gallery .task-gallery-code {
                font-size: 0.85rem !important;
                color: #666 !important;
                margin-bottom: 4px !important;
            }
            
            .task-gallery.warehouse-tasks-gallery .task-gallery-qty {
                font-size: 0.85rem !important;
                color: #4361ee !important;
                font-weight: 600 !important;
                margin-bottom: 4px !important;
            }
            
            .task-gallery.warehouse-tasks-gallery .task-gallery-creator {
                font-size: 0.75rem !important;
                color: #888 !important;
            }
            
            /* 响应式设计 */
            @media (max-width: 1200px) {
                .task-gallery.warehouse-tasks-gallery {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 12px !important;
                }
                
                .task-gallery.warehouse-tasks-gallery .task-front,
                .task-gallery.warehouse-tasks-gallery .task-back {
                    min-height: 230px !important;
                }
                
                .task-gallery.warehouse-tasks-gallery .task-gallery-img {
                    height: 120px !important;
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
                }
                
                .task-gallery.warehouse-tasks-gallery .task-gallery-img {
                    height: 100px !important;
                }
            }
            
            /* 悬停效果 */
            .task-gallery.warehouse-tasks-gallery .task-flip-container:hover .task-front {
                transform: translateY(-5px) !important;
                box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15) !important;
            }
            
            /* 确保高度统一 */
            .task-gallery.warehouse-tasks-gallery .task-flip-container {
                display: flex !important;
                flex-direction: column !important;
            }
            
            .task-gallery.warehouse-tasks-gallery .task-front,
            .task-gallery.warehouse-tasks-gallery .task-back {
                flex: 1 !important;
            }
        `;

        // 移除旧的样式
        const existingStyles = document.getElementById('warehouse-grid-fix-styles');
        if (existingStyles) {
            existingStyles.remove();
        }

        // 应用新样式
        const styleSheet = document.createElement('style');
        styleSheet.id = 'warehouse-grid-fix-styles';
        styleSheet.textContent = fundamentalStyles;
        document.head.appendChild(styleSheet);

        console.log('✅ 根本性网格布局样式已应用');
    }

    // 监控DOM变化，确保样式持续生效
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否有新的仓库任务容器
                            if (node.classList && node.classList.contains('warehouse-tasks-gallery')) {
                                console.log('🔄 检测到新的仓库任务容器，重新应用样式');
                                setTimeout(applyFundamentalGridFix, 100);
                            }
                            
                            // 检查子节点中是否有仓库任务容器
                            const warehouseContainers = node.querySelectorAll && node.querySelectorAll('.warehouse-tasks-gallery');
                            if (warehouseContainers.length > 0) {
                                console.log('🔄 检测到仓库任务容器更新，重新应用样式');
                                setTimeout(applyFundamentalGridFix, 100);
                            }
                        }
                    });
                }
            });
        });

        // 观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('👁️ DOM变化监控已启动');
    }

    // 初始化修复
    function initializeFix() {
        console.log('🚀 开始执行仓库任务卡网格布局根本性修复...');
        
        try {
            // 立即应用基础修复
            applyFundamentalGridFix();
            
            // 设置DOM监控
            setupMutationObserver();
            
            // 定期检查和修复（防万一）
            setInterval(function() {
                const gallery = document.querySelector('.task-gallery.warehouse-tasks-gallery');
                if (gallery) {
                    const computedStyle = window.getComputedStyle(gallery);
                    if (computedStyle.display !== 'grid' || computedStyle.gridTemplateColumns !== 'repeat(3, 1fr)') {
                        console.log('🔁 检测到样式失效，重新应用修复');
                        applyFundamentalGridFix();
                    }
                }
            }, 3000);
            
            console.log('🎉 仓库任务卡网格布局根本性修复已完成！');
            
        } catch (error) {
            console.error('❌ 修复过程中出现错误:', error);
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFix);
    } else {
        initializeFix();
    }

})();
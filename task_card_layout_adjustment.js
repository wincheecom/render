(function() {
    'use strict';
    
    console.log('🔧 开始调整任务卡片布局...');
    
    // 添加新的CSS样式
    function addLayoutStyles() {
        // 检查是否已经添加过样式
        if (document.getElementById('task-layout-adjustment-styles')) {
            console.log('✅ 布局样式已存在，跳过添加');
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'task-layout-adjustment-styles';
        style.textContent = `
            /* 调整任务操作栏宽度为40px */
            .task-gallery-actions {
                width: 40px !important;
                min-width: 40px !important;
                flex-shrink: 0 !important;
            }
            
            /* 确保任务卡片内容区域充分利用剩余空间 */
            .task-card-content {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                width: 100% !important;
            }
            
            /* 商品信息容器样式调整 */
            .task-info-inline {
                display: flex !important;
                align-items: center !important;
                gap: 15px !important;
                flex: 1 !important;
                justify-content: space-around !important;
                margin-left: 0 !important;
                margin-right: auto !important;
            }
            
            /* 单个信息项样式 */
            .task-gallery-name,
            .task-gallery-qty,
            .task-gallery-creator {
                flex: 1 !important;
                text-align: center !important;
                font-size: 0.85rem !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                min-width: 0 !important;
            }
            
            /* 商品名称特殊样式 */
            .task-gallery-name {
                font-weight: 600 !important;
                color: #333 !important;
            }
            
            /* 数量和创建人样式 */
            .task-gallery-qty,
            .task-gallery-creator {
                font-size: 0.75rem !important;
                color: #666 !important;
            }
            
            /* 针对不同屏幕尺寸的响应式调整 */
            @media (max-width: 768px) {
                .task-info-inline {
                    gap: 8px !important;
                }
                
                .task-gallery-name,
                .task-gallery-qty,
                .task-gallery-creator {
                    font-size: 0.7rem !important;
                    max-width: 80px !important;
                }
            }
            
            @media (max-width: 576px) {
                .task-info-inline {
                    gap: 6px !important;
                }
                
                .task-gallery-name,
                .task-gallery-qty,
                .task-gallery-creator {
                    font-size: 0.65rem !important;
                    max-width: 60px !important;
                }
            }
            
            /* 确保在已发布任务画廊中的样式也生效 */
            .published-tasks-gallery .task-gallery-actions {
                width: 40px !important;
                min-width: 40px !important;
                flex-shrink: 0 !important;
            }
            
            .published-tasks-gallery .task-card-content {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                width: 100% !important;
            }
            
            .published-tasks-gallery .task-info-inline {
                display: flex !important;
                align-items: center !important;
                gap: 15px !important;
                flex: 1 !important;
                justify-content: space-around !important;
                margin-left: 0 !important;
                margin-right: auto !important;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ 已添加任务卡片布局调整样式');
    }
    
    // 应用布局调整到现有元素
    function applyLayoutAdjustment() {
        console.log('🔍 查找并调整任务卡片布局...');
        
        // 查找所有的任务卡片内容容器
        const taskCards = document.querySelectorAll('.task-card-content');
        console.log(`🎯 找到 ${taskCards.length} 个任务卡片内容容器`);
        
        taskCards.forEach((cardContent, index) => {
            try {
                // 调整操作栏宽度
                const actionsContainer = cardContent.querySelector('.task-gallery-actions');
                if (actionsContainer) {
                    actionsContainer.style.width = '40px';
                    actionsContainer.style.minWidth = '40px';
                    actionsContainer.style.flexShrink = '0';
                    console.log(`   ✅ 调整第 ${index + 1} 个卡片的操作栏宽度`);
                }
                
                // 调整信息容器布局
                const infoInline = cardContent.querySelector('.task-info-inline');
                if (infoInline) {
                    infoInline.style.display = 'flex';
                    infoInline.style.alignItems = 'center';
                    infoInline.style.gap = '15px';
                    infoInline.style.flex = '1';
                    infoInline.style.justifyContent = 'space-around';
                    infoInline.style.marginLeft = '0';
                    infoInline.style.marginRight = 'auto';
                    console.log(`   ✅ 调整第 ${index + 1} 个卡片的信息容器布局`);
                }
                
                // 调整各个信息项
                const infoItems = cardContent.querySelectorAll('.task-gallery-name, .task-gallery-qty, .task-gallery-creator');
                infoItems.forEach(item => {
                    item.style.flex = '1';
                    item.style.textAlign = 'center';
                    item.style.fontSize = '0.85rem';
                    item.style.whiteSpace = 'nowrap';
                    item.style.overflow = 'hidden';
                    item.style.textOverflow = 'ellipsis';
                    item.style.minWidth = '0';
                });
                
                console.log(`   ✅ 完成第 ${index + 1} 个卡片的布局调整`);
                
            } catch (error) {
                console.warn(`   ⚠️ 调整第 ${index + 1} 个卡片时出错:`, error);
            }
        });
        
        // 特别处理已发布任务画廊
        const publishedGalleries = document.querySelectorAll('.published-tasks-gallery');
        publishedGalleries.forEach((gallery, index) => {
            const galleryActions = gallery.querySelectorAll('.task-gallery-actions');
            galleryActions.forEach(actions => {
                actions.style.width = '40px';
                actions.style.minWidth = '40px';
                actions.style.flexShrink = '0';
            });
            console.log(`   ✅ 调整已发布任务画廊 ${index + 1} 的操作栏`);
        });
    }
    
    // 监听DOM变化，自动应用布局调整
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldApplyAdjustment = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是任务卡片相关元素
                            if (node.classList && (
                                node.classList.contains('task-card-content') ||
                                node.classList.contains('task-gallery-actions') ||
                                node.classList.contains('task-info-inline') ||
                                node.querySelector && (
                                    node.querySelector('.task-card-content') ||
                                    node.querySelector('.task-gallery-actions') ||
                                    node.querySelector('.task-info-inline')
                                )
                            )) {
                                shouldApplyAdjustment = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldApplyAdjustment) {
                console.log('🔄 检测到新任务卡片，自动应用布局调整...');
                setTimeout(() => {
                    applyLayoutAdjustment();
                }, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ 已设置DOM变化监听器');
    }
    
    // 主执行函数
    function main() {
        // 添加样式
        addLayoutStyles();
        
        // 应用初始调整
        applyLayoutAdjustment();
        
        // 设置监听器
        setupMutationObserver();
        
        console.log('🎉 任务卡片布局调整完成！');
        console.log('📋 调整说明：');
        console.log('   • 操作栏宽度已设置为 40px');
        console.log('   • 商品名称、数量、创建人信息已均匀分布在内容区域内');
        console.log('   • 响应式设计确保在不同屏幕尺寸下都能良好显示');
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
    
})();
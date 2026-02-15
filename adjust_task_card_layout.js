/**
 * 调整任务卡片布局脚本
 * 1. 移除详情按钮
 * 2. 将任务信息移动到操作栏同一行显示
 */

(function() {
    'use strict';
    
    console.log('🚀 开始调整任务卡片布局...');
    
    // 查找所有任务卡片容器
    const taskGalleries = document.querySelectorAll('.published-tasks-gallery, .warehouse-tasks-gallery');
    
    taskGalleries.forEach((gallery, galleryIndex) => {
        console.log(`🔧 处理画廊 ${galleryIndex + 1}:`, gallery);
        
        const taskContainers = gallery.querySelectorAll('.task-flip-container');
        
        taskContainers.forEach((container, taskIndex) => {
            try {
                // 获取任务ID
                const taskId = container.dataset.taskId;
                console.log(`   处理任务卡片 ${taskIndex + 1} (ID: ${taskId})`);
                
                // 查找正面卡片
                const frontCard = container.querySelector('.task-front');
                if (!frontCard) {
                    console.warn(`   ⚠️ 未找到正面卡片`);
                    return;
                }
                
                // 查找信息容器和操作栏
                const infoContainer = frontCard.querySelector('.task-info-container');
                const actionsContainer = frontCard.querySelector('.task-gallery-actions');
                
                if (!infoContainer || !actionsContainer) {
                    console.warn(`   ⚠️ 未找到信息容器或操作栏`);
                    return;
                }
                
                // 获取所有信息元素
                const nameElement = infoContainer.querySelector('.task-gallery-name');
                const codeElement = infoContainer.querySelector('.task-gallery-code');
                const qtyElement = infoContainer.querySelector('.task-gallery-qty');
                const creatorElement = infoContainer.querySelector('.task-gallery-creator');
                
                // 移除详情按钮
                const detailButton = actionsContainer.querySelector('button.btn.btn-sm.btn-outline-primary');
                if (detailButton) {
                    detailButton.remove();
                    console.log(`   ✅ 已移除详情按钮`);
                }
                
                // 创建新的信息容器用于放置在同一行
                const newInfoContainer = document.createElement('div');
                newInfoContainer.className = 'task-info-inline d-flex align-items-center gap-2 flex-wrap';
                newInfoContainer.style.flex = '1';
                newInfoContainer.style.minWidth = '0'; // 允许收缩
                
                // 移动信息元素到新容器
                if (nameElement) {
                    // 调整名称样式以适应同行显示
                    nameElement.style.fontSize = '0.85rem';
                    nameElement.style.fontWeight = '600';
                    nameElement.style.marginBottom = '0';
                    nameElement.style.overflow = 'hidden';
                    nameElement.style.textOverflow = 'ellipsis';
                    nameElement.style.whiteSpace = 'nowrap';
                    nameElement.style.maxWidth = '120px';
                    newInfoContainer.appendChild(nameElement);
                }
                
                if (codeElement) {
                    // 调整货号样式
                    codeElement.style.fontSize = '0.75rem';
                    codeElement.style.color = '#666';
                    codeElement.style.marginBottom = '0';
                    codeElement.style.overflow = 'hidden';
                    codeElement.style.textOverflow = 'ellipsis';
                    codeElement.style.whiteSpace = 'nowrap';
                    codeElement.style.maxWidth = '100px';
                    newInfoContainer.appendChild(codeElement);
                }
                
                if (qtyElement) {
                    // 调整数量样式
                    qtyElement.style.fontSize = '0.75rem';
                    qtyElement.style.color = '#888';
                    qtyElement.style.marginBottom = '0';
                    qtyElement.style.overflow = 'hidden';
                    qtyElement.style.textOverflow = 'ellipsis';
                    qtyElement.style.whiteSpace = 'nowrap';
                    qtyElement.style.maxWidth = '100px';
                    newInfoContainer.appendChild(qtyElement);
                }
                
                if (creatorElement) {
                    // 调整创建人样式
                    creatorElement.style.fontSize = '0.7rem';
                    creatorElement.style.color = '#999';
                    creatorElement.style.marginBottom = '0';
                    creatorElement.style.overflow = 'hidden';
                    creatorElement.style.textOverflow = 'ellipsis';
                    creatorElement.style.whiteSpace = 'nowrap';
                    creatorElement.style.maxWidth = '80px';
                    newInfoContainer.appendChild(creatorElement);
                }
                
                // 将新信息容器插入到操作栏前面
                actionsContainer.parentNode.insertBefore(newInfoContainer, actionsContainer);
                
                // 移除原来的信息容器
                infoContainer.remove();
                
                // 调整操作栏样式以适应同行布局
                actionsContainer.style.flexShrink = '0';
                actionsContainer.style.marginLeft = 'auto';
                
                console.log(`   ✅ 任务卡片 ${taskIndex + 1} 布局调整完成`);
                
            } catch (error) {
                console.error(`   ❌ 处理任务卡片 ${taskIndex + 1} 时出错:`, error);
            }
        });
    });
    
    // 添加必要的CSS样式
    const styleId = 'task-card-layout-adjustment';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* 任务信息同行显示样式 */
            .task-info-inline {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                flex-wrap: wrap !important;
                min-width: 0 !important;
            }
            
            .task-info-inline > div {
                flex: 0 0 auto !important;
                min-width: 0 !important;
            }
            
            /* 确保操作栏右对齐 */
            .task-gallery-actions.d-flex.align-items-center.gap-2 {
                margin-left: auto !important;
                flex-shrink: 0 !important;
            }
            
            /* 响应式调整 */
            @media (max-width: 768px) {
                .task-info-inline {
                    gap: 4px !important;
                }
                
                .task-info-inline > div {
                    font-size: 0.7rem !important;
                    max-width: 80px !important;
                }
            }
        `;
        document.head.appendChild(style);
        console.log('✅ 已添加布局调整CSS样式');
    }
    
    console.log('🎉 任务卡片布局调整完成！');
    
})();
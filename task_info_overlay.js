/**
 * 任务信息覆盖层显示脚本
 * 在任务图片上层显示商品名称、数量、创建人信息，居下显示
 */

(function() {
    'use strict';
    
    console.log('🎨 开始初始化任务信息覆盖层...');
    
    // 覆盖层配置
    const OVERLAY_CONFIG = {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        textColor: '#ffffff',
        fontSize: '14px',
        padding: '12px',
        borderRadius: '0 0 6px 6px',
        minHeight: '60px'
    };
    
    // 创建覆盖层样式
    function createOverlayStyles() {
        const style = document.createElement('style');
        style.id = 'task-info-overlay-styles';
        style.textContent = `
            /* 任务信息覆盖层基础样式 */
            .task-info-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: ${OVERLAY_CONFIG.backgroundColor};
                color: ${OVERLAY_CONFIG.textColor};
                padding: ${OVERLAY_CONFIG.padding};
                border-radius: ${OVERLAY_CONFIG.borderRadius};
                font-size: ${OVERLAY_CONFIG.fontSize};
                min-height: ${OVERLAY_CONFIG.minHeight};
                display: flex;
                flex-direction: column;
                justify-content: center;
                z-index: 10;
                backdrop-filter: blur(2px);
                transition: opacity 0.3s ease;
                opacity: 0.9;
            }
            
            /* 覆盖层内容容器 */
            .task-info-content {
                display: flex;
                flex-direction: column;
                gap: 4px;
                width: 100%;
            }
            
            /* 商品名称样式 */
            .task-info-name {
                font-weight: 600;
                font-size: 15px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }
            
            /* 数量和创建人信息行 */
            .task-info-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 13px;
                gap: 10px;
            }
            
            /* 数量样式 */
            .task-info-quantity {
                font-weight: 500;
                color: #4caf50;
            }
            
            /* 创建人样式 */
            .task-info-creator {
                color: #bbbbbb;
                font-size: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
                text-align: right;
            }
            
            /* 图片容器相对定位 */
            .task-gallery-img {
                position: relative !important;
                overflow: visible !important;
            }
            
            /* 鼠标悬停时的透明度效果 */
            .task-gallery-img:hover .task-info-overlay {
                opacity: 1;
            }
            
            /* 响应式适配 */
            @media (max-width: 768px) {
                .task-info-overlay {
                    padding: 10px;
                    min-height: 50px;
                }
                
                .task-info-name {
                    font-size: 14px;
                }
                
                .task-info-details {
                    font-size: 12px;
                }
                
                .task-info-creator {
                    font-size: 11px;
                }
            }
            
            /* 确保覆盖层在所有任务类型中都能正确显示 */
            .published-tasks-gallery .task-info-overlay,
            .warehouse-tasks-gallery .task-info-overlay,
            .task-flip-container .task-info-overlay {
                position: absolute !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
            }
        `;
        
        // 移除旧样式
        const existingStyle = document.getElementById('task-info-overlay-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
        console.log('✅ 任务信息覆盖层样式已创建');
    }
    
    // 创建信息覆盖层
    function createInfoOverlay(imgContainer, taskData) {
        // 如果已有覆盖层，先移除
        const existingOverlay = imgContainer.querySelector('.task-info-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // 创建覆盖层容器
        const overlay = document.createElement('div');
        overlay.className = 'task-info-overlay';
        
        // 创建内容容器
        const content = document.createElement('div');
        content.className = 'task-info-content';
        
        // 商品名称
        const nameDiv = document.createElement('div');
        nameDiv.className = 'task-info-name';
        nameDiv.textContent = taskData.name || '未知商品';
        
        // 详情行（数量和创建人）
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'task-info-details';
        
        // 数量
        const quantitySpan = document.createElement('span');
        quantitySpan.className = 'task-info-quantity';
        quantitySpan.textContent = `数量: ${taskData.quantity || 0}`;
        
        // 创建人
        const creatorSpan = document.createElement('span');
        creatorSpan.className = 'task-info-creator';
        creatorSpan.textContent = taskData.creator || '未知创建人';
        
        // 组装DOM结构
        detailsDiv.appendChild(quantitySpan);
        detailsDiv.appendChild(creatorSpan);
        content.appendChild(nameDiv);
        content.appendChild(detailsDiv);
        overlay.appendChild(content);
        
        // 添加到图片容器
        imgContainer.style.position = 'relative';
        imgContainer.appendChild(overlay);
        
        return overlay;
    }
    
    // 从现有DOM结构提取任务数据
    function extractTaskData(taskElement) {
        const data = {};
        
        // 查找商品名称
        const nameElement = taskElement.querySelector('.task-gallery-name');
        data.name = nameElement ? nameElement.textContent.trim() : '';
        
        // 查找数量信息
        const qtyElement = taskElement.querySelector('.task-gallery-qty');
        if (qtyElement) {
            const qtyText = qtyElement.textContent.trim();
            const qtyMatch = qtyText.match(/(\d+)/);
            data.quantity = qtyMatch ? parseInt(qtyMatch[1]) : 0;
        } else {
            data.quantity = 0;
        }
        
        // 查找创建人信息
        const creatorElement = taskElement.querySelector('.task-gallery-creator');
        data.creator = creatorElement ? creatorElement.textContent.replace('创建人:', '').trim() : '';
        
        return data;
    }
    
    // 应用覆盖层到所有任务卡片
    function applyOverlays() {
        // 查找所有任务图片容器
        const imgContainers = document.querySelectorAll('.task-gallery-img');
        let appliedCount = 0;
        
        imgContainers.forEach(container => {
            // 找到对应的父级任务元素
            const taskFront = container.closest('.task-front');
            if (taskFront) {
                const taskData = extractTaskData(taskFront);
                if (taskData.name || taskData.quantity > 0) {
                    createInfoOverlay(container, taskData);
                    appliedCount++;
                }
            }
        });
        
        console.log(`✅ 已为 ${appliedCount} 个任务卡片添加信息覆盖层`);
        return appliedCount;
    }
    
    // 监听动态内容变化
    function observeDynamicContent() {
        const observer = new MutationObserver((mutations) => {
            let shouldApply = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否添加了新的任务图片容器
                            if (node.classList && node.classList.contains('task-gallery-img')) {
                                shouldApply = true;
                            }
                            
                            // 检查子元素中是否有任务相关元素
                            const taskElements = node.querySelectorAll('.task-gallery-img, .task-front');
                            if (taskElements.length > 0) {
                                shouldApply = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldApply) {
                setTimeout(() => {
                    applyOverlays();
                }, 100);
            }
        });
        
        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('🔍 任务信息覆盖层监听器已启动');
    }
    
    // 初始化函数
    function initialize() {
        // 创建样式
        createOverlayStyles();
        
        // 等待DOM加载完成后应用覆盖层
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(applyOverlays, 500);
                observeDynamicContent();
            });
        } else {
            setTimeout(applyOverlays, 500);
            observeDynamicContent();
        }
    }
    
    // 提供全局控制函数
    window.toggleTaskInfoOverlay = function(show = true) {
        const overlays = document.querySelectorAll('.task-info-overlay');
        overlays.forEach(overlay => {
            overlay.style.display = show ? 'flex' : 'none';
        });
        
        if (show) {
            console.log('👁️ 任务信息覆盖层已显示');
        } else {
            console.log('🙈 任务信息覆盖层已隐藏');
        }
    };
    
    window.refreshTaskInfoOverlay = function() {
        // 移除所有现有覆盖层
        document.querySelectorAll('.task-info-overlay').forEach(overlay => overlay.remove());
        // 重新应用
        applyOverlays();
        console.log('🔄 任务信息覆盖层已刷新');
    };
    
    // 启动初始化
    initialize();
    
    console.log('✨ 任务信息覆盖层系统已加载完成');
    
})();
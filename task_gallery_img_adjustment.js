/**
 * 任务卡片图片容器尺寸调整脚本
 * 将 div.task-gallery-img 的尺寸调整为 262.66px x 259.06px
 */

(function() {
    'use strict';
    
    console.log('🖼️ 开始调整任务卡片图片容器尺寸...');
    
    // 目标尺寸
    const TARGET_WIDTH = '262.66px';
    const TARGET_HEIGHT = '259.06px';
    
    // 创建样式覆盖
    function adjustGalleryImgSizes() {
        const style = document.createElement('style');
        style.id = 'task-gallery-img-adjustment';
        style.textContent = `
            /* 调整任务卡片图片容器尺寸 */
            .task-gallery-img {
                width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                object-fit: cover !important;
                border-radius: 6px !important;
                margin-bottom: 8px !important;
                background-color: #f8f9fa !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            /* 针对发布任务画廊的特殊处理 */
            .published-tasks-gallery .task-gallery-img {
                width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                object-fit: cover !important;
                border-radius: 6px !important;
                margin-bottom: 8px !important;
                background-color: #f8f9fa !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            /* 针对任务翻转容器内的图片 */
            .task-flip-container .task-gallery-img {
                width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                object-fit: cover !important;
                border-radius: 6px !important;
                margin-bottom: 8px !important;
                background-color: #f8f9fa !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            /* 仓库任务画廊的特殊处理 */
            #warehouseTasks.published-tasks-gallery .task-gallery-img {
                width: 100% !important;
                height: ${TARGET_HEIGHT} !important;
                object-fit: cover !important;
                border-radius: 6px !important;
                margin-bottom: 8px !important;
                background-color: #f8f9fa !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            /* 响应式适配 */
            @media (max-width: 768px) {
                .task-gallery-img,
                .published-tasks-gallery .task-gallery-img,
                .task-flip-container .task-gallery-img {
                    width: calc(100% - 20px) !important;
                    height: auto !important;
                    min-height: 200px !important;
                }
                
                #warehouseTasks.published-tasks-gallery .task-gallery-img {
                    width: 100% !important;
                    height: 200px !important;
                }
            }
        `;
        
        // 移除旧的样式
        const existingStyle = document.getElementById('task-gallery-img-adjustment');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
        console.log(`✅ 任务卡片图片容器尺寸已调整为 ${TARGET_WIDTH} x ${TARGET_HEIGHT}`);
    }
    
    // 直接调整现有元素
    function applyImmediateAdjustments() {
        const imgContainers = document.querySelectorAll('.task-gallery-img');
        imgContainers.forEach(container => {
            container.style.width = TARGET_WIDTH;
            container.style.height = TARGET_HEIGHT;
            container.style.objectFit = 'cover';
            container.style.borderRadius = '6px';
            container.style.marginBottom = '8px';
            container.style.backgroundColor = '#f8f9fa';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
        });
        
        console.log(`✅ 已调整 ${imgContainers.length} 个图片容器`);
    }
    
    // 初始化调整
    function initializeAdjustment() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                adjustGalleryImgSizes();
                setTimeout(applyImmediateAdjustments, 100);
            });
        } else {
            adjustGalleryImgSizes();
            setTimeout(applyImmediateAdjustments, 100);
        }
        
        // 监听动态添加的内容
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是图片容器相关元素
                            if (node.classList && node.classList.contains('task-gallery-img')) {
                                applyImmediateAdjustments();
                            }
                            
                            // 检查子元素
                            const imgElements = node.querySelectorAll('.task-gallery-img');
                            if (imgElements.length > 0) {
                                setTimeout(applyImmediateAdjustments, 50);
                            }
                        }
                    });
                }
            });
        });
        
        function startObserving() {
            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                console.log('🔍 图片容器尺寸调整监控已启动');
            } else {
                // 如果body还不存在，等待它出现
                const bodyObserver = new MutationObserver(() => {
                    if (document.body) {
                        bodyObserver.disconnect();
                        startObserving();
                    }
                });
                bodyObserver.observe(document.documentElement, {
                    childList: true
                });
            }
        }
        
        startObserving();
    }
    
    // 执行初始化
    initializeAdjustment();
    
    // 提供全局函数供手动调用
    window.adjustTaskGalleryImgSize = function(width = '262.66px', height = '259.06px') {
        const style = document.getElementById('task-gallery-img-adjustment');
        if (style) {
            style.textContent = style.textContent
                .replace(/262\.66px/g, width)
                .replace(/259\.06px/g, height);
        }
        console.log(`🔄 任务卡片图片容器尺寸已更新为 ${width} x ${height}`);
    };
    
    console.log('✨ 任务卡片图片容器尺寸调整脚本已加载');
    
})();
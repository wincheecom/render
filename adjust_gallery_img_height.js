/**
 * 专门调整任务卡片图片容器高度的脚本
 * 将 div.task-gallery-img 的高度从 120px 调整为 259.06px
 */
(function() {
    'use strict';
    
    console.log('📏 开始调整任务卡片图片容器高度...');
    
    const TARGET_WIDTH = '262.66px';
    const TARGET_HEIGHT = '259.06px';
    
    // 创建高优先级的样式覆盖
    function createHeightAdjustmentStyles() {
        // 移除可能存在的旧样式
        const existingStyles = document.querySelectorAll('[id^="gallery-img-height-adjust"]');
        existingStyles.forEach(style => style.remove());
        
        const style = document.createElement('style');
        style.id = 'gallery-img-height-adjustment-override';
        style.textContent = `
            /* 最高优先级的图片容器高度调整 */
            .task-gallery-img {
                width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                min-height: ${TARGET_HEIGHT} !important;
                max-height: ${TARGET_HEIGHT} !important;
                object-fit: cover !important;
                border-radius: 6px !important;
                margin-bottom: 8px !important;
                background-color: #f8f9fa !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            /* 针对发布任务画廊的强制覆盖 */
            .published-tasks-gallery .task-gallery-img {
                width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
                min-height: ${TARGET_HEIGHT} !important;
                max-height: ${TARGET_HEIGHT} !important;
                object-fit: cover !important;
            }
            
            /* 覆盖内联样式 */
            .task-gallery-img[style] {
                width: ${TARGET_WIDTH} !important;
                height: ${TARGET_HEIGHT} !important;
            }
            
            /* 覆盖特定的120px高度设置 */
            .published-tasks-gallery .task-gallery-img {
                height: ${TARGET_HEIGHT} !important;
            }
            
            /* 仓库任务的特殊处理 */
            #warehouseTasks .task-gallery-img {
                height: ${TARGET_HEIGHT} !important;
                min-height: ${TARGET_HEIGHT} !important;
            }
            
            /* 响应式处理 */
            @media (max-width: 768px) {
                .task-gallery-img {
                    height: 200px !important;
                    min-height: 200px !important;
                }
            }
        `;
        
        // 插入到head的最前面以确保最高优先级
        if (document.head.firstChild) {
            document.head.insertBefore(style, document.head.firstChild);
        } else {
            document.head.appendChild(style);
        }
        
        console.log(`✅ 高优先级样式已创建，目标高度: ${TARGET_HEIGHT}`);
    }
    
    // 直接修改现有元素的样式
    function applyDirectHeightAdjustment() {
        const imgContainers = document.querySelectorAll('.task-gallery-img');
        
        if (imgContainers.length === 0) {
            console.log('⚠️ 未找到图片容器元素');
            return 0;
        }
        
        let adjustedCount = 0;
        
        imgContainers.forEach((container, index) => {
            // 保存原始样式以便恢复
            if (!container.dataset.originalStyle) {
                container.dataset.originalStyle = container.getAttribute('style') || '';
            }
            
            // 应用新的样式
            container.style.setProperty('width', TARGET_WIDTH, 'important');
            container.style.setProperty('height', TARGET_HEIGHT, 'important');
            container.style.setProperty('min-height', TARGET_HEIGHT, 'important');
            container.style.setProperty('max-height', TARGET_HEIGHT, 'important');
            container.style.setProperty('object-fit', 'cover', 'important');
            container.style.setProperty('border-radius', '6px', 'important');
            container.style.setProperty('margin-bottom', '8px', 'important');
            container.style.setProperty('background-color', '#f8f9fa', 'important');
            container.style.setProperty('display', 'flex', 'important');
            container.style.setProperty('align-items', 'center', 'important');
            container.style.setProperty('justify-content', 'center', 'important');
            
            adjustedCount++;
            console.log(`✅ 已调整图片容器 ${index + 1}: ${container.offsetWidth}x${container.offsetHeight}px`);
        });
        
        return adjustedCount;
    }
    
    // 清理并重新应用样式
    function forceHeightAdjustment() {
        console.log('🔨 强制执行高度调整...');
        
        // 1. 创建高优先级样式
        createHeightAdjustmentStyles();
        
        // 2. 直接修改元素样式
        const adjustedCount = applyDirectHeightAdjustment();
        
        // 3. 延迟再次检查和调整
        setTimeout(() => {
            const secondPassCount = applyDirectHeightAdjustment();
            console.log(`🔄 第二轮调整完成，共调整 ${secondPassCount} 个元素`);
        }, 500);
        
        // 4. 更长时间后最终检查
        setTimeout(() => {
            const finalCount = applyDirectHeightAdjustment();
            console.log(`🏁 最终调整完成，共调整 ${finalCount} 个元素`);
        }, 2000);
        
        return adjustedCount;
    }
    
    // 监控DOM变化并自动调整新元素
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let needsAdjustment = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查直接添加的图片容器
                            if (node.classList && node.classList.contains('task-gallery-img')) {
                                needsAdjustment = true;
                            }
                            // 检查子元素中的图片容器
                            const imgElements = node.querySelectorAll && node.querySelectorAll('.task-gallery-img');
                            if (imgElements && imgElements.length > 0) {
                                needsAdjustment = true;
                            }
                        }
                    });
                }
            });
            
            if (needsAdjustment) {
                console.log('🔍 检测到新元素，自动调整尺寸...');
                setTimeout(forceHeightAdjustment, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('🔍 高度调整监控已启动');
    }
    
    // 初始化函数
    function initialize() {
        // 确保DOM已加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                forceHeightAdjustment();
                setupMutationObserver();
            });
        } else {
            forceHeightAdjustment();
            setupMutationObserver();
        }
    }
    
    // 提供全局控制函数
    window.adjustGalleryImgHeight = function(height = '259.06px') {
        const style = document.getElementById('gallery-img-height-adjustment-override');
        if (style) {
            style.textContent = style.textContent.replace(/259\.06px/g, height);
        }
        
        // 重新应用直接样式调整
        const imgContainers = document.querySelectorAll('.task-gallery-img');
        imgContainers.forEach(container => {
            container.style.setProperty('height', height, 'important');
            container.style.setProperty('min-height', height, 'important');
            container.style.setProperty('max-height', height, 'important');
        });
        
        console.log(`🔄 图片容器高度已更新为 ${height}`);
    };
    
    window.resetGalleryImgHeight = function() {
        const imgContainers = document.querySelectorAll('.task-gallery-img');
        imgContainers.forEach(container => {
            // 恢复原始样式
            if (container.dataset.originalStyle) {
                container.setAttribute('style', container.dataset.originalStyle);
            } else {
                container.removeAttribute('style');
            }
        });
        
        // 移除自定义样式
        const customStyles = document.querySelectorAll('[id^="gallery-img-height-adjust"]');
        customStyles.forEach(style => style.remove());
        
        console.log('🔄 图片容器高度已重置');
    };
    
    // 执行初始化
    initialize();
    
    console.log('✨ 任务卡片图片容器高度调整脚本已加载');
    
})();
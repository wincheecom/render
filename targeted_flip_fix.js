/**
 * 针对性翻转功能修复脚本
 * 专门为 div#task-95-front.task-front 等现有结构添加翻转功能
 */

(function() {
    'use strict';
    
    console.log('🎯 启动针对性翻转功能修复...');
    
    // 修复函数：为现有的front元素添加完整的翻转结构
    function addFlipStructureToFrontElement(frontElement) {
        const taskId = frontElement.dataset.taskId || frontElement.id.replace('task-', '').replace('-front', '');
        
        if (!taskId) {
            console.warn('⚠️ 无法确定任务ID，跳过翻转结构添加');
            return null;
        }
        
        // 检查是否已有翻转容器
        let flipContainer = frontElement.closest('.task-flip-container');
        if (flipContainer) {
            console.log(`✅ 任务 ${taskId} 已有翻转容器`);
            return flipContainer;
        }
        
        console.log(`🔨 为任务 ${taskId} 创建翻转结构...`);
        
        // 创建翻转容器
        flipContainer = document.createElement('div');
        flipContainer.className = 'task-flip-container';
        flipContainer.dataset.taskId = taskId;
        flipContainer.style.cssText = `
            perspective: 1500px !important;
            transform-style: preserve-3d !important;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative !important;
            cursor: pointer !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 307.46px !important;
            max-width: 282.66px !important;
            max-height: 307.46px !important;
            display: block !important;
        `;
        
        // 创建背面元素
        const backElement = document.createElement('div');
        backElement.className = 'task-back';
        backElement.style.cssText = `
            backface-visibility: hidden !important;
            -webkit-backface-visibility: hidden !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            min-height: 307.46px !important;
            max-width: 282.66px !important;
            box-sizing: border-box !important;
            z-index: 1 !important;
            background-color: white !important;
            border-radius: 10px !important;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 15px !important;
            transform: rotateY(180deg) !important;
        `;
        
        // 构建背面内容
        backElement.innerHTML = `
            <div class="task-back-content">
                <div class="task-files-container">
                    <div class="task-file-item">
                        <div class="file-label">本体码</div>
                        <div class="no-file">未上传</div>
                    </div>
                    <div class="task-file-item">
                        <div class="file-label">条码</div>
                        <div class="no-file">未上传</div>
                    </div>
                    <div class="task-file-item">
                        <div class="file-label">警示码</div>
                        <div class="no-file">未上传</div>
                    </div>
                    <div class="task-file-item">
                        <div class="file-label">箱唛</div>
                        <div class="no-file">未上传</div>
                    </div>
                    <div class="task-file-item">
                        <div class="file-label">说明书</div>
                        <div class="no-file">未上传</div>
                    </div>
                    <div class="task-file-item">
                        <div class="file-label">其他</div>
                        <div class="no-file">未上传</div>
                    </div>
                </div>
                <div class="task-back-actions">
                    <div class="back-action-buttons">
                        <button class="btn btn-danger" onclick="event.preventDefault(); event.stopPropagation(); deleteTask('${taskId}');">
                            <i class="fas fa-trash me-1"></i>删除
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // 将原front元素移动到翻转容器中
        const parent = frontElement.parentNode;
        parent.replaceChild(flipContainer, frontElement);
        flipContainer.appendChild(frontElement);
        flipContainer.appendChild(backElement);
        
        // 为front元素添加必要的样式
        frontElement.style.cssText += `
            backface-visibility: hidden !important;
            -webkit-backface-visibility: hidden !important;
            position: relative !important;
            z-index: 2 !important;
        `;
        
        console.log(`✅ 任务 ${taskId} 翻转结构创建完成`);
        return flipContainer;
    }
    
    // 修复函数：批量处理所有需要翻转的front元素
    function fixAllTaskCards() {
        console.log('🔄 开始批量修复任务卡片...');
        
        // 查找所有需要翻转的front元素
        const frontElements = document.querySelectorAll('div[id^="task-"][id$="-front"].task-front');
        console.log(`🔍 找到 ${frontElements.length} 个任务正面元素`);
        
        let fixedCount = 0;
        frontElements.forEach(element => {
            try {
                const result = addFlipStructureToFrontElement(element);
                if (result) {
                    fixedCount++;
                }
            } catch (error) {
                console.error('❌ 修复单个元素时出错:', error);
            }
        });
        
        console.log(`✅ 成功修复 ${fixedCount} 个任务卡片`);
        return fixedCount;
    }
    
    // 增强翻转功能
    function enhanceFlipFunctionality() {
        console.log('⚡ 增强翻转功能...');
        
        // 确保全局翻转函数存在
        if (typeof window.toggleTaskCardFlip !== 'function') {
            window.toggleTaskCardFlip = function(taskId) {
                console.log(`🔄 执行翻转任务: ${taskId}`);
                
                let flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                
                // 如果没找到，尝试通过ID查找
                if (!flipContainer) {
                    const frontElement = document.querySelector(`#task-${taskId}-front`);
                    if (frontElement) {
                        flipContainer = frontElement.closest('.task-flip-container');
                    }
                }
                
                if (!flipContainer) {
                    console.error(`❌ 未找到任务ID为 ${taskId} 的翻转容器`);
                    // 尝试自动修复
                    const frontElement = document.querySelector(`#task-${taskId}-front`);
                    if (frontElement) {
                        console.log('🔧 尝试自动修复结构...');
                        const newContainer = addFlipStructureToFrontElement(frontElement);
                        if (newContainer) {
                            flipContainer = newContainer;
                        }
                    }
                }
                
                if (flipContainer) {
                    flipContainer.classList.toggle('flipped');
                    const isFlipped = flipContainer.classList.contains('flipped');
                    console.log(`✅ 任务 ${taskId} 翻转状态: ${isFlipped ? '背面' : '正面'}`);
                    
                    // 触发自定义事件
                    const flipEvent = new CustomEvent('taskCardFlipped', {
                        detail: {
                            taskId: taskId,
                            flipped: isFlipped,
                            element: flipContainer
                        }
                    });
                    document.dispatchEvent(flipEvent);
                }
            };
        }
        
        // 添加点击事件监听器
        function bindClickEvents() {
            document.addEventListener('click', function(e) {
                // 检查是否点击了翻转容器
                const flipContainer = e.target.closest('.task-flip-container');
                if (flipContainer && flipContainer.dataset.taskId) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.toggleTaskCardFlip(flipContainer.dataset.taskId);
                }
                
                // 检查是否点击了删除按钮
                const deleteButton = e.target.closest('.btn-danger');
                if (deleteButton && deleteButton.onclick) {
                    // 让原有的删除逻辑处理
                    return;
                }
            });
        }
        
        bindClickEvents();
        console.log('✅ 点击事件监听器已绑定');
    }
    
    // 添加必要的CSS样式
    function addFlipStyles() {
        console.log('🎨 添加翻转样式...');
        
        const style = document.createElement('style');
        style.id = 'targeted-flip-styles';
        style.textContent = `
            /* 翻转状态样式 */
            .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
            
            /* 文件预览样式 */
            .task-files-container {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px !important;
                width: 100% !important;
                margin-bottom: 15px !important;
            }
            
            .task-file-item {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                gap: 6px !important;
                padding: 8px !important;
                border: 1px solid #e9ecef !important;
                border-radius: 6px !important;
                background-color: #f8f9fa !important;
                text-align: center !important;
            }
            
            .file-label {
                font-size: 0.8rem !important;
                font-weight: 600 !important;
                color: #495057 !important;
                margin-bottom: 4px !important;
            }
            
            .no-file {
                font-size: 0.8rem !important;
                color: #6c757d !important;
                font-style: italic !important;
            }
            
            .task-back-actions {
                width: 100% !important;
                display: flex !important;
                justify-content: center !important;
                margin-top: auto !important;
                padding-top: 15px !important;
                border-top: 1px solid #e9ecef !important;
            }
            
            .back-action-buttons {
                display: flex !important;
                gap: 10px !important;
            }
            
            .btn-danger {
                background-color: #dc3545 !important;
                border-color: #dc3545 !important;
                color: white !important;
                padding: 8px 16px !important;
                font-size: 0.85rem !important;
                border-radius: 4px !important;
                transition: all 0.2s ease !important;
                cursor: pointer !important;
            }
            
            .btn-danger:hover {
                background-color: #c82333 !important;
                border-color: #bd2130 !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3) !important;
            }
            
            /* 悬停效果 */
            .task-flip-container:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1) !important;
            }
            
            .task-flip-container.flipped:hover {
                transform: translateY(-3px) rotateY(180deg) !important;
            }
        `;
        
        // 移除旧样式
        const existingStyle = document.getElementById('targeted-flip-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
        console.log('✅ 翻转样式已添加');
    }
    
    // 删除任务函数
    window.deleteTask = function(taskId) {
        if (confirm(`确定要删除任务 ${taskId} 吗？`)) {
            console.log(`🗑️ 删除任务: ${taskId}`);
            // 这里可以添加实际的删除逻辑
            const container = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
            if (container) {
                container.style.opacity = '0';
                container.style.transform = 'scale(0.8)';
                setTimeout(() => container.remove(), 300);
            }
        }
    };
    
    // 主初始化函数
    function initializeTargetedFix() {
        console.log('🚀 开始针对性翻转修复初始化...');
        
        // 添加样式
        addFlipStyles();
        
        // 修复现有结构
        const fixedCount = fixAllTaskCards();
        
        // 增强功能
        enhanceFlipFunctionality();
        
        // 设置定时检查，处理动态加载的内容
        setInterval(() => {
            const newFrontElements = document.querySelectorAll('div[id^="task-"][id$="-front"].task-front:not([data-flip-processed])');
            if (newFrontElements.length > 0) {
                console.log(`🔍 发现 ${newFrontElements.length} 个新任务元素，正在处理...`);
                newFrontElements.forEach(el => {
                    el.setAttribute('data-flip-processed', 'true');
                    addFlipStructureToFrontElement(el);
                });
            }
        }, 1000);
        
        console.log('🎉 针对性翻转修复完成！');
        console.log(`💡 已修复 ${fixedCount} 个任务卡片`);
        console.log('💡 点击任务卡片可翻转查看背面文件信息和删除按钮');
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTargetedFix);
    } else {
        initializeTargetedFix();
    }
    
})();
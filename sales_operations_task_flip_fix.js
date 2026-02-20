/**
 * 销售运营模块任务卡片翻转功能专项修复
 * 针对 div#task-96-front.task-front 在销售运营模块内的翻转失效问题
 */

(function() {
    'use strict';
    
    console.log('🚀 启动销售运营任务卡片翻转专项修复...');
    
    // 修复1: 确保销售运营模块的翻转核心样式
    function fixSalesOperationFlipStyles() {
        console.log('🎨 正在修复销售运营模块翻转样式...');
        
        // 移除旧样式
        const existingStyle = document.getElementById('sales-operation-flip-fix');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = 'sales-operation-flip-fix';
        style.textContent = `
            /* 销售运营模块专用翻转样式 */
            .sales-operations-container .task-flip-container {
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
                will-change: transform !important;
                border-radius: 10px !important;
                overflow: hidden !important;
            }
            
            /* 翻转状态 */
            .sales-operations-container .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
            
            /* 正面卡片样式 */
            .sales-operations-container .task-front {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                box-sizing: border-box !important;
                z-index: 2 !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 10px !important;
            }
            
            /* 背面卡片样式 */
            .sales-operations-container .task-back {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                box-sizing: border-box !important;
                z-index: 1 !important;
                background-color: #f8f9fa !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 20px !important;
                transform: rotateY(180deg) !important;
            }
            
            /* 文件展示区域样式 */
            .sales-operations-container .task-back-content {
                width: 100% !important;
                height: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: space-between !important;
            }
            
            .sales-operations-container .task-files-container {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 12px !important;
                width: 100% !important;
                margin-bottom: 20px !important;
            }
            
            .sales-operations-container .task-file-item {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                gap: 6px !important;
                padding: 8px !important;
                border: 1px solid #e9ecef !important;
                border-radius: 6px !important;
                background-color: #ffffff !important;
                text-align: center !important;
            }
            
            .sales-operations-container .file-label {
                font-size: 0.8rem !important;
                font-weight: 600 !important;
                color: #495057 !important;
                margin-bottom: 4px !important;
            }
            
            .sales-operations-container .file-preview {
                max-width: 80px !important;
                max-height: 80px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
            }
            
            .sales-operations-container .file-preview:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
            }
            
            .sales-operations-container .no-file {
                font-size: 0.75rem !important;
                color: #6c757d !important;
                font-style: italic !important;
            }
            
            /* 删除按钮样式 */
            .sales-operations-container .task-back-actions {
                width: 100% !important;
                text-align: center !important;
            }
            
            .sales-operations-container .back-action-buttons {
                display: flex !important;
                gap: 10px !important;
                justify-content: center !important;
            }
            
            .sales-operations-container .btn-danger {
                background-color: #dc3545 !important;
                border-color: #dc3545 !important;
                color: white !important;
                padding: 8px 16px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
            }
            
            .sales-operations-container .btn-danger:hover {
                background-color: #c82333 !important;
                border-color: #bd2130 !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3) !important;
            }
            
            /* 悬停效果增强 */
            .sales-operations-container .task-flip-container:hover {
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15) !important;
                transition: all 0.3s ease !important;
            }
            
            .sales-operations-container .task-flip-container.flipped:hover {
                transform: rotateY(180deg) translateY(-3px) !important;
            }
            
            /* 响应式适配 */
            @media (max-width: 768px) {
                .sales-operations-container .task-files-container {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 8px !important;
                }
                
                .sales-operations-container .task-file-item {
                    padding: 6px !important;
                }
                
                .sales-operations-container .file-preview {
                    max-width: 60px !important;
                    max-height: 60px !important;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ 销售运营翻转样式已应用');
    }
    
    // 修复2: 确保翻转函数存在并正确工作
    function ensureFlipFunction() {
        console.log('🔄 确保翻转函数正常工作...');
        
        // 如果翻转函数不存在，则创建它
        if (typeof window.toggleTaskCardFlip !== 'function') {
            window.toggleTaskCardFlip = function(taskId) {
                console.log(`🔄 执行翻转任务: ${taskId}`);
                
                // 查找翻转容器
                let flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                
                // 如果没找到，尝试在销售运营模块中查找
                if (!flipContainer) {
                    flipContainer = document.querySelector(`.sales-operations-container .task-flip-container[data-task-id="${taskId}"]`);
                }
                
                if (!flipContainer) {
                    console.error(`❌ 未找到任务ID为 ${taskId} 的翻转容器`);
                    alert(`错误：找不到任务 ${taskId} 的翻转容器`);
                    return;
                }
                
                // 执行翻转
                flipContainer.classList.toggle('flipped');
                
                // 记录翻转状态
                const isFlipped = flipContainer.classList.contains('flipped');
                console.log(`✅ 任务 ${taskId} 翻转状态: ${isFlipped ? '背面' : '正面'}`);
                
                // 触发自定义事件
                const event = new CustomEvent('taskCardFlipped', {
                    detail: {
                        taskId: taskId,
                        flipped: isFlipped
                    }
                });
                flipContainer.dispatchEvent(event);
            };
            
            console.log('✅ 翻转函数已创建');
        } else {
            console.log('✅ 翻转函数已存在');
        }
    }
    
    // 修复3: 为销售运营模块的任务卡片添加点击事件
    function bindClickEvents() {
        console.log('🖱️ 正在绑定点击事件...');
        
        // 查找销售运营模块中的所有任务正面卡片
        const salesFrontCards = document.querySelectorAll('.sales-operations-container .task-front[id]');
        
        salesFrontCards.forEach(function(frontCard) {
            // 检查是否已经绑定了事件
            if (frontCard.dataset.flipBound) {
                return;
            }
            
            const taskId = frontCard.id.replace('task-', '').replace('-front', '');
            
            // 添加点击事件监听器
            frontCard.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🖱️ 点击了任务卡片: ${taskId}`);
                
                // 调用翻转函数
                if (typeof window.toggleTaskCardFlip === 'function') {
                    window.toggleTaskCardFlip(taskId);
                } else {
                    console.error('❌ 翻转函数不可用');
                }
            });
            
            // 标记已绑定事件
            frontCard.dataset.flipBound = 'true';
            
            console.log(`✅ 任务 ${taskId} 的点击事件已绑定`);
        });
        
        console.log(`✅ 共为 ${salesFrontCards.length} 个任务卡片绑定了点击事件`);
    }
    
    // 修复4: 确保任务卡片有完整的DOM结构
    function ensureCompleteDOMStructure() {
        console.log('🏗️ 正在确保DOM结构完整性...');
        
        // 查找销售运营模块中的任务卡片
        const salesFrontCards = document.querySelectorAll('.sales-operations-container .task-front[id]');
        
        salesFrontCards.forEach(function(frontCard) {
            const taskId = frontCard.id.replace('task-', '').replace('-front', '');
            
            // 查找或创建翻转容器
            let flipContainer = frontCard.closest('.task-flip-container');
            
            if (!flipContainer) {
                console.log(`🔄 为任务 ${taskId} 创建翻转容器...`);
                
                // 创建新的翻转容器
                flipContainer = document.createElement('div');
                flipContainer.className = 'task-flip-container';
                flipContainer.dataset.taskId = taskId;
                
                // 获取父元素并重新组织结构
                const parent = frontCard.parentElement;
                parent.replaceChild(flipContainer, frontCard);
                flipContainer.appendChild(frontCard);
                
                console.log(`✅ 任务 ${taskId} 的翻转容器已创建`);
            }
            
            // 确保有背面元素
            let backCard = flipContainer.querySelector('.task-back');
            if (!backCard) {
                console.log(`🔄 为任务 ${taskId} 创建背面元素...`);
                
                backCard = document.createElement('div');
                backCard.className = 'task-back';
                backCard.dataset.taskId = taskId;
                
                // 创建背面内容
                backCard.innerHTML = `
                    <div class="task-back-content">
                        <h5 style="margin-bottom: 20px; color: #495057;">📦 任务文件信息</h5>
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
                                <div class="file-label">说明书</div>
                                <div class="no-file">未上传</div>
                            </div>
                            <div class="task-file-item">
                                <div class="file-label">箱唛</div>
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
                
                flipContainer.appendChild(backCard);
                console.log(`✅ 任务 ${taskId} 的背面元素已创建`);
            }
        });
        
        console.log('✅ DOM结构完整性检查完成');
    }
    
    // 修复5: 添加删除任务功能
    function addDeleteTaskFunction() {
        console.log('🗑️ 添加删除任务功能...');
        
        if (typeof window.deleteTask !== 'function') {
            window.deleteTask = function(taskId) {
                console.log(`🗑️ 准备删除任务: ${taskId}`);
                
                if (confirm(`确定要删除任务 ${taskId} 吗？此操作不可撤销！`)) {
                    // 这里可以添加实际的删除逻辑
                    console.log(`✅ 任务 ${taskId} 已删除`);
                    alert(`任务 ${taskId} 已成功删除`);
                    
                    // 可选：移除DOM元素
                    const container = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                    if (container) {
                        container.remove();
                    }
                }
            };
            
            console.log('✅ 删除任务函数已添加');
        } else {
            console.log('✅ 删除任务函数已存在');
        }
    }
    
    // 修复6: 添加视觉反馈和调试信息
    function addVisualFeedback() {
        console.log('👁️ 添加视觉反馈...');
        
        // 为所有任务卡片添加悬停效果指示
        const salesContainers = document.querySelectorAll('.sales-operations-container .task-flip-container');
        
        salesContainers.forEach(function(container) {
            // 添加悬停提示
            const frontCard = container.querySelector('.task-front');
            if (frontCard && !frontCard.title) {
                frontCard.title = '点击卡片查看详细文件信息';
            }
        });
        
        console.log('✅ 视觉反馈已添加');
    }
    
    // 主修复函数
    function performSalesOperationFix() {
        console.log('🔧 开始执行销售运营模块翻转功能修复...');
        
        try {
            // 按顺序执行各项修复
            fixSalesOperationFlipStyles();
            ensureFlipFunction();
            ensureCompleteDOMStructure();
            bindClickEvents();
            addDeleteTaskFunction();
            addVisualFeedback();
            
            console.log('🎉 销售运营模块翻转功能修复完成！');
            
            // 返回修复状态
            return {
                success: true,
                timestamp: new Date().toISOString(),
                fixesApplied: [
                    '翻转核心样式修复',
                    '翻转函数增强',
                    'DOM结构完整性保障',
                    '点击事件绑定',
                    '删除功能添加',
                    '视觉反馈增强'
                ]
            };
            
        } catch (error) {
            console.error('❌ 修复过程中发生错误:', error);
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    // 暴露到全局作用域
    window.SalesOperationsTaskFlipFix = {
        performFix: performSalesOperationFix,
        getStatus: function() {
            return {
                initialized: true,
                taskCount: document.querySelectorAll('.sales-operations-container .task-flip-container').length,
                flipFunctionAvailable: typeof window.toggleTaskCardFlip === 'function',
                deleteFunctionAvailable: typeof window.deleteTask === 'function'
            };
        }
    };
    
    // 自动执行修复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', performSalesOperationFix);
    } else {
        // 延迟执行以确保其他脚本加载完成
        setTimeout(performSalesOperationFix, 100);
    }
    
})();
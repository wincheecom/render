/**
 * 销售运营模块任务卡片紧急翻转修复
 * 针对 task-96-front 的具体问题进行精准修复
 */

(function() {
    'use strict';
    
    console.log('🚨 启动销售运营任务卡片紧急翻转修复...');
    
    // 等待DOM完全加载
    function waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }
    
    // 核心修复函数
    async function emergencyFlipFix() {
        await waitForDOM();
        
        console.log('🔍 开始紧急翻转修复...');
        
        // 修复1: 强制重置task-front的关键样式
        function resetTaskFrontStyles() {
            const taskFront = document.querySelector('#task-96-front.task-front');
            if (!taskFront) {
                console.warn('❌ 未找到 #task-96-front.task-front 元素');
                return false;
            }
            
            console.log('🔧 重置 task-front 样式...');
            
            // 移除所有强制的 !important 样式
            taskFront.style.cssText = '';
            
            // 重新设置正确的3D翻转样式
            taskFront.style.position = 'absolute';
            taskFront.style.width = '100%';
            taskFront.style.height = '100%';
            taskFront.style.backfaceVisibility = 'hidden';
            taskFront.style.webkitBackfaceVisibility = 'hidden';
            taskFront.style.zIndex = '2';
            taskFront.style.transform = 'rotateY(0deg)';
            taskFront.style.backgroundColor = 'white';
            taskFront.style.borderRadius = '10px';
            taskFront.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.08)';
            
            return true;
        }
        
        // 修复2: 确保翻转容器样式正确
        function fixFlipContainer() {
            const flipContainer = document.querySelector('.task-flip-container[data-task-id="96"]');
            if (!flipContainer) {
                console.warn('❌ 未找到翻转容器');
                return false;
            }
            
            console.log('🔧 修复翻转容器样式...');
            
            // 清理容器样式
            flipContainer.style.cssText = '';
            
            // 设置正确的3D翻转容器样式
            flipContainer.style.perspective = '1500px';
            flipContainer.style.webkitPerspective = '1500px';
            flipContainer.style.transformStyle = 'preserve-3d';
            flipContainer.style.webkitTransformStyle = 'preserve-3d';
            flipContainer.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            flipContainer.style.position = 'relative';
            flipContainer.style.cursor = 'pointer';
            flipContainer.style.width = '100%';
            flipContainer.style.height = '100%';
            flipContainer.style.minHeight = '307.46px';
            flipContainer.style.maxWidth = '282.66px';
            flipContainer.style.maxHeight = '307.46px';
            flipContainer.style.display = 'block';
            flipContainer.style.willChange = 'transform';
            flipContainer.style.borderRadius = '10px';
            flipContainer.style.overflow = 'hidden';
            
            return true;
        }
        
        // 修复3: 确保翻转函数存在且正确
        function ensureFlipFunction() {
            window.toggleTaskCardFlip = function(taskId) {
                console.log(`🔄 触发翻转: taskId=${taskId}`);
                
                let flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                if (!flipContainer) {
                    flipContainer = document.querySelector(`.sales-operations-container .task-flip-container[data-task-id="${taskId}"]`);
                }
                
                if (flipContainer) {
                    flipContainer.classList.toggle('flipped');
                    console.log('✅ 翻转状态切换:', flipContainer.classList.contains('flipped'));
                    
                    // 调试信息
                    const front = flipContainer.querySelector('.task-front');
                    const back = flipContainer.querySelector('.task-back');
                    console.log(' fronts:', !!front, ' backs:', !!back);
                } else {
                    console.error('❌ 未找到翻转容器');
                }
            };
            
            console.log('✅ 翻转函数已确保存在');
        }
        
        // 修复4: 重建背面结构（如果不存在）
        function rebuildBackStructure() {
            const flipContainer = document.querySelector('.task-flip-container[data-task-id="96"]');
            if (!flipContainer) return false;
            
            let taskBack = flipContainer.querySelector('.task-back');
            if (!taskBack) {
                console.log('🔧 重建背面结构...');
                
                taskBack = document.createElement('div');
                taskBack.className = 'task-back';
                taskBack.setAttribute('data-task-id', '96');
                taskBack.innerHTML = `
                    <div class="task-back-header d-flex justify-content-between align-items-center mb-3">
                        <h6 class="mb-0">任务详情</h6>
                        <button class="btn btn-sm btn-outline-secondary" onclick="toggleTaskCardFlip(96)">
                            <i class="fas fa-arrow-left"></i> 返回
                        </button>
                    </div>
                    <div class="task-back-content">
                        <div class="file-preview-section">
                            <h6 class="mb-2">本体码</h6>
                            <div class="file-list mb-3" id="entity-code-files-96"></div>
                            
                            <h6 class="mb-2">条码</h6>
                            <div class="file-list mb-3" id="barcode-files-96"></div>
                            
                            <h6 class="mb-2">警示码</h6>
                            <div class="file-list mb-3" id="warning-code-files-96"></div>
                            
                            <h6 class="mb-2">说明书</h6>
                            <div class="file-list mb-3" id="manual-files-96"></div>
                            
                            <h6 class="mb-2">箱唛</h6>
                            <div class="file-list mb-3" id="carton-label-files-96"></div>
                            
                            <h6 class="mb-2">其他文件</h6>
                            <div class="file-list mb-3" id="other-files-96"></div>
                        </div>
                        <div class="task-back-footer mt-3 pt-3 border-top">
                            <button class="btn btn-danger btn-sm w-100" onclick="deleteTask(96)">
                                <i class="fas fa-trash"></i> 删除任务
                            </button>
                        </div>
                    </div>
                `;
                
                flipContainer.appendChild(taskBack);
                console.log('✅ 背面结构已重建');
            }
            
            // 确保背面样式正确
            taskBack.style.position = 'absolute';
            taskBack.style.width = '100%';
            taskBack.style.height = '100%';
            taskBack.style.backfaceVisibility = 'hidden';
            taskBack.style.webkitBackfaceVisibility = 'hidden';
            taskBack.style.transform = 'rotateY(180deg)';
            taskBack.style.zIndex = '1';
            taskBack.style.backgroundColor = 'white';
            taskBack.style.borderRadius = '10px';
            taskBack.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.08)';
            taskBack.style.padding = '15px';
            taskBack.style.boxSizing = 'border-box';
            
            return true;
        }
        
        // 修复5: 绑定点击事件
        function bindClickEvents() {
            const taskFront = document.querySelector('#task-96-front.task-front');
            if (!taskFront) return false;
            
            // 移除可能存在的旧事件监听器
            const clone = taskFront.cloneNode(true);
            taskFront.parentNode.replaceChild(clone, taskFront);
            
            // 添加新的点击事件
            clone.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ 点击事件触发');
                window.toggleTaskCardFlip(96);
            });
            
            // 添加悬停效果
            clone.style.cursor = 'pointer';
            clone.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            clone.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            console.log('✅ 点击事件已绑定');
            return true;
        }
        
        // 执行所有修复步骤
        try {
            const step1 = resetTaskFrontStyles();
            const step2 = fixFlipContainer();
            ensureFlipFunction();
            const step4 = rebuildBackStructure();
            const step5 = bindClickEvents();
            
            if (step1 && step2 && step4 && step5) {
                console.log('🎉 紧急翻转修复完成！');
                
                // 测试翻转功能
                setTimeout(() => {
                    console.log('🧪 测试翻转功能...');
                    window.toggleTaskCardFlip(96);
                    
                    setTimeout(() => {
                        window.toggleTaskCardFlip(96);
                        console.log('✅ 翻转功能测试完成');
                    }, 1000);
                }, 1000);
                
                return true;
            } else {
                console.error('❌ 修复步骤失败');
                return false;
            }
        } catch (error) {
            console.error('❌ 修复过程中出现错误:', error);
            return false;
        }
    }
    
    // 启动修复
    emergencyFlipFix();
    
})();
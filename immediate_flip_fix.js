/**
 * 立即修复任务卡片翻转功能
 * 针对 div#task-96-front.task-front 元素的紧急修复方案
 */

(function() {
    'use strict';
    
    console.log('🚀 启动立即翻转功能修复...');
    
    // 修复1: 添加必要的CSS样式
    function addFlipStyles() {
        console.log('🎨 添加翻转所需CSS样式...');
        
        const styles = `
            /* 立即翻转修复样式 */
            .task-flip-container {
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
            }
            
            .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
            
            .task-front, .task-back {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                box-sizing: border-box !important;
            }
            
            .task-front {
                z-index: 2 !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
            }
            
            .task-back {
                transform: rotateY(180deg) !important;
                z-index: 1 !important;
                background-color: #f8f9fa !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
            }
            
            /* 确保任务卡片网格布局正确 */
            .published-tasks-gallery {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(282.66px, 1fr)) !important;
                gap: 15px !important;
                margin-top: 15px !important;
                align-content: start !important;
                justify-content: stretch !important;
                width: 100% !important;
                grid-auto-rows: minmax(307.46px, auto) !important;
            }
            
            /* 点击效果增强 */
            .task-flip-container:hover {
                transform: translateY(-5px) !important;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
            }
            
            .task-flip-container.flipped:hover {
                transform: translateY(-5px) rotateY(180deg) !important;
            }
        `;
        
        // 移除旧样式
        const existingStyle = document.getElementById('immediate-flip-fix-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // 添加新样式
        const styleSheet = document.createElement('style');
        styleSheet.id = 'immediate-flip-fix-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        console.log('✅ 翻转样式已添加');
    }
    
    // 修复2: 为目标任务卡片添加翻转结构
    function fixTask96Structure() {
        console.log('🔧 修复任务#96的翻转结构...');
        
        const taskFront = document.querySelector('#task-96-front.task-front');
        if (!taskFront) {
            console.error('❌ 未找到任务#96的front元素');
            return false;
        }
        
        // 检查是否已经有翻转容器
        let flipContainer = taskFront.closest('.task-flip-container');
        
        if (!flipContainer) {
            console.log('🏗️ 为任务#96创建翻转容器...');
            
            // 创建翻转容器
            flipContainer = document.createElement('div');
            flipContainer.className = 'task-flip-container';
            flipContainer.dataset.taskId = '96';
            
            // 获取父元素并重新组织结构
            const parent = taskFront.parentElement;
            const taskData = {
                name: taskFront.querySelector('.task-gallery-name')?.textContent || '立体拼图交通',
                qty: taskFront.querySelector('.task-gallery-qty')?.textContent || '数量: 1',
                creator: taskFront.querySelector('.task-gallery-creator')?.textContent || '创建人: 管理员',
                status: taskFront.querySelector('.badge')?.textContent || '待发'
            };
            
            // 替换原有结构
            parent.replaceChild(flipContainer, taskFront);
            
            // 重新添加front元素
            flipContainer.appendChild(taskFront);
            
            // 创建back元素
            const taskBack = document.createElement('div');
            taskBack.className = 'task-back';
            taskBack.innerHTML = `
                <div style="padding: 20px; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <h5 style="margin-bottom: 15px; color: #495057;">📦 任务文件清单</h5>
                        <div class="task-files-container" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                            <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <i class="fas fa-barcode fa-2x mb-2" style="color: #0d6efd;"></i>
                                <div style="font-size: 12px; font-weight: bold;">本体码</div>
                                <div style="font-size: 11px; color: #6c757d;">主产品标识</div>
                            </div>
                            <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <i class="fas fa-qrcode fa-2x mb-2" style="color: #198754;"></i>
                                <div style="font-size: 12px; font-weight: bold;">条码</div>
                                <div style="font-size: 11px; color: #6c757d;">物流追踪码</div>
                            </div>
                            <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <i class="fas fa-exclamation-triangle fa-2x mb-2" style="color: #ffc107;"></i>
                                <div style="font-size: 12px; font-weight: bold;">警示码</div>
                                <div style="font-size: 11px; color: #6c757d;">安全提醒</div>
                            </div>
                            <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <i class="fas fa-box-open fa-2x mb-2" style="color: #dc3545;"></i>
                                <div style="font-size: 12px; font-weight: bold;">箱唛</div>
                                <div style="font-size: 11px; color: #6c757d;">包装标识</div>
                            </div>
                        </div>
                        <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <i class="fas fa-book fa-2x mb-2" style="color: #6f42c1;"></i>
                            <div style="font-size: 12px; font-weight: bold;">说明书</div>
                            <div style="font-size: 11px; color: #6c757d;">产品使用指南</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button class="btn btn-outline-secondary btn-sm" onclick="window.toggleTaskCardFlip('96')" style="flex: 1;">
                            <i class="fas fa-arrow-left me-1"></i>返回
                        </button>
                        <button class="btn btn-success btn-sm" style="flex: 1;">
                            <i class="fas fa-paper-plane me-1"></i>确认发货
                        </button>
                    </div>
                </div>
            `;
            
            flipContainer.appendChild(taskBack);
            
            console.log('✅ 任务#96翻转结构创建完成');
        } else {
            console.log('✅ 任务#96已有翻转结构');
        }
        
        return true;
    }
    
    // 修复3: 确保翻转功能函数存在
    function ensureFlipFunction() {
        console.log('⚡ 确保翻转功能函数存在...');
        
        // 创建或覆盖翻转函数
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🔄 执行翻转 - 任务ID: ${taskId}`);
            
            try {
                const flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                if (!flipContainer) {
                    console.error(`❌ 未找到任务容器: ${taskId}`);
                    return;
                }
                
                // 切换翻转状态
                flipContainer.classList.toggle('flipped');
                const isFlipped = flipContainer.classList.contains('flipped');
                
                console.log(`✅ 任务 ${taskId} 翻转状态: ${isFlipped ? '背面' : '正面'}`);
                
                // 更新按钮文本（如果存在）
                const flipButton = flipContainer.querySelector('[data-action="flip"]');
                if (flipButton) {
                    flipButton.innerHTML = isFlipped ? 
                        '<i class="fas fa-arrow-left me-1"></i>返回正面' : 
                        '<i class="fas fa-info-circle me-1"></i>查看详情';
                }
                
                // 触发自定义事件
                const event = new CustomEvent('taskCardFlipped', {
                    detail: { taskId, flipped: isFlipped }
                });
                document.dispatchEvent(event);
                
            } catch (error) {
                console.error('❌ 翻转执行出错:', error);
            }
        };
        
        console.log('✅ 翻转函数已就绪');
    }
    
    // 修复4: 添加直接点击事件监听
    function addClickListeners() {
        console.log('🖱️ 添加点击事件监听器...');
        
        // 为所有翻转容器添加点击事件
        const containers = document.querySelectorAll('.task-flip-container');
        containers.forEach(container => {
            // 移除可能存在的旧监听器
            const clone = container.cloneNode(true);
            container.parentNode.replaceChild(clone, container);
            
            // 添加新的点击事件
            clone.addEventListener('click', function(e) {
                // 阻止按钮区域的点击事件
                if (e.target.closest('button')) {
                    return;
                }
                
                e.preventDefault();
                e.stopPropagation();
                
                const taskId = this.dataset.taskId;
                if (taskId && typeof window.toggleTaskCardFlip === 'function') {
                    window.toggleTaskCardFlip(taskId);
                }
            });
        });
        
        console.log(`✅ 为 ${containers.length} 个容器添加了点击监听`);
    }
    
    // 修复5: 验证修复结果
    function verifyFix() {
        console.log('🔍 验证修复结果...');
        
        const task96Container = document.querySelector('.task-flip-container[data-task-id="96"]');
        const hasFlipFunction = typeof window.toggleTaskCardFlip === 'function';
        const hasStyles = !!document.getElementById('immediate-flip-fix-styles');
        
        console.log('📊 验证结果:');
        console.log(`   - 任务#96翻转容器: ${task96Container ? '✅ 存在' : '❌ 缺失'}`);
        console.log(`   - 翻转函数: ${hasFlipFunction ? '✅ 可用' : '❌ 不可用'}`);
        console.log(`   - 样式表: ${hasStyles ? '✅ 已加载' : '❌ 未加载'}`);
        
        if (task96Container && hasFlipFunction && hasStyles) {
            console.log('🎉 修复验证通过！可以尝试点击任务卡片进行翻转测试');
            return true;
        } else {
            console.log('⚠️ 修复不完整，请检查上述缺失项');
            return false;
        }
    }
    
    // 主执行函数
    function executeImmediateFix() {
        console.log('⚡ 执行立即翻转修复...');
        
        try {
            // 按顺序执行修复步骤
            addFlipStyles();
            const structureFixed = fixTask96Structure();
            ensureFlipFunction();
            addClickListeners();
            const verificationPassed = verifyFix();
            
            if (structureFixed && verificationPassed) {
                console.log('✅ 立即翻转修复完成！');
                console.log('💡 现在可以点击任务卡片进行翻转测试');
                
                // 显示成功提示
                if (typeof alertify !== 'undefined') {
                    alertify.success('任务卡片翻转功能已修复！');
                } else {
                    console.log('ℹ️ 提示: 任务卡片翻转功能已修复完成');
                }
            } else {
                console.error('❌ 修复过程中出现问题');
            }
            
        } catch (error) {
            console.error('❌ 修复执行出错:', error);
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeImmediateFix);
    } else {
        // 延迟执行确保所有资源加载完成
        setTimeout(executeImmediateFix, 1000);
    }
    
    // 暴露到全局供手动调用
    window.executeImmediateFlipFix = executeImmediateFix;
    window.testTask96Flip = function() {
        if (typeof window.toggleTaskCardFlip === 'function') {
            window.toggleTaskCardFlip('96');
            console.log('🔄 已触发任务#96翻转测试');
        } else {
            console.error('❌ 翻转函数不可用');
        }
    };
    
    console.log('🚀 立即翻转修复脚本已加载');
    console.log('💡 可在控制台执行: executeImmediateFlipFix() 或 testTask96Flip()');
    
})();
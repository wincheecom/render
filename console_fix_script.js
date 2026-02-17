/**
 * 控制台直接执行的销售运营任务卡翻转修复脚本
 * 针对 div#task-96-front.task-front 元素
 */

(function() {
    'use strict';
    
    console.log('🚀 开始执行销售运营任务卡翻转紧急修复...');
    
    // 步骤1: 定位并清理冲突样式
    function step1CleanStyles() {
        console.log('🧹 步骤1: 清理冲突的CSS样式');
        
        const task96Front = document.querySelector('#task-96-front.task-front');
        if (!task96Front) {
            console.error('❌ 未找到 #task-96-front.task-front 元素');
            return false;
        }
        
        // 保存原始样式
        const originalStyle = task96Front.getAttribute('style') || '';
        task96Front.setAttribute('data-original-style', originalStyle);
        console.log('💾 已保存原始样式:', originalStyle.substring(0, 100) + '...');
        
        // 清除所有内联样式
        task96Front.removeAttribute('style');
        console.log('✅ 冲突样式已清除');
        
        return true;
    }
    
    // 步骤2: 重建翻转结构
    function step2RebuildStructure() {
        console.log('🏗️  步骤2: 重建翻转结构');
        
        const task96Front = document.querySelector('#task-96-front.task-front');
        if (!task96Front) return false;
        
        const flipContainer = task96Front.closest('.task-flip-container');
        if (!flipContainer) {
            console.error('❌ 未找到翻转容器');
            return false;
        }
        
        // 确保容器属性正确
        flipContainer.setAttribute('data-task-id', '96');
        
        // 检查并创建背面元素
        let taskBack = flipContainer.querySelector('.task-back[data-task-id="96"]');
        if (!taskBack) {
            taskBack = document.createElement('div');
            taskBack.className = 'task-back';
            taskBack.setAttribute('data-task-id', '96');
            taskBack.innerHTML = `
                <div class="task-back-content" style="padding: 15px; height: 100%; display: flex; flex-direction: column;">
                    <h5 style="margin: 0 0 15px 0;">任务详情</h5>
                    <div class="task-files-preview" style="flex: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 15px 0;">
                        <div class="file-item" style="display: flex; align-items: center; gap: 8px; padding: 8px; background-color: #f8f9fa; border-radius: 6px; font-size: 0.85rem;">
                            <i class="fas fa-barcode"></i>
                            <span>本体码</span>
                        </div>
                        <div class="file-item" style="display: flex; align-items: center; gap: 8px; padding: 8px; background-color: #f8f9fa; border-radius: 6px; font-size: 0.85rem;">
                            <i class="fas fa-qrcode"></i>
                            <span>条码</span>
                        </div>
                        <div class="file-item" style="display: flex; align-items: center; gap: 8px; padding: 8px; background-color: #f8f9fa; border-radius: 6px; font-size: 0.85rem;">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>警示码</span>
                        </div>
                        <div class="file-item" style="display: flex; align-items: center; gap: 8px; padding: 8px; background-color: #f8f9fa; border-radius: 6px; font-size: 0.85rem;">
                            <i class="fas fa-box"></i>
                            <span>箱唛</span>
                        </div>
                        <div class="file-item" style="display: flex; align-items: center; gap: 8px; padding: 8px; background-color: #f8f9fa; border-radius: 6px; font-size: 0.85rem;">
                            <i class="fas fa-book"></i>
                            <span>说明书</span>
                        </div>
                    </div>
                    <div class="task-back-actions" style="display: flex; gap: 10px; justify-content: space-between; margin-top: auto;">
                        <button class="btn btn-outline-secondary btn-sm" onclick="toggleTaskCardFlip('96')" style="padding: 5px 10px; border: 1px solid #6c757d; background: white; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-arrow-left me-1"></i>返回
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="completeShipment('96')" style="padding: 5px 10px; background: #0d6efd; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-truck me-1"></i>确认发货
                        </button>
                    </div>
                </div>
            `;
            flipContainer.appendChild(taskBack);
            console.log('✅ 背面元素已创建');
        }
        
        return true;
    }
    
    // 步骤3: 应用正确的CSS样式
    function step3ApplyStyles() {
        console.log('🎨 步骤3: 应用正确的CSS样式');
        
        // 移除旧样式
        const oldStyles = document.getElementById('emergency-task-fix-styles');
        if (oldStyles) {
            oldStyles.remove();
        }
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'emergency-task-fix-styles';
        styleSheet.textContent = `
            /* 紧急修复样式 - 针对任务96 */
            
            /* 确保翻转容器有正确的3D属性 */
            .task-flip-container[data-task-id="96"] {
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
                transform-origin: center center !important;
            }
            
            /* 确保正面和背面元素正确设置 */
            .task-flip-container[data-task-id="96"] .task-front,
            .task-flip-container[data-task-id="96"] .task-back {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                box-sizing: border-box !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                background-color: white !important;
            }
            
            /* 正面元素样式 */
            .task-flip-container[data-task-id="96"] .task-front {
                z-index: 2 !important;
                transform: rotateY(0deg) !important;
            }
            
            /* 背面元素样式 */
            .task-flip-container[data-task-id="96"] .task-back {
                transform: rotateY(180deg) !important;
                z-index: 1 !important;
            }
            
            /* 翻转状态 */
            .task-flip-container[data-task-id="96"].flipped {
                transform: rotateY(180deg) !important;
            }
            
            .task-flip-container[data-task-id="96"].flipped .task-front {
                transform: rotateY(0deg) !important;
                z-index: 1 !important;
            }
            
            .task-flip-container[data-task-id="96"].flipped .task-back {
                transform: rotateY(180deg) !important;
                z-index: 2 !important;
            }
            
            /* 强制重置可能冲突的样式 */
            #task-96-front.task-front {
                position: static !important;
                width: auto !important;
                height: auto !important;
                margin: 0 !important;
                padding: 0 !important;
                z-index: auto !important;
                transform: none !important;
            }
        `;
        
        document.head.appendChild(styleSheet);
        console.log('✅ 正确样式已应用');
        return true;
    }
    
    // 步骤4: 确保翻转函数正常工作
    function step4EnsureFlipFunction() {
        console.log('⚡ 步骤4: 确保翻转函数正常工作');
        
        // 保存原始函数
        const originalFunction = window.toggleTaskCardFlip;
        
        // 创建或覆盖翻转函数
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🔄 翻转函数调用 - 任务ID: ${taskId}`);
            
            if (taskId !== '96') {
                // 如果不是任务96，调用原始函数
                if (originalFunction && typeof originalFunction === 'function') {
                    return originalFunction.call(this, taskId);
                }
                return;
            }
            
            try {
                const flipContainer = document.querySelector('.task-flip-container[data-task-id="96"]');
                if (!flipContainer) {
                    console.error('❌ 未找到任务96的翻转容器');
                    return;
                }
                
                // 切换翻转状态
                flipContainer.classList.toggle('flipped');
                const isFlipped = flipContainer.classList.contains('flipped');
                
                console.log(`✅ 任务96翻转状态: ${isFlipped ? '背面' : '正面'}`);
                
                // 更新按钮文本
                const flipButtons = flipContainer.querySelectorAll('button[onclick*="toggleTaskCardFlip"]');
                flipButtons.forEach(button => {
                    if (button.innerHTML.includes('查看详情') || button.innerHTML.includes('View Details')) {
                        button.innerHTML = isFlipped ? 
                            '<i class="fas fa-arrow-left me-1"></i>返回' : 
                            '<i class="fas fa-info-circle me-1"></i>查看详情';
                    }
                });
                
            } catch (error) {
                console.error('❌ 翻转函数执行出错:', error);
            }
        };
        
        console.log('✅ 翻转函数已确保');
        return true;
    }
    
    // 步骤5: 添加事件监听器
    function step5AddEventListeners() {
        console.log('👂 步骤5: 添加事件监听器');
        
        const task96Container = document.querySelector('.task-flip-container[data-task-id="96"]');
        if (task96Container) {
            // 移除现有监听器避免重复绑定
            task96Container.removeEventListener('click', window.handleTask96Click);
            
            // 创建新的监听器函数
            window.handleTask96Click = function(e) {
                // 阻止事件冒泡
                e.stopPropagation();
                
                // 如果点击的是按钮，让按钮自己处理
                if (e.target.closest('button')) {
                    return;
                }
                
                // 执行翻转
                window.toggleTaskCardFlip('96');
            };
            
            // 添加监听器
            task96Container.addEventListener('click', window.handleTask96Click, true);
            console.log('✅ 任务96点击事件已绑定');
        }
        
        return true;
    }
    
    // 步骤6: 验证修复结果
    function step6VerifyFix() {
        console.log('🔍 步骤6: 验证修复结果');
        
        const task96Container = document.querySelector('.task-flip-container[data-task-id="96"]');
        const task96Front = document.querySelector('#task-96-front.task-front');
        const hasFlipFunction = typeof window.toggleTaskCardFlip === 'function';
        const hasStyles = !!document.getElementById('emergency-task-fix-styles');
        
        console.log('📊 验证结果:');
        console.log(`   - 任务96容器: ${task96Container ? '✅ 存在' : '❌ 缺失'}`);
        console.log(`   - 任务96正面: ${task96Front ? '✅ 存在' : '❌ 缺失'}`);
        console.log(`   - 翻转函数: ${hasFlipFunction ? '✅ 可用' : '❌ 不可用'}`);
        console.log(`   - 样式表: ${hasStyles ? '✅ 已加载' : '❌ 未加载'}`);
        
        if (task96Container && task96Front && hasFlipFunction && hasStyles) {
            console.log('🎉 修复验证通过！');
            console.log('💡 现在可以点击任务卡片进行翻转测试');
            return true;
        } else {
            console.error('❌ 修复验证失败，请检查上述问题');
            return false;
        }
    }
    
    // 执行所有步骤
    function executeAllSteps() {
        console.log('🔧 开始执行所有修复步骤...');
        
        const steps = [
            { name: '清理冲突样式', func: step1CleanStyles },
            { name: '重建翻转结构', func: step2RebuildStructure },
            { name: '应用正确样式', func: step3ApplyStyles },
            { name: '确保翻转函数', func: step4EnsureFlipFunction },
            { name: '添加事件监听', func: step5AddEventListeners },
            { name: '验证修复结果', func: step6VerifyFix }
        ];
        
        let successCount = 0;
        
        steps.forEach((step, index) => {
            console.log(`\n--- 步骤 ${index + 1}/${steps.length}: ${step.name} ---`);
            try {
                const result = step.func();
                if (result) {
                    successCount++;
                    console.log(`✅ ${step.name} 完成`);
                } else {
                    console.log(`❌ ${step.name} 失败`);
                }
            } catch (error) {
                console.error(`❌ ${step.name} 执行出错:`, error);
            }
        });
        
        console.log(`\n📊 修复完成: ${successCount}/${steps.length} 步骤成功`);
        
        if (successCount === steps.length) {
            console.log('🎉 所有修复步骤已完成！任务卡片翻转功能应该恢复正常。');
            console.log('💡 请刷新页面或重新加载模块以确保修复生效');
        } else {
            console.log('⚠️  部分修复步骤失败，请检查控制台错误信息。');
        }
        
        return successCount === steps.length;
    }
    
    // 立即执行修复
    const result = executeAllSteps();
    
    // 返回结果供外部使用
    return {
        success: result,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    };
    
})();

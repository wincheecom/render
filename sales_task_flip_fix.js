/**
 * 销售运营任务卡翻转功能紧急修复
 * 针对 div#task-96-front.task-front 翻转失效问题
 */

(function() {
    'use strict';
    
    console.log('🚀 启动销售运营任务卡翻转修复...');
    
    // 修复1: 清理冲突的CSS样式
    function cleanConflictingStyles() {
        console.log('🧹 正在清理冲突的CSS样式...');
        
        const task96Front = document.querySelector('#task-96-front.task-front');
        if (!task96Front) {
            console.error('❌ 未找到 #task-96-front.task-front 元素');
            return false;
        }
        
        // 移除所有内联的 !important 样式
        const originalStyle = task96Front.getAttribute('style') || '';
        console.log('原始样式:', originalStyle);
        
        // 保存原始样式用于恢复
        task96Front.setAttribute('data-original-style', originalStyle);
        
        // 清除所有内联样式
        task96Front.removeAttribute('style');
        
        console.log('✅ 冲突样式已清理');
        return true;
    }
    
    // 修复2: 重建正确的翻转结构
    function rebuildFlipStructure() {
        console.log('🏗️  正在重建翻转结构...');
        
        const task96Front = document.querySelector('#task-96-front.task-front');
        if (!task96Front) return false;
        
        const flipContainer = task96Front.closest('.task-flip-container');
        if (!flipContainer) {
            console.error('❌ 未找到翻转容器');
            return false;
        }
        
        // 确保容器有正确的属性
        flipContainer.setAttribute('data-task-id', '96');
        
        // 检查并创建背面元素（如果不存在）
        let taskBack = flipContainer.querySelector('.task-back[data-task-id="96"]');
        if (!taskBack) {
            taskBack = document.createElement('div');
            taskBack.className = 'task-back';
            taskBack.setAttribute('data-task-id', '96');
            taskBack.innerHTML = `
                <div class="task-back-content">
                    <h5>任务详情</h5>
                    <div class="task-files-preview">
                        <div class="file-item">
                            <i class="fas fa-barcode"></i>
                            <span>本体码</span>
                        </div>
                        <div class="file-item">
                            <i class="fas fa-qrcode"></i>
                            <span>条码</span>
                        </div>
                        <div class="file-item">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>警示码</span>
                        </div>
                        <div class="file-item">
                            <i class="fas fa-box"></i>
                            <span>箱唛</span>
                        </div>
                        <div class="file-item">
                            <i class="fas fa-book"></i>
                            <span>说明书</span>
                        </div>
                    </div>
                    <div class="task-back-actions">
                        <button class="btn btn-outline-secondary btn-sm" onclick="toggleTaskCardFlip('96')">
                            <i class="fas fa-arrow-left me-1"></i>返回
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="completeShipment('96')">
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
    
    // 修复3: 重新应用正确的CSS样式
    function applyCorrectStyles() {
        console.log('🎨 正在应用正确的CSS样式...');
        
        // 移除旧的样式表（如果存在）
        const oldStyles = document.getElementById('sales-task-flip-fix-styles');
        if (oldStyles) {
            oldStyles.remove();
        }
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'sales-task-flip-fix-styles';
        styleSheet.textContent = `
            /* 销售运营任务卡翻转修复样式 */
            
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
                display: flex !important;
                flex-direction: column !important;
                padding: 15px !important;
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
            
            /* 背面内容样式 */
            .task-back-content {
                display: flex !important;
                flex-direction: column !important;
                height: 100% !important;
            }
            
            .task-files-preview {
                flex: 1 !important;
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 10px !important;
                margin: 15px 0 !important;
            }
            
            .file-item {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                padding: 8px !important;
                background-color: #f8f9fa !important;
                border-radius: 6px !important;
                font-size: 0.85rem !important;
            }
            
            .task-back-actions {
                display: flex !important;
                gap: 10px !important;
                justify-content: space-between !important;
                margin-top: auto !important;
            }
            
            /* 调试样式（可选） */
            /*
            .task-flip-container[data-task-id="96"] {
                outline: 2px solid #007bff !important;
            }
            */
        `;
        
        document.head.appendChild(styleSheet);
        console.log('✅ 正确样式已应用');
        return true;
    }
    
    // 修复4: 确保翻转函数正常工作
    function ensureFlipFunction() {
        console.log('⚡ 确保翻转函数正常工作...');
        
        // 保存原始函数（如果存在）
        const originalFunction = window.toggleTaskCardFlip;
        
        // 创建或覆盖翻转函数
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🔄 翻转函数调用 - 任务ID: ${taskId}`);
            
            if (taskId !== '96') {
                // 如果不是任务96，调用原始函数（如果存在）
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
                
                // 更新按钮文本（如果存在）
                const flipButtons = flipContainer.querySelectorAll('[onclick*="toggleTaskCardFlip"]');
                flipButtons.forEach(button => {
                    if (isFlipped) {
                        button.innerHTML = button.innerHTML.replace('查看详情', '返回').replace('View Details', 'Back');
                    } else {
                        button.innerHTML = button.innerHTML.replace('返回', '查看详情').replace('Back', 'View Details');
                    }
                });
                
            } catch (error) {
                console.error('❌ 翻转函数执行出错:', error);
            }
        };
        
        console.log('✅ 翻转函数已确保');
        return true;
    }
    
    // 修复5: 添加事件监听器
    function addEventListeners() {
        console.log('👂 正在添加事件监听器...');
        
        // 为任务96添加点击事件
        const task96Container = document.querySelector('.task-flip-container[data-task-id="96"]');
        if (task96Container) {
            // 移除现有监听器避免重复绑定
            task96Container.removeEventListener('click', handleTask96Click);
            
            // 添加新的监听器
            task96Container.addEventListener('click', handleTask96Click, true);
            console.log('✅ 任务96点击事件已绑定');
        }
        
        function handleTask96Click(e) {
            // 阻止事件冒泡到父级
            e.stopPropagation();
            
            // 如果点击的是按钮，让按钮自己处理
            if (e.target.closest('button')) {
                return;
            }
            
            // 执行翻转
            window.toggleTaskCardFlip('96');
        }
        
        return true;
    }
    
    // 修复6: 验证修复结果
    function verifyFix() {
        console.log('🔍 正在验证修复结果...');
        
        const task96Container = document.querySelector('.task-flip-container[data-task-id="96"]');
        const task96Front = document.querySelector('#task-96-front.task-front');
        const hasFlipFunction = typeof window.toggleTaskCardFlip === 'function';
        const hasStyles = !!document.getElementById('sales-task-flip-fix-styles');
        
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
    
    // 执行所有修复步骤
    function executeAllFixes() {
        console.log('🔧 开始执行所有修复步骤...');
        
        const steps = [
            { name: '清理冲突样式', func: cleanConflictingStyles },
            { name: '重建翻转结构', func: rebuildFlipStructure },
            { name: '应用正确样式', func: applyCorrectStyles },
            { name: '确保翻转函数', func: ensureFlipFunction },
            { name: '添加事件监听', func: addEventListeners },
            { name: '验证修复结果', func: verifyFix }
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
        } else {
            console.log('⚠️  部分修复步骤失败，请检查控制台错误信息。');
        }
    }
    
    // 页面加载完成后执行修复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeAllFixes);
    } else {
        // 延迟执行确保DOM完全加载
        setTimeout(executeAllFixes, 100);
    }
    
    // 暴露到全局供手动调用
    window.executeSalesTaskFlipFix = executeAllFixes;
    
    console.log('🔧 销售运营任务卡翻转修复工具已加载');
    console.log('💡 可在控制台执行 executeSalesTaskFlipFix() 手动触发修复');
    
})();
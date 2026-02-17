/**
 * 终极任务96翻转修复脚本
 * 专门解决 div#task-96-front.task-front 卡片翻转功能失效问题
 */

(function() {
    'use strict';
    
    console.log('🚀 启动终极任务96翻转修复...');
    
    // 修复1: 强制重建翻转结构
    function rebuildTask96Structure() {
        console.log('🔧 正在重建任务96翻转结构...');
        
        const task96Front = document.querySelector('#task-96-front.task-front');
        if (!task96Front) {
            console.error('❌ 未找到 #task-96-front.task-front 元素');
            return false;
        }
        
        // 查找或创建翻转容器
        let flipContainer = task96Front.closest('.task-flip-container');
        if (!flipContainer) {
            console.log('🔄 创建新的翻转容器...');
            
            // 创建翻转容器
            flipContainer = document.createElement('div');
            flipContainer.className = 'task-flip-container';
            flipContainer.setAttribute('data-task-id', '96');
            flipContainer.style.cssText = `
                width: 282.66px !important;
                height: 307.46px !important;
                position: relative !important;
                transform-style: preserve-3d !important;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                perspective: 1500px !important;
                cursor: pointer !important;
                display: block !important;
                will-change: transform !important;
                transform-origin: center center !important;
            `;
            
            // 将原元素移动到新容器中
            const parent = task96Front.parentElement;
            parent.replaceChild(flipContainer, task96Front);
            flipContainer.appendChild(task96Front);
        }
        
        // 确保正面元素有正确的样式
        task96Front.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            backface-visibility: hidden !important;
            -webkit-backface-visibility: hidden !important;
            z-index: 2 !important;
            background-color: white !important;
            border-radius: 10px !important;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 10px !important;
            box-sizing: border-box !important;
        `;
        
        // 创建背面元素（如果不存在）
        let task96Back = flipContainer.querySelector('.task-back');
        if (!task96Back) {
            console.log('🔄 创建任务96背面元素...');
            task96Back = document.createElement('div');
            task96Back.className = 'task-back';
            task96Back.setAttribute('data-task-id', '96');
            task96Back.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                transform: rotateY(180deg) !important;
                z-index: 1 !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 15px !important;
                box-sizing: border-box !important;
            `;
            
            // 添加背面内容
            task96Back.innerHTML = `
                <div style="text-align: center; width: 100%;">
                    <h5 style="margin: 0 0 15px 0; color: #333;">任务详情</h5>
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 12px; margin-bottom: 15px; text-align: left;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: #666;">任务名称:</span>
                            <strong>立体拼图交通</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: #666;">数量:</span>
                            <strong>1</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: #666;">创建人:</span>
                            <strong>管理员</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #666;">状态:</span>
                            <span class="badge badge-warning">待发</span>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;">
                        <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <i class="fas fa-barcode fa-2x mb-2" style="color: #4361ee;"></i>
                            <div style="font-size: 12px; font-weight: bold;">本体码</div>
                            <div style="font-size: 11px; color: #6c757d;">123456789</div>
                        </div>
                        <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <i class="fas fa-qrcode fa-2x mb-2" style="color: #7209b7;"></i>
                            <div style="font-size: 12px; font-weight: bold;">条码</div>
                            <div style="font-size: 11px; color: #6c757d;">987654321</div>
                        </div>
                        <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            <i class="fas fa-book fa-2x mb-2" style="color: #6f42c1;"></i>
                            <div style="font-size: 12px; font-weight: bold;">说明书</div>
                            <div style="font-size: 11px; color: #6c757d;">产品使用指南</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-outline-secondary btn-sm" onclick="window.toggleTaskCardFlip('96')" style="flex: 1;">
                            <i class="fas fa-arrow-left me-1"></i>返回
                        </button>
                        <button class="btn btn-success btn-sm" style="flex: 1;">
                            <i class="fas fa-paper-plane me-1"></i>确认发货
                        </button>
                    </div>
                </div>
            `;
            
            flipContainer.appendChild(task96Back);
        }
        
        console.log('✅ 任务96结构重建完成');
        return true;
    }
    
    // 修复2: 注入终极翻转函数
    function injectUltimateFlipFunction() {
        console.log('⚡ 注入终极翻转函数...');
        
        // 创建防抖控制
        if (!window.flipCooldownMap) {
            window.flipCooldownMap = new Map();
        }
        
        // 终极翻转函数
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🔄 终极翻转函数执行 - 任务ID: ${taskId}`);
            
            // 防抖控制
            const now = Date.now();
            const lastFlip = window.flipCooldownMap.get(taskId) || 0;
            if (now - lastFlip < 500) {
                console.log(`⏱️  任务 ${taskId} 翻转冷却中，忽略此次点击`);
                return;
            }
            window.flipCooldownMap.set(taskId, now);
            
            try {
                // 多种方式查找翻转容器
                let flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                if (!flipContainer) {
                    const frontElement = document.querySelector(`#task-${taskId}-front`);
                    if (frontElement) {
                        flipContainer = frontElement.closest('.task-flip-container');
                    }
                }
                
                if (!flipContainer) {
                    console.error(`❌ 未找到任务ID为 ${taskId} 的翻转容器`);
                    return;
                }
                
                // 强制应用必要的CSS样式
                const computedStyle = window.getComputedStyle(flipContainer);
                if (computedStyle.transformStyle !== 'preserve-3d') {
                    flipContainer.style.transformStyle = 'preserve-3d';
                    flipContainer.style.webkitTransformStyle = 'preserve-3d';
                }
                
                if (!computedStyle.perspective || computedStyle.perspective === 'none') {
                    flipContainer.style.perspective = '1500px';
                    flipContainer.style.webkitPerspective = '1500px';
                }
                
                // 切换翻转状态
                flipContainer.classList.toggle('flipped');
                const isFlipped = flipContainer.classList.contains('flipped');
                
                console.log(`✅ 任务 ${taskId} 翻转状态: ${isFlipped ? '背面' : '正面'}`);
                
                // 更新按钮文本
                const flipButtons = flipContainer.querySelectorAll('[onclick*="toggleTaskCardFlip"]');
                flipButtons.forEach(button => {
                    if (button.innerHTML.includes('查看详情') || button.innerHTML.includes('info')) {
                        button.innerHTML = isFlipped ? 
                            '<i class="fas fa-arrow-left me-1"></i>返回正面' : 
                            '<i class="fas fa-info-circle me-1"></i>查看详情';
                    }
                });
                
            } catch (error) {
                console.error(`❌ 翻转函数执行出错:`, error);
            }
        };
        
        console.log('✅ 终极翻转函数注入完成');
    }
    
    // 修复3: 应用强制CSS样式
    function applyForceStyles() {
        console.log('🎨 应用强制CSS样式...');
        
        // 移除现有的相关样式
        const existingStyles = document.getElementById('ultimate-task96-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
        
        // 创建新的强制样式
        const styleSheet = document.createElement('style');
        styleSheet.id = 'ultimate-task96-styles';
        styleSheet.textContent = `
            /* 终极任务96翻转样式 */
            .task-flip-container[data-task-id="96"] {
                width: 282.66px !important;
                height: 307.46px !important;
                position: relative !important;
                transform-style: preserve-3d !important;
                -webkit-transform-style: preserve-3d !important;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                -webkit-transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                perspective: 1500px !important;
                -webkit-perspective: 1500px !important;
                cursor: pointer !important;
                display: block !important;
                will-change: transform !important;
                transform-origin: center center !important;
                -webkit-transform-origin: center center !important;
            }
            
            .task-flip-container[data-task-id="96"].flipped {
                transform: rotateY(180deg) !important;
                -webkit-transform: rotateY(180deg) !important;
            }
            
            #task-96-front.task-front {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                z-index: 2 !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
            }
            
            .task-flip-container[data-task-id="96"] .task-back {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                transform: rotateY(180deg) !important;
                -webkit-transform: rotateY(180deg) !important;
                z-index: 1 !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
            }
            
            /* 清理冲突样式 */
            #task-96-front.task-front:not([style*="position: absolute"]) {
                position: absolute !important;
            }
            
            #task-96-front.task-front:not([style*="backface-visibility: hidden"]) {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
            }
        `;
        
        document.head.appendChild(styleSheet);
        console.log('✅ 强制CSS样式应用完成');
    }
    
    // 修复4: 添加点击事件监听器
    function addClickListeners() {
        console.log('🖱️ 添加点击事件监听器...');
        
        // 为任务96正面元素添加直接点击事件
        const task96Front = document.querySelector('#task-96-front.task-front');
        if (task96Front) {
            // 移除现有事件监听器
            const clone = task96Front.cloneNode(true);
            task96Front.parentNode.replaceChild(clone, task96Front);
            
            // 添加新的点击事件
            clone.addEventListener('click', function(e) {
                // 避免事件冒泡到子元素
                if (e.target.closest('button, a, input')) {
                    return;
                }
                
                console.log('🖱️ 任务96正面被点击，触发翻转');
                window.toggleTaskCardFlip('96');
            });
            
            console.log('✅ 点击事件监听器添加完成');
        }
    }
    
    // 修复5: 验证修复结果
    function verifyFix() {
        console.log('🔍 验证修复结果...');
        
        const task96Container = document.querySelector('.task-flip-container[data-task-id="96"]');
        const task96Front = document.querySelector('#task-96-front.task-front');
        const task96Back = task96Container?.querySelector('.task-back');
        const hasFlipFunction = typeof window.toggleTaskCardFlip === 'function';
        
        console.log('📊 验证结果:');
        console.log(`   - 翻转容器: ${task96Container ? '✅ 存在' : '❌ 缺失'}`);
        console.log(`   - 正面元素: ${task96Front ? '✅ 存在' : '❌ 缺失'}`);
        console.log(`   - 背面元素: ${task96Back ? '✅ 存在' : '❌ 缺失'}`);
        console.log(`   - 翻转函数: ${hasFlipFunction ? '✅ 存在' : '❌ 缺失'}`);
        
        if (task96Container && task96Front && task96Back && hasFlipFunction) {
            console.log('🎉 所有组件验证通过！');
            return true;
        } else {
            console.error('❌ 部分组件缺失，请检查修复过程');
            return false;
        }
    }
    
    // 执行所有修复步骤
    function executeAllFixes() {
        console.log('🚀 开始执行终极修复流程...');
        
        try {
            // 按顺序执行修复
            const structureFixed = rebuildTask96Structure();
            if (!structureFixed) {
                console.error('❌ 结构重建失败，终止修复流程');
                return;
            }
            
            injectUltimateFlipFunction();
            applyForceStyles();
            addClickListeners();
            
            // 验证结果
            setTimeout(() => {
                const isFixed = verifyFix();
                if (isFixed) {
                    console.log('🎊 终极修复完成！任务96翻转功能应该已恢复正常');
                    
                    // 提供测试方法
                    console.log('\n🧪 测试方法:');
                    console.log('1. 在控制台执行: window.toggleTaskCardFlip("96")');
                    console.log('2. 或者直接点击任务卡片正面区域');
                    console.log('3. 访问测试页面: http://localhost:3002/emergency_flip_test_demo.html');
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ 修复过程中发生错误:', error);
        }
    }
    
    // 页面加载完成后执行修复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeAllFixes);
    } else {
        executeAllFixes();
    }
    
})();
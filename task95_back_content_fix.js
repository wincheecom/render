/**
 * 任务95背面内容修复脚本
 * 为 div#task-95-front.task-front 添加完整的背面显示内容
 */

(function() {
    'use strict';
    
    console.log('🔧 启动任务95背面内容修复...');
    
    // 修复1: 为任务95添加背面元素
    function addTask95BackContent() {
        console.log('🏗️ 正在为任务95添加背面内容...');
        
        const task95Front = document.querySelector('#task-95-front.task-front');
        if (!task95Front) {
            console.error('❌ 未找到 #task-95-front.task-front 元素');
            return false;
        }
        
        // 查找翻转容器
        let flipContainer = task95Front.closest('.task-flip-container');
        if (!flipContainer) {
            console.log('🔄 未找到翻转容器，尝试创建...');
            // 如果没有翻转容器，先创建基本结构
            const parent = task95Front.parentElement;
            flipContainer = document.createElement('div');
            flipContainer.className = 'task-flip-container';
            flipContainer.setAttribute('data-task-id', '95');
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
            
            parent.replaceChild(flipContainer, task95Front);
            flipContainer.appendChild(task95Front);
        }
        
        // 检查是否已有背面元素
        let task95Back = flipContainer.querySelector('.task-back[data-task-id="95"]');
        if (task95Back) {
            console.log('✅ 任务95背面元素已存在');
            return true;
        }
        
        console.log('➕ 创建任务95背面元素...');
        
        // 创建背面元素
        task95Back = document.createElement('div');
        task95Back.className = 'task-back';
        task95Back.setAttribute('data-task-id', '95');
        task95Back.style.cssText = `
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
        
        // 构建背面内容
        task95Back.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <h5 style="margin: 0 0 15px 0; color: #333;">📦 任务文件清单</h5>
                <div style="background: #f8f9fa; border-radius: 8px; padding: 12px; margin-bottom: 15px; text-align: left;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">任务名称:</span>
                        <strong>化妆品包</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">货号:</span>
                        <strong>KABI-165</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="color: #666;">数量:</span>
                        <strong>1</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #666;">创建人:</span>
                        <strong>管理员</strong>
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
                    <button class="btn btn-outline-secondary btn-sm" onclick="window.toggleTaskCardFlip('95')" style="flex: 1;">
                        <i class="fas fa-arrow-left me-1"></i>返回
                    </button>
                    <button class="btn btn-success btn-sm" style="flex: 1;">
                        <i class="fas fa-paper-plane me-1"></i>确认发货
                    </button>
                </div>
            </div>
        `;
        
        // 添加到翻转容器
        flipContainer.appendChild(task95Back);
        console.log('✅ 任务95背面内容添加完成');
        return true;
    }
    
    // 修复2: 确保翻转功能正常
    function ensureFlipFunctionality() {
        console.log('⚡ 确保翻转功能正常...');
        
        // 检查翻转函数是否存在
        if (typeof window.toggleTaskCardFlip !== 'function') {
            console.log('🔄 创建翻转函数...');
            
            window.toggleTaskCardFlip = function(taskId) {
                console.log(`🔄 执行翻转 - 任务ID: ${taskId}`);
                
                try {
                    const flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                    if (!flipContainer) {
                        console.error(`❌ 未找到任务容器: ${taskId}`);
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
        }
        
        console.log('✅ 翻转功能已确保');
    }
    
    // 修复3: 应用必要的CSS样式
    function applyNecessaryStyles() {
        console.log('🎨 应用必要的CSS样式...');
        
        // 移除可能存在的旧样式
        const existingStyles = document.getElementById('task95-fix-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
        
        // 创建新的样式表
        const styleSheet = document.createElement('style');
        styleSheet.id = 'task95-fix-styles';
        styleSheet.textContent = `
            /* 任务95翻转修复样式 */
            .task-flip-container[data-task-id="95"] {
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
            
            .task-flip-container[data-task-id="95"].flipped {
                transform: rotateY(180deg) !important;
                -webkit-transform: rotateY(180deg) !important;
            }
            
            #task-95-front.task-front {
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
            
            .task-flip-container[data-task-id="95"] .task-back {
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
        `;
        
        document.head.appendChild(styleSheet);
        console.log('✅ CSS样式应用完成');
    }
    
    // 修复4: 验证修复结果
    function verifyFix() {
        console.log('🔍 验证修复结果...');
        
        const task95Container = document.querySelector('.task-flip-container[data-task-id="95"]');
        const task95Front = document.querySelector('#task-95-front.task-front');
        const task95Back = task95Container?.querySelector('.task-back[data-task-id="95"]');
        const hasFlipFunction = typeof window.toggleTaskCardFlip === 'function';
        
        console.log('📊 验证结果:');
        console.log(`   - 翻转容器: ${task95Container ? '✅ 存在' : '❌ 缺失'}`);
        console.log(`   - 正面元素: ${task95Front ? '✅ 存在' : '❌ 缺失'}`);
        console.log(`   - 背面元素: ${task95Back ? '✅ 存在' : '❌ 缺失'}`);
        console.log(`   - 翻转函数: ${hasFlipFunction ? '✅ 存在' : '❌ 缺失'}`);
        
        if (task95Container && task95Front && task95Back && hasFlipFunction) {
            console.log('🎉 所有组件验证通过！');
            return true;
        } else {
            console.error('❌ 部分组件缺失，请检查修复过程');
            return false;
        }
    }
    
    // 执行所有修复步骤
    function executeAllRepairs() {
        console.log('🚀 开始执行任务95背面内容修复流程...');
        
        try {
            // 按顺序执行修复
            const backAdded = addTask95BackContent();
            if (!backAdded) {
                console.error('❌ 背面内容添加失败，终止修复流程');
                return;
            }
            
            ensureFlipFunctionality();
            applyNecessaryStyles();
            
            // 验证结果
            setTimeout(() => {
                const isFixed = verifyFix();
                if (isFixed) {
                    console.log('🎊 任务95背面内容修复完成！');
                    console.log('🧪 测试方法:');
                    console.log('1. 在控制台执行: window.toggleTaskCardFlip("95")');
                    console.log('2. 或者直接点击任务卡片正面区域');
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ 修复过程中发生错误:', error);
        }
    }
    
    // 页面加载完成后执行修复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeAllRepairs);
    } else {
        executeAllRepairs();
    }
    
})();
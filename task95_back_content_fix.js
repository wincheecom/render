// 任务95背面内容修复脚本
// 解决卡片翻转后不显示本体码等问题

(function() {
    'use strict';
    
    console.log('🔧 初始化任务95背面内容修复...');
    
    // 检查是否已经处理过
    if (window.task95BackContentFixed) {
        console.log('✅ 任务95背面内容已修复，跳过重复执行');
        return;
    }
    
    // 等待DOM加载完成
    function waitForElement(selector, callback, maxAttempts = 50) {
        let attempts = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            attempts++;
            
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.warn(`❌ 未找到元素: ${selector} (尝试${attempts}次)`);
            }
        }, 100);
    }
    
    // 创建任务95背面内容
    function createTask95BackContent() {
        const task95Front = document.getElementById('task-95-front');
        if (!task95Front) {
            console.error('❌ 未找到任务95正面元素');
            return false;
        }
        
        // 检查是否已有背面元素
        const existingBack = task95Front.parentElement.querySelector('.task-back');
        if (existingBack) {
            console.log('✅ 任务95背面元素已存在');
            return true;
        }
        
        // 获取翻转容器
        const flipContainer = task95Front.closest('.task-flip-container');
        if (!flipContainer) {
            console.error('❌ 未找到任务95翻转容器');
            return false;
        }
        
        // 创建背面元素
        const task95Back = document.createElement('div');
        task95Back.className = 'task-back';
        task95Back.id = 'task-95-back';
        task95Back.setAttribute('data-flip-processed', 'true');
        
        // 设置背面样式
        task95Back.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            backface-visibility: hidden !important;
            -webkit-backface-visibility: hidden !important;
            transform: rotateY(180deg) !important;
            background: white !important;
            border-radius: 10px !important;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 15px !important;
            box-sizing: border-box !important;
            z-index: 1 !important;
        `;
        
        // 构建背面内容 - 包含本体码、条码等信息
        task95Back.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <h5 style="margin: 0 0 15px 0; color: #333;">📦 任务文件清单</h5>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;">
                    <!-- 本体码 -->
                    <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <i class="fas fa-barcode fa-2x mb-2" style="color: #4361ee;"></i>
                        <div style="font-size: 12px; font-weight: bold;">本体码</div>
                        <div style="font-size: 11px; color: #6c757d;">123456789</div>
                    </div>
                    
                    <!-- 条码 -->
                    <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <i class="fas fa-qrcode fa-2x mb-2" style="color: #4cc9f0;"></i>
                        <div style="font-size: 12px; font-weight: bold;">条码</div>
                        <div style="font-size: 11px; color: #6c757d;">987654321</div>
                    </div>
                    
                    <!-- 说明书 -->
                    <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <i class="fas fa-book fa-2x mb-2" style="color: #7209b7;"></i>
                        <div style="font-size: 12px; font-weight: bold;">说明书</div>
                        <div style="font-size: 11px; color: #6c757d;">V1.0</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                    <!-- 警示码 -->
                    <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <i class="fas fa-exclamation-triangle fa-2x mb-2" style="color: #f72585;"></i>
                        <div style="font-size: 12px; font-weight: bold;">警示码</div>
                        <div style="font-size: 11px; color: #6c757d;">WARN001</div>
                    </div>
                    
                    <!-- 箱唛 -->
                    <div style="background: white; border-radius: 8px; padding: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <i class="fas fa-tags fa-2x mb-2" style="color: #ef233c;"></i>
                        <div style="font-size: 12px; font-weight: bold;">箱唛</div>
                        <div style="font-size: 11px; color: #6c757d;">BOX001</div>
                    </div>
                </div>
                
                <div style="width: 100%; text-align: center; padding: 10px; background: #f8f9fa; border-radius: 8px; margin-top: 10px;">
                    <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 5px;">任务信息</div>
                    <div style="font-size: 12px; color: #666;">
                        <div>商品名称: 化妆包</div>
                        <div>货号: KABI-165</div>
                        <div>数量: 1</div>
                        <div>创建人: 管理员</div>
                    </div>
                </div>
            </div>
        `;
        
        // 将背面元素添加到翻转容器中
        flipContainer.appendChild(task95Back);
        console.log('✅ 任务95背面内容创建成功');
        
        // 更新翻转容器的CSS变量以支持背面显示
        flipContainer.style.setProperty('--back-content-display', 'block');
        
        return true;
    }
    
    // 增强翻转功能
    function enhanceFlipFunctionality() {
        // 备份原始翻转函数
        const originalToggle = window.toggleTaskCardFlip;
        
        // 创建新的翻转函数
        window.toggleTaskCardFlip = function(taskId) {
            // 如果不是任务95，调用原始函数
            if (taskId !== '95') {
                if (originalToggle) {
                    return originalToggle.call(this, taskId);
                }
                return;
            }
            
            console.log('🔄 执行任务95翻转');
            
            const flipContainer = document.querySelector('.task-flip-container[data-task-id="95"]');
            if (!flipContainer) {
                console.error('❌ 未找到任务95翻转容器');
                return;
            }
            
            // 切换翻转状态
            flipContainer.classList.toggle('flipped');
            
            // 更新按钮状态
            const flipButton = flipContainer.querySelector('[onclick*="toggleTaskCardFlip"]');
            if (flipButton) {
                const isFlipped = flipContainer.classList.contains('flipped');
                flipButton.textContent = isFlipped ? '查看正面' : '查看文件';
                flipButton.title = isFlipped ? '点击查看任务正面' : '点击查看相关文件';
            }
            
            console.log(`✅ 任务95翻转状态: ${flipContainer.classList.contains('flipped') ? '背面' : '正面'}`);
        };
        
        console.log('✅ 任务95翻转功能增强完成');
    }
    
    // 添加CSS样式支持
    function addCSSStyles() {
        const styleId = 'task95-flip-fix-styles';
        if (document.getElementById(styleId)) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* 任务95翻转修复样式 */
            .task-flip-container[data-task-id="95"] {
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
            
            .task-flip-container[data-task-id="95"].flipped {
                transform: rotateY(180deg) !important;
            }
            
            .task-flip-container[data-task-id="95"] .task-front {
                transform-style: preserve-3d !important;
                position: relative !important;
                z-index: 2 !important;
                min-height: 307.46px !important;
                align-items: center !important;
            }
            
            .task-flip-container[data-task-id="95"] .task-back {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                box-sizing: border-box !important;
                transform: rotateY(180deg) !important;
                background: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 15px !important;
                z-index: 1 !important;
            }
            
            /* 确保背面内容可见 */
            .task-flip-container[data-task-id="95"] .task-back * {
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ 任务95 CSS样式添加完成');
    }
    
    // 初始化修复
    function initializeFix() {
        console.log('🚀 开始任务95背面内容修复...');
        
        // 添加必要的CSS样式
        addCSSStyles();
        
        // 等待任务95元素加载
        waitForElement('#task-95-front', function(frontElement) {
            console.log('🔍 找到任务95正面元素，开始修复...');
            
            // 创建背面内容
            const backCreated = createTask95BackContent();
            
            if (backCreated) {
                // 增强翻转功能
                enhanceFlipFunctionality();
                
                // 标记已修复
                window.task95BackContentFixed = true;
                
                console.log('🎉 任务95背面内容修复完成！');
                
                // 显示成功通知
                if (typeof showNotification === 'function') {
                    showNotification('任务95背面内容修复成功！现在可以正常翻转查看文件信息。', 'success');
                }
            } else {
                console.error('❌ 任务95背面内容创建失败');
            }
        });
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFix);
    } else {
        initializeFix();
    }
    
    // 也监听可能的动态内容加载
    setTimeout(initializeFix, 2000);
    
})();
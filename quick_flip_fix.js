// 销售运营任务卡片翻转功能快速修复命令
// 在浏览器控制台中执行以下代码：

(function() {
    'use strict';
    
    console.log('🚀 执行销售运营任务卡片翻转快速修复...');
    
    // 1. 确保核心样式存在
    function addEssentialStyles() {
        const styleId = 'quick-sales-flip-fix';
        if (document.getElementById(styleId)) {
            console.log('✅ 核心样式已存在');
            return;
        }
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .sales-operations-container .task-flip-container {
                perspective: 1500px !important;
                transform-style: preserve-3d !important;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                position: relative !important;
                cursor: pointer !important;
                width: 100% !important;
                height: 100% !important;
                min-height: 307.46px !important;
                border-radius: 10px !important;
                overflow: hidden !important;
            }
            
            .sales-operations-container .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
            
            .sales-operations-container .task-front {
                backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                z-index: 2 !important;
                background-color: white !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
            }
            
            .sales-operations-container .task-back {
                backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                z-index: 1 !important;
                background-color: #f8f9fa !important;
                border-radius: 10px !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                transform: rotateY(180deg) !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 20px !important;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ 核心样式已添加');
    }
    
    // 2. 确保翻转函数存在
    function ensureFlipFunction() {
        if (typeof window.toggleTaskCardFlip === 'function') {
            console.log('✅ 翻转函数已存在');
            return;
        }
        
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🔄 翻转任务: ${taskId}`);
            
            let container = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
            if (!container) {
                container = document.querySelector(`.sales-operations-container .task-flip-container[data-task-id="${taskId}"]`);
            }
            
            if (!container) {
                console.error(`❌ 未找到任务容器: ${taskId}`);
                return;
            }
            
            container.classList.toggle('flipped');
            const isFlipped = container.classList.contains('flipped');
            console.log(`✅ 任务 ${taskId} 状态: ${isFlipped ? '背面' : '正面'}`);
        };
        
        console.log('✅ 翻转函数已创建');
    }
    
    // 3. 修复DOM结构
    function fixDOMStructure() {
        const salesFrontCards = document.querySelectorAll('.sales-operations-container .task-front[id]');
        console.log(`🔧 发现 ${salesFrontCards.length} 个任务卡片`);
        
        salesFrontCards.forEach(card => {
            const taskId = card.id.replace('task-', '').replace('-front', '');
            
            // 确保有翻转容器
            let container = card.closest('.task-flip-container');
            if (!container) {
                console.log(`🏗️ 为任务 ${taskId} 创建翻转容器`);
                container = document.createElement('div');
                container.className = 'task-flip-container';
                container.dataset.taskId = taskId;
                card.parentNode.replaceChild(container, card);
                container.appendChild(card);
            }
            
            // 确保有背面元素
            let backCard = container.querySelector('.task-back');
            if (!backCard) {
                console.log(` backpage 为任务 ${taskId} 创建背面`);
                backCard = document.createElement('div');
                backCard.className = 'task-back';
                backCard.dataset.taskId = taskId;
                backCard.innerHTML = `
                    <div style="text-align: center;">
                        <h5>📦 任务文件信息</h5>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0;">
                            <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: white;">
                                <div style="font-size: 12px; color: #666;">本体码</div>
                                <div style="font-size: 11px; color: #999; margin-top: 5px;">未上传</div>
                            </div>
                            <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: white;">
                                <div style="font-size: 12px; color: #666;">条码</div>
                                <div style="font-size: 11px; color: #999; margin-top: 5px;">未上传</div>
                            </div>
                            <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: white;">
                                <div style="font-size: 12px; color: #666;">警示码</div>
                                <div style="font-size: 11px; color: #999; margin-top: 5px;">未上传</div>
                            </div>
                            <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: white;">
                                <div style="font-size: 12px; color: #666;">说明书</div>
                                <div style="font-size: 11px; color: #999; margin-top: 5px;">未上传</div>
                            </div>
                            <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: white;">
                                <div style="font-size: 12px; color: #666;">箱唛</div>
                                <div style="font-size: 11px; color: #999; margin-top: 5px;">未上传</div>
                            </div>
                            <div style="padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: white;">
                                <div style="font-size: 12px; color: #666;">其他</div>
                                <div style="font-size: 11px; color: #999; margin-top: 5px;">未上传</div>
                            </div>
                        </div>
                        <button onclick="window.toggleTaskCardFlip('${taskId}')" 
                                style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-arrow-left"></i> 返回
                        </button>
                    </div>
                `;
                container.appendChild(backCard);
            }
        });
        
        console.log('✅ DOM结构修复完成');
    }
    
    // 4. 绑定点击事件
    function bindClickEvents() {
        const salesFrontCards = document.querySelectorAll('.sales-operations-container .task-front[id]');
        
        salesFrontCards.forEach(card => {
            if (card.dataset.flipBound) return;
            
            const taskId = card.id.replace('task-', '').replace('-front', '');
            
            card.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🖱️ 点击任务卡片: ${taskId}`);
                window.toggleTaskCardFlip(taskId);
            });
            
            card.dataset.flipBound = 'true';
            card.style.cursor = 'pointer';
            card.title = '点击查看详情';
        });
        
        console.log(`✅ 为 ${salesFrontCards.length} 个卡片绑定了点击事件`);
    }
    
    // 执行所有修复步骤
    try {
        addEssentialStyles();
        ensureFlipFunction();
        fixDOMStructure();
        bindClickEvents();
        
        console.log('🎉 销售运营任务卡片翻转功能修复完成！');
        console.log('💡 现在可以点击任务卡片测试翻转功能');
        
    } catch (error) {
        console.error('❌ 修复过程中出现错误:', error);
    }
    
})();
/**
 * 紧急翻转功能修复脚本
 * 针对 div#task-95-front.task-front 的紧急修复
 */

(function() {
    'use strict';
    
    console.log('🚨 启动紧急翻转功能修复...');
    
    // 直接针对特定元素的修复函数
    function fixSpecificTaskCard(taskId) {
        console.log(`🔧 正在修复任务卡片: ${taskId}`);
        
        // 更广泛的选择器尝试查找元素
        const selectors = [
            `#task-${taskId}-front.task-front`,
            `div[id='task-${taskId}-front'].task-front`,
            `[data-task-id='${taskId}'].task-front`,
            `.task-front[data-task-id='${taskId}']`,
            `#task-${taskId}`,
            `[data-task-id='${taskId}']`,
            `[id*='${taskId}']`
        ];
        
        let frontElement = null;
        let usedSelector = '';
        
        // 尝试不同的选择器
        for (const selector of selectors) {
            frontElement = document.querySelector(selector);
            if (frontElement) {
                usedSelector = selector;
                console.log(`✅ 使用选择器 '${selector}' 找到元素`);
                break;
            }
        }
        
        // 如果还找不到，尝试更广泛的模糊查找
        if (!frontElement) {
            console.log('🔍 尝试更广泛的模糊查找...');
            
            // 查找所有可能的任务相关元素
            const allPossibleElements = document.querySelectorAll('[data-task-id], [id*="task"], .task-card, .task-item');
            
            for (const element of allPossibleElements) {
                const elementId = element.id || 
                                 element.getAttribute('data-task-id') || 
                                 element.getAttribute('data-id') ||
                                 '';
                
                if (elementId.toString().includes(taskId)) {
                    // 如果是容器元素，查找其内部的.front元素
                    if (element.classList.contains('task-front')) {
                        frontElement = element;
                        console.log(`✅ 通过模糊匹配找到 .task-front 元素: ${elementId}`);
                        break;
                    } else if (element.querySelector('.task-front')) {
                        frontElement = element.querySelector('.task-front');
                        console.log(`✅ 在容器中找到 .task-front 元素: ${elementId}`);
                        break;
                    } else {
                        // 如果没有.front子元素，将此元素视为front元素
                        frontElement = element;
                        console.log(`✅ 将元素视为 .task-front: ${elementId}`);
                        // 确保元素有正确的类名
                        frontElement.classList.add('task-front');
                        break;
                    }
                }
            }
        }
        
        if (!frontElement) {
            console.error(`❌ 未找到任务 ${taskId} 的元素`);
            console.log('📋 尝试过的选择器:', selectors);
            
            // 详细的诊断信息
            console.log('\n📊 当前页面元素诊断:');
            
            // 检查所有可能相关的元素
            const allTaskElements = document.querySelectorAll('[data-task-id], [id*="task"]');
            console.log(`  找到 ${allTaskElements.length} 个包含任务ID的元素:`);
            allTaskElements.forEach((el, index) => {
                console.log(`    ${index + 1}. ID: ${el.id || '无'}, data-task-id: ${el.dataset.taskId || '无'}, tag: ${el.tagName}, class: ${el.className}`);
            });
            
            // 检查.task-front元素
            const allTaskFronts = document.querySelectorAll('.task-front');
            console.log(`\n  找到 ${allTaskFronts.length} 个 .task-front 元素:`);
            allTaskFronts.forEach((el, index) => {
                console.log(`    ${index + 1}. ID: ${el.id || '无'}, data-task-id: ${el.dataset.taskId || '无'}, parent: ${el.parentElement?.className || '无'}`);
            });
            
            // 检查页面状态
            console.log('\n  页面状态检查:');
            console.log(`    仓库任务区域: ${document.getElementById('warehouseTasks') ? '存在' : '不存在'}`);
            console.log(`    销售运营区域: ${document.querySelector('.sales-operations-container') ? '存在' : '不存在'}`);
            console.log(`    激活标签页: ${document.querySelector('.nav-link.active')?.textContent?.trim() || '未知'}`);
            
            // 建议解决方案
            console.log('\n💡 解决方案建议:');
            console.log('  1. 确认是否在正确的页面模块（仓库任务/销售运营）');
            console.log('  2. 确认任务数据是否已加载');
            console.log('  3. 可以执行 diagnoseCurrentTasks() 获取详细诊断信息');
            console.log('  4. 如果任务确实不存在，可以选择其他任务ID进行测试');
            
            return false;
        }
        
        // 检查是否已经有翻转容器
        let flipContainer = frontElement.closest('.task-flip-container');
        
        if (!flipContainer) {
            console.log('🏗️ 创建新的翻转容器结构...');
            
            // 创建翻转容器
            flipContainer = document.createElement('div');
            flipContainer.className = 'task-flip-container';
            flipContainer.dataset.taskId = taskId;
            
            // 设置关键样式
            Object.assign(flipContainer.style, {
                'perspective': '1500px',
                'transform-style': 'preserve-3d',
                'transition': 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                'position': 'relative',
                'cursor': 'pointer',
                'width': '100%',
                'height': '100%',
                'minHeight': '307.46px',
                'maxWidth': '282.66px',
                'maxHeight': '307.46px',
                'display': 'block'
            });
            
            // 创建背面元素
            const backElement = document.createElement('div');
            backElement.className = 'task-back';
            Object.assign(backElement.style, {
                'backfaceVisibility': 'hidden',
                'WebkitBackfaceVisibility': 'hidden',
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%',
                'minHeight': '307.46px',
                'maxWidth': '282.66px',
                'boxSizing': 'border-box',
                'zIndex': '1',
                'backgroundColor': 'white',
                'borderRadius': '10px',
                'boxShadow': '0 3px 8px rgba(0, 0, 0, 0.08)',
                'display': 'flex',
                'flexDirection': 'column',
                'alignItems': 'center',
                'justifyContent': 'center',
                'padding': '15px',
                'transform': 'rotateY(180deg)'
            });
            
            // 设置背面内容
            backElement.innerHTML = `
                <div style="text-align: center; width: 100%;">
                    <h5 style="margin-bottom: 20px; color: #495057;">文件信息</h5>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; width: 100%; margin-bottom: 20px;">
                        <div style="padding: 10px; border: 1px solid #e9ecef; border-radius: 6px; background: #f8f9fa; text-align: center;">
                            <div style="font-size: 0.8rem; font-weight: 600; color: #495057; margin-bottom: 5px;">本体码</div>
                            <div style="font-size: 0.8rem; color: #6c757d; font-style: italic;">未上传</div>
                        </div>
                        <div style="padding: 10px; border: 1px solid #e9ecef; border-radius: 6px; background: #f8f9fa; text-align: center;">
                            <div style="font-size: 0.8rem; font-weight: 600; color: #495057; margin-bottom: 5px;">条码</div>
                            <div style="font-size: 0.8rem; color: #6c757d; font-style: italic;">未上传</div>
                        </div>
                        <div style="padding: 10px; border: 1px solid #e9ecef; border-radius: 6px; background: #f8f9fa; text-align: center;">
                            <div style="font-size: 0.8rem; font-weight: 600; color: #495057; margin-bottom: 5px;">警示码</div>
                            <div style="font-size: 0.8rem; color: #6c757d; font-style: italic;">未上传</div>
                        </div>
                        <div style="padding: 10px; border: 1px solid #e9ecef; border-radius: 6px; background: #f8f9fa; text-align: center;">
                            <div style="font-size: 0.8rem; font-weight: 600; color: #495057; margin-bottom: 5px;">箱唛</div>
                            <div style="font-size: 0.8rem; color: #6c757d; font-style: italic;">未上传</div>
                        </div>
                        <div style="padding: 10px; border: 1px solid #e9ecef; border-radius: 6px; background: #f8f9fa; text-align: center;">
                            <div style="font-size: 0.8rem; font-weight: 600; color: #495057; margin-bottom: 5px;">说明书</div>
                            <div style="font-size: 0.8rem; color: #6c757d; font-style: italic;">未上传</div>
                        </div>
                        <div style="padding: 10px; border: 1px solid #e9ecef; border-radius: 6px; background: #f8f9fa; text-align: center;">
                            <div style="font-size: 0.8rem; font-weight: 600; color: #495057; margin-bottom: 5px;">其他</div>
                            <div style="font-size: 0.8rem; color: #6c757d; font-style: italic;">未上传</div>
                        </div>
                    </div>
                    <div style="width: 100%; text-align: center; padding-top: 15px; border-top: 1px solid #e9ecef;">
                        <button onclick="emergencyDeleteTask('${taskId}')" 
                                style="background-color: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                            <i class="fas fa-trash me-1"></i>删除任务
                        </button>
                    </div>
                </div>
            `;
            
            // 重构DOM结构
            const parent = frontElement.parentNode;
            parent.replaceChild(flipContainer, frontElement);
            flipContainer.appendChild(frontElement);
            flipContainer.appendChild(backElement);
            
            console.log('✅ 翻转容器结构创建完成');
        }
        
        // 确保front元素有正确的样式
        Object.assign(frontElement.style, {
            'backfaceVisibility': 'hidden',
            'WebkitBackfaceVisibility': 'hidden',
            'position': 'relative',
            'zIndex': '2'
        });
        
        // 添加或更新翻转功能
        ensureFlipFunctionality(flipContainer, taskId);
        
        console.log(`✅ 任务 ${taskId} 修复完成`);
        return true;
    }
    
    // 确保翻转功能正常工作
    function ensureFlipFunctionality(container, taskId) {
        console.log('⚡ 确保翻转功能...');
        
        // 移除可能存在的旧事件监听器
        const clone = container.cloneNode(true);
        container.parentNode.replaceChild(clone, container);
        
        // 重新添加点击事件
        clone.addEventListener('click', function(e) {
            // 阻止事件冒泡到删除按钮
            if (e.target.closest('button') && e.target.closest('button').onclick) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            // 切换翻转状态
            this.classList.toggle('flipped');
            const isFlipped = this.classList.contains('flipped');
            
            console.log(`🔄 任务 ${taskId} 翻转状态: ${isFlipped ? '背面' : '正面'}`);
            
            // 可选：触发自定义事件
            const event = new CustomEvent('taskCardFlipped', {
                detail: { taskId, flipped: isFlipped }
            });
            document.dispatchEvent(event);
        });
        
        console.log('✅ 点击事件已绑定');
    }
    
    // 紧急删除任务函数
    window.emergencyDeleteTask = function(taskId) {
        if (confirm(`确定要删除任务 ${taskId} 吗？此操作不可撤销。`)) {
            console.log(`🗑️ 紧急删除任务: ${taskId}`);
            
            const container = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
            if (container) {
                // 添加删除动画
                container.style.transition = 'all 0.3s ease';
                container.style.opacity = '0';
                container.style.transform = 'scale(0.8) rotateY(180deg)';
                
                setTimeout(() => {
                    container.remove();
                    console.log(`✅ 任务 ${taskId} 已删除`);
                }, 300);
            }
        }
    };
    
    // 添加关键CSS样式
    function addCriticalStyles() {
        console.log('🎨 添加关键样式...');
        
        // 移除旧样式
        const oldStyle = document.getElementById('emergency-flip-styles');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = 'emergency-flip-styles';
        style.textContent = `
            /* 翻转状态核心样式 */
            .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
            
            /* 确保3D变换正常工作 */
            .task-flip-container {
                transform-style: preserve-3d !important;
                -webkit-transform-style: preserve-3d !important;
            }
            
            /* 背面元素始终隐藏 */
            .task-back {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
            }
            
            /* 正面元素在翻转时隐藏 */
            .task-flip-container.flipped .task-front {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
            }
            
            /* 悬停效果增强 */
            .task-flip-container:hover {
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15) !important;
                transition: all 0.3s ease !important;
            }
            
            /* 翻转时的悬停效果 */
            .task-flip-container.flipped:hover {
                transform: rotateY(180deg) translateY(-3px) !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ 关键样式已添加');
    }
    
    // 主修复函数
    function performEmergencyFix() {
        console.log('🚀 执行紧急修复...');
        
        // 添加样式
        addCriticalStyles();
        
        // 修复特定任务卡片
        const targetTasks = ['95']; // 可以扩展到更多任务ID
        
        let successCount = 0;
        targetTasks.forEach(taskId => {
            if (fixSpecificTaskCard(taskId)) {
                successCount++;
            }
        });
        
        console.log(`🎉 紧急修复完成！成功修复 ${successCount}/${targetTasks.length} 个任务卡片`);
        
        // 提供用户反馈
        if (successCount > 0) {
            console.log('💡 现在可以点击任务卡片进行翻转了！');
            console.log('💡 点击卡片背面的删除按钮可以删除任务');
        }
    }
    
    // 页面加载完成后立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', performEmergencyFix);
    } else {
        // 如果页面已经加载完成，稍后执行
        setTimeout(performEmergencyFix, 100);
    }
    
    // 也暴露到全局以便手动调用
    window.performEmergencyFlipFix = performEmergencyFix;
    
})();
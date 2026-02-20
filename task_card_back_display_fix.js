/**
 * 任务卡片背面显示修复脚本
 * 专门解决任务卡片翻转后背面不显示的问题
 */

(function() {
    'use strict';
    
    console.log('🔧 启动任务卡片背面显示修复...');
    
    // 诊断当前状态
    function diagnoseCurrentState() {
        console.log('🔍 诊断当前任务卡片状态...');
        
        const taskFronts = document.querySelectorAll('.task-front[id^="task-"]');
        const flipContainers = document.querySelectorAll('.task-flip-container');
        const taskBacks = document.querySelectorAll('.task-back');
        
        console.log(`📊 当前状态统计:`);
        console.log(`   - 任务正面元素: ${taskFronts.length} 个`);
        console.log(`   - 翻转容器: ${flipContainers.length} 个`);
        console.log(`   - 背面元素: ${taskBacks.length} 个`);
        
        // 检查翻转函数状态
        const hasFlipFunction = typeof window.toggleTaskCardFlip === 'function';
        console.log(`   - 翻转函数存在: ${hasFlipFunction ? '✅' : '❌'}`);
        
        if (hasFlipFunction) {
            console.log('   - 翻转函数内容预览:', window.toggleTaskCardFlip.toString().substring(0, 100) + '...');
        }
        
        return {
            frontCount: taskFronts.length,
            containerCount: flipContainers.length,
            backCount: taskBacks.length,
            hasFlipFunction: hasFlipFunction
        };
    }
    
    // 修复1: 确保翻转函数正确
    function ensureFlipFunction() {
        console.log('🔄 确保翻转函数正确...');
        
        // 保存可能存在的原始函数
        const originalFunction = window.toggleTaskCardFlip;
        
        // 创建新的翻转函数
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🔄 执行翻转 - 任务ID: ${taskId}`);
            
            try {
                // 多重查找策略
                let flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
                
                if (!flipContainer) {
                    const frontElement = document.querySelector(`#task-${taskId}-front`);
                    if (frontElement) {
                        flipContainer = frontElement.closest('.task-flip-container');
                    }
                }
                
                if (!flipContainer) {
                    console.error(`❌ 未找到任务容器: ${taskId}`);
                    return false;
                }
                
                // 执行翻转
                flipContainer.classList.toggle('flipped');
                const isNowFlipped = flipContainer.classList.contains('flipped');
                
                console.log(`✅ 任务 ${taskId} 翻转状态: ${isNowFlipped ? '背面' : '正面'}`);
                
                // 更新按钮文本
                updateFlipButton(taskId, isNowFlipped);
                
                return true;
                
            } catch (error) {
                console.error(`❌ 翻转执行出错:`, error);
                return false;
            }
        };
        
        console.log('✅ 翻转函数已更新');
    }
    
    // 更新翻转按钮文本
    function updateFlipButton(taskId, isFlipped) {
        const buttons = document.querySelectorAll(`[data-task-id="${taskId}"][data-action="flip"]`);
        buttons.forEach(button => {
            if (isFlipped) {
                button.innerHTML = '<i class="fas fa-arrow-left me-1"></i>返回';
            } else {
                button.innerHTML = '<i class="fas fa-info-circle me-1"></i>查看详情';
            }
        });
    }
    
    // 修复2: 为缺少背面的卡片添加背面元素
    function addMissingBackElements() {
        console.log('➕ 为缺少背面的卡片添加背面元素...');
        
        const taskFronts = document.querySelectorAll('.task-front[id^="task-"]');
        let addedCount = 0;
        
        taskFronts.forEach(frontElement => {
            const taskIdMatch = frontElement.id.match(/task-(.+)-front/);
            if (!taskIdMatch) return;
            
            const taskId = taskIdMatch[1];
            
            // 查找翻转容器
            let flipContainer = frontElement.closest('.task-flip-container');
            
            // 如果没有翻转容器，创建一个
            if (!flipContainer) {
                console.log(`🏗️ 为任务 ${taskId} 创建翻转容器...`);
                flipContainer = createFlipContainer(frontElement, taskId);
            }
            
            // 检查是否有背面元素
            const existingBack = flipContainer.querySelector('.task-back');
            if (!existingBack) {
                console.log(`➕ 为任务 ${taskId} 创建背面元素...`);
                const backElement = createTaskBackElement(taskId, frontElement);
                flipContainer.appendChild(backElement);
                addedCount++;
            }
        });
        
        console.log(`✅ 完成背面元素添加，共处理 ${addedCount} 个任务`);
        return addedCount;
    }
    
    // 创建翻转容器
    function createFlipContainer(frontElement, taskId) {
        const container = document.createElement('div');
        container.className = 'task-flip-container';
        container.dataset.taskId = taskId;
        
        // 设置必要样式
        Object.assign(container.style, {
            'perspective': '1500px',
            'transform-style': 'preserve-3d',
            'transition': 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            'position': 'relative',
            'cursor': 'pointer',
            'width': '100%',
            'height': '100%',
            'minHeight': '307.46px',
            'maxWidth': '282.66px',
            'display': 'block',
            'borderRadius': '10px',
            'overflow': 'hidden'
        });
        
        // 重新组织DOM结构
        const parent = frontElement.parentElement;
        parent.replaceChild(container, frontElement);
        container.appendChild(frontElement);
        
        return container;
    }
    
    // 创建任务背面元素
    function createTaskBackElement(taskId, frontElement) {
        const backElement = document.createElement('div');
        backElement.className = 'task-back';
        backElement.dataset.taskId = taskId;
        
        // 设置背面样式
        Object.assign(backElement.style, {
            'backfaceVisibility': 'hidden',
            'WebkitBackfaceVisibility': 'hidden',
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'borderRadius': '10px',
            'display': 'flex',
            'flexDirection': 'column',
            'boxSizing': 'border-box',
            'background': 'white',
            'boxShadow': '0 3px 8px rgba(0, 0, 0, 0.08)',
            'transform': 'rotateY(180deg)',
            'zIndex': '1',
            'padding': '15px'
        });
        
        // 从正面提取任务信息
        const taskInfo = extractTaskInfo(frontElement);
        
        // 构建背面内容
        backElement.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <!-- 头部区域 -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e9ecef;">
                    <h6 style="margin: 0; color: #495057;">📦 任务文件清单</h6>
                    <button onclick="toggleTaskCardFlip('${taskId}')" 
                            style="background: #6c757d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-arrow-left me-1"></i>返回
                    </button>
                </div>
                
                <!-- 文件分类区域 -->
                <div style="flex: 1; overflow-y: auto; margin-bottom: 15px;">
                    ${generateFileSections(taskId)}
                </div>
                
                <!-- 操作按钮区域 -->
                <div style="padding-top: 15px; border-top: 1px solid #e9ecef;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button onclick="downloadAllFiles('${taskId}')" 
                                style="background: #0d6efd; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-download me-1"></i>全部下载
                        </button>
                        <button onclick="printTaskFiles('${taskId}')" 
                                style="background: #20c997; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                            <i class="fas fa-print me-1"></i>打印
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return backElement;
    }
    
    // 提取任务信息
    function extractTaskInfo(frontElement) {
        return {
            name: frontElement.querySelector('.task-gallery-name')?.textContent || '未知任务',
            code: frontElement.querySelector('.task-gallery-code')?.textContent?.replace('货号: ', '') || '',
            qty: frontElement.querySelector('.task-gallery-qty')?.textContent?.replace('数量: ', '') || '',
            creator: frontElement.querySelector('.task-gallery-creator')?.textContent?.replace('创建人: ', '') || '',
            status: frontElement.querySelector('.badge')?.textContent || '待发'
        };
    }
    
    // 生成文件分类区域
    function generateFileSections(taskId) {
        const fileTypes = [
            { id: 'entity-code', name: '本体码', icon: 'fa-barcode', color: '#0d6efd' },
            { id: 'barcode', name: '条码', icon: 'fa-qrcode', color: '#198754' },
            { id: 'warning-code', name: '警示码', icon: 'fa-exclamation-triangle', color: '#ffc107' },
            { id: 'manual', name: '说明书', icon: 'fa-book', color: '#6f42c1' },
            { id: 'carton-label', name: '箱唛', icon: 'fa-tags', color: '#dc3545' },
            { id: 'other', name: '其他文件', icon: 'fa-file', color: '#6c757d' }
        ];
        
        return fileTypes.map(fileType => `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <i class="fas ${fileType.icon}" style="color: ${fileType.color}; margin-right: 8px;"></i>
                    <strong style="color: #495057; font-size: 14px;">${fileType.name}</strong>
                </div>
                <div id="${fileType.id}-files-${taskId}" 
                     style="min-height: 60px; background: #f8f9fa; border-radius: 6px; padding: 12px; border: 1px dashed #dee2e6; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center; color: #6c757d;">
                        <i class="fas fa-file-upload fa-lg mb-2" style="opacity: 0.5;"></i>
                        <div style="font-size: 12px;">暂无文件</div>
                        <div style="font-size: 11px; margin-top: 4px;">点击上传文件</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // 修复3: 添加必要的CSS样式
    function addEssentialStyles() {
        console.log('🎨 添加必要的CSS样式...');
        
        const styleId = 'task-card-back-fix-styles';
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* 任务卡片背面修复核心样式 */
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
                display: block !important;
                border-radius: 10px !important;
                overflow: hidden !important;
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
                border-radius: 10px !important;
                display: flex !important;
                flex-direction: column !important;
                box-sizing: border-box !important;
            }
            
            .task-front {
                z-index: 2 !important;
                background: white !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
            }
            
            .task-back {
                transform: rotateY(180deg) !important;
                z-index: 1 !important;
                background: white !important;
                box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08) !important;
                padding: 15px !important;
            }
            
            /* 确保在所有容器中生效 */
            .published-tasks-gallery .task-flip-container,
            .warehouse-tasks-gallery .task-flip-container,
            .task-gallery .task-flip-container {
                perspective: 1500px !important;
                transform-style: preserve-3d !important;
            }
            
            .published-tasks-gallery .task-front,
            .published-tasks-gallery .task-back,
            .warehouse-tasks-gallery .task-front,
            .warehouse-tasks-gallery .task-back,
            .task-gallery .task-front,
            .task-gallery .task-back {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ CSS样式已添加');
    }
    
    // 修复4: 绑定点击事件
    function bindClickEvents() {
        console.log('🖱️ 绑定点击事件...');
        
        // 使用事件委托
        document.addEventListener('click', function(e) {
            // 检查是否点击了翻转容器
            const flipContainer = e.target.closest('.task-flip-container');
            if (flipContainer && flipContainer.dataset.taskId) {
                // 避免按钮区域触发容器翻转
                if (!e.target.closest('[data-action]')) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.toggleTaskCardFlip(flipContainer.dataset.taskId);
                }
            }
        });
        
        console.log('✅ 点击事件已绑定');
    }
    
    // 添加全局函数
    window.downloadAllFiles = function(taskId) {
        console.log(`📥 下载任务 ${taskId} 的所有文件...`);
        alert(`📥 开始下载任务 #${taskId} 的所有文件...`);
    };
    
    window.printTaskFiles = function(taskId) {
        console.log(`🖨️ 打印任务 ${taskId} 的文件清单...`);
        alert(`🖨️ 准备打印任务 #${taskId} 的文件清单...`);
    };
    
    // 主修复函数
    function performCompleteFix() {
        console.log('🚀 开始完整修复流程...');
        
        // 1. 诊断当前状态
        const initialState = diagnoseCurrentState();
        
        // 2. 添加必要样式
        addEssentialStyles();
        
        // 3. 确保翻转函数正确
        ensureFlipFunction();
        
        // 4. 添加缺失的背面元素
        const addedBacks = addMissingBackElements();
        
        // 5. 绑定点击事件
        bindClickEvents();
        
        // 6. 最终诊断
        setTimeout(() => {
            const finalState = diagnoseCurrentState();
            console.log('🎉 修复完成！');
            console.log(`📊 修复结果:`);
            console.log(`   - 新增背面元素: ${addedBacks} 个`);
            console.log(`   - 翻转函数状态: ${finalState.hasFlipFunction ? '正常' : '异常'}`);
            console.log(`   - 总背面元素数: ${finalState.backCount} 个`);
        }, 1000);
    }
    
    // 页面加载完成后执行修复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', performCompleteFix);
    } else {
        // DOM已加载完成，立即执行
        setTimeout(performCompleteFix, 100);
    }
    
    // 监听动态添加的内容
    const observer = new MutationObserver(function(mutations) {
        let shouldFix = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && node.classList.contains('task-front')) {
                            shouldFix = true;
                        } else if (node.querySelectorAll) {
                            const newFronts = node.querySelectorAll('.task-front');
                            if (newFronts.length > 0) {
                                shouldFix = true;
                            }
                        }
                    }
                });
            }
        });
        
        if (shouldFix) {
            console.log('🔄 检测到新任务卡片，执行增量修复...');
            setTimeout(() => {
                addMissingBackElements();
            }, 500);
        }
    });
    
    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
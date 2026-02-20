/**
 * 控制台直接修复脚本 - 销售运营任务卡片翻转
 * 可以直接在浏览器开发者工具控制台中粘贴执行
 */

function manualSalesFlipFix() {
    console.log('🔧 开始手动修复销售运营任务卡片翻转...');
    
    // 目标元素
    const taskFront = document.querySelector('#task-96-front.task-front');
    const flipContainer = document.querySelector('.task-flip-container[data-task-id="96"]');
    
    if (!taskFront || !flipContainer) {
        console.error('❌ 未找到必要的DOM元素');
        console.log('taskFront存在:', !!taskFront);
        console.log('flipContainer存在:', !!flipContainer);
        return false;
    }
    
    console.log('✅ 找到目标元素，开始修复...');
    
    // 1. 重置并修复task-front样式
    console.log('1️⃣ 修复task-front样式...');
    taskFront.style.cssText = '';
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
    taskFront.style.cursor = 'pointer';
    
    // 2. 修复翻转容器样式
    console.log('2️⃣ 修复翻转容器样式...');
    flipContainer.style.cssText = '';
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
    
    // 3. 确保翻转函数存在
    console.log('3️⃣ 确保翻转函数...');
    window.toggleTaskCardFlip = function(taskId) {
        console.log(`🔄 toggleTaskCardFlip(${taskId}) 被调用`);
        const container = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
        if (container) {
            container.classList.toggle('flipped');
            console.log('✅ 翻转状态:', container.classList.contains('flipped'));
        }
    };
    
    // 4. 检查或创建背面元素
    console.log('4️⃣ 检查背面结构...');
    let taskBack = flipContainer.querySelector('.task-back');
    if (!taskBack) {
        console.log('🔧 创建背面元素...');
        taskBack = document.createElement('div');
        taskBack.className = 'task-back';
        taskBack.setAttribute('data-task-id', '96');
        taskBack.innerHTML = `
            <div style="padding: 15px; height: 100%; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h6 style="margin: 0;">任务详情</h6>
                    <button onclick="toggleTaskCardFlip(96)" style="background: #6c757d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        ← 返回
                    </button>
                </div>
                <div>
                    <h6>本体码</h6>
                    <div id="entity-code-files-96" style="margin-bottom: 15px; min-height: 30px; background: #f8f9fa; border-radius: 4px; padding: 8px;">
                        <small style="color: #6c757d;">暂无文件</small>
                    </div>
                    
                    <h6>条码</h6>
                    <div id="barcode-files-96" style="margin-bottom: 15px; min-height: 30px; background: #f8f9fa; border-radius: 4px; padding: 8px;">
                        <small style="color: #6c757d;">暂无文件</small>
                    </div>
                    
                    <h6>警示码</h6>
                    <div id="warning-code-files-96" style="margin-bottom: 15px; min-height: 30px; background: #f8f9fa; border-radius: 4px; padding: 8px;">
                        <small style="color: #6c757d;">暂无文件</small>
                    </div>
                    
                    <h6>说明书</h6>
                    <div id="manual-files-96" style="margin-bottom: 15px; min-height: 30px; background: #f8f9fa; border-radius: 4px; padding: 8px;">
                        <small style="color: #6c757d;">暂无文件</small>
                    </div>
                    
                    <h6>箱唛</h6>
                    <div id="carton-label-files-96" style="margin-bottom: 15px; min-height: 30px; background: #f8f9fa; border-radius: 4px; padding: 8px;">
                        <small style="color: #6c757d;">暂无文件</small>
                    </div>
                    
                    <h6>其他文件</h6>
                    <div id="other-files-96" style="margin-bottom: 15px; min-height: 30px; background: #f8f9fa; border-radius: 4px; padding: 8px;">
                        <small style="color: #6c757d;">暂无文件</small>
                    </div>
                </div>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                    <button onclick="alert('删除功能待实现')" style="width: 100%; background: #dc3545; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
                        🗑️ 删除任务
                    </button>
                </div>
            </div>
        `;
        flipContainer.appendChild(taskBack);
    }
    
    // 设置背面样式
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
    
    // 5. 绑定点击事件
    console.log('5️⃣ 绑定点击事件...');
    
    // 移除现有事件监听器的简单方法：克隆元素
    const newTaskFront = taskFront.cloneNode(true);
    taskFront.parentNode.replaceChild(newTaskFront, taskFront);
    
    // 添加点击事件
    newTaskFront.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🖱️ task-front 被点击');
        window.toggleTaskCardFlip(96);
    });
    
    // 添加视觉反馈
    newTaskFront.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02) rotateY(0deg)';
        this.style.transition = 'transform 0.2s ease';
    });
    
    newTaskFront.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotateY(0deg)';
    });
    
    console.log('✅ 手动修复完成！');
    console.log('🧪 测试翻转功能...');
    
    // 延迟测试翻转
    setTimeout(() => {
        window.toggleTaskCardFlip(96);
        setTimeout(() => {
            window.toggleTaskCardFlip(96);
            console.log('✅ 翻转测试完成，请检查效果');
        }, 1000);
    }, 1000);
    
    return true;
}

// 自动执行
console.log('🚀 执行销售运营任务卡片翻转修复...');
manualSalesFlipFix();
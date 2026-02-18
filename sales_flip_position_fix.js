/**
 * 销售运营翻转位置修复脚本
 * 解决销售任务卡片翻转功能的位置和显示问题
 */

(function() {
    'use strict';
    
    console.log('🚀 销售运营翻转位置修复脚本已加载');
    
    // 确保翻转函数存在
    if (typeof window.toggleTaskCardFlip !== 'function') {
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🔄 翻转任务卡片 - ID: ${taskId}`);
            
            const flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
            if (flipContainer) {
                flipContainer.classList.toggle('flipped');
                const isFlipped = flipContainer.classList.contains('flipped');
                console.log(`✅ 任务 ${taskId} 翻转状态: ${isFlipped ? '背面' : '正面'}`);
            } else {
                console.error(`❌ 未找到任务容器: ${taskId}`);
            }
        };
    }
    
    // 修复销售任务卡片位置
    function fixSalesTaskPositions() {
        console.log('🔧 修复销售任务卡片位置...');
        
        const salesTasks = document.querySelectorAll('.sales-operations-container .task-flip-container');
        salesTasks.forEach((container, index) => {
            // 确保容器有正确的样式
            container.style.position = 'relative';
            container.style.transformStyle = 'preserve-3d';
            container.style.perspective = '1500px';
            
            // 修复正面元素
            const front = container.querySelector('.task-front');
            if (front) {
                front.style.position = 'absolute';
                front.style.top = '0';
                front.style.left = '0';
                front.style.width = '100%';
                front.style.height = '100%';
                front.style.backfaceVisibility = 'hidden';
                front.style.zIndex = '2';
            }
            
            // 修复背面元素
            const back = container.querySelector('.task-back');
            if (back) {
                back.style.position = 'absolute';
                back.style.top = '0';
                back.style.left = '0';
                back.style.width = '100%';
                back.style.height = '100%';
                back.style.backfaceVisibility = 'hidden';
                back.style.transform = 'rotateY(180deg)';
                back.style.zIndex = '1';
            }
        });
        
        console.log(`✅ 已修复 ${salesTasks.length} 个销售任务卡片位置`);
    }
    
    // 页面加载完成后执行修复
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(fixSalesTaskPositions, 1000);
    });
    
    // 也监听页面结构变化
    const observer = new MutationObserver(function(mutations) {
        let shouldFix = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && 
                        (node.classList?.contains('task-flip-container') || 
                         node.querySelector?.('.task-flip-container'))) {
                        shouldFix = true;
                    }
                });
            }
        });
        
        if (shouldFix) {
            setTimeout(fixSalesTaskPositions, 500);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();
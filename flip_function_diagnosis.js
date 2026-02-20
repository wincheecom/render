/**
 * 任务卡片翻转功能诊断脚本
 * 用于检测和验证翻转功能状态
 */
(function() {
    'use strict';
    
    // 在控制台显示诊断信息
    function diagnoseFlipFunction() {
        console.log('🔍 任务卡片翻转功能诊断开始...');
        
        // 检查翻转函数
        const hasFlipFunction = typeof window.toggleTaskCardFlip === 'function';
        console.log(`🔄 翻转函数状态: ${hasFlipFunction ? '✅ 存在' : '❌ 缺失'}`);
        
        if (hasFlipFunction) {
            console.log('📄 翻转函数内容:', window.toggleTaskCardFlip.toString().substring(0, 200) + '...');
        }
        
        // 检查任务元素
        const taskFronts = document.querySelectorAll('.task-front[id^="task-"]');
        const flipContainers = document.querySelectorAll('.task-flip-container');
        const taskBacks = document.querySelectorAll('.task-back');
        
        console.log(`📊 元素统计:`);
        console.log(`   - 任务正面: ${taskFronts.length} 个`);
        console.log(`   - 翻转容器: ${flipContainers.length} 个`);
        console.log(`   - 背面元素: ${taskBacks.length} 个`);
        
        // 检查样式
        const firstContainer = flipContainers[0];
        if (firstContainer) {
            const computedStyle = window.getComputedStyle(firstContainer);
            console.log(`🎨 样式检查:`);
            console.log(`   - perspective: ${computedStyle.perspective}`);
            console.log(`   - transform-style: ${computedStyle.transformStyle}`);
            console.log(`   - transition: ${computedStyle.transition}`);
        }
        
        // 测试翻转功能
        if (hasFlipFunction && taskFronts.length > 0) {
            const firstTaskId = taskFronts[0].id.replace('task-', '').replace('-front', '');
            console.log(`🧪 测试翻转功能 - 任务ID: ${firstTaskId}`);
            
            try {
                // 测试翻转
                window.toggleTaskCardFlip(firstTaskId);
                console.log('✅ 翻转功能调用成功');
                
                // 延迟检查状态
                setTimeout(() => {
                    const container = document.querySelector(`.task-flip-container[data-task-id="${firstTaskId}"]`);
                    if (container) {
                        const isFlipped = container.classList.contains('flipped');
                        console.log(`📊 翻转状态: ${isFlipped ? '背面' : '正面'}`);
                        
                        // 测试返回
                        window.toggleTaskCardFlip(firstTaskId);
                        setTimeout(() => {
                            const isBack = container.classList.contains('flipped');
                            console.log(`📊 返回状态: ${isBack ? '背面' : '正面'}`);
                            console.log(isBack ? '❌ 返回功能异常' : '✅ 返回功能正常');
                        }, 600);
                    }
                }, 600);
                
            } catch (error) {
                console.error('❌ 翻转功能测试失败:', error);
            }
        }
        
        console.log('🏁 诊断完成');
        return {
            hasFlipFunction,
            frontCount: taskFronts.length,
            containerCount: flipContainers.length,
            backCount: taskBacks.length
        };
    }
    
    // 添加到全局以便手动调用
    window.diagnoseTaskFlip = diagnoseFlipFunction;
    
    // 页面加载完成后自动诊断
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(diagnoseFlipFunction, 2000);
        });
    } else {
        setTimeout(diagnoseFlipFunction, 2000);
    }
    
    console.log('💡 提示: 在控制台输入 diagnoseTaskFlip() 可手动运行诊断');
    
})();
/**
 * 任务卡片翻转功能诊断工具
 * 专门针对 div#task-96-front.task-front 元素翻转失效问题
 */

(function() {
    'use strict';
    
    console.log('🔍 启动任务卡片翻转功能诊断...');
    
    // 诊断1: 检查翻转函数是否存在
    function diagnoseFlipFunction() {
        console.log('\n=== 诊断1: 翻转函数检查 ===');
        
        if (typeof window.toggleTaskCardFlip === 'function') {
            console.log('✅ toggleTaskCardFlip 函数存在');
            console.log('函数源码预览:', window.toggleTaskCardFlip.toString().substring(0, 200) + '...');
        } else {
            console.error('❌ toggleTaskCardFlip 函数不存在');
            return false;
        }
        
        return true;
    }
    
    // 诊断2: 检查目标元素结构
    function diagnoseTargetElement() {
        console.log('\n=== 诊断2: 目标元素结构检查 ===');
        
        const task96Front = document.querySelector('#task-96-front.task-front');
        const task96Container = document.querySelector('.task-flip-container[data-task-id="96"]');
        
        if (task96Front) {
            console.log('✅ 找到 #task-96-front.task-front 元素');
            console.log('元素标签:', task96Front.tagName);
            console.log('父元素:', task96Front.parentElement?.className || '无');
            console.log('CSS类:', task96Front.className);
        } else {
            console.error('❌ 未找到 #task-96-front.task-front 元素');
        }
        
        if (task96Container) {
            console.log('✅ 找到对应的翻转容器');
            console.log('容器类名:', task96Container.className);
            console.log('是否已翻转:', task96Container.classList.contains('flipped'));
            console.log('data-task-id:', task96Container.dataset.taskId);
        } else {
            console.error('❌ 未找到对应的翻转容器');
        }
        
        return { front: task96Front, container: task96Container };
    }
    
    // 诊断3: 检查事件监听器
    function diagnoseEventListeners() {
        console.log('\n=== 诊断3: 事件监听器检查 ===');
        
        const elements = [
            '#task-96-front.task-front',
            '.task-flip-container[data-task-id="96"]',
            '.btn.btn-sm.btn-outline-primary'
        ];
        
        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`🔍 检查元素: ${selector}`);
                console.log('  元素存在: ✅');
                console.log('  click事件监听器数量:', getEventListeners(element)?.click?.length || 0);
                console.log('  其他事件监听器:', Object.keys(getEventListeners(element) || {}).filter(k => k !== 'click'));
            } else {
                console.log(`🔍 检查元素: ${selector} - 不存在 ❌`);
            }
        });
    }
    
    // 诊断4: 检查CSS样式
    function diagnoseCSSStyles() {
        console.log('\n=== 诊断4: CSS样式检查 ===');
        
        const container = document.querySelector('.task-flip-container[data-task-id="96"]');
        if (container) {
            const computedStyle = window.getComputedStyle(container);
            console.log('容器样式检查:');
            console.log('  perspective:', computedStyle.perspective);
            console.log('  transform-style:', computedStyle.transformStyle);
            console.log('  transition:', computedStyle.transition);
            console.log('  transform:', computedStyle.transform);
        }
        
        const front = document.querySelector('#task-96-front.task-front');
        if (front) {
            const computedStyle = window.getComputedStyle(front);
            console.log('正面元素样式检查:');
            console.log('  backface-visibility:', computedStyle.backfaceVisibility);
            console.log('  position:', computedStyle.position);
            console.log('  display:', computedStyle.display);
        }
    }
    
    // 诊断5: 执行翻转测试
    function testFlipFunctionality() {
        console.log('\n=== 诊断5: 翻转功能测试 ===');
        
        const container = document.querySelector('.task-flip-container[data-task-id="96"]');
        if (!container) {
            console.error('❌ 无法进行翻转测试 - 容器不存在');
            return;
        }
        
        const initialState = container.classList.contains('flipped');
        console.log('初始翻转状态:', initialState ? '已翻转' : '未翻转');
        
        // 尝试调用翻转函数
        try {
            console.log('🔄 调用 toggleTaskCardFlip("96")...');
            window.toggleTaskCardFlip('96');
            
            setTimeout(() => {
                const newState = container.classList.contains('flipped');
                console.log('翻转后状态:', newState ? '已翻转' : '未翻转');
                
                if (initialState === newState) {
                    console.error('❌ 翻转状态未改变 - 翻转功能失效');
                } else {
                    console.log('✅ 翻转状态已改变 - 翻转功能正常');
                }
                
                // 恢复原始状态
                if (newState !== initialState) {
                    console.log('🔄 恢复原始状态...');
                    window.toggleTaskCardFlip('96');
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ 调用翻转函数时出错:', error.message);
        }
    }
    
    // 诊断6: 检查DOM结构完整性
    function diagnoseDOMStructure() {
        console.log('\n=== 诊断6: DOM结构完整性检查 ===');
        
        const container = document.querySelector('.task-flip-container[data-task-id="96"]');
        if (!container) {
            console.error('❌ 容器不存在，无法检查结构');
            return;
        }
        
        const front = container.querySelector('.task-front');
        const back = container.querySelector('.task-back');
        
        console.log('结构检查结果:');
        console.log('  翻转容器存在: ✅');
        console.log('  正面元素存在:', front ? '✅' : '❌');
        console.log('  背面元素存在:', back ? '✅' : '❌');
        
        if (front) {
            console.log('  正面元素ID:', front.id);
            console.log('  正面元素data-task-id:', front.dataset.taskId);
        }
        
        if (back) {
            console.log('  背面元素data-task-id:', back.dataset.taskId);
        }
    }
    
    // 主诊断函数
    function runFullDiagnosis() {
        console.log('🚀 开始全面诊断任务卡片翻转功能...\n');
        
        const functionExists = diagnoseFlipFunction();
        const elements = diagnoseTargetElement();
        diagnoseEventListeners();
        diagnoseCSSStyles();
        diagnoseDOMStructure();
        
        if (functionExists && elements.container) {
            testFlipFunctionality();
        }
        
        console.log('\n🏁 诊断完成');
    }
    
    // 页面加载完成后执行诊断
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runFullDiagnosis);
    } else {
        runFullDiagnosis();
    }
    
})();
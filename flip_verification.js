/**
 * 翻转功能验证脚本
 * 用于检查紧急修复是否正常工作
 */

(function() {
    'use strict';
    
    // 验证函数
    function verifyFlipFix() {
        console.log('🔍 开始验证翻转功能修复...');
        
        // 检查关键元素是否存在
        const containers = document.querySelectorAll('.task-flip-container');
        const frontElements = document.querySelectorAll('.task-front');
        const backElements = document.querySelectorAll('.task-back');
        
        console.log(`📊 统计信息:`);
        console.log(`   - 翻转容器数量: ${containers.length}`);
        console.log(`   - 正面元素数量: ${frontElements.length}`);
        console.log(`   - 背面元素数量: ${backElements.length}`);
        
        // 检查样式是否正确应用
        const styleSheet = document.getElementById('emergency-flip-styles');
        console.log(`🎨 紧急样式表: ${styleSheet ? '✅ 存在' : '❌ 缺失'}`);
        
        // 检查关键函数是否存在
        console.log(`⚡ 紧急修复函数: ${typeof window.performEmergencyFlipFix === 'function' ? '✅ 存在' : '❌ 缺失'}`);
        console.log(`⚡ 删除函数: ${typeof window.emergencyDeleteTask === 'function' ? '✅ 存在' : '❌ 缺失'}`);
        
        // 检查特定任务卡片
        const targetTask = document.querySelector('#task-95-front.task-front');
        if (targetTask) {
            const container = targetTask.closest('.task-flip-container');
            console.log(`🎯 目标任务卡片: ${container ? '✅ 结构完整' : '❌ 结构缺失'}`);
            
            if (container) {
                // 测试点击功能
                console.log('🧪 测试点击功能...');
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                });
                
                // 监听翻转事件
                const flipListener = function(e) {
                    console.log(`🔄 翻转事件触发: 任务${e.detail.taskId}, 状态${e.detail.flipped ? '背面' : '正面'}`);
                };
                
                document.addEventListener('taskCardFlipped', flipListener);
                
                // 模拟点击
                container.dispatchEvent(clickEvent);
                
                setTimeout(() => {
                    const isFlipped = container.classList.contains('flipped');
                    console.log(`✅ 点击测试结果: ${isFlipped ? '成功翻转到背面' : '仍在正面'}`);
                    document.removeEventListener('taskCardFlipped', flipListener);
                }, 600);
            }
        } else {
            console.log('❌ 未找到目标任务卡片 #task-95-front');
        }
        
        // 总结
        console.log('\n📋 验证总结:');
        if (containers.length > 0 && styleSheet && typeof window.performEmergencyFlipFix === 'function') {
            console.log('🎉 翻转功能修复验证通过！');
            console.log('💡 现在可以正常使用任务卡片翻转功能');
        } else {
            console.log('⚠️ 翻转功能修复可能存在问题');
            console.log('💡 建议重新执行紧急修复');
        }
    }
    
    // 页面加载完成后执行验证
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', verifyFlipFix);
    } else {
        setTimeout(verifyFlipFix, 500);
    }
    
    // 暴露到全局
    window.verifyFlipFix = verifyFlipFix;
    
})();
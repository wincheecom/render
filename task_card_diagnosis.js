/**
 * 任务卡片诊断工具
 * 帮助识别当前页面中的任务卡片结构和ID
 */

(function() {
    'use strict';
    
    console.log('🔍 启动任务卡片诊断工具...');
    
    function diagnoseTaskCards() {
        console.log('\n=== 任务卡片诊断报告 ===');
        
        // 查找所有可能的任务相关元素
        const taskFronts = document.querySelectorAll('.task-front');
        const taskBacks = document.querySelectorAll('.task-back');
        const flipContainers = document.querySelectorAll('.task-flip-container');
        const galleryImgs = document.querySelectorAll('.task-gallery-img');
        
        console.log(`📊 元素统计:`);
        console.log(`   - .task-front 元素: ${taskFronts.length} 个`);
        console.log(`   - .task-back 元素: ${taskBacks.length} 个`);
        console.log(`   - .task-flip-container 元素: ${flipContainers.length} 个`);
        console.log(`   - .task-gallery-img 元素: ${galleryImgs.length} 个`);
        
        // 分析 task-front 元素
        if (taskFronts.length > 0) {
            console.log('\n📋 .task-front 元素详情:');
            taskFronts.forEach((element, index) => {
                console.log(`\n--- 元素 ${index + 1} ---`);
                console.log(`   ID: ${element.id || '无ID'}`);
                console.log(`   data-task-id: ${element.dataset.taskId || '无data-task-id'}`);
                console.log(`   class: ${element.className}`);
                console.log(`   parent: ${element.parentElement ? element.parentElement.className : '无父元素'}`);
                
                // 检查是否在翻转容器中
                const container = element.closest('.task-flip-container');
                console.log(`   翻转容器: ${container ? '✅ 存在' : '❌ 不存在'}`);
                
                if (container) {
                    console.log(`   容器ID: ${container.dataset.taskId || '无ID'}`);
                    console.log(`   翻转状态: ${container.classList.contains('flipped') ? '背面' : '正面'}`);
                }
            });
        }
        
        // 分析 task-gallery-img 元素
        if (galleryImgs.length > 0) {
            console.log('\n🖼️ .task-gallery-img 元素详情:');
            galleryImgs.forEach((element, index) => {
                console.log(`\n--- 图片容器 ${index + 1} ---`);
                console.log(`   offsetWidth: ${element.offsetWidth}px`);
                console.log(`   offsetHeight: ${element.offsetHeight}px`);
                console.log(`   computed width: ${window.getComputedStyle(element).width}`);
                console.log(`   computed height: ${window.getComputedStyle(element).height}`);
                console.log(`   parent class: ${element.parentElement ? element.parentElement.className : '无父元素'}`);
            });
        }
        
        // 检查销售运营模块
        const salesSection = document.querySelector('.sales-operations-container');
        console.log(`\n🏪 销售运营模块: ${salesSection ? '✅ 存在' : '❌ 不存在'}`);
        
        if (salesSection) {
            const publishedGallery = salesSection.querySelector('.published-tasks-gallery');
            console.log(`   发布任务画廊: ${publishedGallery ? '✅ 存在' : '❌ 不存在'}`);
            
            if (publishedGallery) {
                const taskCards = publishedGallery.querySelectorAll('[id^="task-"]');
                console.log(`   任务卡片数量: ${taskCards.length} 个`);
                
                taskCards.forEach((card, index) => {
                    console.log(`     卡片 ${index + 1}: ${card.id}, 类型: ${card.className}`);
                });
            }
        }
        
        // 检查可用的修复函数
        console.log('\n⚙️ 可用修复函数:');
        console.log(`   performEmergencyFlipFix: ${typeof window.performEmergencyFlipFix === 'function' ? '✅ 可用' : '❌ 不可用'}`);
        console.log(`   verifyFlipFix: ${typeof window.verifyFlipFix === 'function' ? '✅ 可用' : '❌ 不可用'}`);
        console.log(`   toggleTaskCardFlip: ${typeof window.toggleTaskCardFlip === 'function' ? '✅ 可用' : '❌ 不可用'}`);
        
        // 总结建议
        console.log('\n💡 诊断建议:');
        if (taskFronts.length === 0) {
            console.log('   ⚠️ 未找到任何 .task-front 元素，请确认是否在正确的页面模块');
        } else if (flipContainers.length === 0) {
            console.log('   🔧 需要为任务卡片添加翻转容器结构');
            console.log('   💡 建议执行: performEmergencyFlipFix()');
        } else {
            console.log('   ✅ 翻转结构基本完整');
            console.log('   💡 可以测试翻转功能: 点击任务卡片查看效果');
        }
        
        console.log('\n=== 诊断完成 ===');
    }
    
    // 页面加载完成后执行诊断
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(diagnoseTaskCards, 1000);
        });
    } else {
        setTimeout(diagnoseTaskCards, 1000);
    }
    
    // 暴露到全局
    window.diagnoseTaskCards = diagnoseTaskCards;
    
    console.log('🔧 任务卡片诊断工具已加载，可在控制台执行 diagnoseTaskCards() 查看详细信息');
    
})();
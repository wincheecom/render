/**
 * 仓库任务结构诊断脚本
 * 分析当前DOM结构，验证容器层级关系
 */

(function() {
    'use strict';
    
    console.log('🔍 开始仓库任务结构诊断...');
    
    // 1. 查找主要容器
    const warehouseContainer = document.getElementById('warehouseTasks');
    if (!warehouseContainer) {
        console.error('❌ 未找到主仓库容器 #warehouseTasks');
        return;
    }
    
    console.log('✅ 找到主仓库容器:', warehouseContainer);
    console.log('   容器ID:', warehouseContainer.id);
    console.log('   容器类名:', warehouseContainer.className);
    
    // 2. 查找画廊容器
    const galleryContainers = warehouseContainer.querySelectorAll('.task-gallery.warehouse-tasks-gallery');
    console.log('\n📊 画廊容器分析:');
    console.log('   找到画廊容器数量:', galleryContainers.length);
    
    galleryContainers.forEach((container, index) => {
        console.log(`\n   画廊容器 ${index + 1}:`);
        console.log('   - 元素:', container);
        console.log('   - ID:', container.id || '无ID');
        console.log('   - 类名:', container.className);
        console.log('   - 子元素数量:', container.children.length);
        
        // 分析子元素
        const children = Array.from(container.children);
        children.forEach((child, childIndex) => {
            console.log(`     子元素 ${childIndex + 1}:`);
            console.log(`       标签名: ${child.tagName}`);
            console.log(`       类名: ${child.className}`);
            console.log(`       data-task-id: ${child.dataset.taskId || '无'}`);
            
            if (child.classList.contains('task-flip-container')) {
                const front = child.querySelector('.task-front');
                const back = child.querySelector('.task-back');
                console.log(`       包含正面: ${!!front}`);
                console.log(`       包含背面: ${!!back}`);
                if (front) {
                    console.log(`       正面ID: ${front.id || '无'}`);
                }
            }
        });
    });
    
    // 3. 查找所有任务卡片
    const allTaskCards = warehouseContainer.querySelectorAll('.task-flip-container');
    console.log('\n📋 任务卡片总览:');
    console.log('   总任务卡片数:', allTaskCards.length);
    
    allTaskCards.forEach((card, index) => {
        const taskId = card.dataset.taskId || '无ID';
        const parentClass = card.parentElement?.className || '未知';
        const hasFront = !!card.querySelector('.task-front');
        const hasBack = !!card.querySelector('.task-back');
        
        console.log(`   ${index + 1}. 任务ID: ${taskId}`);
        console.log(`      父容器类名: ${parentClass}`);
        console.log(`      包含正面: ${hasFront}, 包含背面: ${hasBack}`);
    });
    
    // 4. 特别检查任务95和96
    console.log('\n🎯 特定任务检查:');
    
    const task95Front = document.getElementById('task-95-front');
    const task96Container = document.querySelector('[data-task-id="96"]');
    
    if (task95Front) {
        console.log('✅ 找到任务95正面:');
        console.log('   元素:', task95Front);
        console.log('   父元素:', task95Front.parentElement);
        console.log('   祖父元素:', task95Front.parentElement?.parentElement);
    } else {
        console.log('❌ 未找到任务95正面元素');
    }
    
    if (task96Container) {
        console.log('✅ 找到任务96容器:');
        console.log('   元素:', task96Container);
        console.log('   父元素:', task96Container.parentElement);
        console.log('   祖父元素:', task96Container.parentElement?.parentElement);
    } else {
        console.log('❌ 未找到任务96容器');
    }
    
    // 5. 验证结构完整性
    console.log('\n✅ 结构诊断完成');
    console.log('💡 建议: 根据诊断结果决定是否需要调整容器结构');
    
})();
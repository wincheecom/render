/**
 * 仓库任务容器状态诊断脚本
 * 用于检查和分析仓库任务容器的当前状态
 */

(function() {
    'use strict';
    
    console.log('🔍 开始仓库任务容器状态诊断...');
    
    // 诊断信息收集
    const diagnosis = {
        timestamp: new Date().toISOString(),
        warehouseContainer: null,
        galleryContainers: [],
        taskCards: [],
        stabilityScriptActive: false,
        containerLayerIssues: false
    };
    
    // 1. 检查主仓库容器
    console.log('\n🏭 主仓库容器检查:');
    const warehouseContainer = document.getElementById('warehouseTasks');
    diagnosis.warehouseContainer = {
        exists: !!warehouseContainer,
        id: warehouseContainer?.id || '不存在',
        className: warehouseContainer?.className || '无',
        childrenCount: warehouseContainer?.children?.length || 0
    };
    
    console.log(`  主容器存在: ${diagnosis.warehouseContainer.exists ? '✅' : '❌'}`);
    if (warehouseContainer) {
        console.log(`  ID: ${warehouseContainer.id}`);
        console.log(`  类名: ${warehouseContainer.className}`);
        console.log(`  子元素数量: ${warehouseContainer.children.length}`);
    }
    
    // 2. 检查画廊容器
    console.log('\n🖼️ 画廊容器检查:');
    const galleryContainers = document.querySelectorAll('.task-gallery.warehouse-tasks-gallery');
    diagnosis.galleryContainers = Array.from(galleryContainers).map((container, index) => ({
        index: index + 1,
        id: container.id || '无ID',
        className: container.className,
        parent: container.parentElement?.id || container.parentElement?.className || '无父元素',
        childrenCount: container.children.length
    }));
    
    console.log(`  找到画廊容器数量: ${galleryContainers.length}`);
    galleryContainers.forEach((container, index) => {
        console.log(`  ${index + 1}. ID: ${container.id || '无ID'}, 父元素: ${container.parentElement?.id || '未知'}`);
        console.log(`     类名: ${container.className}`);
        console.log(`     子元素: ${container.children.length} 个`);
    });
    
    // 3. 检查任务卡片
    console.log('\n📋 任务卡片检查:');
    const taskCards = document.querySelectorAll('.task-flip-container');
    diagnosis.taskCards = Array.from(taskCards).map((card, index) => ({
        index: index + 1,
        taskId: card.dataset.taskId || '无ID',
        parent: card.parentElement?.className || '无父元素',
        hasFront: !!card.querySelector('.task-front'),
        hasBack: !!card.querySelector('.task-back')
    }));
    
    console.log(`  找到任务卡片数量: ${taskCards.length}`);
    const cardsWithTaskId = Array.from(taskCards).filter(card => card.dataset.taskId);
    console.log(`  有任务ID的卡片: ${cardsWithTaskId.length} 个`);
    
    // 4. 检查稳定性脚本状态
    console.log('\n🔧 稳定性脚本状态:');
    diagnosis.stabilityScriptActive = typeof window.checkAndRestoreContainer === 'function';
    console.log(`  checkAndRestoreContainer 函数: ${diagnosis.stabilityScriptActive ? '✅ 存在' : '❌ 不存在'}`);
    
    diagnosis.mutationObserverActive = typeof window.mutationObserver !== 'undefined';
    console.log(`  MutationObserver: ${diagnosis.mutationObserverActive ? '✅ 活跃' : '❌ 不活跃'}`);
    
    // 5. 检查容器层级问题
    console.log('\n🏗️ 容器层级结构检查:');
    if (warehouseContainer) {
        const nestedGalleries = warehouseContainer.querySelectorAll('.task-gallery.warehouse-tasks-gallery');
        diagnosis.containerLayerIssues = nestedGalleries.length > 0;
        
        console.log(`  嵌套画廊容器: ${nestedGalleries.length} 个 ${nestedGalleries.length > 0 ? '⚠️ 有问题' : '✅ 正常'}`);
        
        if (nestedGalleries.length > 0) {
            nestedGalleries.forEach((gallery, index) => {
                console.log(`    ${index + 1}. 嵌套容器位于: ${gallery.parentElement?.id || gallery.parentElement?.className || '未知位置'}`);
            });
        }
        
        // 检查直接子元素
        const directChildren = Array.from(warehouseContainer.children);
        console.log(`  直接子元素数量: ${directChildren.length}`);
        directChildren.forEach((child, index) => {
            console.log(`    ${index + 1}. ${child.tagName} - ${child.className || '无类名'} - ${child.id || '无ID'}`);
        });
    }
    
    // 6. 检查相关修复脚本
    console.log('\n🛠️ 相关修复脚本状态:');
    const scripts = [
        'warehouse_gallery_stability_fix.js',
        'remove_warehouse_container_layer.js',
        'deep_clean_warehouse_residuals.js'
    ];
    
    scripts.forEach(script => {
        const scriptLoaded = !!document.querySelector(`script[src*="${script}"]`);
        console.log(`  ${script}: ${scriptLoaded ? '✅ 已加载' : '❌ 未加载'}`);
    });
    
    // 7. 提供诊断建议
    console.log('\n💡 诊断建议:');
    
    if (!warehouseContainer) {
        console.log('  ❌ 主仓库容器不存在');
        console.log('  💡 建议: 检查是否在正确的页面模块');
    } else if (galleryContainers.length === 0) {
        console.log('  ⚠️ 未找到画廊容器');
        console.log('  💡 建议: 可能需要重新加载仓库任务数据');
        console.log('  💡 可以尝试执行: loadWarehouseTasks()');
    } else if (diagnosis.containerLayerIssues) {
        console.log('  ⚠️ 检测到容器层级问题');
        console.log('  💡 建议: 执行深度清理修复');
        console.log('  💡 可以尝试执行: performDeepClean()');
    } else {
        console.log('  ✅ 容器结构基本正常');
        console.log('  💡 稳定性监控正在运行');
    }
    
    // 8. 快速修复选项
    console.log('\n🔧 快速修复选项:');
    console.log('  1. window.checkAndRestoreContainer() - 检查并恢复容器');
    console.log('  2. window.performEmergencyFix() - 执行紧急修复');
    console.log('  3. window.performDeepClean() - 深度清理容器');
    console.log('  4. diagnoseWarehouseContainer() - 重新运行此诊断');
    
    // 暴露诊断信息到全局
    window.warehouseDiagnosis = diagnosis;
    
    // 创建便捷的诊断函数
    window.diagnoseWarehouseContainer = function() {
        console.clear();
        // 重新执行此脚本
        const script = document.createElement('script');
        script.textContent = '(' + arguments.callee.caller.toString() + ')();';
        document.head.appendChild(script);
    };
    
    console.log('\n🔍 诊断完成。可以通过 window.warehouseDiagnosis 查看详细信息');
    
})();
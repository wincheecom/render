// 仓库任务残留问题深度清理脚本
// 彻底清除所有可能导致布局异常的残留元素和样式

(function() {
    'use strict';
    
    console.log('🧹 启动仓库任务残留问题深度清理...');
    
    // 深度清理函数
    function deepCleanWarehouseResiduals() {
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) {
            console.warn('⚠️ 未找到仓库任务容器 #warehouseTasks');
            return false;
        }
        
        console.log('🔍 开始深度清理检查...');
        
        // 1. 清理所有嵌套的.gallery相关容器
        const nestedGalleries = warehouseContainer.querySelectorAll('.task-gallery, .warehouse-tasks-gallery');
        let cleanedElements = 0;
        
        nestedGalleries.forEach(element => {
            // 检查是否是直接子元素的嵌套容器
            if (element.parentElement === warehouseContainer && 
                element.classList.contains('task-gallery') && 
                element.classList.contains('warehouse-tasks-gallery')) {
                
                console.log('🗑️ 发现并清理嵌套容器:', element.className);
                
                // 将容器内的任务卡片移到主容器
                const taskCards = element.querySelectorAll('.task-flip-container');
                taskCards.forEach(card => {
                    warehouseContainer.appendChild(card);
                });
                
                // 移除空的嵌套容器
                if (element.children.length === 0) {
                    element.remove();
                }
                
                cleanedElements++;
            }
        });
        
        // 2. 清理孤立的空容器
        const emptyContainers = warehouseContainer.querySelectorAll(':scope > div');
        emptyContainers.forEach(container => {
            if (container.children.length === 0 && 
                (container.classList.contains('task-gallery') || 
                 container.classList.contains('warehouse-tasks-gallery'))) {
                console.log('🗑️ 清理空容器:', container.className);
                container.remove();
                cleanedElements++;
            }
        });
        
        // 3. 修复任务卡片的类名问题
        const taskCards = warehouseContainer.querySelectorAll('.task-flip-container');
        taskCards.forEach(card => {
            // 确保任务卡片没有多余的包装层
            const parent = card.parentElement;
            if (parent !== warehouseContainer && 
                parent.classList.contains('task-gallery')) {
                console.log('🔧 修复任务卡片层级:', card.getAttribute('data-task-id'));
                warehouseContainer.appendChild(card);
            }
        });
        
        // 4. 清理可能的重复元素
        const allElements = Array.from(warehouseContainer.children);
        const seenIds = new Set();
        
        allElements.forEach(element => {
            const taskId = element.getAttribute('data-task-id');
            if (taskId) {
                if (seenIds.has(taskId)) {
                    console.log('🗑️ 清理重复任务卡片:', taskId);
                    element.remove();
                    cleanedElements++;
                } else {
                    seenIds.add(taskId);
                }
            }
        });
        
        // 5. 重置容器的类名确保正确
        warehouseContainer.className = 'published-tasks-gallery task-gallery';
        
        console.log(`✅ 深度清理完成！共清理了 ${cleanedElements} 个问题元素`);
        return cleanedElements > 0;
    }
    
    // CSS样式残留清理
    function cleanCSSResiduals() {
        console.log('🎨 开始清理CSS样式残留...');
        
        // 移除可能冲突的内联样式
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (warehouseContainer) {
            // 清理容器的内联样式
            warehouseContainer.style.cssText = '';
            
            // 清理子元素的潜在问题样式
            const problematicElements = warehouseContainer.querySelectorAll('[style*="display: grid"]');
            problematicElements.forEach(element => {
                if (!element.classList.contains('warehouse-tasks-gallery')) {
                    element.style.display = '';
                    console.log('🔧 清理了不当的grid样式');
                }
            });
        }
        
        console.log('✅ CSS样式清理完成');
    }
    
    // 重建正确的网格布局
    function rebuildProperGrid() {
        console.log('🏗️ 重建正确的网格布局...');
        
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) return;
        
        // 确保只有任务卡片作为直接子元素
        const directChildren = Array.from(warehouseContainer.children);
        const taskCards = directChildren.filter(child => 
            child.classList.contains('task-flip-container')
        );
        
        // 清空容器
        warehouseContainer.innerHTML = '';
        
        // 重新添加任务卡片
        taskCards.forEach(card => {
            warehouseContainer.appendChild(card);
        });
        
        console.log(`✅ 重建完成！当前有 ${taskCards.length} 个任务卡片`);
    }
    
    // 验证最终状态
    function verifyFinalState() {
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) return false;
        
        const nestedGalleries = warehouseContainer.querySelectorAll('.task-gallery.warehouse-tasks-gallery');
        const taskCards = warehouseContainer.querySelectorAll('.task-flip-container');
        const directChildren = warehouseContainer.children.length;
        
        console.log('📊 最终状态验证:');
        console.log(`   - 嵌套容器数量: ${nestedGalleries.length}`);
        console.log(`   - 任务卡片数量: ${taskCards.length}`);
        console.log(`   - 直接子元素数量: ${directChildren}`);
        console.log(`   - 容器类名: ${warehouseContainer.className}`);
        
        const isClean = nestedGalleries.length === 0 && 
                       taskCards.length === directChildren &&
                       warehouseContainer.classList.contains('published-tasks-gallery') &&
                       warehouseContainer.classList.contains('task-gallery');
        
        if (isClean) {
            console.log('🎉 仓库任务结构完全正常！');
        } else {
            console.log('❌ 仍存在结构问题');
        }
        
        return isClean;
    }
    
    // 执行完整的深度清理流程
    function performDeepClean() {
        console.log('🚀 开始执行深度清理流程...');
        
        // 1. 深度清理元素
        deepCleanWarehouseResiduals();
        
        // 2. 清理CSS残留
        cleanCSSResiduals();
        
        // 3. 重建网格布局
        rebuildProperGrid();
        
        // 4. 验证最终状态
        setTimeout(() => {
            const isClean = verifyFinalState();
            if (isClean) {
                console.log('🎊 深度清理成功完成！');
            } else {
                console.log('⚠️ 清理可能不完全，请手动检查');
            }
        }, 200);
    }
    
    // 设置自动监控和清理
    function setupAutoMonitoring() {
        // 立即执行一次深度清理
        performDeepClean();
        
        // 设置定期检查（每10秒）
        setInterval(() => {
            const warehouseContainer = document.getElementById('warehouseTasks');
            if (warehouseContainer) {
                const nestedGalleries = warehouseContainer.querySelectorAll('.task-gallery.warehouse-tasks-gallery');
                if (nestedGalleries.length > 0) {
                    console.log('🔍 检测到残留问题，自动执行深度清理...');
                    performDeepClean();
                }
            }
        }, 10000);
        
        console.log('⏰ 已启动自动监控和深度清理');
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAutoMonitoring);
    } else {
        setupAutoMonitoring();
    }
    
    // 对外暴露功能
    window.deepCleanWarehouseResiduals = deepCleanWarehouseResiduals;
    window.performDeepClean = performDeepClean;
    window.verifyFinalState = verifyFinalState;
    
    console.log('🧹 仓库任务残留问题深度清理脚本已加载');
    console.log('💡 调用 performDeepClean() 执行完整深度清理');
    console.log('💡 调用 verifyFinalState() 验证当前状态');
    
})();
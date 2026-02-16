/**
 * 仓库任务画廊稳定性修复脚本
 * 解决 div.task-gallery.warehouse-tasks-gallery 容器消失问题
 */

(function() {
    'use strict';
    
    console.log('🔧 启动仓库任务画廊稳定性监控...');
    
    // 存储原始容器引用
    let originalGalleryContainer = null;
    let mutationObserver = null;
    let containerRestoreAttempts = 0;
    const MAX_RESTORE_ATTEMPTS = 5;
    
    // 修复1: 监控容器变化
    function monitorGalleryContainer() {
        console.log('👁️  开始监控仓库任务画廊容器...');
        
        // 查找目标容器
        const galleryContainer = document.querySelector('.task-gallery.warehouse-tasks-gallery');
        if (galleryContainer) {
            originalGalleryContainer = galleryContainer;
            console.log('✅ 找到原始容器:', galleryContainer);
        } else {
            console.warn('⚠️  未找到仓库任务画廊容器');
            return;
        }
        
        // 创建MutationObserver监控DOM变化
        mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // 检查是否有节点被移除
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach(function(removedNode) {
                        if (removedNode === originalGalleryContainer || 
                            (removedNode.nodeType === 1 && 
                             removedNode.classList && 
                             removedNode.classList.contains('warehouse-tasks-gallery'))) {
                            
                            console.warn('🚨 检测到仓库任务画廊容器被移除!');
                            handleContainerRemoval();
                        }
                    });
                }
                
                // 检查属性变化
                if (mutation.type === 'attributes' && mutation.target === originalGalleryContainer) {
                    console.log('📝 容器属性发生变化:', mutation.attributeName);
                }
            });
        });
        
        // 开始观察
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'id']
        });
        
        console.log('✅ 容器监控已启动');
    }
    
    // 修复2: 容器移除处理
    function handleContainerRemoval() {
        if (containerRestoreAttempts >= MAX_RESTORE_ATTEMPTS) {
            console.error('❌ 达到最大恢复尝试次数，停止自动恢复');
            showUserNotification('仓库任务显示异常，请刷新页面重试', 'error');
            return;
        }
        
        containerRestoreAttempts++;
        console.log(`🔄 尝试恢复容器 (第${containerRestoreAttempts}次)`);
        
        // 方法1: 重新加载仓库任务
        if (typeof loadWarehouseTasks === 'function') {
            console.log('🔁 调用 loadWarehouseTasks 重新加载任务');
            try {
                loadWarehouseTasks();
                setTimeout(verifyContainerRestored, 1000);
                return;
            } catch (error) {
                console.error('❌ loadWarehouseTasks 执行失败:', error);
            }
        }
        
        // 方法2: 手动重建容器
        rebuildGalleryContainer();
    }
    
    // 修复3: 重建容器
    function rebuildGalleryContainer() {
        console.log('🔨 尝试手动重建容器...');
        
        // 查找父容器
        const parentContainer = document.getElementById('warehouseTasks');
        if (!parentContainer) {
            console.error('❌ 未找到父容器 #warehouseTasks');
            return;
        }
        
        // 检查是否已有容器
        const existingContainer = parentContainer.querySelector('.task-gallery.warehouse-tasks-gallery');
        if (existingContainer) {
            console.log('✅ 容器已存在，无需重建');
            originalGalleryContainer = existingContainer;
            return;
        }
        
        // 创建新容器
        const newContainer = document.createElement('div');
        newContainer.className = 'task-gallery warehouse-tasks-gallery';
        newContainer.id = 'warehouseTasksGallery';
        
        // 添加必要的样式类
        newContainer.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-sync fa-spin fa-2x mb-3"></i>
                <p>正在重新加载任务数据...</p>
            </div>
        `;
        
        parentContainer.appendChild(newContainer);
        originalGalleryContainer = newContainer;
        
        console.log('✅ 新容器已创建:', newContainer);
        
        // 重新加载数据
        setTimeout(() => {
            if (typeof loadWarehouseTasks === 'function') {
                loadWarehouseTasks();
            }
        }, 500);
    }
    
    // 修复4: 验证容器恢复
    function verifyContainerRestored() {
        const currentContainer = document.querySelector('.task-gallery.warehouse-tasks-gallery');
        if (currentContainer) {
            console.log('✅ 容器已成功恢复');
            originalGalleryContainer = currentContainer;
            showUserNotification('任务列表已恢复显示', 'success');
        } else {
            console.warn('⚠️ 容器恢复验证失败');
            setTimeout(handleContainerRemoval, 2000);
        }
    }
    
    // 修复5: 阻止不必要的重绘
    function preventUnnecessaryRepaint() {
        console.log('🛡️  应用重绘防护措施...');
        
        // 保存重要的事件处理器
        const originalEventListeners = {};
        
        // 监控可能引起重绘的函数
        const suspiciousFunctions = [
            'renderWarehouseTasks',
            'updateWarehouseDisplay',
            'refreshWarehouseView'
        ];
        
        suspiciousFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                originalEventListeners[funcName] = window[funcName];
                
                window[funcName] = function(...args) {
                    console.log(`🔍 拦截函数调用: ${funcName}`, args);
                    
                    // 检查容器是否存在
                    const containerExists = document.querySelector('.task-gallery.warehouse-tasks-gallery');
                    if (!containerExists) {
                        console.warn(`⚠️  执行 ${funcName} 时容器不存在，先恢复容器`);
                        rebuildGalleryContainer();
                        setTimeout(() => {
                            originalEventListeners[funcName].apply(this, args);
                        }, 1000);
                        return;
                    }
                    
                    // 正常执行原函数
                    return originalEventListeners[funcName].apply(this, args);
                };
            }
        });
    }
    

    
    // 修复7: 页面生命周期管理
    function setupPageLifecycle() {
        // 页面可见性变化监听
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                console.log('👀 页面重新可见，检查容器状态');
                setTimeout(checkAndRestoreContainer, 1000);
            }
        });
        
        // 页面卸载前清理
        window.addEventListener('beforeunload', function() {
            if (mutationObserver) {
                mutationObserver.disconnect();
                console.log('🧹 已清理MutationObserver');
            }
        });
    }
    
    // 检查并恢复容器
    function checkAndRestoreContainer() {
        const container = document.querySelector('.task-gallery.warehouse-tasks-gallery');
        if (!container) {
            console.warn('🔍 检测到容器缺失，尝试恢复');
            handleContainerRemoval();
        } else {
            console.log('✅ 容器状态正常');
        }
    }
    
    // 主执行函数
    function initializeStabilityFix() {
        console.log('🚀 初始化仓库任务画廊稳定性修复...');
        
        try {
            monitorGalleryContainer();
            preventUnnecessaryRepaint();
            setupPageLifecycle();
            
            // 定期健康检查
            setInterval(checkAndRestoreContainer, 30000); // 每30秒检查一次
            
            console.log('🎉 仓库任务画廊稳定性修复已启动');
            
        } catch (error) {
            console.error('❌ 初始化过程中出现错误:', error);
            showUserNotification('稳定性修复启动失败', 'error');
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeStabilityFix);
    } else {
        // 延迟执行确保所有资源加载完成
        setTimeout(initializeStabilityFix, 1000);
    }
    
    // 如果页面已经加载完成，立即执行
    if (document.readyState === 'complete') {
        setTimeout(initializeStabilityFix, 2000);
    }
    
})();
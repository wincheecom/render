// 任务卡位置调整工具函数
// 可以根据需要动态调整任务在画廊中的显示位置

(function() {
    'use strict';
    
    // 任务位置映射配置
    const taskPositionConfig = {
        // 任务ID: [列, 行]
        77: [2, 1],  // 任务77显示在第2列第1行（第二个位置）
        74: [1, 1],  // 任务74显示在第1列第1行（第一个位置）
        // 可以添加更多任务的位置配置
    };
    
    // 应用任务位置配置
    function applyTaskPositions() {
        const containers = document.querySelectorAll('.task-flip-container[data-task-id]');
        
        containers.forEach(container => {
            const taskId = parseInt(container.getAttribute('data-task-id'));
            const position = taskPositionConfig[taskId];
            
            if (position) {
                container.style.gridColumn = position[0];
                container.style.gridRow = position[1];
                console.log(`任务 ${taskId} 已定位到列:${position[0]}, 行:${position[1]}`);
            }
        });
    }
    
    // 监听DOM变化，自动应用位置配置
    function observeTaskGallery() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // 检查是否有新的任务卡被添加
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && node.classList.contains('task-flip-container')) {
                                // 新任务卡添加后应用位置配置
                                setTimeout(applyTaskPositions, 100);
                            }
                        }
                    });
                }
            });
        });
        
        // 观察仓库任务容器
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (warehouseContainer) {
            observer.observe(warehouseContainer, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // 页面加载完成后初始化
    function init() {
        // 等待页面完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                applyTaskPositions();
                observeTaskGallery();
            });
        } else {
            applyTaskPositions();
            observeTaskGallery();
        }
        
        // 也监听自定义事件（如果有的话）
        document.addEventListener('tasksLoaded', applyTaskPositions);
        document.addEventListener('warehouseTasksUpdated', applyTaskPositions);
    }
    
    // 导出函数供外部调用
    window.TaskPositionManager = {
        applyPositions: applyTaskPositions,
        setPosition: function(taskId, column, row) {
            taskPositionConfig[taskId] = [column, row];
            applyTaskPositions();
        },
        getConfig: function() {
            return {...taskPositionConfig};
        },
        setConfig: function(config) {
            Object.assign(taskPositionConfig, config);
            applyTaskPositions();
        }
    };
    
    // 启动初始化
    init();
    
    console.log('🎯 任务位置管理器已初始化');
    console.log('🔧 可用命令:');
    console.log('- TaskPositionManager.applyPositions() // 应用当前位置配置');
    console.log('- TaskPositionManager.setPosition(taskId, column, row) // 设置特定任务位置');
    console.log('- TaskPositionManager.getConfig() // 获取当前配置');
    console.log('- TaskPositionManager.setConfig(newConfig) // 批量设置配置');
    
})();
/**
 * 仓库任务卡翻转初始化修复
 * 解决仓库任务卡需要刷新才能翻转的问题
 */

(function() {
    'use strict';
    
    console.log('🔧 启动仓库任务卡翻转初始化修复...');
    
    // 防止重复初始化
    if (window.warehouseFlipInitializationFixed) {
        console.log('✅ 仓库翻转初始化修复已在运行');
        return;
    }
    window.warehouseFlipInitializationFixed = true;
    
    // 存储已初始化的任务卡
    const initializedTasks = new Set();
    
    /**
     * 初始化仓库任务卡翻转功能
     * @param {HTMLElement} taskContainer - 任务容器元素
     */
    function initializeWarehouseTaskFlip(taskContainer) {
        const taskId = taskContainer.dataset.taskId;
        if (!taskId || initializedTasks.has(taskId)) {
            return; // 已经初始化过
        }
        
        try {
            // 获取任务正面元素
            const frontElement = taskContainer.querySelector('.task-front');
            if (!frontElement) {
                console.warn(`⚠️ 未找到任务正面元素: ${taskId}`);
                return;
            }
            
            // 添加翻转标识类
            taskContainer.classList.add('warehouse-task-initialized');
            
            // 绑定点击事件
            if (!frontElement._warehouseFlipBound) {
                frontElement.addEventListener('click', function(e) {
                    // 避免点击按钮时触发翻转
                    if (e.target.closest('button, a, input')) {
                        return;
                    }
                    
                    e.stopPropagation();
                    toggleWarehouseTaskFlip(taskId);
                });
                
                frontElement._warehouseFlipBound = true;
                console.log(`✅ 已为仓库任务 ${taskId} 绑定翻转事件`);
            }
            
            // 标记为已初始化
            initializedTasks.add(taskId);
            
            // 尝试获取并显示备注信息
            loadAndDisplayTaskRemark(taskId);
            
        } catch (error) {
            console.error(`❌ 初始化仓库任务 ${taskId} 翻转功能失败:`, error);
        }
    }
    
    /**
     * 加载并显示任务备注信息
     * @param {string} taskId - 任务ID
     */
    function loadAndDisplayTaskRemark(taskId) {
        // 延迟执行，等待DOM完全渲染
        setTimeout(() => {
            try {
                // 检查是否已经有备注内容
                const remarkDisplay = document.querySelector(`.task-remark-display[data-task-id="${taskId}"]`);
                if (!remarkDisplay) {
                    console.warn(`⚠️ 未找到备注显示区域: ${taskId}`);
                    return;
                }
                
                const placeholder = remarkDisplay.querySelector('.remark-placeholder');
                if (!placeholder) {
                    // 已经有备注内容，不需要重新加载
                    return;
                }
                
                // 请求服务器获取备注信息
                console.log(`📡 请求任务 ${taskId} 的备注信息...`);
                fetch(`/api/tasks/${taskId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(taskData => {
                        if (taskData && taskData.remark && taskData.remark.trim()) {
                            console.log(`📋 为仓库任务 ${taskId} 更新备注:`, taskData.remark.substring(0, 50) + '...');
                            if (typeof updateTaskRemarkDisplay === 'function') {
                                updateTaskRemarkDisplay(taskId, taskData.remark);
                            }
                        } else {
                            console.log(`ℹ️ 仓库任务 ${taskId} 无备注内容`);
                        }
                    })
                    .catch(error => {
                        console.warn(`⚠️ 获取仓库任务 ${taskId} 备注失败:`, error.message);
                    });
                    
            } catch (error) {
                console.error(`❌ 加载仓库任务 ${taskId} 备注信息失败:`, error);
            }
        }, 500);
    }
    
    /**
     * 扫描并初始化所有仓库任务卡
     */
    function scanAndInitializeWarehouseTasks() {
        const warehouseContainers = document.querySelectorAll('#warehouseTasks .task-flip-container');
        let initializedCount = 0;
        
        warehouseContainers.forEach(container => {
            const taskId = container.dataset.taskId;
            if (taskId && !initializedTasks.has(taskId)) {
                initializeWarehouseTaskFlip(container);
                initializedCount++;
            }
        });
        
        if (initializedCount > 0) {
            console.log(`✅ 成功初始化 ${initializedCount} 个仓库任务卡的翻转功能`);
        }
    }
    
    /**
     * 设置MutationObserver监听新添加的仓库任务
     */
    function setupWarehouseTaskObserver() {
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) {
            console.warn('⚠️ 未找到仓库任务容器 #warehouseTasks');
            return;
        }
        
        const observer = new MutationObserver(function(mutations) {
            let newTasksDetected = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否添加了新的任务容器
                            if (node.classList && node.classList.contains('task-flip-container')) {
                                newTasksDetected = true;
                                // 延迟初始化，等待元素完全渲染
                                setTimeout(() => {
                                    initializeWarehouseTaskFlip(node);
                                }, 100);
                            }
                            // 检查子节点中是否有任务容器
                            const taskContainers = node.querySelectorAll && node.querySelectorAll('.task-flip-container');
                            if (taskContainers && taskContainers.length > 0) {
                                newTasksDetected = true;
                                setTimeout(() => {
                                    taskContainers.forEach(container => {
                                        initializeWarehouseTaskFlip(container);
                                    });
                                }, 100);
                            }
                        }
                    });
                }
            });
            
            if (newTasksDetected) {
                console.log('🔍 检测到新的仓库任务，已自动初始化翻转功能');
            }
        });
        
        observer.observe(warehouseContainer, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ 已启动仓库任务添加监听器');
    }
    
    /**
     * 主初始化函数
     */
    function initializeWarehouseFlipSystem() {
        console.log('🚀 开始仓库任务翻转系统初始化...');
        
        try {
            // 立即扫描现有任务
            scanAndInitializeWarehouseTasks();
            
            // 设置监听器
            setupWarehouseTaskObserver();
            
            // 定期检查（防万一）
            setInterval(scanAndInitializeWarehouseTasks, 3000);
            
            console.log('✅ 仓库任务翻转初始化修复完成');
            
        } catch (error) {
            console.error('❌ 仓库任务翻转初始化失败:', error);
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWarehouseFlipSystem);
    } else {
        // DOM已经加载完成
        setTimeout(initializeWarehouseFlipSystem, 100);
    }
    
    // 也监听自定义的仓库任务加载事件
    document.addEventListener('warehouseTasksLoaded', function() {
        console.log('📥 收到仓库任务加载完成事件，重新初始化翻转功能');
        setTimeout(scanAndInitializeWarehouseTasks, 500);
    });
    
    // 暴露初始化函数到全局作用域
    window.initializeWarehouseTaskFlip = initializeWarehouseTaskFlip;
    window.scanAndInitializeWarehouseTasks = scanAndInitializeWarehouseTasks;
    
})();
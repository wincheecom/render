// 任务备注自动更新脚本
// 自动检测和更新任务卡片的备注显示

(function() {
    'use strict';
    
    console.log('🚀 启动任务备注自动更新系统...');
    
    // 防止重复请求的缓存
    const requestCache = new Map();
    const processedTasks = new Set();
    let isProcessing = false;
    
    // 自动检测和更新现有任务卡片的备注显示
    function autoUpdateExistingTaskRemarks() {
        // 防止同时多次执行
        if (isProcessing) {
            console.log('⏳ 正在处理中，跳过本次执行');
            return;
        }
        
        isProcessing = true;
        console.log('🔍 自动检测现有任务卡片备注...');
        
        // 查找所有任务卡片
        const taskCards = document.querySelectorAll('.task-flip-container[data-task-id]');
        console.log(`发现 ${taskCards.length} 个任务卡片`);
        
        if (taskCards.length === 0) {
            console.log('⚠️ 未发现任务卡片，稍后重试...');
            isProcessing = false;
            setTimeout(autoUpdateExistingTaskRemarks, 3000);
            return;
        }
        
        let processedCount = 0;
        
        taskCards.forEach((card, index) => {
            const taskId = card.dataset.taskId;
            if (taskId && !processedTasks.has(taskId)) {
                // 检查是否已经有备注内容
                const remarkDisplay = card.querySelector('.task-remark-display');
                if (remarkDisplay) {
                    const placeholder = remarkDisplay.querySelector('.remark-placeholder');
                    const remarkText = remarkDisplay.querySelector('.remark-text');
                    
                    // 如果只有占位符且没有备注文本，则尝试从服务器获取
                    if (placeholder && !remarkText) {
                        // 检查缓存或防抖
                        const cacheKey = `task_${taskId}`;
                        const now = Date.now();
                        const lastRequest = requestCache.get(cacheKey);
                        
                        // 防止频繁请求同一任务（间隔至少5秒）
                        if (!lastRequest || (now - lastRequest.timestamp) > 5000) {
                            requestCache.set(cacheKey, { timestamp: now, attempts: (lastRequest?.attempts || 0) + 1 });
                            
                            console.log(`📡 请求任务 ${taskId} 的备注信息...`);
                            
                            // 延迟执行以分散请求
                            setTimeout(() => {
                                fetch(`/api/tasks/${taskId}`)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                                        }
                                        return response.json();
                                    })
                                    .then(taskData => {
                                        if (taskData && taskData.remark && taskData.remark.trim()) {
                                            console.log(`📋 为任务 ${taskId} 更新备注:`, taskData.remark.substring(0, 50) + '...');
                                            if (typeof updateTaskRemarkDisplay === 'function') {
                                                updateTaskRemarkDisplay(taskId, taskData.remark);
                                                processedTasks.add(taskId); // 标记为已处理
                                            } else {
                                                console.warn('⚠️ updateTaskRemarkDisplay 函数不可用');
                                            }
                                        } else {
                                            console.log(`📝 任务 ${taskId} 没有备注信息`);
                                            processedTasks.add(taskId); // 即使没有备注也标记为已处理
                                        }
                                    })
                                    .catch(error => {
                                        console.warn(`⚠️ 获取任务 ${taskId} 备注失败:`, error.message);
                                        // 减少失败任务的重试频率
                                        const cacheEntry = requestCache.get(cacheKey);
                                        if (cacheEntry && cacheEntry.attempts > 3) {
                                            processedTasks.add(taskId); // 失败超过3次也标记为已处理
                                        }
                                    })
                                    .finally(() => {
                                        processedCount++;
                                        if (processedCount === taskCards.length) {
                                            isProcessing = false;
                                        }
                                    });
                            }, index * 300); // 分散请求时间
                        } else {
                            console.log(`⏭️ 跳过任务 ${taskId} 的重复请求`);
                            processedCount++;
                            if (processedCount === taskCards.length) {
                                isProcessing = false;
                            }
                        }
                    } else if (remarkText) {
                        console.log(`✅ 任务 ${taskId} 备注已存在:`, remarkText.textContent.substring(0, 30) + '...');
                        processedTasks.add(taskId); // 标记为已处理
                        processedCount++;
                        if (processedCount === taskCards.length) {
                            isProcessing = false;
                        }
                    }
                }
            } else if (taskId && processedTasks.has(taskId)) {
                console.log(`⏭️ 任务 ${taskId} 已经处理过，跳过`);
                processedCount++;
                if (processedCount === taskCards.length) {
                    isProcessing = false;
                }
            }
        });
        
        // 如果没有需要处理的任务，释放锁
        if (processedCount === 0) {
            isProcessing = false;
        }
    }
    
    // 监听新任务卡片的添加
    function observeNewTaskCards() {
        const observer = new MutationObserver(function(mutations) {
            let hasNewTasks = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是新的任务卡片
                            if (node.classList && node.classList.contains('task-flip-container') && node.dataset.taskId) {
                                const taskId = node.dataset.taskId;
                                if (!processedTasks.has(taskId)) {
                                    console.log(`🆕 检测到新任务卡片: ${taskId}`);
                                    hasNewTasks = true;
                                    // 从已处理集合中移除，以便重新处理
                                    processedTasks.delete(taskId);
                                    // 清除缓存
                                    requestCache.delete(`task_${taskId}`);
                                }
                            }
                        }
                    });
                }
            });
            
            // 如果检测到新任务，延迟处理
            if (hasNewTasks) {
                setTimeout(() => {
                    autoUpdateExistingTaskRemarks();
                }, 1500);
            }
        });
        
        // 观察主要容器
        const containers = ['#warehouseTasks', '#publishedTasksBody'];
        containers.forEach(selector => {
            const container = document.querySelector(selector);
            if (container) {
                observer.observe(container, {
                    childList: true,
                    subtree: true
                });
                console.log(`👁️ 已开始观察容器: ${selector}`);
            }
        });
    }
    
    // 在页面加载完成后执行自动更新
    function initializeAutoUpdate() {
        console.log('🔄 初始化任务备注自动更新...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(autoUpdateExistingTaskRemarks, 2000);
                setTimeout(observeNewTaskCards, 2500);
            });
        } else {
            setTimeout(autoUpdateExistingTaskRemarks, 2000);
            setTimeout(observeNewTaskCards, 2500);
        }
        
        // 监听自定义事件
        document.addEventListener('tasksLoaded', function() {
            console.log('🎯 收到任务加载完成事件');
            // 清空处理记录，重新处理所有任务
            processedTasks.clear();
            requestCache.clear();
            setTimeout(autoUpdateExistingTaskRemarks, 800);
        });
        
        document.addEventListener('taskCardCreated', function(event) {
            console.log('🆕 收到任务卡片创建事件:', event.detail?.taskId);
            if (event.detail?.taskId) {
                // 从已处理集合中移除新任务，以便处理
                processedTasks.delete(event.detail.taskId);
                requestCache.delete(`task_${event.detail.taskId}`);
            }
            setTimeout(autoUpdateExistingTaskRemarks, 1200);
        });
        
        // 定期清理缓存（每5分钟）
        setInterval(() => {
            const now = Date.now();
            for (const [key, value] of requestCache.entries()) {
                if ((now - value.timestamp) > 300000) { // 5分钟
                    requestCache.delete(key);
                }
            }
            console.log('🧹 清理过期缓存完成');
        }, 300000);
        
        console.log('✅ 任务备注自动更新系统初始化完成');
    }
    
    // 启动系统
    initializeAutoUpdate();
    
})();
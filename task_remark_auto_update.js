// 任务备注自动更新脚本
// 自动检测和更新任务卡片的备注显示

(function() {
    'use strict';
    
    console.log('🚀 启动任务备注自动更新系统...');
    
    // 自动检测和更新现有任务卡片的备注显示
    function autoUpdateExistingTaskRemarks() {
        console.log('🔍 自动检测现有任务卡片备注...');
        
        // 查找所有任务卡片
        const taskCards = document.querySelectorAll('.task-flip-container[data-task-id]');
        console.log(`发现 ${taskCards.length} 个任务卡片`);
        
        if (taskCards.length === 0) {
            console.log('⚠️ 未发现任务卡片，稍后重试...');
            setTimeout(autoUpdateExistingTaskRemarks, 2000);
            return;
        }
        
        taskCards.forEach(card => {
            const taskId = card.dataset.taskId;
            if (taskId) {
                // 延迟执行以确保DOM完全加载
                setTimeout(() => {
                    // 检查是否已经有备注内容
                    const remarkDisplay = card.querySelector('.task-remark-display');
                    if (remarkDisplay) {
                        const placeholder = remarkDisplay.querySelector('.remark-placeholder');
                        const remarkText = remarkDisplay.querySelector('.remark-text');
                        
                        // 如果只有占位符且没有备注文本，则尝试从服务器获取
                        if (placeholder && !remarkText) {
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
                                        console.log(`📋 为任务 ${taskId} 更新备注:`, taskData.remark.substring(0, 50) + '...');
                                        if (typeof updateTaskRemarkDisplay === 'function') {
                                            updateTaskRemarkDisplay(taskId, taskData.remark);
                                        } else {
                                            console.warn('⚠️ updateTaskRemarkDisplay 函数不可用');
                                        }
                                    } else {
                                        console.log(`📝 任务 ${taskId} 没有备注信息`);
                                    }
                                })
                                .catch(error => {
                                    console.warn(`⚠️ 获取任务 ${taskId} 备注失败:`, error.message);
                                });
                        } else if (remarkText) {
                            console.log(`✅ 任务 ${taskId} 备注已存在:`, remarkText.textContent.substring(0, 30) + '...');
                        }
                    }
                }, 800);
            }
        });
    }
    
    // 监听新任务卡片的添加
    function observeNewTaskCards() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是新的任务卡片
                            if (node.classList && node.classList.contains('task-flip-container') && node.dataset.taskId) {
                                console.log(`🆕 检测到新任务卡片: ${node.dataset.taskId}`);
                                // 延迟处理新添加的卡片
                                setTimeout(() => {
                                    autoUpdateExistingTaskRemarks();
                                }, 1000);
                            }
                        }
                    });
                }
            });
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
                setTimeout(autoUpdateExistingTaskRemarks, 1500);
                setTimeout(observeNewTaskCards, 2000);
            });
        } else {
            setTimeout(autoUpdateExistingTaskRemarks, 1500);
            setTimeout(observeNewTaskCards, 2000);
        }
        
        // 监听自定义事件
        document.addEventListener('tasksLoaded', function() {
            console.log('🎯 收到任务加载完成事件');
            setTimeout(autoUpdateExistingTaskRemarks, 500);
        });
        
        document.addEventListener('taskCardCreated', function(event) {
            console.log('🆕 收到任务卡片创建事件:', event.detail?.taskId);
            setTimeout(autoUpdateExistingTaskRemarks, 1000);
        });
        
        console.log('✅ 任务备注自动更新系统初始化完成');
    }
    
    // 启动系统
    initializeAutoUpdate();
    
})();
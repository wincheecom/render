/**
 * 仓库任务容器协调管理系统
 * 统一管理所有仓库相关的容器监控和修复脚本
 * 避免多个脚本同时操作导致的冲突
 */

(function() {
    'use strict';
    
    console.log('🔄 启动仓库容器协调管理系统...');
    
    // 全局状态管理
    const ContainerManager = {
        // 容器状态
        containers: new Map(),
        // 活跃的监控器
        activeMonitors: new Set(),
        // 恢复尝试计数
        restoreAttempts: new Map(),
        // 最大恢复尝试次数
        MAX_RESTORE_ATTEMPTS: 3,
        
        // 初始化
        init() {
            console.log('🔧 初始化容器管理系统...');
            this.scanContainers();
            this.setupCoordination();
            this.startUnifiedMonitoring();
        },
        
        // 扫描现有容器
        scanContainers() {
            console.log('🔍 扫描现有容器...');
            
            // 清空之前的扫描结果
            this.containers.clear();
            
            // 首先检查主仓库容器
            const warehouseContainer = document.getElementById('warehouseTasks');
            if (warehouseContainer) {
                console.log('✅ 发现主仓库容器: #warehouseTasks');
                
                // 检查是否有任务画廊容器
                const galleryContainers = warehouseContainer.querySelectorAll('.task-gallery.warehouse-tasks-gallery');
                
                if (galleryContainers.length > 0) {
                    galleryContainers.forEach((container, index) => {
                        const containerId = container.id || `container-${Date.now()}-${index}`;
                        this.containers.set(containerId, {
                            element: container,
                            id: containerId,
                            parent: container.parentElement?.id || 'unknown',
                            taskCount: container.querySelectorAll('.task-flip-container').length,
                            lastSeen: Date.now()
                        });
                        
                        console.log(`  ✅ 发现任务画廊容器: ${containerId} (${container.querySelectorAll('.task-flip-container').length} 个任务)`);
                    });
                } else {
                    // 如果没有任务画廊容器，但主容器存在，记录主容器
                    console.log('  ℹ️ 主仓库容器存在但暂无任务画廊容器');
                    this.containers.set('warehouseTasks', {
                        element: warehouseContainer,
                        id: 'warehouseTasks',
                        parent: 'root',
                        taskCount: 0,
                        lastSeen: Date.now()
                    });
                }
            } else {
                console.warn('⚠️ 未发现主仓库容器 #warehouseTasks');
                // 即使没找到主容器，也记录这个状态
                this.containers.set('not-found', {
                    element: null,
                    id: 'not-found',
                    parent: 'none',
                    taskCount: 0,
                    lastSeen: Date.now()
                });
            }
            
            // 不再显示警告，改为信息级别日志
            if (this.containers.size <= 1 && !this.containers.has('warehouseTasks')) {
                console.info('ℹ️ 当前未发现活跃的仓库任务容器');
            } else {
                console.log(`✅ 共发现 ${this.containers.size} 个仓库相关容器`);
            }
        },
        
        // 设置协调机制
        setupCoordination() {
            console.log('🤝 设置脚本协调机制...');
            
            // 阻止重复的监控器启动
            if (window.ContainerCoordinationActive) {
                console.log('ℹ️ 协调系统已在运行，跳过重复初始化');
                return;
            }
            
            window.ContainerCoordinationActive = true;
            
            // 拦截可能冲突的函数调用
            const conflictingScripts = [
                'warehouse_gallery_stability_fix.js',
                'remove_warehouse_container_layer.js', 
                'deep_clean_warehouse_residuals.js'
            ];
            
            conflictingScripts.forEach(scriptName => {
                const scriptElement = document.querySelector(`script[src*="${scriptName}"]`);
                if (scriptElement) {
                    console.log(`  🛡️ 协调 ${scriptName}`);
                    this.coordinateScript(scriptName);
                }
            });
        },
        
        // 协调单个脚本
        coordinateScript(scriptName) {
            // 保存原始函数
            const originalFunctions = {};
            
            switch(scriptName) {
                case 'warehouse_gallery_stability_fix.js':
                    if (typeof window.checkAndRestoreContainer === 'function') {
                        originalFunctions.checkAndRestoreContainer = window.checkAndRestoreContainer;
                        window.checkAndRestoreContainer = this.createCoordinatedFunction(
                            originalFunctions.checkAndRestoreContainer, 
                            '容器检查'
                        );
                    }
                    break;
                    
                case 'remove_warehouse_container_layer.js':
                    if (typeof window.removeWarehouseContainerLayer === 'function') {
                        originalFunctions.removeWarehouseContainerLayer = window.removeWarehouseContainerLayer;
                        window.removeWarehouseContainerLayer = this.createCoordinatedFunction(
                            originalFunctions.removeWarehouseContainerLayer,
                            '容器层移除'
                        );
                    }
                    break;
                    
                case 'deep_clean_warehouse_residuals.js':
                    if (typeof window.performDeepClean === 'function') {
                        originalFunctions.performDeepClean = window.performDeepClean;
                        window.performDeepClean = this.createCoordinatedFunction(
                            originalFunctions.performDeepClean,
                            '深度清理'
                        );
                    }
                    break;
            }
        },
        
        // 创建协调函数
        createCoordinatedFunction(originalFunc, operationName) {
            return function(...args) {
                console.log(`🔄 协调操作: ${operationName}`);
                
                // 检查是否应该执行
                if (ContainerManager.shouldAllowOperation(operationName)) {
                    try {
                        const result = originalFunc.apply(this, args);
                        ContainerManager.logOperation(operationName, 'success');
                        return result;
                    } catch (error) {
                        ContainerManager.logOperation(operationName, 'error', error.message);
                        throw error;
                    }
                } else {
                    console.log(`⏭️ 跳过 ${operationName} - 由协调系统统一管理`);
                    return false;
                }
            };
        },
        
        // 判断是否允许操作
        shouldAllowOperation(operationName) {
            // 简单的频率控制
            const now = Date.now();
            const lastExecution = this.restoreAttempts.get(operationName) || 0;
            
            if (now - lastExecution < 5000) { // 5秒内不重复执行相同操作
                return false;
            }
            
            this.restoreAttempts.set(operationName, now);
            return true;
        },
        
        // 记录操作日志
        logOperation(operationName, status, errorMessage = null) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                operation: operationName,
                status: status,
                error: errorMessage,
                containerCount: this.containers.size
            };
            
            console.log(`📝 操作日志: ${operationName} - ${status.toUpperCase()} ${errorMessage ? '- ' + errorMessage : ''}`);
            
            // 暴露到全局供调试
            if (!window.containerOperationLogs) {
                window.containerOperationLogs = [];
            }
            window.containerOperationLogs.push(logEntry);
        },
        
        // 统一监控系统
        startUnifiedMonitoring() {
            console.log('👁️ 启动统一监控系统...');
            
            // 使用单个MutationObserver监控所有相关变化
            const warehouseContainer = document.getElementById('warehouseTasks');
            if (!warehouseContainer) {
                console.error('❌ 未找到主仓库容器');
                return;
            }
            
            const observer = new MutationObserver((mutations) => {
                this.handleMutations(mutations);
            });
            
            observer.observe(warehouseContainer, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'id']
            });
            
            this.activeMonitors.add(observer);
            console.log('✅ 统一监控已启动');
        },
        
        // 处理DOM变化
        handleMutations(mutations) {
            let containerChanges = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // 检查容器添加/移除
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && 
                            node.classList?.contains('task-gallery') && 
                            node.classList?.contains('warehouse-tasks-gallery')) {
                            console.log('🆕 检测到新容器添加');
                            containerChanges = true;
                        }
                    });
                    
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === 1 && 
                            node.classList?.contains('task-gallery') && 
                            node.classList?.contains('warehouse-tasks-gallery')) {
                            console.log('🗑️ 检测到容器移除');
                            containerChanges = true;
                        }
                    });
                }
            });
            
            if (containerChanges) {
                // 延迟重新扫描，避免频繁操作
                clearTimeout(this.rescanTimeout);
                this.rescanTimeout = setTimeout(() => {
                    this.rescanContainers();
                }, 1000);
            }
        },
        
        // 重新扫描容器
        rescanContainers() {
            console.log('🔍 重新扫描容器...');
            const previousCount = this.containers.size;
            
            // 清理已不存在的容器
            for (const [containerId, containerInfo] of this.containers) {
                if (!document.contains(containerInfo.element)) {
                    console.log(`  🗑️ 清理已消失的容器: ${containerId}`);
                    this.containers.delete(containerId);
                }
            }
            
            // 添加新发现的容器
            this.scanContainers();
            
            const currentCount = this.containers.size;
            if (previousCount !== currentCount) {
                console.log(`📊 容器数量变化: ${previousCount} → ${currentCount}`);
                this.handleContainerCountChange(previousCount, currentCount);
            }
        },
        
        // 处理容器数量变化
        handleContainerCountChange(oldCount, newCount) {
            if (newCount === 0 && oldCount > 0) {
                console.warn('🚨 检测到所有容器消失！');
                this.attemptUnifiedRecovery();
            } else if (newCount > oldCount) {
                console.log('🎉 检测到新容器添加');
            } else if (newCount < oldCount) {
                console.log('⚠️ 检测到容器减少');
            }
        },
        
        // 统一恢复机制
        attemptUnifiedRecovery() {
            const attemptKey = 'unified-recovery';
            const attempts = this.restoreAttempts.get(attemptKey) || 0;
            
            if (attempts >= this.MAX_RESTORE_ATTEMPTS) {
                console.error('❌ 达到最大统一恢复尝试次数');
                if (typeof Utils !== 'undefined' && typeof Utils.showAlert === 'function') {
                    Utils.showAlert('仓库任务显示异常，请刷新页面', 'error');
                }
                return;
            }
            
            this.restoreAttempts.set(attemptKey, attempts + 1);
            console.log(`🔄 执行统一恢复尝试 (${attempts + 1}/${this.MAX_RESTORE_ATTEMPTS})`);
            
            // 按优先级执行恢复操作
            const recoverySteps = [
                this.tryLoadWarehouseTasks.bind(this),
                this.tryRebuildContainer.bind(this),
                this.tryReloadPage.bind(this)
            ];
            
            this.executeRecoverySteps(recoverySteps, 0);
        },
        
        // 执行恢复步骤
        executeRecoverySteps(steps, currentIndex) {
            if (currentIndex >= steps.length) {
                console.error('❌ 所有恢复步骤均已尝试，未能成功恢复');
                return;
            }
            
            const step = steps[currentIndex];
            console.log(`🔧 执行恢复步骤 ${currentIndex + 1}/${steps.length}`);
            
            Promise.resolve()
                .then(() => step())
                .then(success => {
                    if (success) {
                        console.log('✅ 恢复步骤成功');
                        // 重置恢复计数
                        this.restoreAttempts.set('unified-recovery', 0);
                    } else {
                        console.log(`⏭️ 恢复步骤 ${currentIndex + 1} 失败，尝试下一步`);
                        setTimeout(() => {
                            this.executeRecoverySteps(steps, currentIndex + 1);
                        }, 1000);
                    }
                })
                .catch(error => {
                    console.error(`❌ 恢复步骤 ${currentIndex + 1} 出错:`, error);
                    setTimeout(() => {
                        this.executeRecoverySteps(steps, currentIndex + 1);
                    }, 1000);
                });
        },
        
        // 尝试加载仓库任务
        tryLoadWarehouseTasks() {
            if (typeof loadWarehouseTasks === 'function') {
                console.log('🔁 调用 loadWarehouseTasks');
                try {
                    loadWarehouseTasks();
                    return new Promise(resolve => {
                        setTimeout(() => {
                            const containers = document.querySelectorAll('.task-gallery.warehouse-tasks-gallery');
                            resolve(containers.length > 0);
                        }, 2000);
                    });
                } catch (error) {
                    console.error('loadWarehouseTasks 执行失败:', error);
                    return Promise.resolve(false);
                }
            }
            return Promise.resolve(false);
        },
        
        // 尝试重建容器
        tryRebuildContainer() {
            console.log('🔨 尝试手动重建容器');
            const warehouseContainer = document.getElementById('warehouseTasks');
            if (!warehouseContainer) {
                return Promise.resolve(false);
            }
            
            // 检查是否已有容器
            const existingContainer = warehouseContainer.querySelector('.task-gallery.warehouse-tasks-gallery');
            if (existingContainer) {
                console.log('✅ 容器已存在，无需重建');
                return Promise.resolve(true);
            }
            
            // 创建新容器
            const newContainer = document.createElement('div');
            newContainer.className = 'task-gallery warehouse-tasks-gallery';
            newContainer.innerHTML = `
                <div class="text-center p-4 text-muted">
                    <i class="fas fa-sync fa-spin me-2"></i>
                    正在加载任务数据...
                </div>
            `;
            
            warehouseContainer.appendChild(newContainer);
            console.log('✅ 新容器已创建');
            
            // 触发数据加载
            if (typeof loadWarehouseTasks === 'function') {
                setTimeout(loadWarehouseTasks, 500);
            }
            
            return Promise.resolve(true);
        },
        
        // 尝试重新加载页面
        tryReloadPage() {
            console.log('🔄 准备重新加载页面...');
            return new Promise(resolve => {
                setTimeout(() => {
                    if (typeof Utils !== 'undefined' && typeof Utils.showAlert === 'function') {
                        Utils.showAlert('正在重新加载页面以修复显示问题...', 'info');
                    }
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }, 1000);
                resolve(true); // 这个resolve不会被执行，因为页面会重新加载
            });
        },
        
        // 清理资源
        cleanup() {
            console.log('🧹 清理容器管理系统资源...');
            this.activeMonitors.forEach(observer => {
                observer.disconnect();
            });
            this.activeMonitors.clear();
            window.ContainerCoordinationActive = false;
        }
    };
    
    // 页面生命周期管理
    function setupPageLifecycle() {
        // 页面卸载时清理
        window.addEventListener('beforeunload', () => {
            ContainerManager.cleanup();
        });
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('👀 页面重新可见，执行健康检查');
                setTimeout(() => {
                    ContainerManager.rescanContainers();
                }, 1000);
            }
        });
    }
    
    // 暴露到全局的便捷函数
    window.ContainerManager = ContainerManager;
    window.diagnoseContainers = function() {
        ContainerManager.scanContainers();
        console.log('📊 容器诊断完成，详细信息请查看控制台');
    };
    
    window.forceContainerRecovery = function() {
        console.log('🚨 强制执行容器恢复');
        ContainerManager.attemptUnifiedRecovery();
    };
    
    // 初始化系统
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => ContainerManager.init(), 1000);
        });
    } else {
        setTimeout(() => ContainerManager.init(), 1000);
    }
    
    setupPageLifecycle();
    
    console.log('✅ 仓库容器协调管理系统已启动');
    
})();
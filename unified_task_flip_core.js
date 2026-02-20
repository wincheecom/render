/**
 * 统一任务卡片翻转核心模块
 * 整合所有翻转相关功能，解决脚本冲突问题
 * 
 * 功能整合:
 * 1. 统一翻转函数 (toggleTaskCardFlip)
 * 2. 背面元素动态创建
 * 3. 文件管理功能
 * 4. 防抖和状态管理
 * 5. 样式统一处理
 */

(function() {
    'use strict';
    
    console.log('🚀 启动统一任务翻转核心模块...');
    
    // 修复翻转功能需要刷新的问题
    function fixFlipRefreshIssue() {
        console.log('🔧 修复翻转功能刷新问题...');
        
        // 1. 确保翻转函数存在
        if (typeof window.toggleTaskCardFlip !== 'function') {
            createFlipFunction();
        }
        
        // 2. 使用事件委托绑定点击事件
        bindFlipEventsWithDelegation();
        
        // 3. 设置动态内容观察器
        setupDynamicContentObserver();
        
        // 4. 应用关键CSS样式
        applyCriticalFlipStyles();
        
        console.log('✅ 翻转功能刷新问题修复完成');
    }
    
    // 创建翻转函数
    function createFlipFunction() {
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🔄 翻转任务: ${taskId}`);
            
            // 多种选择器尝试找到容器
            const selectors = [
                `.task-flip-container[data-task-id="${taskId}"]`,
                `#${taskId}.task-flip-container`,
                `.task-flip-container[id="${taskId}"]`
            ];
            
            let container = null;
            for (const selector of selectors) {
                container = document.querySelector(selector);
                if (container) break;
            }
            
            // 如果通过ID找不到，尝试通过front元素查找
            if (!container) {
                const frontElement = document.querySelector(`#task-${taskId}-front`);
                if (frontElement) {
                    container = frontElement.closest('.task-flip-container');
                }
            }
            
            if (!container) {
                console.error(`❌ 未找到任务容器: ${taskId}`);
                return;
            }
            
            container.classList.toggle('flipped');
            const isFlipped = container.classList.contains('flipped');
            console.log(`✅ 翻转完成: ${isFlipped ? '显示背面' : '显示正面'}`);
            
            // 更新相关按钮文本
            updateFlipButtons(taskId, isFlipped);
        };
        
        console.log('✅ 翻转函数已创建');
    }
    
    // 使用事件委托绑定翻转事件
    function bindFlipEventsWithDelegation() {
        // 移除可能存在的旧监听器
        document.removeEventListener('click', handleTaskFlipClick);
        
        // 添加新的委托监听器
        document.addEventListener('click', handleTaskFlipClick);
        
        console.log('✅ 事件委托监听器已绑定');
    }
    
    // 处理任务翻转点击事件
    function handleTaskFlipClick(event) {
        // 检查是否点击了任务正面
        const taskFront = event.target.closest('.task-front');
        if (taskFront) {
            event.stopPropagation();
            const container = taskFront.closest('.task-flip-container');
            if (container && container.dataset.taskId) {
                window.toggleTaskCardFlip(container.dataset.taskId);
                return;
            }
        }
        
        // 检查是否点击了翻转按钮
        const flipButton = event.target.closest('[data-action="flip"]');
        if (flipButton) {
            event.preventDefault();
            const taskId = flipButton.getAttribute('data-task-id');
            if (taskId) {
                window.toggleTaskCardFlip(taskId);
            }
        }
    }
    
    // 设置动态内容观察器
    function setupDynamicContentObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldRebind = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否添加了任务相关元素
                            if (node.classList && (
                                node.classList.contains('task-flip-container') ||
                                node.classList.contains('task-front') ||
                                node.classList.contains('task-gallery')
                            )) {
                                shouldRebind = true;
                            }
                            
                            // 检查子元素中是否有任务元素
                            const taskElements = node.querySelectorAll('.task-flip-container, .task-front');
                            if (taskElements.length > 0) {
                                shouldRebind = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldRebind) {
                // 延迟执行以确保DOM完全更新
                setTimeout(() => {
                    console.log('🔄 检测到动态内容变化，重新绑定事件');
                }, 100);
            }
        });
        
        // 观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ 动态内容观察器已设置');
    }
    
    // 应用关键翻转样式
    function applyCriticalFlipStyles() {
        const styleId = 'critical-flip-styles-fix-refresh';
        if (document.getElementById(styleId)) {
            return; // 样式已存在
        }
        
        const styles = `
            /* 关键翻转样式 - 解决刷新问题 */
            .task-flip-container {
                perspective: 1500px !important;
                transform-style: preserve-3d !important;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                position: relative !important;
                cursor: pointer !important;
                will-change: transform !important;
            }
            
            .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
            
            .task-front, .task-back {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                box-sizing: border-box !important;
            }
            
            .task-back {
                transform: rotateY(180deg) !important;
            }
            
            /* 确保正面元素可点击 */
            .task-front {
                z-index: 2 !important;
                pointer-events: auto !important;
            }
            
            .task-flip-container.flipped .task-front {
                z-index: 1 !important;
            }
            
            .task-flip-container.flipped .task-back {
                z-index: 2 !important;
            }
        `;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = styles;
        document.head.appendChild(style);
        
        console.log('✅ 关键翻转样式已应用');
    }
    
    // 防止重复初始化
    if (window.unifiedTaskFlipCoreLoaded) {
        console.log('✅ 统一翻转核心已在运行');
        return;
    }
    window.unifiedTaskFlipCoreLoaded = true;
    
    // 添加事件委托处理动态内容
    function setupEventDelegation() {
        // 使用事件委托处理任务卡片点击
        document.addEventListener('click', function(event) {
            // 检查是否点击了任务正面
            const taskFront = event.target.closest('.task-front');
            if (taskFront) {
                event.preventDefault();
                event.stopPropagation();
                
                // 获取任务ID
                const container = taskFront.closest('.task-flip-container');
                if (container && container.dataset.taskId) {
                    window.toggleTaskCardFlip(container.dataset.taskId);
                } else {
                    // 尝试从ID中提取任务ID
                    const frontId = taskFront.id;
                    if (frontId && frontId.startsWith('task-') && frontId.endsWith('-front')) {
                        const taskId = frontId.replace('task-', '').replace('-front', '');
                        window.toggleTaskCardFlip(taskId);
                    }
                }
                return;
            }
            
            // 检查是否点击了翻转按钮
            const flipButton = event.target.closest('[data-action="flip"]');
            if (flipButton) {
                event.preventDefault();
                const taskId = flipButton.getAttribute('data-task-id');
                if (taskId) {
                    window.toggleTaskCardFlip(taskId);
                }
            }
        });
        
        console.log('✅ 事件委托已设置');
    }
    
    // 页面加载完成后执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupEventDelegation);
    } else {
        setupEventDelegation();
    }
    
    // 立即执行翻转功能修复
    fixFlipRefreshIssue();
    
    // 全局状态管理
    window.flipState = {
        cooldown: new Map(),
        fileStorage: {},
        activeContainers: new Set()
    };
    
    /**
     * 统一的任务卡片翻转函数
     * @param {string} taskId - 任务ID
     */
    window.toggleTaskCardFlip = function(taskId) {
        console.log(`🔄 统一翻转函数调用 - 任务: ${taskId}`);
        
        // 防抖控制
        const now = Date.now();
        const lastFlip = window.flipState.cooldown.get(taskId) || 0;
        if (now - lastFlip < 300) {
            console.log(`⏳ 任务 ${taskId} 翻转冷却中`);
            return;
        }
        window.flipState.cooldown.set(taskId, now);
        
        // 查找翻转容器
        let flipContainer = findFlipContainer(taskId);
        if (!flipContainer) {
            console.error(`❌ 未找到任务容器: ${taskId}`);
            return;
        }
        
        // 确保背面元素存在
        ensureBackElement(flipContainer, taskId);
        
        // 执行翻转
        executeFlipAnimation(flipContainer, taskId);
        
        // 清理过期冷却记录
        cleanupCooldown();
    };
    
    /**
     * 更新任务备注显示
     * @param {string} taskId - 任务ID
     * @param {string} remark - 备注内容
     */
    function updateTaskRemarkDisplay(taskId, remark) {
        const remarkElements = document.querySelectorAll(`.task-remark-display[data-task-id="${taskId}"]`);
        
        remarkElements.forEach(element => {
            const contentElement = element.querySelector('.remark-content');
            const placeholderElement = element.querySelector('.remark-placeholder');
            
            if (contentElement && remark && remark.trim()) {
                // 如果有备注内容，替换占位符
                if (placeholderElement) {
                    placeholderElement.remove();
                }
                
                // 创建或更新备注文本
                let remarkTextElement = element.querySelector('.remark-text');
                if (!remarkTextElement) {
                    remarkTextElement = document.createElement('div');
                    remarkTextElement.className = 'remark-text';
                    contentElement.appendChild(remarkTextElement);
                }
                
                remarkTextElement.textContent = remark.trim();
            } else if (contentElement && placeholderElement) {
                // 如果没有备注内容，确保显示占位符
                const remarkTextElement = element.querySelector('.remark-text');
                if (remarkTextElement) {
                    remarkTextElement.remove();
                }
                
                if (!placeholderElement) {
                    const newPlaceholder = document.createElement('div');
                    newPlaceholder.className = 'remark-placeholder';
                    newPlaceholder.textContent = '暂无备注信息';
                    contentElement.appendChild(newPlaceholder);
                }
            }
        });
    }
    
    // 将函数暴露到全局作用域
    window.updateTaskRemarkDisplay = updateTaskRemarkDisplay;
    
    /**
     * 查找翻转容器
     * @param {string} taskId - 任务ID
     * @returns {HTMLElement|null}
     */
    function findFlipContainer(taskId) {
        // 多种查找策略
        const selectors = [
            `.task-flip-container[data-task-id="${taskId}"]`,
            `#task-${taskId}-front`,
            `.task-front[data-task-id="${taskId}"]`
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.closest('.task-flip-container') || element.parentElement;
            }
        }
        
        return null;
    }
    
    /**
     * 确保背面元素存在
     * @param {HTMLElement} container - 翻转容器
     * @param {string} taskId - 任务ID
     */
    function ensureBackElement(container, taskId) {
        let backElement = container.querySelector('.task-back');
        
        if (!backElement) {
            console.log(`➕ 创建任务 ${taskId} 的背面元素...`);
            backElement = createBackElement(taskId);
            container.appendChild(backElement);
        }
        
        return backElement;
    }
    
    /**
     * 创建背面元素
     * @param {string} taskId - 任务ID
     * @returns {HTMLElement}
     */
    function createBackElement(taskId) {
        const backElement = document.createElement('div');
        backElement.className = 'task-back unified-back';
        backElement.dataset.taskId = taskId;
        backElement.innerHTML = generateBackContent(taskId);
        return backElement;
    }
    
    /**
     * 生成背面内容
     * @param {string} taskId - 任务ID
     * @param {Object} config - 配置选项
     * @returns {string}
     */
    function generateBackContent(taskId, config = {}) {
        // 默认配置（销售运营模式）
        const defaultConfig = {
            title: '任务文件管理',
            icon: 'fa-folder-open',
            allowUpload: true,
            actionButtons: [
                { id: 'download', text: '全部下载', icon: 'fa-download', className: 'primary', action: 'downloadAllFiles' },
                { id: 'print', text: '打印清单', icon: 'fa-print', className: 'secondary', action: 'printTaskFiles' },
                { id: 'export', text: '导出数据', icon: 'fa-file-export', className: 'success', action: 'exportTaskData' }
            ],
            footerText: '点击文件区域可上传对应类型的文件'
        };
        
        // 仓库发货模式配置
        const warehouseConfig = {
            title: '仓库发货文件管理',
            icon: 'fa-warehouse',
            allowUpload: false,
            actionButtons: [
                { id: 'download', text: '下载文件', icon: 'fa-download', className: 'primary', action: 'downloadWarehouseFiles' },
                { id: 'print', text: '打印清单', icon: 'fa-print', className: 'secondary', action: 'printWarehouseManifest' },
                { id: 'ship', text: '确认发货', icon: 'fa-truck', className: 'success', action: 'markAsShipped' }
            ],
            footerText: '仓库发货专用文件管理'
        };
        
        // 判断当前任务所属模块
        const isWarehouseTask = isWarehouseModuleTask(taskId);
        const finalConfig = isWarehouseTask ? {...defaultConfig, ...warehouseConfig} : {...defaultConfig, ...config};
        
        return `
            <div class="unified-back-content">
                <!-- 头部 -->
                <div class="back-header ${isWarehouseTask ? 'warehouse-header' : ''}">
                    <h6><i class="fas ${finalConfig.icon} me-2"></i>${finalConfig.title}</h6>
                    <button onclick="toggleTaskCardFlip('${taskId}')" class="back-return-btn ${isWarehouseTask ? 'warehouse-return-btn' : ''}">
                        <i class="fas fa-arrow-left me-1"></i>返回任务
                    </button>
                </div>
                
                <!-- 文件管理区域 -->
                <div class="file-management-area ${isWarehouseTask ? 'warehouse-file-area' : ''}">
                    ${generateFileSections(taskId, finalConfig.allowUpload, isWarehouseTask)}
                </div>
                
                <!-- 任务备注信息 -->
                <div class="task-remark-display ${isWarehouseTask ? 'warehouse-remark-display' : ''}" data-task-id="${taskId}">
                    <div class="remark-header">
                        <h6><i class="fas fa-sticky-note me-2"></i>任务备注</h6>
                    </div>
                    <div class="remark-content">
                        <div class="remark-placeholder">暂无备注信息</div>
                    </div>
                </div>
                
                <!-- 操作按钮 -->
                <div class="back-action-buttons ${isWarehouseTask ? 'warehouse-action-buttons' : ''}">
                    ${finalConfig.actionButtons.map(btn => `
                        <button onclick="${btn.action}('${taskId}')" class="action-btn ${btn.className}">
                            <i class="fas ${btn.icon} me-1"></i>${btn.text}
                        </button>
                    `).join('')}
                </div>
                
                <!-- 提示信息 -->
                <div class="back-footer ${isWarehouseTask ? 'warehouse-footer' : ''}">
                    <small><i class="fas fa-info-circle me-1"></i>${finalConfig.footerText}</small>
                </div>
            </div>
        `;
    }
    
    /**
     * 判断是否为仓库模块任务
     * @param {string} taskId - 任务ID
     * @returns {boolean}
     */
    function isWarehouseModuleTask(taskId) {
        // 方法1: 通过DOM结构判断
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`) || 
                           document.getElementById(`task-${taskId}-front`);
        
        if (taskElement) {
            // 检查是否在仓库容器内
            const warehouseContainer = document.getElementById('warehouseTasks');
            if (warehouseContainer && warehouseContainer.contains(taskElement)) {
                return true;
            }
            
            // 检查是否有仓库相关的类名
            const flipContainer = taskElement.closest('.task-flip-container');
            if (flipContainer) {
                const parentGallery = flipContainer.closest('.warehouse-tasks-gallery');
                if (parentGallery) {
                    return true;
                }
            }
        }
        
        // 方法2: 通过任务ID前缀判断（如果有约定的话）
        // 例如: warehouse-123, wh-456 等
        if (taskId.startsWith('warehouse-') || taskId.startsWith('wh-')) {
            return true;
        }
        
        return false;
    }
    
    /**
     * 生成文件区域
     * @param {string} taskId - 任务ID
     * @param {boolean} allowUpload - 是否允许上传
     * @param {boolean} isWarehouse - 是否为仓库任务
     * @returns {string}
     */
    function generateFileSections(taskId, allowUpload = true, isWarehouse = false) {
        // 根据模块类型选择不同的文件类型
        const fileTypes = isWarehouse ? 
            [
                { id: 'shipping-label', name: '发货标签', icon: 'fa-tag', color: '#0d6efd' },
                { id: 'packing-list', name: '装箱清单', icon: 'fa-list', color: '#198754' },
                { id: 'invoice', name: '发票', icon: 'fa-file-invoice', color: '#fd7e14' },
                { id: 'quality-cert', name: '质检证书', icon: 'fa-certificate', color: '#6f42c1' },
                { id: 'customs-doc', name: '报关单据', icon: 'fa-passport', color: '#20c997' },
                { id: 'warehouse-other', name: '其他文件', icon: 'fa-file', color: '#6c757d' }
            ] : 
            [
                { id: 'entity-code', name: '本体码', icon: 'fa-barcode', color: '#0d6efd' },
                { id: 'barcode', name: '条码', icon: 'fa-qrcode', color: '#198754' },
                { id: 'warning-code', name: '警示码', icon: 'fa-exclamation-triangle', color: '#dc3545' },
                { id: 'manual', name: '说明书', icon: 'fa-book', color: '#fd7e14' },
                { id: 'carton-label', name: '箱唛', icon: 'fa-tags', color: '#6f42c1' },
                { id: 'other', name: '其他文件', icon: 'fa-file', color: '#20c997' }
            ];
        
        return fileTypes.map(fileType => `
            <div class="file-section ${isWarehouse ? 'warehouse-file-section' : ''}">
                <div class="file-header ${isWarehouse ? 'warehouse-file-header' : ''}">
                    <i class="fas ${fileType.icon}" style="color: ${fileType.color};"></i>
                    <strong>${fileType.name}</strong>
                    <span class="file-status" id="status-${fileType.id}-${taskId}">○ 未上传</span>
                </div>
                <div class="file-upload-area ${isWarehouse ? 'warehouse-upload-area' : ''}" 
                     id="${fileType.id}-files-${taskId}"
                     ${allowUpload ? `onclick="handleFileUpload('${taskId}', '${fileType.id}', '${fileType.name}')"` : ''}>
                    <div class="upload-placeholder ${isWarehouse ? 'warehouse-placeholder' : ''}">
                        <i class="fas fa-${allowUpload ? 'cloud-upload-alt' : 'eye'} fa-2x mb-2"></i>
                        <div>${allowUpload ? '上传' : '查看'}${fileType.name}</div>
                        <small>${allowUpload ? '支持 JPG/PNG/PDF 格式' : '点击查看文件详情'}</small>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * 执行翻转动画
     * @param {HTMLElement} container - 翻转容器
     * @param {string} taskId - 任务ID
     */
    function executeFlipAnimation(container, taskId) {
        container.classList.toggle('flipped');
        const isFlipped = container.classList.contains('flipped');
        
        console.log(`✅ 翻转完成: ${isFlipped ? '显示背面' : '显示正面'}`);
        
        // 更新相关按钮文本
        updateFlipButtons(taskId, isFlipped);
    }
    
    /**
     * 更新翻转按钮
     * @param {string} taskId - 任务ID
     * @param {boolean} isFlipped - 是否已翻转
     */
    function updateFlipButtons(taskId, isFlipped) {
        const buttons = document.querySelectorAll(`[data-task-id="${taskId}"][data-action="flip"]`);
        buttons.forEach(button => {
            const textElement = button.querySelector('.button-text') || button;
            const iconElement = button.querySelector('i');
            
            textElement.textContent = isFlipped ? '返回任务' : '查看文件';
            
            if (iconElement) {
                iconElement.className = isFlipped ? 'fas fa-arrow-left me-1' : 'fas fa-folder-open me-1';
            }
        });
    }
    
    /**
     * 清理过期冷却记录
     */
    function cleanupCooldown() {
        const fiveSecondsAgo = Date.now() - 5000;
        for (const [id, timestamp] of window.flipState.cooldown.entries()) {
            if (timestamp < fiveSecondsAgo) {
                window.flipState.cooldown.delete(id);
            }
        }
    }
    
    // 文件操作函数
    window.handleFileUpload = function(taskId, fileType, typeName) {
        console.log(`📁 准备上传文件 - 任务: ${taskId}, 类型: ${typeName}`);
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.jpg,.jpeg,.png,.pdf';
        input.multiple = true;
        
        input.onchange = function(e) {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                processUploadedFiles(taskId, fileType, typeName, files);
            }
        };
        
        input.click();
    };
    
    function processUploadedFiles(taskId, fileType, typeName, files) {
        console.log(`📤 处理上传的 ${files.length} 个文件`);
        
        // 更新显示
        const container = document.getElementById(`${fileType}-files-${taskId}`);
        const statusElement = document.getElementById(`status-${fileType}-${taskId}`);
        
        if (container && statusElement) {
            container.innerHTML = generateFileList(files, taskId, fileType);
            statusElement.innerHTML = `<span style="color: #198754;">● 已上传 (${files.length})</span>`;
            
            // 保存文件引用
            if (!window.flipState.fileStorage[taskId]) {
                window.flipState.fileStorage[taskId] = {};
            }
            window.flipState.fileStorage[taskId][fileType] = files;
        }
    }
    
    function generateFileList(files, taskId, fileType) {
        return `
            <div class="uploaded-files-list">
                ${files.map((file, index) => `
                    <div class="file-item">
                        <i class="fas fa-file-${getFileIcon(file.type)} me-2" style="color: #0d6efd;"></i>
                        <div class="file-info">
                            <div class="file-name" title="${file.name}">${file.name}</div>
                            <div class="file-size">${formatFileSize(file.size)}</div>
                        </div>
                        <div class="file-actions">
                            <button onclick="previewFile('${taskId}', '${fileType}', ${index})" class="file-action-btn">
                                预览
                            </button>
                            <button onclick="deleteFile('${taskId}', '${fileType}', ${index})" class="file-action-btn danger">
                                删除
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // 辅助函数
    function getFileIcon(mimeType) {
        if (mimeType.includes('image')) return 'image';
        if (mimeType.includes('pdf')) return 'pdf';
        return 'alt';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    window.previewFile = function(taskId, fileType, fileIndex) {
        console.log(`👁️ 预览文件 - 任务: ${taskId}, 索引: ${fileIndex}`);
        // 实现文件预览逻辑
    };
    
    window.deleteFile = function(taskId, fileType, fileIndex) {
        console.log(`🗑️ 删除文件 - 任务: ${taskId}, 索引: ${fileIndex}`);
        // 实现文件删除逻辑
    };
    
    window.downloadAllFiles = function(taskId) {
        console.log(`📥 下载所有文件 - 任务: ${taskId}`);
        // 实现批量下载逻辑
    };
    
    window.printTaskFiles = function(taskId) {
        console.log(`🖨️ 打印文件清单 - 任务: ${taskId}`);
        // 实现打印逻辑
    };
    
    window.exportTaskData = function(taskId) {
        console.log(`📤 导出任务数据 - 任务: ${taskId}`);
        // 实现数据导出逻辑
    };
    
    // 仓库专用操作函数
    window.downloadWarehouseFiles = function(taskId) {
        console.log(`📥 下载仓库文件 - 任务: ${taskId}`);
        // 实现仓库文件下载逻辑
        alert(`开始下载仓库任务 ${taskId} 的相关文件`);
    };
    
    window.printWarehouseManifest = function(taskId) {
        console.log(`🖨️ 打印仓库清单 - 任务: ${taskId}`);
        // 实现仓库清单打印逻辑
        alert(`准备打印仓库任务 ${taskId} 的发货清单`);
    };
    
    window.markAsShipped = function(taskId) {
        console.log(`🚚 标记为已发货 - 任务: ${taskId}`);
        // 实现发货标记逻辑
        if (confirm(`确认将任务 ${taskId} 标记为已发货吗？`)) {
            alert(`任务 ${taskId} 已标记为已发货`);
            // 这里可以添加实际的发货处理逻辑
        }
    };
    
    console.log('✅ 统一翻转核心模块初始化完成');
    
})();
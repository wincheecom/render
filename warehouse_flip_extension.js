/**
 * 仓库任务翻转扩展模块
 * 专门为仓库发货模块提供翻转功能支持
 * 解决仓库模块特有的选择器和结构问题
 */

(function() {
    'use strict';
    
    console.log('🏭 启动仓库任务翻转扩展模块...');
    
    // 防止重复初始化
    if (window.warehouseFlipExtensionLoaded) {
        console.log('✅ 仓库翻转扩展已在运行');
        return;
    }
    window.warehouseFlipExtensionLoaded = true;
    
    /**
     * 仓库模块专用翻转函数
     * @param {string} taskId - 任务ID
     */
    window.toggleWarehouseTaskFlip = function(taskId) {
        console.log(`🏭 仓库翻转函数调用 - 任务: ${taskId}`);
        
        // 使用仓库模块特有的选择器
        const selectors = [
            `#warehouseTasks .task-flip-container[data-task-id="${taskId}"]`,
            `#warehouseTasks #task-${taskId}-front`,
            `.warehouse-tasks-gallery .task-flip-container[data-task-id="${taskId}"]`
        ];
        
        let flipContainer = null;
        for (const selector of selectors) {
            flipContainer = document.querySelector(selector);
            if (flipContainer) {
                console.log(`✅ 找到仓库任务容器: ${selector}`);
                break;
            }
        }
        
        if (!flipContainer) {
            console.error(`❌ 未找到仓库任务容器: ${taskId}`);
            // 尝试通用查找
            flipContainer = document.querySelector(`.task-flip-container[data-task-id="${taskId}"]`);
            if (!flipContainer) {
                console.error(`❌ 完全找不到任务容器: ${taskId}`);
                return;
            }
        }
        
        // 确保背面元素存在（使用仓库专用模板）
        ensureWarehouseBackElement(flipContainer, taskId);
        
        // 执行翻转
        executeWarehouseFlip(flipContainer, taskId);
    };
    
    /**
     * 确保仓库背面元素存在
     * @param {HTMLElement} container - 翻转容器
     * @param {string} taskId - 任务ID
     */
    function ensureWarehouseBackElement(container, taskId) {
        let backElement = container.querySelector('.task-back');
        
        if (!backElement) {
            console.log(`➕ 创建仓库任务 ${taskId} 的背面元素...`);
            backElement = createWarehouseBackElement(taskId);
            container.appendChild(backElement);
        }
        
        return backElement;
    }
    
    /**
     * 创建仓库专用背面元素
     * @param {string} taskId - 任务ID
     * @returns {HTMLElement}
     */
    function createWarehouseBackElement(taskId) {
        const backElement = document.createElement('div');
        backElement.className = 'task-back warehouse-back unified-back';
        backElement.dataset.taskId = taskId;
        backElement.innerHTML = generateWarehouseBackContent(taskId);
        return backElement;
    }
    
    /**
     * 生成仓库专用背面内容
     * @param {string} taskId - 任务ID
     * @returns {string}
     */
    function generateWarehouseBackContent(taskId) {
        return `
            <div class="warehouse-back-content unified-back-content">
                <!-- 仓库头部 -->
                <div class="back-header warehouse-header">
                    <h6><i class="fas fa-warehouse me-2"></i>仓库发货文件管理</h6>
                    <button onclick="toggleWarehouseTaskFlip('${taskId}')" class="back-return-btn warehouse-return-btn">
                        <i class="fas fa-arrow-left me-1"></i>返回任务
                    </button>
                </div>
                
                <!-- 仓库文件管理区域 -->
                <div class="file-management-area warehouse-file-area">
                    ${generateWarehouseFileSections(taskId)}
                </div>
                
                <!-- 任务备注信息 -->
                <div class="task-remark-display warehouse-remark-display" data-task-id="${taskId}">
                    <div class="remark-header">
                        <h6><i class="fas fa-sticky-note me-2"></i>任务备注</h6>
                    </div>
                    <div class="remark-content">
                        <div class="remark-placeholder">暂无备注信息</div>
                    </div>
                </div>
                
                <!-- 仓库专用操作按钮 -->
                <div class="back-action-buttons warehouse-action-buttons">
                    <button onclick="downloadWarehouseFiles('${taskId}')" class="action-btn primary">
                        <i class="fas fa-download me-1"></i>下载文件
                    </button>
                    <button onclick="printWarehouseManifest('${taskId}')" class="action-btn secondary">
                        <i class="fas fa-print me-1"></i>打印清单
                    </button>
                    <button onclick="markAsShipped('${taskId}')" class="action-btn success">
                        <i class="fas fa-truck me-1"></i>标记发货
                    </button>
                </div>
                
                <!-- 仓库提示信息 -->
                <div class="back-footer warehouse-footer">
                    <small><i class="fas fa-info-circle me-1"></i>仓库发货专用文件管理</small>
                </div>
            </div>
        `;
    }
    
    /**
     * 生成仓库文件区域
     * @param {string} taskId - 任务ID
     * @returns {string}
     */
    function generateWarehouseFileSections(taskId) {
        const fileTypes = [
            { id: 'shipping-label', name: '发货标签', icon: 'fa-tag', color: '#0d6efd' },
            { id: 'packing-list', name: '装箱清单', icon: 'fa-list', color: '#198754' },
            { id: 'invoice', name: '发票', icon: 'fa-file-invoice', color: '#fd7e14' },
            { id: 'quality-cert', name: '质检证书', icon: 'fa-certificate', color: '#6f42c1' },
            { id: 'customs-doc', name: '报关单据', icon: 'fa-passport', color: '#20c997' },
            { id: 'warehouse-other', name: '其他文件', icon: 'fa-file', color: '#6c757d' }
        ];
        
        return fileTypes.map(fileType => `
            <div class="file-section warehouse-file-section">
                <div class="file-header warehouse-file-header">
                    <i class="fas ${fileType.icon}" style="color: ${fileType.color};"></i>
                    <strong>${fileType.name}</strong>
                    <span class="file-status" id="status-${fileType.id}-${taskId}">○ 未上传</span>
                </div>
                <div class="file-upload-area warehouse-upload-area" 
                     id="${fileType.id}-files-${taskId}"
                     onclick="handleWarehouseFileUpload('${taskId}', '${fileType.id}', '${fileType.name}')">
                    <div class="upload-placeholder warehouse-placeholder">
                        <i class="fas fa-cloud-upload-alt fa-2x mb-2"></i>
                        <div>上传${fileType.name}</div>
                        <small>支持 JPG/PNG/PDF 格式</small>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * 执行仓库翻转动画
     * @param {HTMLElement} container - 翻转容器
     * @param {string} taskId - 任务ID
     */
    function executeWarehouseFlip(container, taskId) {
        container.classList.toggle('flipped');
        const isFlipped = container.classList.contains('flipped');
        
        console.log(`✅ 仓库翻转完成: ${isFlipped ? '显示背面' : '显示正面'}`);
        
        // 更新相关按钮文本
        updateWarehouseFlipButtons(taskId, isFlipped);
    }
    
    /**
     * 更新仓库翻转按钮
     * @param {string} taskId - 任务ID
     * @param {boolean} isFlipped - 是否已翻转
     */
    function updateWarehouseFlipButtons(taskId, isFlipped) {
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
    
    // 仓库文件操作函数
    window.handleWarehouseFileUpload = function(taskId, fileType, typeName) {
        console.log(`🏭 仓库文件上传 - 任务: ${taskId}, 类型: ${typeName}`);
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.jpg,.jpeg,.png,.pdf';
        input.multiple = true;
        
        input.onchange = function(e) {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                processWarehouseFiles(taskId, fileType, typeName, files);
            }
        };
        
        input.click();
    };
    
    function processWarehouseFiles(taskId, fileType, typeName, files) {
        console.log(`📤 处理仓库上传的 ${files.length} 个文件`);
        
        // 更新显示
        const container = document.getElementById(`${fileType}-files-${taskId}`);
        const statusElement = document.getElementById(`status-${fileType}-${taskId}`);
        
        if (container && statusElement) {
            container.innerHTML = generateWarehouseFileList(files, taskId, fileType);
            statusElement.innerHTML = `<span style="color: #198754;">● 已上传 (${files.length})</span>`;
        }
    }
    
    function generateWarehouseFileList(files, taskId, fileType) {
        return `
            <div class="uploaded-files-list warehouse-file-list">
                ${files.map((file, index) => `
                    <div class="file-item warehouse-file-item">
                        <i class="fas fa-file-${getFileIcon(file.type)} me-2" style="color: #0d6efd;"></i>
                        <div class="file-info warehouse-file-info">
                            <div class="file-name" title="${file.name}">${file.name}</div>
                            <div class="file-size">${formatFileSize(file.size)}</div>
                        </div>
                        <div class="file-actions warehouse-file-actions">
                            <button onclick="previewWarehouseFile('${taskId}', '${fileType}', ${index})" class="file-action-btn">
                                预览
                            </button>
                            <button onclick="deleteWarehouseFile('${taskId}', '${fileType}', ${index})" class="file-action-btn danger">
                                删除
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // 仓库专用操作函数
    window.downloadWarehouseFiles = function(taskId) {
        console.log(`📥 下载仓库文件 - 任务: ${taskId}`);
        // 实现仓库文件下载逻辑
    };
    
    window.printWarehouseManifest = function(taskId) {
        console.log(`🖨️ 打印仓库清单 - 任务: ${taskId}`);
        // 实现仓库清单打印逻辑
    };
    
    window.markAsShipped = function(taskId) {
        console.log(`🚚 标记为已发货 - 任务: ${taskId}`);
        // 实现发货标记逻辑
    };
    
    window.previewWarehouseFile = function(taskId, fileType, fileIndex) {
        console.log(`👁️ 预览仓库文件 - 任务: ${taskId}, 索引: ${fileIndex}`);
        // 实现仓库文件预览逻辑
    };
    
    window.deleteWarehouseFile = function(taskId, fileType, fileIndex) {
        console.log(`🗑️ 删除仓库文件 - 任务: ${taskId}, 索引: ${fileIndex}`);
        // 实现仓库文件删除逻辑
    };
    
    // 辅助函数（复用统一核心的函数）
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
    
    console.log('✅ 仓库任务翻转扩展模块初始化完成');
    
})();
// 创建测试任务脚本
// 用于测试仓库任务卡样式统一效果

async function createTestTasks() {
    console.log('🧪 开始创建测试任务...');
    
    try {
        // 模拟创建几个测试任务
        const testData = [
            {
                items: [{
                    productId: 'test-product-1',
                    productName: '测试商品A',
                    productCode: 'TEST001',
                    productImage: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=A',
                    quantity: 5
                }],
                bodyCodeImage: 'https://via.placeholder.com/100x100/4ECDC4/FFFFFF?text=BC',
                barcodeImage: 'https://via.placeholder.com/100x100/45B7D1/FFFFFF?text=BAR',
                creatorName: '测试用户1',
                status: 'pending'
            },
            {
                items: [{
                    productId: 'test-product-2', 
                    productName: '测试商品B',
                    productCode: 'TEST002',
                    productImage: 'https://via.placeholder.com/200x200/96CEB4/FFFFFF?text=B',
                    quantity: 3
                }],
                warningCodeImage: 'https://via.placeholder.com/100x100/FFEAA7/000000?text=WC',
                labelImage: 'https://via.placeholder.com/100x100/DDA0DD/FFFFFF?text=LBL',
                creatorName: '测试用户2',
                status: 'pending'
            },
            {
                items: [{
                    productId: 'test-product-3',
                    productName: '测试商品C',
                    productCode: 'TEST003', 
                    productImage: 'https://via.placeholder.com/200x200/F7DC6F/000000?text=C',
                    quantity: 8
                }],
                manualImage: 'https://via.placeholder.com/100x100/BB8FCE/FFFFFF?text=MNL',
                otherImage: 'https://via.placeholder.com/100x100/85C1E9/FFFFFF?text=OTH',
                creatorName: '测试用户3',
                status: 'pending'
            }
        ];
        
        // 如果DataManager可用，使用它创建任务
        if (typeof DataManager !== 'undefined' && DataManager.addTask) {
            for (const taskData of testData) {
                try {
                    const newTask = await DataManager.addTask(taskData);
                    console.log(`✅ 创建测试任务成功: ${newTask.taskNumber}`);
                } catch (error) {
                    console.error('❌ 创建测试任务失败:', error);
                }
            }
            
            // 刷新仓库任务列表
            if (typeof loadWarehouseTasksList === 'function') {
                setTimeout(() => {
                    loadWarehouseTasksList();
                    console.log('🔄 已刷新仓库任务列表');
                }, 500);
            }
            
        } else {
            console.log('⚠️ DataManager不可用，使用模拟数据显示');
            // 在页面上显示模拟数据
            displayMockTasks(testData);
        }
        
    } catch (error) {
        console.error('❌ 创建测试任务过程中出错:', error);
    }
}

function displayMockTasks(tasks) {
    const container = document.getElementById('warehouseTasks');
    if (!container) {
        console.error('❌ 未找到仓库任务容器');
        return;
    }
    
    // 构建模拟任务HTML
    const tasksHtml = `
        <div class="task-gallery warehouse-tasks-gallery">
            ${tasks.map((task, index) => {
                const itemCount = task.items[0].quantity;
                const firstItemImage = task.items[0].productImage;
                const creatorId = task.creatorName;
                
                return `
                    <div class="task-flip-container" data-task-id="mock-${index}">
                        <!-- 卡片正面 -->
                        <div class="task-front" id="task-mock-${index}-front">
                            <div class="task-gallery-img">
                                ${firstItemImage ? 
                                    `<img src="${firstItemImage}" alt="产品图片">` : 
                                    '<div class="d-flex align-items-center justify-content-center h-100"><i class="fas fa-image fa-2x text-muted"></i></div>'
                                }
                            </div>
                            <div class="task-card-content d-flex align-items-center gap-2 w-100">
                                <div class="task-info-inline d-flex align-items-center gap-2 flex-shrink-0 ms-auto">
                                    <div class="task-gallery-name" style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 120px;">${task.items[0].productName}</div>
                                    <div class="task-gallery-code" data-content="${task.items[0].productCode}" style="font-size: 0.75rem; color: #666; margin-bottom: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100px;">货号: ${task.items[0].productCode}</div>
                                    <div class="task-gallery-qty" data-content="${itemCount}" style="font-size: 0.75rem; color: #888; margin-bottom: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100px;">数量: ${itemCount}</div>
                                    <div class="task-gallery-creator" data-content="${creatorId}" style="font-size: 0.7rem; color: #999; margin-bottom: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 80px;">创建人: ${creatorId}</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 卡片背面 -->
                        <div class="task-back">
                            <div class="task-back-content">
                                <div class="task-files-container">
                                    ${task.bodyCodeImage ? `
                                        <div class="task-file-item">
                                            <div class="file-label">本体码</div>
                                            <img src="${task.bodyCodeImage}" alt="本体码" class="file-preview">
                                        </div>
                                    ` : ''}
                                    ${task.barcodeImage ? `
                                        <div class="task-file-item">
                                            <div class="file-label">条码</div>
                                            <img src="${task.barcodeImage}" alt="条码" class="file-preview">
                                        </div>
                                    ` : ''}
                                    ${task.warningCodeImage ? `
                                        <div class="task-file-item">
                                            <div class="file-label">警示码</div>
                                            <img src="${task.warningCodeImage}" alt="警示码" class="file-preview">
                                        </div>
                                    ` : ''}
                                    ${task.labelImage ? `
                                        <div class="task-file-item">
                                            <div class="file-label">箱唛</div>
                                            <img src="${task.labelImage}" alt="箱唛" class="file-preview">
                                        </div>
                                    ` : ''}
                                    ${task.manualImage ? `
                                        <div class="task-file-item">
                                            <div class="file-label">说明书</div>
                                            <img src="${task.manualImage}" alt="说明书" class="file-preview">
                                        </div>
                                    ` : ''}
                                    ${task.otherImage ? `
                                        <div class="task-file-item">
                                            <div class="file-label">其他</div>
                                            <img src="${task.otherImage}" alt="其他" class="file-preview">
                                        </div>
                                    ` : ''}
                                </div>
                                <div class="task-back-actions">
                                    <div class="back-action-buttons">
                                        <button class="btn btn-sm btn-success" data-task-id="mock-${index}" data-action="complete-shipment">确认发货</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    container.innerHTML = tasksHtml;
    console.log('🎨 已显示模拟测试任务');
}

// 如果在浏览器环境中，提供全局访问
if (typeof window !== 'undefined') {
    window.createTestTasks = createTestTasks;
    window.displayMockTasks = displayMockTasks;
    
    console.log('🧪 测试任务脚本已加载');
    console.log('💡 调用 createTestTasks() 创建真实测试任务');
    console.log('💡 调用 displayMockTasks(tasks) 显示模拟任务');
}
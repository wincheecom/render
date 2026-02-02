/**
 * Salesperson Statistics Module
 * 用于处理销售统计相关的功能
 */


/**
 * 更新销售员统计数据
 * @param {Array} tasks - 任务列表
 * @param {string} currentFilter - 当前筛选条件
 * @param {string} currentUserId - 当前用户ID
 */
function updateSalespersonStatistics(tasks, currentFilter, currentUserId) {
    console.log('Updating salesperson statistics...', { tasks, currentFilter, currentUserId });
    
    // 根据当前用户ID筛选任务
    const filteredTasks = tasks.filter(task => {
        // 如果是管理员，显示所有任务；否则只显示自己的任务
        if (window.currentUser && window.currentUser.role === 'admin') {
            return true;
        } else {
            return task.creator_name === window.currentUser.name || 
                   (task.userId && task.userId === currentUserId);
        }
    });

    // 按创建者（销售员）分组统计
    const statsByCreator = {};
    
    filteredTasks.forEach(task => {
        const creator = task.creator_name || '未知';
        if (!statsByCreator[creator]) {
            statsByCreator[creator] = {
                tasks: [],
                totalQuantity: 0,
                totalSales: 0,
                totalProfit: 0,
                productDetails: [] // 存储商品详情
            };
        }
        
        statsByCreator[creator].tasks.push(task);
        
        // 计算任务中的商品总数、销售额和利润
        if (task.items && Array.isArray(task.items)) {
            task.items.forEach(item => {
                // 累计数量
                statsByCreator[creator].totalQuantity += (item.quantity || 0);
                
                // 累计销售额（如果有价格信息）
                if (item.price || item.salePrice) {
                    statsByCreator[creator].totalSales += (item.quantity || 0) * (item.price || item.salePrice || 0);
                }
                
                // 累计利润（如果有利润信息）
                if (item.profit) {
                    statsByCreator[creator].totalProfit += (item.profit || 0);
                }
                
                // 添加商品详情
                if (item.productName) {
                    const productDetail = `${item.productName}(${item.quantity || 0}件) - ${item.supplier || '未知供应商'}`;
                    if (!statsByCreator[creator].productDetails.includes(productDetail)) {
                        statsByCreator[creator].productDetails.push(productDetail);
                    }
                }
            });
        }
    });
    
    // 渲染销售员统计数据
    renderSalespersonStats(statsByCreator);
}

/**
 * 渲染销售员统计数据
 * @param {Object} statsByCreator - 按创建者分组的统计数据
 */
function renderSalespersonStats(statsByCreator) {
    const container = document.getElementById('salesperson-stats-grid');
    if (!container) {
        console.warn('Salesperson stats container not found');
        return;
    }
    
    // 清空现有内容
    container.innerHTML = '';
    
    // 为每个销售员创建统计卡片
    Object.keys(statsByCreator).forEach(creator => {
        const stats = statsByCreator[creator];
        
        // 创建销售员统计卡片
        const statCard = document.createElement('div');
        statCard.className = 'salesperson-stat-card';
        
        // 格式化商品明细
        const productDetailsText = stats.productDetails.length > 0 
            ? stats.productDetails.join('，')
            : '暂无商品';
        
        statCard.innerHTML = `
            <div class="stats-header">
                <div class="stats-title">${creator} 统计</div>
            </div>
            <div class="salesperson-stats-grid-item">
                <div class="stat-item">
                    <span class="stat-label">发货数量统计</span>
                    <span class="stat-value stat-highlight">${stats.totalQuantity}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">销售额统计</span>
                    <span class="stat-value stat-highlight">¥${stats.totalSales.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">销售利润统计</span>
                    <span class="stat-value stat-highlight">¥${stats.totalProfit.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">销售商品明细</span>
                    <span class="stat-value">${productDetailsText}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">总任务数</span>
                    <span class="stat-value">${stats.tasks.length} 个</span>
                </div>
            </div>
        `;
        
        container.appendChild(statCard);
    });
}

/**
 * 加载销售员统计数据
 */
async function loadSalespersonStatisticsData() {
    try {
        // 获取所有任务数据
        const response = await fetch(`${DataManager.API_BASE}/api/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(DataManager.STORAGE_KEYS.TOKEN)}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
        }
        
        const tasks = await response.json();
        
        // 获取当前筛选器和用户信息
        const currentFilter = window.currentFilter || 'all';
        const currentUserId = window.currentUser ? window.currentUser.id : null;
        
        // 更新销售员统计数据
        updateSalespersonStatistics(tasks, currentFilter, currentUserId);
        
    } catch (error) {
        console.error('Error loading salesperson statistics:', error);
        // 显示错误信息给用户
        Utils.showAlert('加载销售员统计数据失败', 'error');
    }
}

// 导出函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateSalespersonStatistics,
        renderSalespersonStats,
        loadSalespersonStatisticsData
    };
}
// 修复DataManager.getCreatorStatistics方法的角色访问权限问题
// 使销售运营用户也能看到所有数据，而不只是自己的数据

// 这个脚本应该在DataManager定义之后，统计分析模块加载之前执行

// 保存原始的getCreatorStatistics方法
const originalGetCreatorStatistics = DataManager.getCreatorStatistics;

// 重写getCreatorStatistics方法
DataManager.getCreatorStatistics = async function(filter = 'day') {
    try {
        const history = await this.getHistory();
        const products = await this.getAllProducts();
        const { startDate, endDate } = Utils.getDateRange(filter);
        
        // 获取当前用户信息
        const currentUser = this.getCurrentUser();
        
        // 修改过滤逻辑：允许销售运营角色查看所有数据
        const filteredHistory = history.filter(task => {
            // 确保task对象存在
            if (!task) return false;
            const taskDate = new Date(task.completed_at || task.created_at || task.completedAt || task.createdAt);
            // 检查日期是否有效
            if (isNaN(taskDate.getTime())) return false;
            
            // 对于管理员和销售运营用户，显示所有任务
            if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'sales')) {
                return taskDate >= startDate && taskDate < endDate;
            } else {
                // 对于其他角色，只显示他们自己创建的任务
                const taskCreator = task.creator_name || task.creatorName || task.creator;
                return taskDate >= startDate && taskDate < endDate && 
                       (taskCreator === currentUser.name || taskCreator === currentUser.username);
            }
        });
        
        const creatorStats = {};
        
        filteredHistory.forEach(task => {
            // 确保task对象存在
            if (!task) return;
            
            const creatorName = task.creator_name || task.creatorName || task.creator || 'Unknown';
            
            if (!creatorStats[creatorName]) {
                creatorStats[creatorName] = {
                    name: creatorName,
                    totalShipments: 0,
                    totalSales: 0,
                    totalProfit: 0,
                    totalTasks: 0,
                    tasks: [],
                    productCount: 0,
                    topProducts: []
                };
            }
            
            creatorStats[creatorName].totalTasks++;
            creatorStats[creatorName].tasks.push(task);
            
            // 确保items存在且为数组
            if (task.items && Array.isArray(task.items)) {
                task.items.forEach(item => {
                    // 确保item和quantity存在
                    if (item && item.quantity) {
                        creatorStats[creatorName].totalShipments += item.quantity;
                        
                        // 确保productId存在
                        if (item.productId) {
                            const product = products.find(p => p.id === item.productId);
                            if (product) {
                                const itemSales = (product.sale_price || product.salePrice || 0) * (item.quantity || 0);
                                const itemCost = (product.purchase_price || product.purchasePrice || 0) * (item.quantity || 0);
                                const itemProfit = itemSales - itemCost;
                                
                                creatorStats[creatorName].totalSales += itemSales;
                                creatorStats[creatorName].totalProfit += itemProfit;
                            }
                        }
                    }
                });
            }
        });
        
        // 计算每个销售员的商品种类数和畅销商品排行
        Object.keys(creatorStats).forEach(creatorName => {
            const stats = creatorStats[creatorName];
            
            // 计算商品种类数
            const productIds = new Set();
            if (stats.tasks && Array.isArray(stats.tasks)) {
                stats.tasks.forEach(task => {
                    if (task.items && Array.isArray(task.items)) {
                        task.items.forEach(item => {
                            if (item && item.productId) {
                                productIds.add(item.productId);
                            }
                        });
                    }
                });
            }
            stats.productCount = productIds.size;
            
            // 计算畅销商品排行
            const productSales = {};
            if (stats.tasks && Array.isArray(stats.tasks)) {
                stats.tasks.forEach(task => {
                    if (task.items && Array.isArray(task.items)) {
                        task.items.forEach(item => {
                            if (item && item.productId) {
                                const product = products.find(p => p.id === item.productId);
                                if (product) {
                                    if (!productSales[product.id]) {
                                        productSales[product.id] = {
                                            id: product.id,
                                            name: product.name,
                                            code: product.code,
                                            quantity: 0
                                        };
                                    }
                                    productSales[product.id].quantity += item.quantity || 0;
                                }
                            }
                        });
                    }
                });
            }
            
            // 按销量排序并获取前5名
            stats.topProducts = Object.values(productSales)
                .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
                .slice(0, 5);
        });

        // 对于管理员和销售运营用户，返回所有统计数据
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'sales')) {
            // 返回按销售额排序的创作者统计信息
            return Object.values(creatorStats).sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0));
        } else {
            // 对于其他角色，只返回自己的统计数据
            const userStats = creatorStats[currentUser.name] || creatorStats[currentUser.username] || null;
            return userStats ? [userStats] : [];
        }
    } catch (error) {
        console.error('获取创建者统计数据失败:', error);
        console.error('错误堆栈:', error.stack);
        return [];
    }
};
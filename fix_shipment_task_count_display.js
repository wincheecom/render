/**
 * 修复发货任务统计显示问题
 * 问题：在时间筛选为"全部"时，发货任务统计显示了137（发货数量总和）而不是正确的任务数量
 */

// 这个脚本旨在修复index.html中的统计数据显示逻辑
// 主要是修复 loadStatisticsData 函数中的发货任务数量统计

console.log('开始修复发货任务统计显示问题...');

// 修复方案：
// 1. 确保 shipmentTaskCount 显示的是任务数量而不是发货数量
// 2. 统一使用 stats.filteredHistory.length 来计算任务数量，不管过滤器是什么

// 在页面加载完成后应用修复
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经定义了loadStatisticsData函数，如果已定义则进行覆盖修复
    if (typeof loadStatisticsData === 'function') {
        // 保存原始函数
        const originalLoadStatisticsData = loadStatisticsData;
        
        // 重新定义loadStatisticsData函数，修复其中的逻辑
        loadStatisticsData = async function() {
            try {
                // 获取常规统计数据
                const stats = await DataManager.getStatisticsData(currentStatisticsFilter);
                
                // 获取当日统计数据
                const dayStats = await DataManager.getStatisticsData('day');
                
                // 更新基础统计数据
                const dayShipmentsEl = document.getElementById('dayShipments');
                const daySalesEl = document.getElementById('daySales');
                const dayProfitEl = document.getElementById('dayProfit');
                const avgProfitMarginEl = document.getElementById('avgProfitMargin');
                
                // 新增：更新发货任务数量统计
                const shipmentTaskCountEl = document.getElementById('shipmentTaskCount');
                
                // 确保分别使用各自的数据源，避免混用
                // 修复：确保dayShipments显示发货数量
                if (dayShipmentsEl) {
                    const dayShipmentsValue = Math.round(dayStats?.totalShipments || 0);
                    dayShipmentsEl.textContent = dayShipmentsValue;
                }
                if (daySalesEl) daySalesEl.textContent = Utils.formatCurrency(dayStats?.totalSales || 0);
                if (dayProfitEl) dayProfitEl.textContent = Utils.formatCurrency(dayStats?.totalProfit || 0);
                if (avgProfitMarginEl) avgProfitMarginEl.textContent = `${stats?.avgProfitMargin || 0}%`;
                
                // 更新发货任务数量统计卡 - 明确使用任务数量而非发货数量
                // 修复：统一使用stats.filteredHistory，不管是什么过滤器
                if (shipmentTaskCountEl) {
                    let shipmentTaskCount = 0;
                    
                    // 统一使用stats.filteredHistory，不管是什么过滤器
                    if (stats?.filteredHistory && Array.isArray(stats.filteredHistory)) {
                        shipmentTaskCount = stats.filteredHistory.length;
                    }
                    
                    shipmentTaskCountEl.textContent = shipmentTaskCount;
                }
                
                // 添加调试日志来确认数据分配正确
                console.log('数据分配检查:', {
                    dayShipmentsValue: dayStats?.totalShipments,
                    calculatedTaskCount: (stats?.filteredHistory && Array.isArray(stats.filteredHistory)) ? stats.filteredHistory.length : 0,
                    dayShipmentsDisplay: Math.round(dayStats?.totalShipments || 0),
                    taskCountDisplay: (stats?.filteredHistory && Array.isArray(stats.filteredHistory)) ? stats.filteredHistory.length : 0
                });
                
                // 明确显示标签与数据类型的对应关系，防止混淆
                console.log(`当前筛选器: ${currentStatisticsFilter}, 发货任务数: ${shipmentTaskCountEl?.textContent || 'N/A'}, 发货数量: ${dayShipmentsEl?.textContent || 'N/A'}`);
                
                // 更新排名
                updateSalesRanking(stats?.salesRanking || []);
                updateProfitRanking(stats?.profitRanking || []);
                
                // 更新图表
                updateShipmentChart(stats?.monthlyShipments || {});
                updateSalesChart(stats?.monthlySales || {});
                updateProfitChart(stats?.monthlyProfit || {});
                
                // 加载按销售运营账户的统计信息
                console.log('开始获取销售员统计数据，过滤器:', currentStatisticsFilter);
                const creatorStats = await DataManager.getCreatorStatistics(currentStatisticsFilter);
                console.log('获取到的销售员统计数据:', creatorStats);
                updateCreatorStatistics(creatorStats || []);
                
                // 现在调用 salesperson_stats.js 中的 loadSalespersonStatisticsData 函数
                // 来正确初始化标签页功能和加载销售人员数据
                if (typeof loadSalespersonStatisticsData === 'function') {
                    await loadSalespersonStatisticsData();
                } else {
                    console.error('loadSalespersonStatisticsData 函数未定义');
                    
                    // 如果函数未定义，尝试延迟加载
                    setTimeout(async () => {
                        if (typeof loadSalespersonStatisticsData === 'function') {
                            await loadSalespersonStatisticsData();
                        } else {
                            console.error('salesperson_stats.js 仍未加载成功');
                        }
                    }, 500);
                }
                
            } catch (error) {
                console.error('加载统计数据失败:', error);
                console.error('错误堆栈:', error.stack);
                Utils.showAlert('加载统计数据失败，请稍后重试', 'error');
            }
        };
        
        console.log('已修复 loadStatisticsData 函数');
    } else {
        console.log('loadStatisticsData 函数未找到，将在页面加载后尝试修复');
        
        // 如果函数还未定义，等待一段时间后尝试重定义
        setTimeout(function() {
            if (typeof loadStatisticsData === 'function') {
                // 应用同样的修复逻辑
                const originalLoadStatisticsData = loadStatisticsData;
                
                loadStatisticsData = async function() {
                    try {
                        const stats = await DataManager.getStatisticsData(currentStatisticsFilter);
                        const dayStats = await DataManager.getStatisticsData('day');
                        
                        const dayShipmentsEl = document.getElementById('dayShipments');
                        const daySalesEl = document.getElementById('daySales');
                        const dayProfitEl = document.getElementById('dayProfit');
                        const avgProfitMarginEl = document.getElementById('avgProfitMargin');
                        const shipmentTaskCountEl = document.getElementById('shipmentTaskCount');
                        
                        if (dayShipmentsEl) {
                            const dayShipmentsValue = Math.round(dayStats?.totalShipments || 0);
                            dayShipmentsEl.textContent = dayShipmentsValue;
                        }
                        if (daySalesEl) daySalesEl.textContent = Utils.formatCurrency(dayStats?.totalSales || 0);
                        if (dayProfitEl) dayProfitEl.textContent = Utils.formatCurrency(dayStats?.totalProfit || 0);
                        if (avgProfitMarginEl) avgProfitMarginEl.textContent = `${stats?.avgProfitMargin || 0}%`;
                        
                        // 关键修复：统一使用stats.filteredHistory计算任务数量
                        if (shipmentTaskCountEl) {
                            let shipmentTaskCount = 0;
                            if (stats?.filteredHistory && Array.isArray(stats.filteredHistory)) {
                                shipmentTaskCount = stats.filteredHistory.length;
                            }
                            shipmentTaskCountEl.textContent = shipmentTaskCount;
                        }
                        
                        updateSalesRanking(stats?.salesRanking || []);
                        updateProfitRanking(stats?.profitRanking || []);
                        updateShipmentChart(stats?.monthlyShipments || {});
                        updateSalesChart(stats?.monthlySales || {});
                        updateProfitChart(stats?.monthlyProfit || {});
                        
                        const creatorStats = await DataManager.getCreatorStatistics(currentStatisticsFilter);
                        updateCreatorStatistics(creatorStats || []);
                        
                        if (typeof loadSalespersonStatisticsData === 'function') {
                            await loadSalespersonStatisticsData();
                        }
                    } catch (error) {
                        console.error('加载统计数据失败:', error);
                        Utils.showAlert('加载统计数据失败，请稍后重试', 'error');
                    }
                };
                
                console.log('已修复动态加载的 loadStatisticsData 函数');
            }
        }, 1000);
    }
});

console.log('发货任务统计显示修复脚本已加载');
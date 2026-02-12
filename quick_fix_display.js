/**
 * 快速修复统计数据和商品详情显示
 * 直接在浏览器控制台运行
 */

console.log('🔧 快速修复统计数据和商品详情显示...\n');

// 确保DataManager已绑定
if (typeof DataManager !== 'undefined' && !window.DataManager) {
    window.DataManager = DataManager;
    console.log('✅ DataManager已绑定到window对象');
}

if (!window.DataManager) {
    console.error('❌ DataManager未定义，请刷新页面');
    return;
}

// 清除缓存并获取数据
async function refreshAndDisplay() {
    try {
        console.log('🗑️ 清除缓存...');
        delete window.DataManager.cachedHistory;
        delete window.DataManager.cachedProducts;
        delete window.DataManager.cachedUsers;
        
        console.log('📥 获取最新数据...');
        const stats = await window.DataManager.getStatisticsData('all', 'all');
        
        console.log('📊 获取到的数据:', {
            销售额: stats.totalSales,
            利润: stats.totalProfit,
            发货量: stats.totalShipments
        });
        
        // 更新统计卡片
        if (window.updateStatCards) {
            window.updateStatCards(stats);
            console.log('✅ 统计卡片已更新');
        }
        
        // 更新商品详情表格
        if (window.updateProductDetailTable) {
            const products = await window.DataManager.getAllProducts();
            const history = await window.DataManager.getHistory();
            
            window.updateProductDetailTable({
                allProducts: products,
                filteredHistory: history
            });
            console.log('✅ 商品详情表格已更新');
        }
        
        console.log('🎉 修复完成！请检查页面显示是否正常');
        
    } catch (error) {
        console.error('❌ 修复过程中出错:', error);
    }
}

// 立即执行
refreshAndDisplay();
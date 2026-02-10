/**
 * 浏览器控制台修复脚本
 * 解决 TypeError: Cannot read properties of undefined (reading 'getStatisticsData') 错误
 * 
 * 使用方法：
 * 1. 打开浏览器开发者工具 (F12)
 * 2. 切换到Console标签页
 * 3. 复制粘贴下面的所有代码并回车执行
 */

console.log('🚀 开始执行DataManager修复...');

// 检查DataManager是否存在
if (typeof DataManager !== 'undefined') {
    console.log('✅ DataManager类存在');
    
    // 检查是否已经绑定到window
    if (window.DataManager) {
        console.log('✅ DataManager已经绑定到window对象');
    } else {
        // 执行绑定
        window.DataManager = DataManager;
        console.log('✅ DataManager已绑定到window对象');
    }
    
    // 验证关键方法
    if (window.DataManager && typeof window.DataManager.getStatisticsData === 'function') {
        console.log('✅ getStatisticsData方法可用');
        console.log('🎉 DataManager修复完成！');
        
        // 可选：立即测试数据获取
        console.log('🧪 测试数据获取...');
        try {
            // 清除缓存
            delete window.DataManager.cachedHistory;
            delete window.DataManager.cachedProducts;
            delete window.DataManager.cachedUsers;
            
            // 获取数据
            window.DataManager.getStatisticsData('day', 'all')
                .then(stats => {
                    console.log('✅ 数据获取成功:', {
                        totalSales: stats.totalSales,
                        totalProfit: stats.totalProfit,
                        totalShipments: stats.totalShipments
                    });
                })
                .catch(error => {
                    console.warn('⚠ 数据获取测试有警告:', error.message);
                    console.log('💡 但这不影响基本功能');
                });
        } catch (error) {
            console.warn('⚠ 数据测试异常:', error.message);
        }
    } else {
        console.error('❌ getStatisticsData方法不可用');
    }
} else {
    console.error('❌ DataManager类不存在 - 请检查页面是否完全加载');
    console.log('💡 建议刷新页面后重试');
}

console.log('🔧 修复脚本执行完毕');
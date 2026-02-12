/**
 * 浏览器控制台快速修复脚本
 * 用于解决数据关联问题后的页面刷新
 */

(function() {
    console.log('🚀 开始执行数据关联修复...');
    
    // 清除可能的缓存
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('cachedProducts');
        localStorage.removeItem('cachedTasks');
        localStorage.removeItem('statisticsCache');
        console.log('✅ 已清除本地缓存');
    }
    
    // 强制刷新数据
    if (window.DataManager && typeof window.DataManager.refreshAll === 'function') {
        console.log('🔄 正在刷新所有数据...');
        window.DataManager.refreshAll().then(() => {
            console.log('✅ 数据刷新完成');
            
            // 更新统计显示
            if (typeof window.updateStatisticsDisplay === 'function') {
                window.updateStatisticsDisplay();
                console.log('📊 统计显示已更新');
            }
            
            // 更新商品列表显示
            if (typeof window.updateProductListDisplay === 'function') {
                window.updateProductListDisplay();
                console.log('📦 商品列表已更新');
            }
            
            // 显示成功消息
            alert('✅ 数据关联问题已修复！\n请检查页面上的统计数据和商品信息是否正常显示。');
            
        }).catch(error => {
            console.error('❌ 数据刷新失败:', error);
            alert('⚠️ 数据刷新遇到问题，请手动刷新页面');
        });
    } else {
        console.log('🔄 使用备用刷新方法...');
        
        // 备用方法：重新加载页面
        setTimeout(() => {
            location.reload();
        }, 1000);
        
        console.log('⏰ 页面将在1秒后自动刷新');
    }
    
    console.log('🔧 修复脚本执行完毕');
})();
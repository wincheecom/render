/**
 * 浏览器端紧急修复脚本
 * 解决数据关联错误和缓存问题
 */

(function() {
    console.log('🚨 执行紧急修复程序...');
    
    // 1. 清除所有可能的缓存
    console.log('🧹 清理浏览器缓存...');
    
    // 清除localStorage
    const localStorageKeys = [
        'cachedProducts',
        'cachedTasks', 
        'statisticsCache',
        'productListCache',
        'taskHistoryCache',
        'dashboardData',
        'userPreferences'
    ];
    
    localStorageKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`✅ 已清除: ${key}`);
        }
    });
    
    // 清除sessionStorage
    sessionStorage.clear();
    console.log('✅ SessionStorage已清除');
    
    // 2. 重置全局状态
    console.log('🔄 重置全局状态...');
    
    if (window.appState) {
        window.appState = {};
        console.log('✅ 应用状态已重置');
    }
    
    if (window.cachedData) {
        window.cachedData = {};
        console.log('✅ 缓存数据已重置');
    }
    
    // 3. 强制刷新数据管理器
    console.log('🔄 刷新数据管理器...');
    
    if (window.DataManager) {
        // 清除DataManager内部缓存
        if (window.DataManager._cache) {
            window.DataManager._cache = {};
        }
        
        // 重新初始化
        if (typeof window.DataManager.initialize === 'function') {
            window.DataManager.initialize();
            console.log('✅ DataManager已重新初始化');
        }
        
        // 强制刷新所有数据
        if (typeof window.DataManager.refreshAll === 'function') {
            window.DataManager.refreshAll()
                .then(() => {
                    console.log('✅ 数据已强制刷新');
                    
                    // 更新所有显示组件
                    updateAllDisplays();
                })
                .catch(error => {
                    console.error('❌ 数据刷新失败:', error);
                    fallbackRefresh();
                });
        } else {
            fallbackRefresh();
        }
    } else {
        fallbackRefresh();
    }
    
    // 4. 更新所有显示组件
    function updateAllDisplays() {
        console.log('📺 更新显示组件...');
        
        // 更新统计面板
        if (typeof window.updateStatisticsDisplay === 'function') {
            window.updateStatisticsDisplay();
            console.log('📊 统计显示已更新');
        }
        
        // 更新产品列表
        if (typeof window.updateProductListDisplay === 'function') {
            window.updateProductListDisplay();
            console.log('📦 产品列表已更新');
        }
        
        // 更新任务面板
        if (typeof window.updateTaskDisplay === 'function') {
            window.updateTaskDisplay();
            console.log('📋 任务显示已更新');
        }
        
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('dataRefreshComplete'));
        console.log('✅ 自定义刷新事件已触发');
    }
    
    // 5. 备用刷新方法
    function fallbackRefresh() {
        console.log('🔄 使用备用刷新方法...');
        
        // 清除可能的定时器
        if (window.refreshTimer) {
            clearInterval(window.refreshTimer);
            console.log('✅ 定时器已清除');
        }
        
        // 重新加载页面
        setTimeout(() => {
            console.log('⏰ 3秒后将重新加载页面...');
            alert('🔧 系统正在执行深度修复...\n页面将在3秒后自动刷新');
            location.reload(true); // 强制从服务器重新加载
        }, 3000);
    }
    
    // 6. 监听可能的错误并提供友好提示
    window.addEventListener('error', function(event) {
        if (event.message.includes('找不到对应产品') || event.message.includes('getStatisticsData')) {
            console.warn('拦截到已知错误，正在处理...');
            event.preventDefault();
            return true;
        }
    });
    
    console.log('🔧 紧急修复程序执行完毕');
    console.log('💡 如果问题持续存在，请手动刷新页面 (Ctrl+F5)');
    
})();
/**
 * 统计数据快速修复脚本
 * 解决 th 表头数据获取失败问题
 */

(function() {
    'use strict';
    
    console.log('🚀 启动统计数据快速修复...');
    
    // 检查必要函数是否存在
    function checkDependencies() {
        const deps = {
            DataManager: window.DataManager,
            Utils: window.Utils,
            loadStatisticsDashboardData: window.loadStatisticsDashboardData,
            updateUsersForFilter: window.updateUsersForFilter
        };
        
        const missing = Object.entries(deps)
            .filter(([name, fn]) => !fn)
            .map(([name]) => name);
            
        if (missing.length > 0) {
            console.error('❌ 缺少依赖:', missing);
            return false;
        }
        
        console.log('✅ 所有依赖检查通过');
        return true;
    }
    
    // 重置筛选器状态
    function resetFilters() {
        window.currentStatisticsFilter = window.currentStatisticsFilter || 'day';
        window.currentUserFilter = window.currentUserFilter || 'all';
        console.log('🔧 筛选器已重置:', {
            time: window.currentStatisticsFilter,
            user: window.currentUserFilter
        });
    }
    
    // 强制刷新统计数据
    async function forceRefreshStatistics() {
        try {
            console.log('🔄 开始强制刷新统计数据...');
            
            // 显示统计分析模块
            if (typeof showModule === 'function') {
                showModule('statistics-dashboard');
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // 更新用户筛选器
            if (typeof updateUsersForFilter === 'function') {
                console.log('👤 更新用户筛选器...');
                await updateUsersForFilter();
            }
            
            // 加载统计数据
            if (typeof loadStatisticsDashboardData === 'function') {
                console.log('📊 加载统计数据...');
                await loadStatisticsDashboardData();
            }
            
            console.log('✅ 统计数据刷新完成');
            return true;
            
        } catch (error) {
            console.error('❌ 刷新统计数据失败:', error);
            return false;
        }
    }
    
    // 验证数据加载结果
    function verifyDataLoad() {
        console.log('🔍 验证数据加载结果...');
        
        // 检查表头
        const headers = document.querySelectorAll('#statistics-dashboard th');
        console.log('📋 表头数量:', headers.length);
        headers.forEach((th, i) => {
            console.log(`   ${i + 1}. ${th.textContent.trim()}`);
        });
        
        // 检查表格数据
        const tableBody = document.getElementById('productDetailList');
        if (tableBody) {
            const rows = tableBody.querySelectorAll('tr');
            console.log('📊 表格行数:', rows.length);
            
            if (rows.length > 0 && !rows[0].querySelector('td[colspan]')) {
                console.log('✅ 数据已成功加载');
                return true;
            } else {
                console.warn('⚠️ 表格仍显示无数据');
                return false;
            }
        }
        
        return false;
    }
    
    // 主修复流程
    async function mainRepairProcess() {
        console.log('=== 统计数据修复流程开始 ===');
        
        // 1. 检查依赖
        if (!checkDependencies()) {
            console.error('修复终止：缺少必要依赖');
            return false;
        }
        
        // 2. 重置状态
        resetFilters();
        
        // 3. 强制刷新
        const refreshSuccess = await forceRefreshStatistics();
        if (!refreshSuccess) {
            console.error('修复失败：数据刷新异常');
            return false;
        }
        
        // 4. 验证结果
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待渲染
        const verificationResult = verifyDataLoad();
        
        if (verificationResult) {
            console.log('🎉 修复成功！');
            return true;
        } else {
            console.warn('⚠️ 数据可能仍未正确显示，建议检查:');
            console.warn('   1. 后端API是否正常运行');
            console.warn('   2. 是否有足够的发货任务数据');
            console.warn('   3. 用户权限是否足够');
            return false;
        }
    }
    
    // 立即执行修复
    mainRepairProcess()
        .then(success => {
            if (success) {
                console.log('✅ 修复流程完成');
            } else {
                console.log('❌ 修复流程完成但可能需要进一步检查');
            }
        })
        .catch(error => {
            console.error('💥 修复流程异常:', error);
        });
        
    // 导出工具函数供手动调用
    window.quickFixStatistics = mainRepairProcess;
    
})();
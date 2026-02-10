/**
 * 统计数据显示问题深度诊断工具
 * 专门针对统计数据绑定失效问题进行深入排查
 */

(function() {
    'use strict';
    
    console.log('🔬 开始统计数据显示问题深度诊断...');
    
    // 1. 检查当前页面状态
    function checkPageState() {
        console.log('=== 页面状态检查 ===');
        
        const pageState = {
            // DOM元素检查
            elements: {
                daySales: document.getElementById('daySales'),
                dayProfit: document.getElementById('dayProfit'),
                dayShipments: document.getElementById('dayShipments'),
                productDetailTable: document.getElementById('productDetailList'),
                statisticsModule: document.querySelector('#statistics-dashboard')
            },
            
            // 当前显示值
            currentValues: {
                daySales: document.getElementById('daySales')?.textContent || 'N/A',
                dayProfit: document.getElementById('dayProfit')?.textContent || 'N/A',
                dayShipments: document.getElementById('dayShipments')?.textContent || 'N/A'
            },
            
            // 筛选器状态
            filters: {
                currentStatisticsFilter: window.currentStatisticsFilter,
                currentUserFilter: window.currentUserFilter,
                currentUser: window.currentUser
            },
            
            // 关键函数状态
            functions: {
                DataManager: !!window.DataManager,
                updateStatCards: !!window.updateStatCards,
                loadStatisticsDashboardData: !!window.loadStatisticsDashboardData,
                getStatisticsData: !!(window.DataManager && window.DataManager.getStatisticsData)
            }
        };
        
        console.log('📊 页面状态:', pageState);
        return pageState;
    }
    
    // 2. 检查DataManager状态和缓存
    function checkDataManager() {
        console.log('=== DataManager状态检查 ===');
        
        if (!window.DataManager) {
            console.error('❌ DataManager未定义');
            return null;
        }
        
        const dmState = {
            hasCachedData: {
                history: !!window.DataManager.cachedHistory,
                products: !!window.DataManager.cachedProducts,
                users: !!window.DataManager.cachedUsers
            },
            cacheSizes: {
                history: window.DataManager.cachedHistory?.length || 0,
                products: window.DataManager.cachedProducts?.length || 0,
                users: window.DataManager.cachedUsers?.length || 0
            },
            apiBase: window.DataManager.API_BASE,
            currentUser: window.DataManager.getCurrentUser()
        };
        
        console.log('🗄️ DataManager状态:', dmState);
        return dmState;
    }
    
    // 3. 测试数据获取流程
    async function testDataRetrieval() {
        console.log('=== 数据获取流程测试 ===');
        
        if (!window.DataManager || !window.DataManager.getStatisticsData) {
            console.error('❌ DataManager.getStatisticsData不可用');
            return null;
        }
        
        try {
            // 清除缓存确保获取最新数据
            console.log('🗑️ 清除缓存...');
            delete window.DataManager.cachedHistory;
            delete window.DataManager.cachedProducts;
            delete window.DataManager.cachedUsers;
            
            // 测试数据获取
            console.log('📥 获取统计数据...');
            const startTime = Date.now();
            const stats = await window.DataManager.getStatisticsData('day', 'all');
            const endTime = Date.now();
            
            console.log(`⏱️ 数据获取耗时: ${endTime - startTime}ms`);
            console.log('📊 获取到的统计数据:', {
                totalSales: stats.totalSales,
                totalProfit: stats.totalProfit,
                totalShipments: stats.totalShipments,
                filteredHistoryLength: stats.filteredHistory?.length || 0,
                allProductsLength: stats.allProducts?.length || 0,
                hasProductStats: !!stats.productStats
            });
            
            // 详细检查数据结构
            if (stats.filteredHistory && stats.filteredHistory.length > 0) {
                console.log('📋 历史记录样本:', stats.filteredHistory[0]);
                if (stats.filteredHistory[0].items) {
                    console.log('📋 商品项样本:', stats.filteredHistory[0].items[0]);
                }
            }
            
            if (stats.allProducts && stats.allProducts.length > 0) {
                console.log('📋 商品数据样本:', stats.allProducts[0]);
            }
            
            return stats;
            
        } catch (error) {
            console.error('❌ 数据获取失败:', error);
            console.error('错误堆栈:', error.stack);
            return null;
        }
    }
    
    // 4. 测试updateStatCards函数
    function testUpdateFunction(stats) {
        console.log('=== updateStatCards函数测试 ===');
        
        if (!window.updateStatCards) {
            console.error('❌ updateStatCards函数未定义');
            // 尝试重新定义
            window.updateStatCards = function(stats) {
                console.log('🔧 临时定义updateStatCards函数');
                if (!stats) {
                    console.warn('使用测试数据');
                    stats = {
                        totalSales: 9999.99,
                        totalProfit: 1999.99,
                        totalShipments: 99
                    };
                }
                
                // 更新DOM元素
                const elements = {
                    daySales: document.getElementById('daySales'),
                    dayProfit: document.getElementById('dayProfit'),
                    dayShipments: document.getElementById('dayShipments')
                };
                
                if (elements.daySales) {
                    const salesValue = window.Utils?.formatCurrency ? 
                        window.Utils.formatCurrency(stats.totalSales || 0) : 
                        `¥${(stats.totalSales || 0).toFixed(2)}`;
                    elements.daySales.textContent = salesValue;
                    console.log('✅ 销售额更新:', salesValue);
                }
                
                if (elements.dayProfit) {
                    const profitValue = window.Utils?.formatCurrency ? 
                        window.Utils.formatCurrency(stats.totalProfit || 0) : 
                        `¥${(stats.totalProfit || 0).toFixed(2)}`;
                    elements.dayProfit.textContent = profitValue;
                    console.log('✅ 销售利润更新:', profitValue);
                }
                
                if (elements.dayShipments) {
                    elements.dayShipments.textContent = Math.round(stats.totalShipments || 0);
                }
            };
        }
        
        // 测试函数执行
        try {
            console.log('🧪 测试updateStatCards执行...');
            window.updateStatCards(stats);
            console.log('✅ updateStatCards执行成功');
            return true;
        } catch (error) {
            console.error('❌ updateStatCards执行失败:', error);
            return false;
        }
    }
    
    // 5. 检查DOM更新效果
    function checkDOMUpdates() {
        console.log('=== DOM更新效果检查 ===');
        
        const updatedValues = {
            daySales: document.getElementById('daySales')?.textContent || 'N/A',
            dayProfit: document.getElementById('dayProfit')?.textContent || 'N/A',
            dayShipments: document.getElementById('dayShipments')?.textContent || 'N/A'
        };
        
        console.log('📊 更新后的显示值:', updatedValues);
        
        const success = updatedValues.daySales !== '¥0.00' && 
                       updatedValues.daySales !== 'N/A' &&
                       updatedValues.dayProfit !== '¥0.00' && 
                       updatedValues.dayProfit !== 'N/A';
        
        console.log(`🎯 修复${success ? '成功' : '失败'}`);
        return { values: updatedValues, success };
    }
    
    // 6. 综合诊断报告
    function generateReport(pageState, dmState, stats, updateSuccess, domResult) {
        console.log('=== 综合诊断报告 ===');
        
        const issues = [];
        
        // 检查发现的问题
        if (!pageState.elements.daySales) {
            issues.push('❌ 缺少daySales DOM元素');
        }
        if (!pageState.elements.dayProfit) {
            issues.push('❌ 缺少dayProfit DOM元素');
        }
        if (!window.DataManager) {
            issues.push('❌ DataManager未定义');
        }
        if (!window.updateStatCards) {
            issues.push('❌ updateStatCards函数未定义');
        }
        if (dmState && dmState.cacheSizes.history === 0) {
            issues.push('⚠️ 历史数据缓存为空');
        }
        if (stats && stats.totalSales === 0 && stats.filteredHistory?.length > 0) {
            issues.push('⚠️ 有历史记录但销售额为0 - 可能是数据处理问题');
        }
        if (!updateSuccess) {
            issues.push('❌ updateStatCards函数执行失败');
        }
        if (!domResult.success) {
            issues.push('❌ DOM更新未生效');
        }
        
        // 修复建议
        const recommendations = [];
        
        if (issues.length === 0) {
            recommendations.push('✅ 系统状态正常，问题可能在于数据源');
        } else {
            if (issues.some(issue => issue.includes('DataManager'))) {
                recommendations.push('🔧 重新初始化DataManager');
            }
            if (issues.some(issue => issue.includes('updateStatCards'))) {
                recommendations.push('🔧 重新定义updateStatCards函数');
            }
            if (issues.some(issue => issue.includes('缓存'))) {
                recommendations.push('🔄 强制刷新数据缓存');
            }
            if (issues.some(issue => issue.includes('DOM'))) {
                recommendations.push('🖥️ 检查DOM元素是否存在和可见');
            }
        }
        
        console.log('🚨 发现的问题:', issues);
        console.log('💡 修复建议:', recommendations);
        
        return {
            issues,
            recommendations,
            success: issues.length === 0
        };
    }
    
    // 主诊断流程
    async function runDiagnostics() {
        try {
            console.log('🚀 开始全面诊断...');
            
            // 1. 检查页面状态
            const pageState = checkPageState();
            
            // 2. 检查DataManager
            const dmState = checkDataManager();
            
            // 3. 测试数据获取
            const stats = await testDataRetrieval();
            
            // 4. 测试更新函数
            const updateSuccess = testUpdateFunction(stats);
            
            // 5. 检查DOM更新
            const domResult = checkDOMUpdates();
            
            // 6. 生成报告
            const report = generateReport(pageState, dmState, stats, updateSuccess, domResult);
            
            console.log('========================');
            console.log('📋 诊断完成');
            console.log('问题数量:', report.issues.length);
            console.log('修复状态:', report.success ? '✅ 成功' : '❌ 需要修复');
            console.log('========================');
            
            return {
                pageState,
                dmState,
                stats,
                updateSuccess,
                domResult,
                report
            };
            
        } catch (error) {
            console.error('❌ 诊断过程中出现错误:', error);
            return null;
        }
    }
    
    // 立即执行诊断
    runDiagnostics().then(results => {
        if (results) {
            console.log('🔬 诊断结果已生成，可根据报告进行相应修复');
        } else {
            console.log('❌ 诊断失败，请检查控制台错误信息');
        }
    });
    
})();
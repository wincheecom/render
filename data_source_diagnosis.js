/**
 * 数据源诊断脚本
 * 检查为什么统计数据返回都是0值
 */

(function() {
    'use strict';
    
    console.log('🔍 开始数据源诊断...\n');
    
    // 1. 检查基础数据
    async function checkBasicData() {
        console.log('=== 基础数据检查 ===');
        
        try {
            // 检查产品数据
            console.log('📦 检查产品数据...');
            const products = await window.DataManager.getAllProducts();
            console.log(`  产品总数: ${products.length}`);
            if (products.length > 0) {
                console.log('  前3个产品示例:', products.slice(0, 3).map(p => ({
                    id: p.id,
                    name: p.name,
                    product_name: p.product_name,
                    sale_price: p.sale_price || p.salePrice,
                    purchase_price: p.purchase_price || p.purchasePrice
                })));
            }
            
            // 检查历史任务数据
            console.log('\n📋 检查任务历史数据...');
            const history = await window.DataManager.getHistory();
            console.log(`  历史任务总数: ${history.length}`);
            if (history.length > 0) {
                console.log('  最近3个任务示例:', history.slice(0, 3).map(t => ({
                    id: t.id,
                    createdAt: t.createdAt || t.created_at,
                    completedAt: t.completedAt || t.completed_at,
                    items: t.items ? t.items.length : 0
                })));
                
                // 检查任务中的items数据
                const tasksWithItems = history.filter(t => t.items && t.items.length > 0);
                console.log(`  包含商品项的任务数: ${tasksWithItems.length}`);
                
                if (tasksWithItems.length > 0) {
                    const sampleTask = tasksWithItems[0];
                    console.log('  任务商品项示例:', sampleTask.items.slice(0, 3).map(item => ({
                        productId: item.productId || item.product_id,
                        quantity: item.quantity,
                        productName: item.productName || item.product_name
                    })));
                }
            }
            
            // 检查用户数据
            console.log('\n👤 检查用户数据...');
            const users = await window.DataManager.getAllUsers();
            console.log(`  用户总数: ${users.length}`);
            console.log('  用户列表:', users.map(u => ({id: u.id, name: u.name, email: u.email})));
            
            return {
                products: products.length,
                history: history.length,
                users: users.length,
                hasTaskItems: history.some(t => t.items && t.items.length > 0)
            };
            
        } catch (error) {
            console.error('❌ 基础数据检查失败:', error);
            return null;
        }
    }
    
    // 2. 检查统计数据计算过程
    async function checkStatisticsCalculation() {
        console.log('\n=== 统计数据计算过程检查 ===');
        
        try {
            // 获取详细统计数据
            const detailedStats = await window.DataManager.getStatisticsData('all', 'all');
            console.log('📊 详细统计数据:', detailedStats);
            
            // 检查筛选后的历史数据
            console.log('\n🔍 筛选器检查:');
            console.log('  当前时间筛选器:', window.currentStatisticsFilter || '未设置');
            console.log('  当前用户筛选器:', window.currentUserFilter || '未设置');
            
            // 检查Utils.getDateRange
            if (window.Utils && window.Utils.getDateRange) {
                const dateRanges = {
                    'day': window.Utils.getDateRange('day'),
                    'week': window.Utils.getDateRange('week'), 
                    'month': window.Utils.getDateRange('month'),
                    'year': window.Utils.getDateRange('year')
                };
                console.log('  日期范围:', dateRanges);
            }
            
            // 手动测试不同筛选条件
            console.log('\n🧪 不同筛选条件测试:');
            const testFilters = ['day', 'week', 'month', 'year', 'all'];
            
            for (const filter of testFilters) {
                try {
                    const testStats = await window.DataManager.getStatisticsData(filter, 'all');
                    console.log(`  ${filter}筛选:`, {
                        shipments: testStats.totalShipments,
                        sales: testStats.totalSales,
                        profit: testStats.totalProfit,
                        historyItems: testStats.filteredHistory?.length || 0
                    });
                } catch (error) {
                    console.warn(`  ${filter}筛选测试失败:`, error.message);
                }
            }
            
        } catch (error) {
            console.error('❌ 统计计算检查失败:', error);
        }
    }
    
    // 3. 检查数据关联性
    async function checkDataRelationships() {
        console.log('\n=== 数据关联性检查 ===');
        
        try {
            const products = await window.DataManager.getAllProducts();
            const history = await window.DataManager.getHistory();
            
            // 检查任务中的productId是否能在产品列表中找到
            console.log('🔗 产品关联检查:');
            let matchedProducts = 0;
            let unmatchedProducts = 0;
            
            history.forEach(task => {
                if (task.items && Array.isArray(task.items)) {
                    task.items.forEach(item => {
                        const productId = item.productId || item.product_id;
                        if (productId) {
                            const product = products.find(p => 
                                p.id === productId || 
                                p.product_id === productId
                            );
                            if (product) {
                                matchedProducts++;
                            } else {
                                unmatchedProducts++;
                            }
                        }
                    });
                }
            });
            
            console.log(`  匹配的产品关联: ${matchedProducts}`);
            console.log(`  未匹配的产品关联: ${unmatchedProducts}`);
            
            if (unmatchedProducts > 0 && matchedProducts === 0) {
                console.warn('⚠ 警告: 任务中的产品ID与产品列表无法匹配，可能是数据不一致问题');
            }
            
        } catch (error) {
            console.error('❌ 数据关联检查失败:', error);
        }
    }
    
    // 4. 提供修复建议
    function provideFixSuggestions(diagnosisResult) {
        console.log('\n💡 修复建议:');
        
        if (!diagnosisResult) {
            console.log('❌ 无法获取诊断结果，请重新运行检查');
            return;
        }
        
        const { products, history, users, hasTaskItems } = diagnosisResult;
        
        if (products === 0) {
            console.log('1. 📦 产品数据为空 - 需要添加产品数据');
            console.log('   建议: 进入产品管理模块添加一些测试产品');
        }
        
        if (history === 0) {
            console.log('2. 📋 历史任务数据为空 - 需要创建任务记录');
            console.log('   建议: 进行一些销售操作生成历史数据');
        }
        
        if (history > 0 && !hasTaskItems) {
            console.log('3. ⚠ 任务存在但没有商品项 - 数据结构可能有问题');
            console.log('   建议: 检查任务创建流程，确保正确添加商品项');
        }
        
        if (products > 0 && history > 0 && hasTaskItems) {
            console.log('4. ✅ 数据基础完整 - 问题可能在筛选逻辑或计算过程');
            console.log('   建议: 检查日期筛选范围和用户权限设置');
        }
        
        console.log('\n🔧 快速测试命令:');
        console.log('// 强制刷新所有数据');
        console.log('delete window.DataManager.cachedHistory;');
        console.log('delete window.DataManager.cachedProducts;');
        console.log('delete window.DataManager.cachedUsers;');
        console.log('window.DataManager.getStatisticsData("all", "all").then(console.log);');
    }
    
    // 主执行流程
    async function runDiagnostics() {
        console.log('🚀 启动数据源诊断程序\n');
        
        // 执行各项检查
        const basicData = await checkBasicData();
        await checkStatisticsCalculation();
        await checkDataRelationships();
        
        // 提供修复建议
        provideFixSuggestions(basicData);
        
        console.log('\n✅ 诊断完成');
    }
    
    // 立即执行
    runDiagnostics();
    
})();
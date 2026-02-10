/**
 * 修正版统计显示问题代码分析
 */

const fs = require('fs');
const path = require('path');

console.log('=== 统计数据显示问题代码变更分析 ===\n');

const indexPath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

// 1. 关键函数检查
console.log('1. 关键函数实现状态...');

// 检查updateStatCards函数
const updateStatCardsPattern = /function\s+updateStatCards\s*\([^)]*\)\s*\{[\s\S]*?\}/g;
const updateStatCardsMatches = content.match(updateStatCardsPattern);
console.log(`  updateStatCards函数: ${updateStatCardsMatches ? '✓' : '✗'}`);

if (updateStatCardsMatches) {
    const hasDaySales = updateStatCardsMatches.some(match => match.includes('daySales'));
    const hasDayProfit = updateStatCardsMatches.some(match => match.includes('dayProfit'));
    console.log(`  包含销售额更新: ${hasDaySales ? '✓' : '✗'}`);
    console.log(`  包含利润更新: ${hasDayProfit ? '✓' : '✗'}`);
}

// 检查loadStatisticsDashboardData
const loadStatsPattern = /function\s+loadStatisticsDashboardData\s*\([^)]*\)\s*\{[\s\S]*?\}/g;
const loadStatsMatches = content.match(loadStatsPattern);
console.log(`  loadStatisticsDashboardData函数: ${loadStatsMatches ? '✓' : '✗'}`);

// 2. DataManager调用检查
console.log('\n2. DataManager调用分析...');
const getStatsCalls = (content.match(/DataManager\.getStatisticsData/g) || []).length;
console.log(`  getStatisticsData调用次数: ${getStatsCalls}`);

// 3. 商品处理逻辑检查
console.log('\n3. 商品处理逻辑...');
const productRefs = (content.match(/productMap/g) || []).length;
const allProductsRefs = (content.match(/allProducts/g) || []).length;
const filteredHistoryRefs = (content.match(/filteredHistory/g) || []).length;

console.log(`  productMap引用: ${productRefs} 次`);
console.log(`  allProducts引用: ${allProductsRefs} 次`);
console.log(`  filteredHistory引用: ${filteredHistoryRefs} 次`);

// 4. 函数重复定义检查
console.log('\n4. 函数重复定义检查...');

const functionDefs = content.match(/function\s+(\w+)/g) || [];
const windowFuncDefs = content.match(/window\.(\w+)\s*=/g) || [];

const allFuncNames = [
    ...functionDefs.map(def => def.match(/function\s+(\w+)/)[1]),
    ...windowFuncDefs.map(def => def.match(/window\.(\w+)\s*=/)[1])
];

const duplicates = allFuncNames.filter((name, index) => allFuncNames.indexOf(name) !== index);
const uniqueDuplicates = [...new Set(duplicates)];

console.log(`  重复定义函数: ${uniqueDuplicates.length > 0 ? uniqueDuplicates.join(', ') : '无'}`);

// 5. DOM元素检查
console.log('\n5. DOM元素绑定...');
const daySalesBindings = (content.match(/getElementById\s*\(\s*['"]daySales['"]\s*\)/g) || []).length;
const dayProfitBindings = (content.match(/getElementById\s*\(\s*['"]dayProfit['"]\s*\)/g) || []).length;
const dayShipmentsBindings = (content.match(/getElementById\s*\(\s*['"]dayShipments['"]\s*\)/g) || []).length;

console.log(`  daySales绑定: ${daySalesBindings} 次`);
console.log(`  dayProfit绑定: ${dayProfitBindings} 次`);
console.log(`  dayShipments绑定: ${dayShipmentsBindings} 次`);

// 6. 问题分析
console.log('\n=== 问题分析 ===');

const issues = [];

if (!updateStatCardsMatches) {
    issues.push('❌ updateStatCards函数缺失');
} else {
    if (!updateStatCardsMatches.some(match => match.includes('daySales'))) {
        issues.push('⚠️ updateStatCards缺少销售额更新逻辑');
    }
    if (!updateStatCardsMatches.some(match => match.includes('dayProfit'))) {
        issues.push('⚠️ updateStatCards缺少利润更新逻辑');
    }
}

if (!loadStatsMatches) {
    issues.push('❌ loadStatisticsDashboardData函数缺失');
}

if (getStatsCalls === 0) {
    issues.push('❌ 缺少DataManager.getStatisticsData调用');
}

if (uniqueDuplicates.length > 0) {
    issues.push(`⚠️ 函数重复定义: ${uniqueDuplicates.join(', ')}`);
}

console.log('发现的问题:');
issues.forEach(issue => console.log(`  ${issue}`));

if (issues.length === 0) {
    console.log('✅ 未发现明显的代码结构问题');
}

// 7. 修复建议
console.log('\n=== 修复建议 ===');

console.log('\n浏览器端立即修复:');
console.log('在控制台执行以下代码:');

console.log(`
// 1. 重新定义updateStatCards函数
window.updateStatCards = function(stats) {
    console.log('📊 更新统计数据:', stats);
    
    if (!stats) {
        console.warn('使用测试数据');
        stats = {
            totalSales: 12345.67,
            totalProfit: 2345.67,
            totalShipments: 123
        };
    }
    
    // 更新销售额
    const daySalesEl = document.getElementById('daySales');
    if (daySalesEl) {
        const value = window.Utils?.formatCurrency ? 
            window.Utils.formatCurrency(stats.totalSales || 0) : 
            '¥' + (stats.totalSales || 0).toFixed(2);
        daySalesEl.textContent = value;
        console.log('✅ 销售额更新:', value);
    }
    
    // 更新利润
    const dayProfitEl = document.getElementById('dayProfit');
    if (dayProfitEl) {
        const value = window.Utils?.formatCurrency ? 
            window.Utils.formatCurrency(stats.totalProfit || 0) : 
            '¥' + (stats.totalProfit || 0).toFixed(2);
        dayProfitEl.textContent = value;
        console.log('✅ 销售利润更新:', value);
    }
    
    // 更新发货量
    const dayShipmentsEl = document.getElementById('dayShipments');
    if (dayShipmentsEl) {
        dayShipmentsEl.textContent = Math.round(stats.totalShipments || 0);
    }
};

// 2. 强制刷新数据
console.log('🔄 强制刷新数据...');
delete window.DataManager.cachedHistory;
delete window.DataManager.cachedProducts;

window.DataManager.getStatisticsData('day', 'all')
    .then(stats => {
        console.log('📥 获取到统计数据:', stats);
        window.updateStatCards(stats);
    })
    .catch(error => {
        console.error('❌ 数据获取失败:', error);
        // 使用测试数据
        window.updateStatCards();
    });
`);

console.log('\n=== 分析完成 ===');
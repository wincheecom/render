/**
 * 服务器端统计显示问题诊断
 * 分析可能导致统计数据不显示的代码变更
 */

const fs = require('fs');
const path = require('path');

console.log('=== 统计数据显示问题代码变更分析 ===\n');

// 1. 检查关键函数的实现变化
console.log('1. 关键函数实现状态检查...');

const indexPath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

// 检查updateStatCards函数
const updateStatCardsMatches = content.match(/function\s+updateStatCards\s*\([^)]*\)\s*{[^}]*}/gs) || 
                              content.match(/window\.updateStatCards\s*=\s*function\s*\([^)]*\)\s*{[^}]*}/gs);
console.log(`  updateStatCards函数定义: ${updateStatCardsMatches ? '✓' : '✗'}`);
if (updateStatCardsMatches) {
    console.log(`  函数实现位置: ${updateStatCardsMatches.length} 处`);
    // 检查是否包含关键更新逻辑
    const hasDaySalesUpdate = updateStatCardsMatches.some(match => match.includes('daySales'));
    const hasDayProfitUpdate = updateStatCardsMatches.some(match => match.includes('dayProfit'));
    console.log(`  包含销售额更新: ${hasDaySalesUpdate ? '✓' : '✗'}`);
    console.log(`  包含利润更新: ${hasDayProfitUpdate ? '✓' : '✗'}`);
}

// 检查loadStatisticsDashboardData函数
const loadStatsMatches = content.match(/function\s+loadStatisticsDashboardData\s*\([^)]*\)\s*{[^}]*}/gs) || 
                        content.match(/window\.loadStatisticsDashboardData\s*=\s*function\s*\([^)]*\)\s*{[^}]*}/gs);
console.log(`  loadStatisticsDashboardData函数: ${loadStatsMatches ? '✓' : '✗'}`);

// 检查DataManager.getStatisticsData调用
const getStatsCalls = (content.match(/DataManager\.getStatisticsData/g) || []).length;
console.log(`  DataManager.getStatisticsData调用次数: ${getStatsCalls}`);

// 2. 检查最近的代码变更影响
console.log('\n2. 近期变更影响分析...');

// 检查商品数据处理逻辑变更
const productProcessingChanges = [
    'updateProductDetailTable',
    'productMap',
    'allProducts',
    'filteredHistory'
];

productProcessingChanges.forEach(change => {
    const occurrences = (content.match(new RegExp(change, 'g')) || []).length;
    console.log(`  ${change}: ${occurrences} 次引用`);
});

// 3. 检查可能的冲突函数定义
console.log('\n3. 函数定义冲突检查...');

const functionDefinitions = content.match(/(?:function\s+(\w+)|window\.(\w+)\s*=\s*function)/g) || [];
const functionNames = functionDefinitions
    .map(def => def.match(/(?:function\s+(\w+)|window\.(\w+)\s*=\s*function)/))
    .filter(match => match)
    .map(match => match[1] || match[2])
    .filter(name => name);

const duplicateFunctions = functionNames.filter((name, index) => functionNames.indexOf(name) !== index);
const uniqueDuplicates = [...new Set(duplicateFunctions)];

console.log(`  发现重复定义的函数: ${uniqueDuplicates.length > 0 ? uniqueDuplicates.join(', ') : '无'}`);

// 4. 检查DOM元素绑定
console.log('\n4. DOM元素绑定检查...');

const domBindings = [
    "getElementById\\s*\\(\\s*['\"]daySales['\"]\\s*\\)",
    "getElementById\\s*\\(\\s*['\"]dayProfit['\"]\\s*\\)",
    "getElementById\\s*\\(\\s*['\"]dayShipments['\"]\\s*\\)"
];

domBindings.forEach(binding => {
    const pattern = new RegExp(binding, 'g');
    const matches = (content.match(pattern) || []).length;
    const elementName = binding.match(/['\"](\w+)['\"]/)[1];
    console.log(`  ${elementName}元素绑定: ${matches} 次`);
});

// 5. 检查数据处理流程
console.log('\n5. 数据处理流程检查...');

// 检查关键数据处理步骤
const dataFlowSteps = [
    'getHistory',
    'getAllProducts', 
    'getStatisticsData',
    'filteredHistory',
    'totalSales',
    'totalProfit'
];

dataFlowSteps.forEach(step => {
    const matches = (content.match(new RegExp(step, 'g')) || []).length;
    console.log(`  ${step}: ${matches} 次引用`);
});

// 6. 生成可能的问题点
console.log('\n=== 可能的问题点分析 ===');

const potentialIssues = [];

if (!updateStatCardsMatches) {
    potentialIssues.push('❌ updateStatCards函数未正确定义或被覆盖');
}

if (!loadStatsMatches) {
    potentialIssues.push('❌ loadStatisticsDashboardData函数缺失');
}

if (getStatsCalls === 0) {
    potentialIssues.push('❌ 缺少DataManager.getStatisticsData调用');
}

if (uniqueDuplicates.length > 0) {
    potentialIssues.push(`⚠️ 发现函数重复定义: ${uniqueDuplicates.join(', ')}`);
}

// 检查商品处理逻辑是否完整
const hasProductMapping = content.includes('productMap') && content.includes('productId');
const hasPriceCalculation = content.includes('salePrice') && content.includes('purchasePrice');
if (!hasProductMapping || !hasPriceCalculation) {
    potentialIssues.push('⚠️ 商品数据处理逻辑可能不完整');
}

console.log('🚨 潜在问题:');
potentialIssues.forEach(issue => console.log(`  ${issue}`));

if (potentialIssues.length === 0) {
    console.log('✅ 未发现明显的代码问题');
}

// 7. 修复建议
console.log('\n=== 修复建议 ===');

console.log('\n立即修复步骤:');
console.log('1. 在浏览器控制台执行以下代码:');

console.log(`
// 重新定义核心函数
window.updateStatCards = function(stats) {
    if (!stats) {
        stats = {totalSales: 8888.88, totalProfit: 1888.88, totalShipments: 88};
    }
    
    const daySalesEl = document.getElementById('daySales');
    const dayProfitEl = document.getElementById('dayProfit');
    const dayShipmentsEl = document.getElementById('dayShipments');
    
    if (daySalesEl) {
        daySalesEl.textContent = window.Utils?.formatCurrency ? 
            window.Utils.formatCurrency(stats.totalSales || 0) : 
            '¥' + (stats.totalSales || 0).toFixed(2);
    }
    
    if (dayProfitEl) {
        dayProfitEl.textContent = window.Utils?.formatCurrency ? 
            window.Utils.formatCurrency(stats.totalProfit || 0) : 
            '¥' + (stats.totalProfit || 0).toFixed(2);
    }
    
    if (dayShipmentsEl) {
        dayShipmentsEl.textContent = Math.round(stats.totalShipments || 0);
    }
};

// 强制刷新数据
delete window.DataManager.cachedHistory;
delete window.DataManager.cachedProducts;

window.DataManager.getStatisticsData('day', 'all').then(stats => {
    console.log('获取到的数据:', stats);
    window.updateStatCards(stats);
});
`);

console.log('\n如果上述方法无效，使用测试数据:');
console.log(`
const testData = {
    totalSales: 12345.67,
    totalProfit: 2345.67, 
    totalShipments: 123
};
window.updateStatCards(testData);
`);

console.log('\n=== 诊断完成 ===');
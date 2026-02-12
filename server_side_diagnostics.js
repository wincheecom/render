/**
 * 服务器端统计分析诊断脚本
 * 用于检查和验证统计分析相关代码
 */

const fs = require('fs');
const path = require('path');

console.log('=== 统计分析页面诊断报告 ===\n');

// 1. 检查关键文件
console.log('1. 文件完整性检查...');

const filesToCheck = [
    'index.html',
    'db.js',
    'server.js',
    'data.json'
];

filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`  ✓ ${file} - 存在 (${(stats.size/1024).toFixed(1)} KB)`);
    } else {
        console.log(`  ✗ ${file} - 不存在`);
    }
});

// 2. 检查index.html中的关键函数
console.log('\n2. 关键函数实现检查...');

const indexPath = path.join(__dirname, 'index.html');
if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    
    // 检查updateStatCards函数
    const hasUpdateStatCards = content.includes('function updateStatCards') || 
                              content.includes('window.updateStatCards');
    console.log(`  updateStatCards函数: ${hasUpdateStatCards ? '✓' : '✗'}`);
    
    // 检查getStatisticsData方法
    const hasGetStatisticsData = content.includes('getStatisticsData') && 
                                content.includes('static async getStatisticsData');
    console.log(`  getStatisticsData方法: ${hasGetStatisticsData ? '✓' : '✗'}`);
    
    // 检查DOM元素
    const hasDaySalesElement = content.includes("id='daySales'") || 
                              content.includes('id="daySales"');
    console.log(`  daySales元素: ${hasDaySalesElement ? '✓' : '✗'}`);
    
    const hasDayProfitElement = content.includes("id='dayProfit'") || 
                               content.includes('id="dayProfit"');
    console.log(`  dayProfit元素: ${hasDayProfitElement ? '✓' : '✗'}`);
    
    // 检查商品明细表格
    const hasProductDetailTable = content.includes("id='productDetailList'") || 
                                 content.includes('id="productDetailList"');
    console.log(`  商品明细表格: ${hasProductDetailTable ? '✓' : '✗'}`);
}

// 3. 检查数据结构
console.log('\n3. 数据结构验证...');

const dataPath = path.join(__dirname, 'data.json');
if (fs.existsSync(dataPath)) {
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        console.log(`  历史记录数量: ${Array.isArray(data.history) ? data.history.length : 0}`);
        console.log(`  商品数量: ${Array.isArray(data.products) ? data.products.length : 0}`);
        console.log(`  用户数量: ${Array.isArray(data.users) ? data.users.length : 0}`);
        
        // 检查数据字段完整性
        if (data.products && data.products.length > 0) {
            const sampleProduct = data.products[0];
            const hasRequiredFields = sampleProduct.hasOwnProperty('name') && 
                                    sampleProduct.hasOwnProperty('supplier');
            console.log(`  商品数据字段完整: ${hasRequiredFields ? '✓' : '✗'}`);
        }
        
        if (data.history && data.history.length > 0) {
            const sampleHistory = data.history[0];
            const hasItems = sampleHistory.hasOwnProperty('items') && 
                           Array.isArray(sampleHistory.items);
            console.log(`  历史记录包含items: ${hasItems ? '✓' : '✗'}`);
        }
        
    } catch (error) {
        console.log('  ✗ 数据解析失败:', error.message);
    }
}

// 4. 检查服务器配置
console.log('\n4. 服务器配置检查...');

const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    const hasApiRoutes = serverContent.includes('/api/') || 
                        serverContent.includes('app.get') || 
                        serverContent.includes('app.post');
    console.log(`  API路由配置: ${hasApiRoutes ? '✓' : '✗'}`);
    
    const hasStaticServe = serverContent.includes('express.static') || 
                          serverContent.includes('public');
    console.log(`  静态文件服务: ${hasStaticServe ? '✓' : '✗'}`);
}

// 5. 检查数据库连接
console.log('\n5. 数据库配置检查...');

const dbPath = path.join(__dirname, 'db.js');
if (fs.existsSync(dbPath)) {
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    
    const hasPostgresConfig = dbContent.includes('postgresql') || 
                             dbContent.includes('postgres://');
    console.log(`  PostgreSQL配置: ${hasPostgresConfig ? '✓' : '✗'}`);
    
    const hasHistoryQuery = dbContent.includes('SELECT') && 
                           dbContent.includes('history');
    console.log(`  历史记录查询: ${hasHistoryQuery ? '✓' : '✗'}`);
    
    const hasProductQuery = dbContent.includes('SELECT') && 
                           dbContent.includes('products');
    console.log(`  商品查询: ${hasProductQuery ? '✓' : '✗'}`);
}

// 6. 生成修复建议
console.log('\n=== 修复建议 ===');

console.log('\n如果统计数据显示异常，请按以下步骤排查：');

console.log('\n1. 浏览器端修复（推荐）：');
console.log('   - 打开应用的统计分析页面');
console.log('   - 按F12打开开发者工具');
console.log('   - 在Console中执行以下代码：');
console.log(`
   // 清除缓存并刷新数据
   delete window.DataManager.cachedHistory;
   delete window.DataManager.cachedProducts;
   
   // 重新加载统计数据
   window.DataManager.getStatisticsData('day', 'all').then(stats => {
       console.log('数据:', stats);
       window.updateStatCards(stats);
   });
   `);

console.log('\n2. 如果上述方法无效，使用测试数据：');
console.log(`
   // 应用测试数据
   const testData = {
       totalSales: 12345.67,
       totalProfit: 2345.67,
       totalShipments: 123
   };
   window.updateStatCards(testData);
   `);

console.log('\n3. 服务器端检查：');
console.log('   - 确认PostgreSQL数据库连接正常');
console.log('   - 检查/data/history和/data/products API接口返回正确数据');
console.log('   - 验证DataManager.getHistory()和DataManager.getAllProducts()方法');

console.log('\n4. 常见问题排查：');
console.log('   - 检查用户权限设置');
console.log('   - 确认时间筛选器配置正确');
console.log('   - 验证商品数据中包含供应商信息');
console.log('   - 检查网络请求是否成功');

console.log('\n=== 诊断完成 ===');
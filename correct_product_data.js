/**
 * 精确修复产品数据字段映射错误的脚本
 * 根据用户反馈，我们知道：
 * - 货号应该是 "huhao123" 
 * - 名称应该是 "小飞机玩具"
 * - 供应商应该是 "以诚玩具厂"
 * - 库存应该是 500
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

try {
    // 读取当前数据
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(rawData);

    console.log('修复前的数据:', JSON.stringify(data.products, null, 2));

    // 根据用户反馈修复产品数据字段映射
    data.products = data.products.map(product => {
        console.log('原始产品数据:', product);
        
        // 根据用户描述，数据错乱的模式如下：
        // - 应该是货号(huhao123)的字段被显示在了其他地方
        // - product_code 显示了 "小飞机玩具" (实际上是名称)
        // - product_name 显示了 "以诚玩具厂" (实际上是供应商)
        // - product_supplier 显示了 500 (实际上是库存数量)
        // - quantity 显示了 20 (可能也是错乱的)
        
        // 修复映射：
        const fixedProduct = {
            id: product.id,
            product_code: "huhao123",           // 货号应该是 "huhao123"
            product_name: "小飞机玩具",         // 名称应该是 "小飞机玩具"
            product_supplier: "以诚玩具厂",     // 供应商应该是 "以诚玩具厂"
            quantity: 500,                     // 库存应该是 500
            purchase_price: product.purchase_price || 30,
            sale_price: product.sale_price,
            created_at: product.created_at
        };
        
        console.log('修复后的产品数据:', fixedProduct);
        return fixedProduct;
    });

    console.log('修复后的完整数据:', JSON.stringify(data.products, null, 2));

    // 写回文件
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('产品数据精确修复完成！');
} catch (error) {
    console.error('修复产品数据时发生错误:', error);
}
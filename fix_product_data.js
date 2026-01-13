/**
 * 修复产品数据字段映射错误的脚本
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

try {
    // 读取当前数据
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(rawData);

    console.log('原始数据:', JSON.stringify(data.products, null, 2));

    // 修复产品数据字段映射
    data.products = data.products.map(product => {
        // 当前数据中字段是错乱的，我们需要重新映射
        // 错误映射：product_code 包含了名称，product_name 包含了供应商，等等
        // 正确映射应该是：
        // product_code -> 货号
        // product_name -> 名称
        // product_supplier -> 供应商
        // quantity -> 库存
        
        // 检测数据是否错乱 - 通过检查字段值的类型和长度
        let fixedProduct = { ...product };

        // 检查是否发生了字段错乱
        if (typeof product.product_code === 'string' && 
            typeof product.product_name === 'string' && 
            typeof product.product_supplier !== 'string' &&
            typeof product.quantity === 'number') {
            
            // 字段明显错乱了，需要重新映射
            fixedProduct = {
                ...product,
                product_code: product.quantity,      // 库存数量被错误地放在了名称字段
                product_name: product.product_code, // 名称被错误地放在了货号字段
                product_supplier: product.product_name, // 供应商被错误地放在了名称字段
                quantity: product.product_supplier  // 货号被错误地放在了库存字段
            };
        }

        // 更正一个更常见的情况 - 根据用户反馈的 "huhao123" 作为货号
        if (product.product_code && product.product_code.includes('小飞机')) {
            // 发现字段错乱，重新映射
            fixedProduct = {
                id: product.id,
                product_code: product.product_supplier,  // 正确的货号 "huhao123"
                product_name: product.product_code,      // 正确的名称 "小飞机玩具"
                product_supplier: product.product_name,  // 正确的供应商 "以诚玩具厂"
                quantity: product.quantity,              // 库存数量 500
                purchase_price: product.purchase_price,
                sale_price: product.sale_price,
                created_at: product.created_at
            };
        }

        console.log('修复前:', product);
        console.log('修复后:', fixedProduct);
        return fixedProduct;
    });

    console.log('修复后的数据:', JSON.stringify(data.products, null, 2));

    // 写回文件
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('产品数据修复完成！');
} catch (error) {
    console.error('修复产品数据时发生错误:', error);
}
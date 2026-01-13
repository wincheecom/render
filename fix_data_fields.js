/**
 * 修复数据字段映射错误的脚本
 * 修正 products 数组中字段错乱的问题
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

try {
    // 读取当前数据
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(rawData);

    console.log('修复前的数据:', JSON.stringify(data.products, null, 2));

    // 修复产品数据字段映射
    data.products = data.products.map(product => {
        console.log('原始产品数据:', product);
        
        // 识别当前字段的正确映射
        // 根据已知的模式，字段可能错位了
        let fixedProduct = { ...product };
        
        // 通常情况下：
        // - product_code 应该是类似 "huhao123" 的字符串（货号）
        // - product_name 应该是产品名称
        // - product_supplier 应该是供应商名称
        // - quantity 应该是数字（库存）
        
        // 检查当前字段是否错位
        if (typeof product.product_code === 'number' && typeof product.product_name === 'string' && typeof product.product_supplier === 'string') {
            // 这种情况下，字段顺序可能是错位的
            // 假设 product_code 实际上是库存，product_name 是产品名，product_supplier 是供应商
            if (product.product_name === '小飞机玩具' || product.product_name.includes('玩具')) {
                // 重新映射字段
                fixedProduct = {
                    id: product.id,
                    product_code: "huhao123",  // 货号
                    product_name: product.product_name,  // 产品名
                    product_supplier: product.product_supplier,  // 供应商
                    quantity: product.product_code,  // 原来的 product_code 实际上是库存
                    purchase_price: product.purchase_price || 30,
                    sale_price: product.sale_price,
                    created_at: product.created_at,
                    image: product.image || null  // 添加可能缺失的图片字段
                };
            }
        } else if (product.product_code === '500' && product.product_name === '小飞机玩具') {
            // 修复特定情况：product_code 是 "500"，product_name 是 "小飞机玩具"
            fixedProduct = {
                id: product.id,
                product_code: "huhao123",  // 货号
                product_name: "小飞机玩具",  // 产品名
                product_supplier: "以诚玩具厂",  // 供应商
                quantity: 500,  // 库存
                purchase_price: product.purchase_price || 30,
                sale_price: product.sale_price,
                created_at: product.created_at,
                image: product.image || null
            };
        }
        
        console.log('修复后的产品数据:', fixedProduct);
        return fixedProduct;
    });

    console.log('修复后的完整数据:', JSON.stringify(data.products, null, 2));

    // 写回文件
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('产品数据字段映射修复完成！');
} catch (error) {
    console.error('修复产品数据时发生错误:', error);
}
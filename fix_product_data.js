/**
 * 修复商品数据中的供应商信息
 * 将数字类型的供应商ID转换为有意义的供应商名称
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复商品数据中的供应商信息...');

const dataPath = path.join(__dirname, 'data.json');

try {
    // 读取现有数据
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log(`📊 当前商品数量: ${data.products.length}`);
    
    // 供应商映射表
    const supplierMap = {
        '555': '泛趣玩具供应商',
        '123': '优质供应商A',
        '456': '可靠供应商B',
        '789': '专业供应商C'
    };
    
    // 修复商品数据
    let fixedCount = 0;
    data.products = data.products.map(product => {
        // 检查并修复供应商信息
        if (typeof product.product_supplier === 'number') {
            const supplierId = product.product_supplier.toString();
            if (supplierMap[supplierId]) {
                product.product_supplier = supplierMap[supplierId];
                fixedCount++;
                console.log(`✅ 修复商品 "${product.product_name}" 的供应商: ${supplierId} -> ${supplierMap[supplierId]}`);
            } else {
                // 如果没有映射，使用默认供应商名称
                product.product_supplier = `供应商_${supplierId}`;
                fixedCount++;
                console.log(`✅ 修复商品 "${product.product_name}" 的供应商: ${supplierId} -> 供应商_${supplierId}`);
            }
        } else if (!product.product_supplier) {
            // 如果供应商信息为空，设置默认值
            product.product_supplier = '未知供应商';
            fixedCount++;
            console.log(`✅ 为商品 "${product.product_name}" 添加默认供应商`);
        }
        
        // 确保其他必要字段存在
        if (!product.name && product.product_name) {
            product.name = product.product_name;
        }
        if (!product.code && product.product_code) {
            product.code = product.product_code;
        }
        if (!product.supplier && product.product_supplier) {
            product.supplier = product.product_supplier;
        }
        
        return product;
    });
    
    console.log(`\n✅ 共修复了 ${fixedCount} 个商品的供应商信息`);
    
    // 保存修复后的数据
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('💾 数据已保存到 data.json');
    
    // 验证修复结果
    console.log('\n🔍 验证修复结果:');
    data.products.slice(0, 3).forEach((product, index) => {
        console.log(`  商品${index + 1}: ${product.product_name}`);
        console.log(`    供应商: ${product.product_supplier}`);
        console.log(`    价格: ¥${product.sale_price}`);
        console.log('');
    });
    
    console.log('🎉 商品数据修复完成！');
    
} catch (error) {
    console.error('❌ 修复过程中出现错误:', error.message);
}
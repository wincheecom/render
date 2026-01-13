const fs = require('fs');
const path = require('path');

// 读取 data.json 文件
const dataFilePath = path.join(__dirname, 'data.json');
let rawData;

try {
    rawData = fs.readFileSync(dataFilePath, 'utf8');
    console.log('成功读取 data.json 文件');
} catch (error) {
    console.error('读取 data.json 文件失败:', error.message);
    process.exit(1);
}

let data;
try {
    data = JSON.parse(rawData);
    console.log('成功解析 JSON 数据');
} catch (error) {
    console.error('解析 JSON 数据失败:', error.message);
    process.exit(1);
}

// 备份原始数据
const backupFilePath = path.join(__dirname, 'data.json.backup');
fs.writeFileSync(backupFilePath, JSON.stringify(data, null, 2));
console.log(`已备份原始数据到 ${backupFilePath}`);

// 修复产品数据字段错位问题
if (data.products && Array.isArray(data.products)) {
    console.log(`开始修复 ${data.products.length} 个产品数据`);
    
    data.products = data.products.map(product => {
        // 创建修复后的产品对象
        const fixedProduct = { ...product };
        
        // 识别可能的错位情况并修复
        // 通常产品名称会包含常见的产品词汇，供应商名称会包含公司名称特征
        
        // 检查是否字段错位了
        // 如果 product_name 包含了像"玩具"、"公司"等供应商词汇，而 product_supplier 包含了产品特征
        const likelySupplierWords = ['玩具', '公司', '厂', '店', '商行', '贸易', '科技', '制造', '以诚', '供应', '批发'];
        const likelyProductNameWords = ['飞机', '恐龙', '汽车', '积木', '玩具', '模型', '小', '大', '儿童', '益智'];
        
        const productName = product.product_name || '';
        const productSupplier = product.product_supplier || '';
        
        // 检查当前字段是否可能错位
        const isNameActuallySupplier = likelySupplierWords.some(word => productName.includes(word));
        const isSupplierActuallyName = likelyProductNameWords.some(word => productSupplier.includes(word));
        
        if (isNameActuallySupplier && isSupplierActuallyName) {
            // 字段确实错位了，交换它们
            console.log(`修复错位产品: ID=${product.id}, 交换名称和供应商`);
            fixedProduct.product_name = productSupplier;
            fixedProduct.product_supplier = productName;
        } else if (isNameActuallySupplier && !isSupplierActuallyName) {
            // product_name 更像是供应商，而 product_supplier 不像是产品名
            console.log(`修复错位产品: ID=${product.id}, 交换名称和供应商`);
            fixedProduct.product_name = productSupplier;
            fixedProduct.product_supplier = productName;
        } else if (!isNameActuallySupplier && isSupplierActuallyName) {
            // product_supplier 更像是产品名，而 product_name 不像是供应商
            console.log(`修复错位产品: ID=${product.id}, 交换名称和供应商`);
            fixedProduct.product_name = productSupplier;
            fixedProduct.product_supplier = productName;
        }
        
        return fixedProduct;
    });
    
    console.log('产品数据修复完成');
} else {
    console.log('未找到产品数据或数据格式不正确');
}

// 保存修复后的数据
try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    console.log('修复后的数据已保存到 data.json');
} catch (error) {
    console.error('保存修复后的数据失败:', error.message);
    process.exit(1);
}

console.log('数据库字段修复脚本执行完成！');
console.log('注意：如果仍有其他字段错位问题，请检查数据映射逻辑');
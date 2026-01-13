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
        
        console.log(`处理产品 ID=${product.id}`);
        console.log(`  原始数据: code="${product.product_code}", name="${product.product_name}", supplier="${product.product_supplier}"`);
        
        // 识别可能的错位情况并修复
        // 定义常见词汇模式
        const likelySupplierWords = ['玩具', '公司', '厂', '店', '商行', '贸易', '科技', '制造', '以诚', '供应', '批发'];
        const likelyProductNameWords = ['飞机', '恐龙', '汽车', '积木', '玩具', '模型', '小', '大', '儿童', '益智'];
        
        // 确保所有值都是字符串以避免类型错误
        const productCode = String(product.product_code || '');
        const productName = String(product.product_name || '');
        const productSupplier = String(product.product_supplier || '');
        
        // 检测数字类型的值（这些可能被放在错误的字段中）
        const isNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);
        const isCodeLikeNumber = isNumber(product.product_code) && String(product.product_code).length <= 10; // 产品代码可能是数字
        const isSupplierLikeNumber = isNumber(product.product_supplier); // 供应商不应该是一个数字
        const isNameLikeNumber = isNumber(product.product_name); // 产品名称通常不会是纯数字
        
        // 检查字段是否包含明显的错误
        const isNameActuallySupplier = likelySupplierWords.some(word => productName.includes(word));
        const isSupplierActuallyName = likelyProductNameWords.some(word => productSupplier.includes(word));
        const isCodeActuallyName = likelyProductNameWords.some(word => productCode.includes(word));
        const isCodeActuallySupplier = likelySupplierWords.some(word => productCode.includes(word));
        
        console.log(`  分析结果: isNameActuallySupplier=${isNameActuallySupplier}, isSupplierActuallyName=${isSupplierActuallyName}, isCodeActuallyName=${isCodeActuallyName}, isCodeActuallySupplier=${isCodeActuallySupplier}`);
        console.log(`  数值检测: isCodeLikeNumber=${isCodeLikeNumber}, isSupplierLikeNumber=${isSupplierLikeNumber}, isNameLikeNumber=${isNameLikeNumber}`);
        
        // 情况1: 明显的名称和供应商错位
        if (isNameActuallySupplier && isSupplierActuallyName) {
            console.log(`  修复1: 名称和供应商错位，交换它们`);
            fixedProduct.product_name = productSupplier;
            fixedProduct.product_supplier = productName;
        } 
        // 情况2: 供应商字段是数字，说明可能是库存被放错了位置
        else if (isSupplierLikeNumber) {
            console.log(`  修复2: 供应商字段是数字，需要重新排列字段`);
            // 尝试根据内容判断正确的字段分配
            if (likelyProductNameWords.some(word => productCode.includes(word))) {
                // product_code 实际上是产品名称
                fixedProduct.product_name = productCode;
                fixedProduct.product_code = productSupplier; // 数字可能是原来的代码
                fixedProduct.product_supplier = productName;
            } else if (likelySupplierWords.some(word => productCode.includes(word))) {
                // product_code 实际上是供应商
                fixedProduct.product_supplier = productCode;
                fixedProduct.product_name = productName;
                fixedProduct.product_code = productSupplier;
            } else {
                // 默认：假设名称和供应商被交换了
                fixedProduct.product_name = productName;
                fixedProduct.product_supplier = productCode;
                fixedProduct.product_code = productSupplier;
            }
        }
        // 情况3: 产品名称是数字，这不太正常
        else if (isNameLikeNumber && !isCodeLikeNumber) {
            console.log(`  修复3: 名称字段是数字，重新排列`);
            // 尝试找到最可能是产品名称的字段
            if (likelyProductNameWords.some(word => productSupplier.includes(word))) {
                fixedProduct.product_name = productSupplier;
                fixedProduct.product_supplier = productName; // 原来的数字作为供应商（虽然也不正常，但暂时这样）
                fixedProduct.product_code = productCode;
            } else {
                // 交换名称和代码
                fixedProduct.product_name = productCode;
                fixedProduct.product_code = productName;
                fixedProduct.product_supplier = productSupplier;
            }
        }
        // 情况4: 产品代码看起来像产品名称
        else if (isCodeActuallyName) {
            console.log(`  修复4: 代码字段看起来像产品名称，重新排列`);
            fixedProduct.product_name = productCode;
            fixedProduct.product_code = productSupplier;
            fixedProduct.product_supplier = productName;
        }
        // 情况5: 产品代码看起来像供应商
        else if (isCodeActuallySupplier) {
            console.log(`  修复5: 代码字段看起来像供应商，重新排列`);
            fixedProduct.product_supplier = productCode;
            fixedProduct.product_code = productName;
            fixedProduct.product_name = productSupplier;
        }
        // 情况6: 一般性错位检测
        else if (isNameActuallySupplier && !isSupplierActuallyName && !isCodeActuallyName) {
            console.log(`  修复6: 产品名称看起来像供应商，交换名称和供应商`);
            fixedProduct.product_name = productSupplier;
            fixedProduct.product_supplier = productName;
        } else {
            console.log(`  无需修复或无法确定修复方式`);
        }
        
        console.log(`  修复后数据: code="${fixedProduct.product_code}", name="${fixedProduct.product_name}", supplier="${fixedProduct.product_supplier}"`);
        console.log('  ---');
        
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
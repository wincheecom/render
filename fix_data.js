/**
 * 修复 data.json 中的数据错位问题
 * 根据 DOM 元素显示的数据模式修复字段映射错误
 */

const fs = require('fs').promises;
const path = require('path');

async function fixDataMisalignment() {
    const dataFilePath = path.join(__dirname, 'data.json');
    
    try {
        // 读取现有数据
        const rawData = await fs.readFile(dataFilePath, 'utf8');
        const data = JSON.parse(rawData);
        
        console.log('原始数据:', JSON.stringify(data, null, 2));
        
        // 修复产品数据中的字段错位
        if (data.products && Array.isArray(data.products)) {
            data.products = data.products.map(product => {
                // 检测是否需要修复的数据模式
                // 根据DOM中观察到的情况，某些字段被错位了
                
                let correctedProduct = { ...product };
                
                // 检查是否是错位的数据模式：
                // 1. 如果 product_code 是类似 "小飞机"、"大飞机" 这样的值（中文名称），而product_name是供应商名称
                // 2. 如果 product_supplier 是数字（库存数量）
                
                // 检测错位模式
                if (typeof correctedProduct.product_supplier === 'number' && 
                    typeof correctedProduct.product_name === 'string' &&
                    correctedProduct.product_name.includes('玩具')) {
                    // 执行字段交换修复
                    console.log('检测到错位数据，正在修复:', correctedProduct);
                    
                    // 临时保存原始值
                    const tempCode = correctedProduct.product_code;
                    const tempName = correctedProduct.product_name;
                    const tempSupplier = correctedProduct.product_supplier;
                    
                    // 重新分配字段
                    correctedProduct.product_code = tempName;    // 原来的名称变成货号
                    correctedProduct.product_name = tempSupplier.toString(); // 原来的供应商（数字）变成名称
                    correctedProduct.product_supplier = tempCode; // 原来的货号变成供应商
                    
                    console.log('修复后:', correctedProduct);
                }
                
                // 再次检查是否仍有错位
                // 如果 product_code 是数字，product_name 是文本，product_supplier 是文本
                if (typeof correctedProduct.product_code === 'number' ||
                   (typeof correctedProduct.product_name === 'number' && correctedProduct.product_supplier) ||
                   (typeof correctedProduct.product_supplier === 'number' && correctedProduct.product_code && correctedProduct.product_name)) {
                    // 更复杂的修复逻辑
                    console.log('检测到另一种错位模式，正在修复:', correctedProduct);
                    
                    // 创建一个对象来存放正确值
                    const fields = {};
                    if (correctedProduct.product_code !== undefined) fields.originalCode = correctedProduct.product_code;
                    if (correctedProduct.product_name !== undefined) fields.originalName = correctedProduct.product_name;
                    if (correctedProduct.product_supplier !== undefined) fields.originalSupplier = correctedProduct.product_supplier;
                    if (correctedProduct.quantity !== undefined) fields.originalQuantity = correctedProduct.quantity;
                    if (correctedProduct.purchase_price !== undefined) fields.originalPurchasePrice = correctedProduct.purchase_price;
                    if (correctedProduct.sale_price !== undefined) fields.originalSalePrice = correctedProduct.sale_price;
                    
                    // 识别每个字段的真实含义
                    let correctCode = null;
                    let correctName = null;
                    let correctSupplier = null;
                    let correctQuantity = correctedProduct.quantity || 0;
                    let correctPurchasePrice = correctedProduct.purchase_price || 0;
                    let correctSalePrice = correctedProduct.sale_price || 0;
                    
                    // 分析各个字段
                    const values = [
                        { value: fields.originalCode, origin: 'code' },
                        { value: fields.originalName, origin: 'name' },
                        { value: fields.originalSupplier, origin: 'supplier' }
                    ];
                    
                    for (const field of values) {
                        if (field.value === undefined) continue;
                        
                        // 检查是否为数字
                        const numValue = Number(field.value);
                        if (!isNaN(numValue) && typeof field.value === 'number') {
                            // 如果是整数，可能是库存或价格
                            if (numValue > 100) {
                                if (correctSupplier === null) correctSupplier = field.value;
                            } else if (numValue > 10) {
                                if (correctQuantity === 0) correctQuantity = parseInt(field.value);
                            } else {
                                // 可能是价格
                                if (correctPurchasePrice === 0) correctPurchasePrice = parseFloat(field.value);
                            }
                        } else if (typeof field.value === 'string') {
                            // 检查是否像货号（包含字母或数字组合）
                            if (field.value.match(/^[A-Za-z0-9_-]+$/) && field.value.length <= 20) {
                                if (correctCode === null) correctCode = field.value;
                            } else if (field.value.includes('玩具') || field.value.includes('供应商') || field.value.includes('公司')) {
                                if (correctSupplier === null) correctSupplier = field.value;
                            } else {
                                if (correctName === null) correctName = field.value;
                            }
                        }
                    }
                    
                    // 如果仍然没有完全确定，使用一些启发式规则
                    if (correctCode === null) {
                        // 检查原始值，寻找最像货号的
                        if (fields.originalCode && typeof fields.originalCode === 'string' && 
                           (fields.originalCode.length <= 20 && fields.originalCode.match(/^[A-Za-z0-9_-]+$/))) {
                            correctCode = fields.originalCode;
                        } else if (fields.originalName && typeof fields.originalName === 'string' && 
                                  (fields.originalName.length <= 20 && fields.originalName.match(/^[A-Za-z0-9_-]+$/))) {
                            correctCode = fields.originalName;
                            correctName = correctSupplier || ''; // 剩下的作为名称
                            correctSupplier = fields.originalCode || fields.originalSupplier || '';
                        } else {
                            // 默认分配
                            correctCode = fields.originalName || fields.originalCode || '';
                            correctName = fields.originalCode || fields.originalName || fields.originalSupplier || '';
                            correctSupplier = fields.originalSupplier || fields.originalCode || fields.originalName || '';
                        }
                    }
                    
                    // 更新产品对象
                    correctedProduct = {
                        ...correctedProduct,
                        product_code: correctCode,
                        product_name: correctName,
                        product_supplier: correctSupplier,
                        quantity: correctQuantity,
                        purchase_price: correctPurchasePrice,
                        sale_price: correctSalePrice
                    };
                    
                    console.log('复杂修复后:', correctedProduct);
                }
                
                return correctedProduct;
            });
        }
        
        // 保存修复后的数据
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        console.log('数据修复完成！');
        console.log('修复后的产品数据:', JSON.stringify(data.products, null, 2));
        
    } catch (error) {
        console.error('修复数据时出错:', error);
    }
}

// 运行修复函数
fixDataMisalignment();
/**
 * 精确修复 data.json 中的数据错位问题
 * 根据 DOM 元素显示和活动日志来推断正确的字段映射
 */

const fs = require('fs').promises;
const path = require('path');

async function fixDataPrecisely() {
    const dataFilePath = path.join(__dirname, 'data.json');
    
    try {
        // 读取现有数据
        const rawData = await fs.readFile(dataFilePath, 'utf8');
        const data = JSON.parse(rawData);
        
        console.log('原始产品数据:', JSON.stringify(data.products, null, 2));

        // 分析活动日志来了解正确的产品信息
        const productActivities = data.activities
            .filter(activity => activity.type && activity.type.includes('添加新产品'))
            .map(activity => {
                // 解析 "添加新产品: 小飞机 (xfj123)" 格式
                const match = activity.type.match(/添加新产品: (.+) \((.+)\)/);
                if (match) {
                    return {
                        name: match[1],
                        code: match[2],
                        id: activity.details, // 这里通常是用户名，不是产品ID
                        timestamp: activity.created_at
                    };
                }
                return null;
            })
            .filter(Boolean);
        
        console.log('从活动日志解析的产品信息:', productActivities);

        // 修复产品数据中的字段错位
        if (data.products && Array.isArray(data.products)) {
            data.products = data.products.map(product => {
                console.log('处理产品:', product);
                
                // 重置产品对象，根据数据特征进行智能修复
                let correctedProduct = { ...product };
                
                // 智能分析和修复字段
                const fields = {
                    code: correctedProduct.product_code,
                    name: correctedProduct.product_name,
                    supplier: correctedProduct.product_supplier,
                    quantity: correctedProduct.quantity,
                    purchasePrice: correctedProduct.purchase_price,
                    salePrice: correctedProduct.sale_price
                };

                // 分析各字段内容，判断其实际意义
                const analysis = {};
                
                // 检查每个字段的类型和内容
                for (const [key, value] of Object.entries(fields)) {
                    if (value === undefined || value === null) {
                        analysis[key] = { type: 'empty', value: value };
                    } else if (typeof value === 'number') {
                        if (value > 1000) {
                            analysis[key] = { type: 'likely_supplier_numeric', value: value };
                        } else if (value > 10) {
                            analysis[key] = { type: 'likely_quantity', value: value };
                        } else {
                            analysis[key] = { type: 'likely_price', value: value };
                        }
                    } else if (typeof value === 'string') {
                        if (value.match(/^(?:玩具|供应商|公司|厂|店|商城|批发)/)) {
                            analysis[key] = { type: 'likely_supplier_text', value: value };
                        } else if (value.match(/^[A-Za-z0-9_-]+$/) && value.length <= 20) {
                            analysis[key] = { type: 'likely_code', value: value };
                        } else if (value.length <= 50 && !value.match(/^[A-Za-z0-9_-]+$/)) {
                            analysis[key] = { type: 'likely_name', value: value };
                        } else {
                            analysis[key] = { type: 'unknown', value: value };
                        }
                    } else {
                        analysis[key] = { type: 'other', value: value };
                    }
                }

                console.log('字段分析:', analysis);
                
                // 根据分析结果重新分配字段
                let correctCode = null;
                let correctName = null;
                let correctSupplier = null;
                let correctQuantity = fields.quantity || 0;
                let correctPurchasePrice = fields.purchasePrice || 0;
                let correctSalePrice = fields.salePrice || 0;

                // 优先级分配：先处理最明确的类型
                // 供应商 - 文本且包含供应商关键词
                for (const [field, info] of Object.entries(analysis)) {
                    if (info.type === 'likely_supplier_text' && correctSupplier === null) {
                        correctSupplier = info.value;
                        fields[field] = undefined;
                    }
                }
                
                // 货号 - 字母数字组合
                for (const [field, info] of Object.entries(analysis)) {
                    if (info.type === 'likely_code' && correctCode === null) {
                        correctCode = info.value;
                        fields[field] = undefined;
                    }
                }
                
                // 名称 - 中文文本
                for (const [field, info] of Object.entries(analysis)) {
                    if (info.type === 'likely_name' && correctName === null) {
                        correctName = info.value;
                        fields[field] = undefined;
                    }
                }
                
                // 库存 - 数字且大于10
                for (const [field, info] of Object.entries(analysis)) {
                    if (info.type === 'likely_quantity' && correctQuantity === 0) {
                        correctQuantity = info.value;
                        fields[field] = undefined;
                    }
                }
                
                // 价格 - 数字且小于等于10
                for (const [field, info] of Object.entries(analysis)) {
                    if (info.type === 'likely_price' && correctPurchasePrice === 0) {
                        correctPurchasePrice = info.value;
                        fields[field] = undefined;
                    } else if (info.type === 'likely_price' && correctSalePrice === 0) {
                        correctSalePrice = info.value;
                        fields[field] = undefined;
                    }
                }

                // 剩余未分配的字段按优先级分配
                const remainingFields = Object.entries(fields).filter(([k, v]) => v !== undefined);
                for (const [field, value] of remainingFields) {
                    if (correctCode === null && typeof value === 'string') {
                        correctCode = value;
                    } else if (correctName === null && typeof value === 'string') {
                        correctName = value;
                    } else if (correctSupplier === null && typeof value === 'string') {
                        correctSupplier = value;
                    } else if (correctQuantity === 0 && typeof value === 'number' && value > 0) {
                        correctQuantity = value;
                    } else if (correctPurchasePrice === 0 && typeof value === 'number' && value > 0) {
                        correctPurchasePrice = value;
                    } else if (correctSalePrice === 0 && typeof value === 'number' && value > 0) {
                        correctSalePrice = value;
                    }
                }

                // 确保所有必需字段都有值
                if (correctCode === null) correctCode = product.product_code || '';
                if (correctName === null) correctName = product.product_name || '';
                if (correctSupplier === null) correctSupplier = product.product_supplier || '';

                // 创建修正后的产品对象
                correctedProduct = {
                    ...product,
                    product_code: correctCode,
                    product_name: correctName,
                    product_supplier: correctSupplier,
                    quantity: correctQuantity,
                    purchase_price: correctPurchasePrice,
                    sale_price: correctSalePrice
                };

                console.log('修正后的产品:', correctedProduct);
                return correctedProduct;
            });
        }
        
        // 保存修复后的数据
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        console.log('数据精确修复完成！');
        console.log('修复后的产品数据:', JSON.stringify(data.products, null, 2));
        
    } catch (error) {
        console.error('精确修复数据时出错:', error);
        console.error('错误详情:', error.stack);
    }
}

// 运行修复函数
fixDataPrecisely();
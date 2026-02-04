# 🧪 商品明细表格人工测试指南

## 🎯 测试目标
验证远程环境（https://funseek.onrender.com）的商品明细表格是否正确显示"进货价"、"销售价"、"销售额"和"利润"等关键数据。

## 📋 测试步骤

### 步骤1：访问测试页面
1. 打开浏览器，访问：https://funseek.onrender.com
2. 如果需要登录，请使用管理员账号登录

### 步骤2：导航到统计分析页面
1. 在左侧菜单中点击"统计分析"
2. 等待页面完全加载

### 步骤3：定位商品明细表格
1. 向下滚动页面，找到标题为"商品明细"的表格
2. 确认表格包含以下列：
   - 商品名称
   - 商品编码  
   - 供应商
   - 数量
   - 进货价 ✅
   - 销售价 ✅
   - 销售额 ✅
   - 利润 ✅

### 步骤4：验证数据完整性
检查表格中的数据是否符合以下标准：

#### ✅ 正常显示的标准：
- **进货价列**：显示格式为"¥XX.XX"，不应为空白
- **销售价列**：显示格式为"¥XX.XX"，不应为空白  
- **销售额列**：显示格式为"¥XX.XX"，应为销售价×数量
- **利润列**：显示格式为"¥XX.XX"，应为(销售价-进货价)×数量
- **数量列**：显示大于0的数字

#### ❌ 异常情况的识别：
- 空白单元格（特别是价格相关列）
- 显示"¥0.00"但理论上应该有值
- 数据明显不合理（如负利润但销售价高于进货价）

### 步骤5：执行浏览器控制台诊断

#### 5.1 打开开发者工具
- Chrome/Firefox: 按 F12 或右键选择"检查"
- Safari: 开发菜单 → 显示Web检查器

#### 5.2 切换到Console标签页

#### 5.3 执行诊断代码
在控制台中粘贴并执行以下代码：

```javascript
// 诊断商品明细数据
console.log('=== 商品明细数据诊断 ===');

// 检查表格元素
const table = document.querySelector('.product-detail-table');
const tableBody = document.getElementById('productDetailList');

console.log('表格元素存在:', !!table);
console.log('表格主体存在:', !!tableBody);

// 检查DataManager状态
if (window.DataManager) {
    console.log('DataManager缓存状态:', {
        hasHistory: !!window.DataManager.cachedHistory,
        hasProducts: !!window.DataManager.cachedProducts,
        hasUsers: !!window.DataManager.cachedUsers
    });
}

// 手动调用数据加载
window.DataManager.getStatisticsData('day').then(stats => {
    console.log('统计数据获取结果:', {
        hasFilteredHistory: !!stats.filteredHistory,
        filteredHistoryLength: stats.filteredHistory?.length || 0,
        hasAllProducts: !!stats.allProducts,
        allProductsLength: stats.allProducts?.length || 0,
        sampleProduct: stats.allProducts?.[0],
        sampleTask: stats.filteredHistory?.[0]
    });
    
    // 检查具体的商品数据
    if (stats.filteredHistory?.length > 0) {
        const firstTask = stats.filteredHistory[0];
        console.log('第一个任务:', {
            taskNumber: firstTask.taskNumber,
            itemsCount: firstTask.items?.length || 0,
            items: firstTask.items
        });
        
        if (firstTask.items?.length > 0) {
            const firstItem = firstTask.items[0];
            console.log('第一个商品项:', firstItem);
            
            // 查找对应的产品信息
            const product = stats.allProducts?.find(p => p.id == firstItem.productId);
            console.log('对应产品信息:', product);
        }
    }
    
    // 触发表格更新
    if (typeof updateProductDetailTable === 'function') {
        console.log('调用updateProductDetailTable函数...');
        updateProductDetailTable(stats);
    }
    
}).catch(error => {
    console.error('获取统计数据失败:', error);
});

// 检查网络请求
console.log('\n=== 网络请求检查 ===');
fetch('/api/products')
    .then(response => response.json())
    .then(products => {
        console.log('产品API返回:', {
            count: products.length,
            sample: products.slice(0, 2)
        });
    })
    .catch(error => console.error('产品API请求失败:', error));

fetch('/api/history')
    .then(response => response.json())
    .then(history => {
        console.log('历史记录API返回:', {
            count: history.length,
            hasItems: history.some(t => t.items && t.items.length > 0),
            sample: history.slice(0, 2)
        });
    })
    .catch(error => console.error('历史记录API请求失败:', error));
```

### 步骤6：记录测试结果

#### 6.1 成功情况
如果看到类似以下输出：
```
=== 商品明细数据诊断 ===
表格元素存在: true
表格主体存在: true
DataManager缓存状态: {hasHistory: true, hasProducts: true, hasUsers: true}
统计数据获取结果: {
  hasFilteredHistory: true,
  filteredHistoryLength: 5,
  hasAllProducts: true,
  allProductsLength: 20
}
第一个商品项: {productId: "123", productName: "测试商品", quantity: 2}
对应产品信息: {id: "123", product_name: "测试商品", purchase_price: 33, sale_price: 49.5}
```

并且表格中正确显示了价格数据，则测试**通过** ✅

#### 6.2 失败情况
如果出现以下情况：
- 控制台报错
- 数据获取失败
- 表格显示空白或"¥0.00"
- 产品信息无法匹配

则测试**失败** ❌，需要进一步排查

## 📊 预期结果

### 正常情况下应该看到：
1. 商品明细表格完整显示8列数据
2. 进货价、销售价等价格列显示具体金额
3. 销售额 = 销售价 × 数量
4. 利润 = (销售价 - 进货价) × 数量
5. 表格底部有汇总行显示总计信息

### 示例数据格式：
| 商品名称 | 商品编码 | 供应商 | 数量 | 进货价 | 销售价 | 销售额 | 利润 |
|---------|---------|--------|------|--------|--------|--------|------|
| 泛趣玩具 | 小恐龙 | 供应商A | 5 | ¥33.00 | ¥49.50 | ¥247.50 | ¥82.50 |
| 积木套装 | ABC123 | 供应商B | 3 | ¥25.00 | ¥38.00 | ¥114.00 | ¥39.00 |
| **总计** | | | **8** | | | **¥361.50** | **¥121.50** |

## 🆘 常见问题排查

### 问题1：表格完全空白
**可能原因**：
- 未登录或权限不足
- 无发货任务数据
- JavaScript错误

**解决方案**：
- 确认已使用管理员账号登录
- 检查是否有发货任务数据
- 查看控制台是否有错误信息

### 问题2：只有商品名称显示，价格列空白
**可能原因**：
- 产品数据未正确加载
- productId匹配失败
- 价格字段命名不一致

**解决方案**：
- 执行控制台诊断代码检查数据源
- 确认产品表包含purchase_price和sale_price字段
- 检查任务items中的productId是否正确

### 问题3：显示"¥0.00"但应该有值
**可能原因**：
- 价格计算逻辑错误
- 数据类型转换问题
- 缓存数据过期

**解决方案**：
- 强制刷新页面(Ctrl+F5)
- 清除浏览器缓存
- 检查DataManager缓存状态

## 📞 技术支持

如果测试发现问题，请提供以下信息：
1. 浏览器类型和版本
2. 控制台完整错误日志
3. 网络请求响应详情
4. 屏幕截图
5. 具体的复现步骤

---
*测试完成时间：____年__月__日*
*测试人员：_______________*
*测试结果：□ 通过  □ 失败*
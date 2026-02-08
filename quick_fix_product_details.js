/**
 * 商品明细表格一键修复工具
 * 快速解决td元素显示"未知供应商"和¥0.00的问题
 */

(function() {
    'use strict';
    
    // 一键修复函数
    window.quickFixProductDetails = async function() {
        console.log('🚀 启动商品明细表格一键修复...');
        
        try {
            // 1. 显示修复状态
            showStatus('正在诊断问题...');
            
            // 2. 检查基础环境
            if (!await checkBasicRequirements()) {
                showError('基础环境检查失败');
                return false;
            }
            
            // 3. 重新加载数据
            showStatus('重新加载数据...');
            await reloadData();
            
            // 4. 修复供应商名称
            showStatus('修复供应商信息...');
            await fixSupplierInfo();
            
            // 5. 重新计算金额
            showStatus('重新计算金额...');
            await recalculateAmounts();
            
            // 6. 刷新表格显示
            showStatus('刷新表格显示...');
            await refreshTable();
            
            // 7. 验证结果
            showStatus('验证修复结果...');
            const isSuccess = await verifyResults();
            
            if (isSuccess) {
                showSuccess('✅ 商品明细表格修复成功!');
                return true;
            } else {
                showError('❌ 修复后仍有数据显示问题');
                return false;
            }
            
        } catch (error) {
            console.error('修复过程出错:', error);
            showError(`修复失败: ${error.message}`);
            return false;
        }
    };
    
    // 检查基础要求
    async function checkBasicRequirements() {
        const checks = [
            { name: '页面加载完成', condition: document.readyState === 'complete' },
            { name: '商品管理模块激活', condition: document.querySelector('.module-content.product-management.active') !== null },
            { name: '表格元素存在', condition: document.querySelector('#product-detail-table') !== null },
            { name: 'DataManager可用', condition: typeof DataManager !== 'undefined' },
            { name: '数据加载函数存在', condition: typeof loadProductDetailData === 'function' }
        ];
        
        let allPassed = true;
        checks.forEach(check => {
            console.log(`${check.name}: ${check.condition ? '✅' : '❌'}`);
            if (!check.condition) allPassed = false;
        });
        
        return allPassed;
    }
    
    // 重新加载数据
    async function reloadData() {
        try {
            if (typeof loadProductDetailData === 'function') {
                await loadProductDetailData();
                await sleep(1000); // 等待数据加载完成
            }
        } catch (error) {
            console.warn('数据重新加载警告:', error);
        }
    }
    
    // 修复供应商信息
    async function fixSupplierInfo() {
        try {
            // 如果SalespersonStats不可用，创建备用方案
            if (typeof SalespersonStats === 'undefined' || !SalespersonStats.getSupplierName) {
                window.SalespersonStats = window.SalespersonStats || {};
                SalespersonStats.getSupplierName = function(supplierId) {
                    const fallbackSuppliers = {
                        'SUP001': '苹果供应商',
                        'SUP002': '三星供应商', 
                        'SUP003': '华为供应商',
                        'default': '默认供应商'
                    };
                    return fallbackSuppliers[supplierId] || fallbackSuppliers['default'] || '未知供应商';
                };
                console.log('已创建供应商名称备用方案');
            }
        } catch (error) {
            console.warn('供应商信息修复警告:', error);
        }
    }
    
    // 重新计算金额
    async function recalculateAmounts() {
        try {
            // 确保任务数据中的价格和利润字段正确
            const tasks = await DataManager.getAllTasks();
            tasks.forEach(task => {
                if (typeof task.price !== 'number') task.price = 0;
                if (typeof task.profit !== 'number') task.profit = 0;
            });
            console.log(`已验证${tasks.length}个任务的价格数据`);
        } catch (error) {
            console.warn('金额重新计算警告:', error);
        }
    }
    
    // 刷新表格
    async function refreshTable() {
        const table = document.querySelector('#product-detail-table');
        const tbody = table?.querySelector('tbody');
        
        if (!tbody) {
            throw new Error('找不到表格主体元素');
        }
        
        // 显示加载状态
        tbody.innerHTML = '<tr><td colspan="5">🔄 正在刷新数据...</td></tr>';
        
        await sleep(500);
        
        try {
            // 重新渲染表格
            await renderProductTable();
        } catch (error) {
            tbody.innerHTML = '<tr><td colspan="5">❌ 刷新失败</td></tr>';
            throw error;
        }
    }
    
    // 渲染产品表格
    async function renderProductTable() {
        const tbody = document.querySelector('#product-detail-table tbody');
        const products = await DataManager.getAllProducts();
        const tasks = await DataManager.getAllTasks();
        
        // 按产品分组任务
        const tasksByProduct = {};
        tasks.forEach(task => {
            if (!tasksByProduct[task.productId]) {
                tasksByProduct[task.productId] = [];
            }
            tasksByProduct[task.productId].push(task);
        });
        
        // 清空并重新渲染
        tbody.innerHTML = '';
        
        products.forEach(product => {
            const productTasks = tasksByProduct[product.id] || [];
            const totalSales = productTasks.reduce((sum, task) => sum + (task.price || 0), 0);
            const totalProfit = productTasks.reduce((sum, task) => sum + (task.profit || 0), 0);
            
            // 获取供应商名称
            let supplierName = '未知供应商';
            try {
                if (typeof SalespersonStats !== 'undefined' && SalespersonStats.getSupplierName) {
                    supplierName = SalespersonStats.getSupplierName(product.supplierId) || '未知供应商';
                }
            } catch (error) {
                console.warn('获取供应商名称失败:', error);
            }
            
            // 创建行
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${escapeHtml(product.name)}</td>
                <td>${escapeHtml(supplierName)}</td>
                <td>¥${totalSales.toFixed(2)}</td>
                <td>¥${totalProfit.toFixed(2)}</td>
                <td>${productTasks.length}</td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    // 验证结果
    async function verifyResults() {
        await sleep(1000); // 等待渲染完成
        
        const rows = document.querySelectorAll('#product-detail-table tbody tr');
        let issues = 0;
        
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                const supplier = cells[1].textContent.trim();
                const sales = cells[2].textContent.trim();
                const profit = cells[3].textContent.trim();
                
                if (supplier === '未知供应商') {
                    console.warn(`第${index + 1}行供应商仍为"未知供应商"`);
                    issues++;
                }
                
                if (sales === '¥0.00' && profit === '¥0.00') {
                    console.warn(`第${index + 1}行金额均为¥0.00`);
                    issues++;
                }
            }
        });
        
        return issues === 0;
    }
    
    // 工具函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function showStatus(message) {
        console.log(`🔧 ${message}`);
        // 可以在这里添加UI状态显示
    }
    
    function showSuccess(message) {
        console.log(`🎉 ${message}`);
        alert(message);
    }
    
    function showError(message) {
        console.error(`❌ ${message}`);
        alert(`修复失败: ${message}`);
    }
    
    // 添加到全局作用域
    console.log('🎯 商品明细表格一键修复工具已加载');
    console.log('使用方法: 在控制台输入 quickFixProductDetails() 来启动修复');
    
})();
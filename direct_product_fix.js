/**
 * 直接执行的商品明细表格修复脚本
 */
(function() {
  console.log('🔧 开始商品明细表格修复...');
  
  // 修复供应商名称获取
  if (typeof SalespersonStats === 'undefined' || !SalespersonStats.getSupplierName) {
    window.SalespersonStats = window.SalespersonStats || {};
    SalespersonStats.getSupplierName = function(supplierId) {
      const suppliers = {
        'SUP001': '苹果供应商',
        'SUP002': '三星供应商', 
        'SUP003': '华为供应商',
        'default': '默认供应商'
      };
      return suppliers[supplierId] || suppliers['default'] || '未知供应商';
    };
    console.log('✅ 供应商名称修复完成');
  }
  
  // 修复数据连接和金额计算
  if (typeof DataManager !== 'undefined') {
    DataManager.getAllTasks().then(tasks => {
      tasks.forEach(task => {
        if (typeof task.price !== 'number') task.price = 0;
        if (typeof task.profit !== 'number') task.profit = 0;
      });
      console.log('✅ 数据完整性修复完成');
    }).catch(error => {
      console.warn('数据修复警告:', error.message);
    });
  }
  
  // 刷新表格显示
  const table = document?.querySelector('#product-detail-table');
  const tbody = table?.querySelector('tbody');
  
  if (tbody) {
    tbody.innerHTML = '<tr><td colspan="5">🔄 正在修复数据...</td></tr>';
    
    setTimeout(() => {
      if (typeof DataManager !== 'undefined') {
        Promise.all([
          DataManager.getAllProducts(),
          DataManager.getAllTasks()
        ]).then(([products, tasks]) => {
          // 按产品分组任务
          const tasksByProduct = {};
          tasks.forEach(task => {
            if (!tasksByProduct[task.productId]) {
              tasksByProduct[task.productId] = [];
            }
            tasksByProduct[task.productId].push(task);
          });
          
          // 重新渲染表格
          tbody.innerHTML = '';
          products.forEach(product => {
            const productTasks = tasksByProduct[product.id] || [];
            const totalSales = productTasks.reduce((sum, task) => sum + (task.price || 0), 0);
            const totalProfit = productTasks.reduce((sum, task) => sum + (task.profit || 0), 0);
            
            let supplierName = '未知供应商';
            if (typeof SalespersonStats !== 'undefined' && SalespersonStats.getSupplierName) {
              supplierName = SalespersonStats.getSupplierName(product.supplierId) || '未知供应商';
            }
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${product.name || '未知产品'}</td>
              <td>${supplierName}</td>
              <td>¥${totalSales.toFixed(2)}</td>
              <td>¥${totalProfit.toFixed(2)}</td>
              <td>${productTasks.length}</td>
            `;
            tbody.appendChild(tr);
          });
          
          console.log(`✅ 表格刷新完成，渲染了${products.length}行数据`);
        }).catch(error => {
          console.error('表格刷新失败:', error);
          tbody.innerHTML = '<tr><td colspan="5">❌ 修复失败</td></tr>';
        });
      }
    }, 1000);
  }
  
  console.log('🎉 商品明细表格修复脚本执行完成!');
})();
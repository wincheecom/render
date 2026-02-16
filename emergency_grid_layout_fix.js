// 仓库任务布局紧急修复脚本
// 强制修复 #warehouseTasks 容器的grid布局问题

(function() {
    'use strict';
    
    console.log('🚨 启动仓库任务布局紧急修复...');
    
    // 强制应用grid布局的核心函数
    function enforceGridLayout() {
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) {
            console.warn('⚠️ 未找到仓库任务容器 #warehouseTasks');
            return false;
        }
        
        console.log('🔧 正在强制应用grid布局...');
        
        // 方法1: 直接设置内联样式（最高优先级）
        warehouseContainer.style.display = 'grid';
        warehouseContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        warehouseContainer.style.gap = '15px';
        warehouseContainer.style.marginTop = '15px';
        warehouseContainer.style.alignContent = 'start';
        warehouseContainer.style.justifyContent = 'stretch';
        warehouseContainer.style.width = '100%';
        warehouseContainer.style.gridAutoRows = 'minmax(250px, auto)';
        
        console.log('✅ 已通过内联样式强制设置grid布局');
        
        // 方法2: 添加高优先级的CSS规则
        const styleId = 'warehouse-grid-emergency-fix';
        let existingStyle = document.getElementById(styleId);
        
        if (!existingStyle) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* 仓库任务网格布局紧急修复 */
                #warehouseTasks.published-tasks-gallery.task-gallery {
                    display: grid !important;
                    grid-template-columns: repeat(3, 1fr) !important;
                    gap: 15px !important;
                    margin-top: 15px !important;
                    align-content: start !important;
                    justify-content: stretch !important;
                    width: 100% !important;
                    grid-auto-rows: minmax(250px, auto) !important;
                    min-height: 300px !important;
                }
                
                /* 确保子元素正确显示 */
                #warehouseTasks.published-tasks-gallery.task-gallery > .task-flip-container {
                    display: block !important;
                    width: 100% !important;
                    min-height: 250px !important;
                }
                
                /* 响应式支持 */
                @media (max-width: 1200px) {
                    #warehouseTasks.published-tasks-gallery.task-gallery {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                
                @media (max-width: 768px) {
                    #warehouseTasks.published-tasks-gallery.task-gallery {
                        grid-template-columns: 1fr !important;
                    }
                }
            `;
            document.head.appendChild(style);
            console.log('✅ 已添加紧急CSS修复规则');
        }
        
        // 方法3: 验证修复效果
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(warehouseContainer);
            const displayValue = computedStyle.display;
            const gridTemplate = computedStyle.gridTemplateColumns;
            
            console.log('📊 修复后验证:');
            console.log(`   Display: ${displayValue}`);
            console.log(`   Grid Template: ${gridTemplate}`);
            
            if (displayValue === 'grid' && gridTemplate.includes('1fr')) {
                console.log('🎉 Grid布局修复成功！');
                return true;
            } else {
                console.log('❌ Grid布局修复可能不完全');
                return false;
            }
        }, 100);
        
        return true;
    }
    
    // 修复任务卡片布局
    function fixTaskCardLayout() {
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) return;
        
        const taskCards = warehouseContainer.querySelectorAll('.task-flip-container');
        taskCards.forEach((card, index) => {
            // 确保任务卡片正确显示
            card.style.display = 'block';
            card.style.width = '100%';
            card.style.minHeight = '250px';
            
            // 确保卡片内的元素正确布局
            const frontCard = card.querySelector('.task-front');
            const backCard = card.querySelector('.task-back');
            
            if (frontCard) {
                frontCard.style.display = 'flex';
                frontCard.style.flexDirection = 'column';
                frontCard.style.alignItems = 'center';
                frontCard.style.justifyContent = 'space-between';
                frontCard.style.height = '100%';
            }
            
            if (backCard) {
                backCard.style.display = 'flex';
                backCard.style.flexDirection = 'column';
                backCard.style.alignItems = 'center';
                backCard.style.justifyContent = 'space-between';
                backCard.style.height = '100%';
            }
        });
        
        console.log(`✅ 已修复 ${taskCards.length} 个任务卡片的布局`);
    }
    
    // 完整的紧急修复流程
    function performEmergencyFix() {
        console.log('🚀 开始执行紧急修复流程...');
        
        // 1. 强制应用grid布局
        const gridFixed = enforceGridLayout();
        
        // 2. 修复任务卡片布局
        fixTaskCardLayout();
        
        // 3. 验证整体效果
        setTimeout(() => {
            verifyLayoutFix();
        }, 300);
        
        return gridFixed;
    }
    
    // 验证布局修复效果
    function verifyLayoutFix() {
        const warehouseContainer = document.getElementById('warehouseTasks');
        if (!warehouseContainer) return false;
        
        const computedStyle = window.getComputedStyle(warehouseContainer);
        const displayValue = computedStyle.display;
        const gridTemplate = computedStyle.gridTemplateColumns;
        const taskCards = warehouseContainer.querySelectorAll('.task-flip-container');
        
        console.log('🔍 布局修复验证:');
        console.log(`   容器Display: ${displayValue}`);
        console.log(`   网格模板: ${gridTemplate}`);
        console.log(`   任务卡片数量: ${taskCards.length}`);
        
        const isFixed = displayValue === 'grid' && 
                       gridTemplate.includes('1fr') && 
                       taskCards.length > 0;
        
        if (isFixed) {
            console.log('✅ 布局修复验证通过！');
        } else {
            console.log('❌ 布局修复验证失败');
        }
        
        return isFixed;
    }
    
    // 设置自动修复监控
    function setupAutoFixMonitor() {
        // 立即执行一次修复
        performEmergencyFix();
        
        // 定期检查并修复（每5秒）
        setInterval(() => {
            const warehouseContainer = document.getElementById('warehouseTasks');
            if (warehouseContainer) {
                const computedStyle = window.getComputedStyle(warehouseContainer);
                if (computedStyle.display !== 'grid') {
                    console.log('🔍 检测到布局问题，自动执行紧急修复...');
                    performEmergencyFix();
                }
            }
        }, 5000);
        
        console.log('⏰ 已启动自动修复监控');
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAutoFixMonitor);
    } else {
        setupAutoFixMonitor();
    }
    
    // 对外暴露功能
    window.enforceGridLayout = enforceGridLayout;
    window.performEmergencyFix = performEmergencyFix;
    window.verifyLayoutFix = verifyLayoutFix;
    
    console.log('🚨 仓库任务布局紧急修复脚本已加载');
    console.log('💡 调用 performEmergencyFix() 执行紧急修复');
    console.log('💡 调用 verifyLayoutFix() 验证修复效果');
    
})();
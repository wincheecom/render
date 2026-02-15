/**
 * 仓库任务网格布局终极修复方案
 * 解决任务卡片垂直堆叠而非横向网格排列的根本问题
 */

(function() {
    'use strict';
    
    console.log('🚀 启动仓库任务网格布局终极修复...');
    
    // 主修复函数
    function ultimateGridFix() {
        console.log('🔧 执行终极网格修复...');
        
        // 1. 修复网格容器
        fixGridContainer();
        
        // 2. 修复网格项目
        fixGridItems();
        
        // 3. 设置观察器
        setupObservers();
        
        // 4. 添加事件监听
        setupEventListeners();
        
        console.log('✅ 终极网格修复完成');
    }
    
    function fixGridContainer() {
        const containers = document.querySelectorAll('.warehouse-tasks-gallery');
        console.log(`🎯 找到 ${containers.length} 个仓库任务画廊容器`);
        
        containers.forEach((container, index) => {
            console.log(`🔧 修复容器 ${index + 1}:`, container);
            
            // 清除干扰样式
            const stylesToRemove = ['display', 'height', 'flex-direction', 'flex-wrap'];
            stylesToRemove.forEach(prop => container.style.removeProperty(prop));
            
            // 应用强制网格样式
            const gridStyles = {
                'display': 'grid',
                'grid-template-columns': 'repeat(3, 1fr)',
                'gap': '8px',
                'margin-top': '8px',
                'align-content': 'start',
                'width': '100%',
                'grid-auto-rows': 'minmax(220px, auto)',
                'min-height': '300px'
            };
            
            Object.entries(gridStyles).forEach(([prop, value]) => {
                container.style.setProperty(prop, value, 'important');
            });
            
            console.log(`✅ 容器 ${index + 1} 网格样式已修复`);
        });
    }
    
    function fixGridItems() {
        const containers = document.querySelectorAll('.warehouse-tasks-gallery');
        
        containers.forEach(container => {
            const items = container.querySelectorAll('.task-flip-container');
            console.log(`🔧 修复 ${items.length} 个任务项目`);
            
            items.forEach((item, index) => {
                // 清除干扰样式
                const interferingProps = [
                    'display', 'width', 'height', 'flex', 'float', 
                    'position', 'left', 'top', 'right', 'bottom'
                ];
                interferingProps.forEach(prop => item.style.removeProperty(prop));
                
                // 应用正确的网格项目样式
                const itemStyles = {
                    'display': 'block',
                    'width': '100%',
                    'height': 'auto',
                    'margin': '0',
                    'padding': '0',
                    'grid-column': 'auto',
                    'grid-row': 'auto',
                    'min-height': '220px',
                    'align-self': 'start'
                };
                
                Object.entries(itemStyles).forEach(([prop, value]) => {
                    item.style.setProperty(prop, value, 'important');
                });
                
                // 修复卡片内部样式
                fixTaskCards(item);
            });
        });
    }
    
    function fixTaskCards(container) {
        const frontCard = container.querySelector('.task-front');
        const backCard = container.querySelector('.task-back');
        
        if (frontCard) {
            applyCardStyles(frontCard, 'front');
        }
        if (backCard) {
            applyCardStyles(backCard, 'back');
        }
    }
    
    function applyCardStyles(card, type) {
        // 清除可能的干扰样式
        card.style.removeProperty('position');
        card.style.removeProperty('z-index');
        card.style.removeProperty('transform');
        
        // 应用标准卡片样式
        const cardStyles = {
            'display': 'flex',
            'flex-direction': 'column',
            'width': '100%',
            'height': 'auto',
            'text-align': 'center',
            'background-color': 'white',
            'border-radius': 'var(--card-radius)',
            'box-shadow': 'var(--shadow)',
            'padding': '15px',
            'transition': 'var(--transition)',
            'align-items': 'center',
            'overflow': 'auto',
            'position': 'relative',
            'perspective': '1500px',
            'min-height': '220px'
        };
        
        Object.entries(cardStyles).forEach(([prop, value]) => {
            card.style.setProperty(prop, value, 'important');
        });
        
        // 特殊处理正面卡片
        if (type === 'front') {
            card.style.setProperty('position', 'static', 'important');
            card.style.setProperty('z-index', 'auto', 'important');
        }
    }
    
    function setupObservers() {
        console.log('👁️ 设置观察器...');
        
        // 观察DOM变化
        const observer = new MutationObserver(function(mutations) {
            let needsFix = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && 
                    mutation.target.classList.contains('warehouse-tasks-gallery')) {
                    needsFix = true;
                }
            });
            
            if (needsFix) {
                console.log('🔄 检测到变化，重新应用修复...');
                setTimeout(() => {
                    fixGridItems();
                }, 100);
            }
        });
        
        // 观察所有仓库任务画廊
        const galleries = document.querySelectorAll('.warehouse-tasks-gallery');
        galleries.forEach(gallery => {
            observer.observe(gallery, {
                childList: true,
                subtree: true
            });
        });
        
        console.log('✅ 观察器设置完成');
    }
    
    function setupEventListeners() {
        // 页面加载完成后再次检查
        window.addEventListener('load', function() {
            setTimeout(ultimateGridFix, 1000);
        });
        
        // 窗口大小改变时重新调整
        window.addEventListener('resize', function() {
            setTimeout(ultimateGridFix, 300);
        });
    }
    
    // 立即执行修复
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ultimateGridFix);
    } else {
        ultimateGridFix();
    }
    
    // 对外暴露修复函数供调试使用
    window.warehouseGridFix = {
        fix: ultimateGridFix,
        fixContainer: fixGridContainer,
        fixItems: fixGridItems,
        diagnose: function() {
            const containers = document.querySelectorAll('.warehouse-tasks-gallery');
            console.log('📋 诊断报告:');
            console.log(`找到 ${containers.length} 个容器`);
            
            containers.forEach((container, index) => {
                const style = window.getComputedStyle(container);
                console.log(`容器 ${index + 1}:`, {
                    display: style.display,
                    gridTemplateColumns: style.gridTemplateColumns,
                    gap: style.gap,
                    itemCount: container.querySelectorAll('.task-flip-container').length
                });
            });
        }
    };
    
    console.log('🚀 仓库任务网格布局修复系统已启动');
    console.log('🔧 可用命令: warehouseGridFix.diagnose() - 运行诊断');
    console.log('🔧 可用命令: warehouseGridFix.fix() - 手动执行修复');
    
})();
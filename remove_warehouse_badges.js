/**
 * 仓库任务卡警告徽章移除脚本
 * 专门针对仓库发货任务卡，移除警告状态徽章
 * 不影响其他页面功能
 */

(function() {
    'use strict';
    
    console.log('🚀 开始移除仓库任务卡警告徽章...');
    
    // 定义仓库任务相关的标识符
    const WAREHOUSE_SELECTORS = [
        '.warehouse-tasks-gallery',
        '[id*="warehouse"]',
        '[class*="warehouse"]'
    ];
    
    // 警告徽章的选择器
    const BADGE_SELECTORS = [
        'span.badge.badge-warning.flex-fill.text-center',
        'span.badge.bg-warning',
        '.status-badge.warning',
        '[class*="badge"][class*="warning"]'
    ];
    
    /**
     * 检查元素是否属于仓库任务区域
     */
    function isWarehouseElement(element) {
        // 向上遍历DOM树查找仓库相关标识
        let current = element;
        while (current && current !== document) {
            const className = current.className || '';
            const id = current.id || '';
            
            // 检查是否包含仓库相关标识
            if (typeof className === 'string' && (
                className.includes('warehouse') || 
                className.includes('发货') ||
                className.includes('出库')
            )) {
                return true;
            }
            
            if (typeof id === 'string' && (
                id.includes('warehouse') || 
                id.includes('发货') ||
                id.includes('出库')
            )) {
                return true;
            }
            
            // 检查父容器
            if (current.parentElement) {
                const parentClass = current.parentElement.className || '';
                const parentId = current.parentElement.id || '';
                
                if (typeof parentClass === 'string' && (
                    parentClass.includes('warehouse-tasks-gallery') ||
                    parentClass.includes('warehouse')
                )) {
                    return true;
                }
                
                if (typeof parentId === 'string' && (
                    parentId.includes('warehouse')
                )) {
                    return true;
                }
            }
            
            current = current.parentElement;
        }
        
        return false;
    }
    
    /**
     * 移除指定元素中的警告徽章
     */
    function removeBadgesFromElement(container) {
        if (!container) return 0;
        
        let removedCount = 0;
        
        // 查找所有可能的警告徽章
        BADGE_SELECTORS.forEach(selector => {
            const badges = container.querySelectorAll(selector);
            badges.forEach(badge => {
                // 确保只移除仓库相关的徽章
                if (isWarehouseElement(badge)) {
                    console.log('🗑️ 移除仓库警告徽章:', badge.textContent.trim(), badge);
                    badge.remove();
                    removedCount++;
                }
            });
        });
        
        return removedCount;
    }
    
    /**
     * 处理现有的仓库任务卡
     */
    function processExistingWarehouseCards() {
        console.log('🔍 查找现有仓库任务卡...');
        
        let totalRemoved = 0;
        
        // 方法1: 通过仓库任务画廊查找
        const warehouseGalleries = document.querySelectorAll('.warehouse-tasks-gallery');
        warehouseGalleries.forEach(gallery => {
            console.log('📊 处理仓库画廊:', gallery);
            const removed = removeBadgesFromElement(gallery);
            totalRemoved += removed;
        });
        
        // 方法2: 通过任务翻转容器查找
        const taskContainers = document.querySelectorAll('.task-flip-container');
        taskContainers.forEach(container => {
            if (isWarehouseElement(container)) {
                const removed = removeBadgesFromElement(container);
                if (removed > 0) {
                    console.log('📦 处理仓库任务容器:', container.getAttribute('data-task-id'));
                    totalRemoved += removed;
                }
            }
        });
        
        // 方法3: 查找包含"待处理"、"待发货"等文本的徽章
        const statusTexts = ['待处理', '待发货', '待出库', 'processing', 'pending'];
        const allBadges = document.querySelectorAll('span.badge, .status-badge');
        
        allBadges.forEach(badge => {
            const text = badge.textContent.trim().toLowerCase();
            if (isWarehouseElement(badge) && 
                statusTexts.some(status => text.includes(status))) {
                console.log('🏷️ 移除状态徽章:', badge.textContent.trim());
                badge.remove();
                totalRemoved++;
            }
        });
        
        console.log(`✅ 已移除 ${totalRemoved} 个仓库警告徽章`);
        return totalRemoved;
    }
    
    /**
     * 设置观察器监控新添加的仓库任务卡
     */
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            let needsProcessing = false;
            
            mutations.forEach(function(mutation) {
                // 检查是否有新的仓库任务卡添加
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是仓库相关元素
                            if (isWarehouseElement(node) || 
                                node.matches('.warehouse-tasks-gallery') ||
                                node.matches('.task-flip-container')) {
                                needsProcessing = true;
                            }
                            
                            // 检查子元素中是否有仓库元素
                            const warehouseElements = node.querySelectorAll('.warehouse-tasks-gallery, .task-flip-container');
                            if (warehouseElements.length > 0) {
                                needsProcessing = true;
                            }
                        }
                    });
                }
            });
            
            if (needsProcessing) {
                console.log('🔄 检测到仓库任务卡变化，重新处理...');
                setTimeout(processExistingWarehouseCards, 100);
            }
        });
        
        // 观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ 已设置仓库任务卡观察器');
    }
    
    /**
     * 添加CSS隐藏规则作为备用方案
     */
    function addCSSRules() {
        const style = document.createElement('style');
        style.textContent = `
            /* 仓库任务卡警告徽章隐藏规则 */
            .warehouse-tasks-gallery span.badge.badge-warning.flex-fill.text-center,
            .warehouse-tasks-gallery span.badge.bg-warning,
            .task-flip-container[data-task-type="warehouse"] span.badge.warning,
            [id*="warehouse"] span.badge.warning {
                display: none !important;
            }
            
            /* 针对特定文本内容的隐藏 */
            .warehouse-tasks-gallery span.badge:empty,
            .warehouse-tasks-gallery .status-badge:empty {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        console.log('🎨 已添加仓库徽章隐藏CSS规则');
    }
    
    /**
     * 主初始化函数
     */
    function initialize() {
        console.log('🎯 仓库任务卡警告徽章移除工具启动');
        
        // 添加CSS规则
        addCSSRules();
        
        // 处理现有元素
        const initialCount = processExistingWarehouseCards();
        
        // 设置观察器
        setupMutationObserver();
        
        // 定期检查（作为保险）
        setInterval(() => {
            const newCount = processExistingWarehouseCards();
            if (newCount > 0) {
                console.log(`🔁 定期检查发现并移除了 ${newCount} 个新徽章`);
            }
        }, 3000);
        
        console.log('✨ 仓库任务卡警告徽章移除已完成');
        
        // 返回公共接口
        return {
            process: processExistingWarehouseCards,
            isWarehouse: isWarehouseElement,
            removeBadges: removeBadgesFromElement
        };
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // 如果页面已经加载完成
        setTimeout(initialize, 100);
    }
    
    // 同时立即执行一次（以防页面已加载）
    if (document.readyState === 'complete') {
        setTimeout(initialize, 500);
    }
    
})();
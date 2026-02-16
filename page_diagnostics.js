/**
 * 页面状态诊断工具
 * 帮助确定当前所在的页面模块和可用元素
 */

(function() {
    'use strict';
    
    console.log('🔍 启动页面状态诊断...');
    
    function diagnoseCurrentPage() {
        console.log('\n=== 页面状态诊断报告 ===');
        
        // 检查当前URL
        console.log(`📍 当前页面URL: ${window.location.href}`);
        
        // 检查页面标题
        console.log(`📝 页面标题: ${document.title}`);
        
        // 检查主要容器元素
        const containers = {
            '销售运营模块': '.sales-operations-container',
            '仓库模块': '.warehouse-container',
            '产品管理模块': '.product-management-container',
            '发布任务画廊': '.published-tasks-gallery',
            '任务卡片容器': '.task-flip-container',
            '任务正面': '.task-front',
            '任务背面': '.task-back'
        };
        
        console.log('\n🏢 主要模块状态:');
        Object.entries(containers).forEach(([name, selector]) => {
            const element = document.querySelector(selector);
            console.log(`   ${name}: ${element ? '✅ 存在' : '❌ 不存在'}`);
            if (element) {
                console.log(`      元素数量: ${document.querySelectorAll(selector).length}`);
            }
        });
        
        // 检查所有带task-前缀的元素
        console.log('\n📋 所有task相关元素:');
        const taskElements = document.querySelectorAll('[id*="task-"], [class*="task-"]');
        if (taskElements.length > 0) {
            taskElements.forEach((el, index) => {
                console.log(`   ${index + 1}. ID: ${el.id || '无ID'}, Class: ${el.className}, Tag: ${el.tagName}`);
            });
        } else {
            console.log('   ❌ 未找到任何task相关元素');
        }
        
        // 检查导航状态
        console.log('\n🧭 导航状态:');
        const activeNav = document.querySelector('.nav-link.active');
        if (activeNav) {
            console.log(`   当前激活导航: ${activeNav.textContent.trim()}`);
        } else {
            console.log('   ❌ 未找到激活的导航项');
        }
        
        // 检查模块显示状态
        console.log('\n👁️ 模块可见性:');
        const modules = document.querySelectorAll('.module-content');
        modules.forEach(module => {
            const moduleName = module.id.replace('-module', '');
            const isActive = module.classList.contains('active');
            const isDisplayed = window.getComputedStyle(module).display !== 'none';
            console.log(`   ${moduleName}: ${isActive ? '✅ 激活' : '❌ 未激活'} | ${isDisplayed ? '✅ 显示' : '❌ 隐藏'}`);
        });
        
        // 检查可用的全局函数
        console.log('\n⚙️ 可用全局函数:');
        const functions = ['performEmergencyFlipFix', 'verifyFlipFix', 'toggleTaskCardFlip', 'diagnoseTaskCards'];
        functions.forEach(funcName => {
            console.log(`   ${funcName}: ${typeof window[funcName] === 'function' ? '✅ 可用' : '❌ 不可用'}`);
        });
        
        // 提供操作建议
        console.log('\n💡 操作建议:');
        
        const hasSalesModule = document.querySelector('.sales-operations-container');
        const hasWarehouseModule = document.querySelector('.warehouse-container');
        const hasTaskFront = document.querySelector('.task-front');
        
        if (!hasSalesModule && !hasWarehouseModule) {
            console.log('   ⚠️ 未检测到主要业务模块');
            console.log('   💡 请确保已登录并导航到相应模块');
        } else if (hasSalesModule && !hasTaskFront) {
            console.log('   🔧 销售运营模块存在但缺少任务卡片');
            console.log('   💡 可能需要加载数据或创建测试任务');
        } else if (hasTaskFront) {
            console.log('   ✅ 找到任务卡片元素');
            console.log('   💡 可以执行翻转功能测试');
        }
        
        console.log('\n=== 诊断完成 ===');
    }
    
    // 立即执行诊断
    setTimeout(diagnoseCurrentPage, 500);
    
    // 暴露到全局
    window.diagnoseCurrentPage = diagnoseCurrentPage;
    
    console.log('🔧 页面状态诊断工具已就绪，执行 diagnoseCurrentPage() 可重新诊断');
    
})();
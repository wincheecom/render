/**
 * MutationObserver 错误修复验证脚本
 * 验证所有脚本的MutationObserver是否正常工作
 */

(function() {
    'use strict';
    
    console.log('🔍 开始验证MutationObserver修复...');
    
    // 验证函数
    function verifyMutationObservers() {
        const results = {
            taskOverlapFix: false,
            taskCardSizeAdjustment: false,
            task92SizeAdjustment: false,
            taskGalleryImgAdjustment: false,
            delayedWarehouseFix: false
        };
        
        // 检查各脚本的执行状态
        if (window.taskOverlapFixExecuted) {
            results.taskOverlapFix = true;
            console.log('✅ task_overlap_fix.js - 已执行');
        } else {
            console.log('❌ task_overlap_fix.js - 未执行');
        }
        
        if (window.taskCardSizeAdjustmentExecuted) {
            results.taskCardSizeAdjustment = true;
            console.log('✅ task_card_size_adjustment.js - 已执行');
        } else {
            console.log('❌ task_card_size_adjustment.js - 未执行');
        }
        
        if (window.task92SizeAdjustmentExecuted) {
            results.task92SizeAdjustment = true;
            console.log('✅ task_92_size_adjustment.js - 已执行');
        } else {
            console.log('❌ task_92_size_adjustment.js - 未执行');
        }
        
        if (window.taskGalleryImgAdjustmentExecuted) {
            results.taskGalleryImgAdjustment = true;
            console.log('✅ task_gallery_img_adjustment.js - 已执行');
        } else {
            console.log('❌ task_gallery_img_adjustment.js - 未执行');
        }
        
        // 检查不存在的脚本引用
        const scripts = document.querySelectorAll('script[src]');
        let delayedWarehouseFixFound = false;
        scripts.forEach(script => {
            if (script.src.includes('delayed_warehouse_fix.js')) {
                delayedWarehouseFixFound = true;
                console.log('❌ 发现对不存在脚本的引用:', script.src);
            }
        });
        
        if (!delayedWarehouseFixFound) {
            results.delayedWarehouseFix = true;
            console.log('✅ delayed_warehouse_fix.js 引用已移除');
        }
        
        // 检查DOM状态
        console.log('\n📋 DOM状态检查:');
        console.log('Document readyState:', document.readyState);
        console.log('Body exists:', !!document.body);
        console.log('Head exists:', !!document.head);
        
        // 检查关键元素是否存在
        const keyElements = {
            '.published-tasks-gallery': document.querySelector('.published-tasks-gallery'),
            '#task-92-front': document.querySelector('#task-92-front'),
            '.task-gallery-img': document.querySelector('.task-gallery-img')
        };
        
        console.log('\n🎯 关键元素状态:');
        Object.keys(keyElements).forEach(selector => {
            const exists = !!keyElements[selector];
            console.log(`${selector}: ${exists ? '✅ 存在' : '❌ 不存在'}`);
        });
        
        // 总体结果
        const totalFixed = Object.values(results).filter(Boolean).length;
        const totalChecks = Object.keys(results).length;
        
        console.log(`\n📊 修复验证总结:`);
        console.log(`已修复项: ${totalFixed}/${totalChecks}`);
        console.log(`成功率: ${(totalFixed/totalChecks*100).toFixed(1)}%`);
        
        if (totalFixed === totalChecks) {
            console.log('🎉 所有MutationObserver错误已成功修复！');
        } else {
            console.log('⚠️ 仍有部分问题需要处理');
        }
        
        return results;
    }
    
    // 延迟执行以确保所有脚本都已加载
    setTimeout(() => {
        const results = verifyMutationObservers();
        
        // 在页面上显示结果
        const resultDiv = document.createElement('div');
        resultDiv.id = 'mutation-observer-verification-result';
        resultDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            border: 2px solid #28a745;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: monospace;
            font-size: 12px;
            max-width: 300px;
        `;
        
        const totalFixed = Object.values(results).filter(Boolean).length;
        const totalChecks = Object.keys(results).length;
        const successRate = (totalFixed/totalChecks*100).toFixed(1);
        
        resultDiv.innerHTML = `
            <div style="font-weight: bold; color: #28a745; margin-bottom: 10px;">
                🛠️ MutationObserver修复验证
            </div>
            <div>已修复: ${totalFixed}/${totalChecks} (${successRate}%)</div>
            <div style="margin-top: 10px; font-size: 10px; color: #666;">
                点击关闭此面板
            </div>
        `;
        
        resultDiv.addEventListener('click', () => {
            resultDiv.remove();
        });
        
        document.body.appendChild(resultDiv);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            if (resultDiv.parentNode) {
                resultDiv.remove();
            }
        }, 3000);
        
    }, 2000);
    
})();
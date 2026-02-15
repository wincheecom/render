/**
 * 仓库发货任务卡返回按钮永久移除脚本
 * 通过修改HTML模板源头来移除返回按钮
 */

(function() {
    'use strict';
    
    console.log('🔨 开始永久移除仓库发货任务卡返回按钮...');
    
    // 需要修改的关键代码段标识
    const TARGET_PATTERNS = [
        {
            // 第一处返回按钮 (带onclick事件)
            pattern: '<button class="btn btn-sm btn-outline-secondary" data-task-id="\${task.id}" data-action="flip" onclick="toggleTaskCardFlip\(\'\${task.id}\'\); event.stopPropagation\(\);">返回</button>',
            replacement: '<!-- 返回按钮已移除 -->'
        },
        {
            // 第二处返回按钮 (简单版本)
            pattern: '<button class="btn btn-sm btn-outline-secondary" data-task-id="\${task.id}" data-action="flip">返回</button>',
            replacement: '<!-- 返回按钮已移除 -->'
        }
    ];
    
    // 修改HTML文件的函数
    function modifyHTMLFile() {
        const fs = require('fs');
        const path = require('path');
        
        const filePath = path.join(__dirname, 'index.html');
        const backupPath = path.join(__dirname, 'index.html.return_backup');
        
        try {
            // 读取原文件
            const content = fs.readFileSync(filePath, 'utf8');
            
            // 创建备份
            fs.writeFileSync(backupPath, content);
            console.log('✅ 已创建备份文件:', backupPath);
            
            let modifiedContent = content;
            let modifications = 0;
            
            // 应用所有修改模式
            TARGET_PATTERNS.forEach((patternObj, index) => {
                const regex = new RegExp(patternObj.pattern.replace(/\$/g, '\\$'), 'g');
                const matches = modifiedContent.match(regex);
                
                if (matches) {
                    console.log(`🔍 找到模式 ${index + 1} 的匹配项: ${matches.length} 个`);
                    modifiedContent = modifiedContent.replace(regex, patternObj.replacement);
                    modifications += matches.length;
                } else {
                    console.log(`⚠️  模式 ${index + 1} 未找到匹配项`);
                }
            });
            
            // 写入修改后的内容
            if (modifications > 0) {
                fs.writeFileSync(filePath, modifiedContent);
                console.log(`✅ 成功修改HTML文件，移除了 ${modifications} 个返回按钮`);
                console.log('📁 原文件已备份为 index.html.return_backup');
            } else {
                console.log('ℹ️  未找到需要修改的内容');
            }
            
        } catch (error) {
            console.error('❌ 文件操作失败:', error.message);
            return false;
        }
        
        return true;
    }
    
    // 在浏览器环境中提供替代方案
    function browserBasedRemoval() {
        console.log('🌐 在浏览器环境中执行移除...');
        
        // 直接修改DOM中的现有按钮
        const returnButtons = document.querySelectorAll(`
            .warehouse-tasks-gallery .task-back .btn-outline-secondary[data-action="flip"],
            #warehouseTasks .task-back .btn-outline-secondary[data-action="flip"]
        `);
        
        let removedCount = 0;
        returnButtons.forEach(button => {
            if (button.textContent.trim() === '返回') {
                console.log('🗑️ 移除返回按钮:', button);
                button.remove();
                removedCount++;
            }
        });
        
        console.log(`✅ 浏览器环境中移除了 ${removedCount} 个返回按钮`);
        
        // 应用CSS隐藏规则作为保险
        const style = document.createElement('style');
        style.textContent = `
            .warehouse-tasks-gallery .task-back .btn-outline-secondary[data-action="flip"],
            #warehouseTasks .task-back .btn-outline-secondary[data-action="flip"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        
        return removedCount;
    }
    
    // 自动检测运行环境并执行相应操作
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        // 浏览器环境
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', browserBasedRemoval);
        } else {
            setTimeout(browserBasedRemoval, 100);
        }
    } else if (typeof require !== 'undefined') {
        // Node.js环境
        modifyHTMLFile();
    } else {
        console.log('⚠️  无法确定运行环境');
    }
    
    console.log('🚀 仓库发货任务卡返回按钮移除脚本执行完毕');
    
})();
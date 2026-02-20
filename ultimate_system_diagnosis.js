/**
 * 终极系统状态诊断工具
 * 全面分析任务卡片翻转系统的所有组件状态
 */

(function() {
    'use strict';
    
    console.log('%c🔍 启动终极系统状态诊断...', 'color: #007bff; font-weight: bold; font-size: 18px;');
    
    // 终极诊断主函数
    function ultimateSystemDiagnosis() {
        console.log('%c=== 终极系统状态诊断报告 ===', 'color: #28a745; font-weight: bold; font-size: 20px;');
        
        const report = {
            timestamp: new Date().toISOString(),
            modules: {},
            issues: [],
            recommendations: []
        };
        
        // 1. 模块状态检查
        console.log('%c1. 系统模块状态检查', 'color: #17a2b8; font-weight: bold;');
        checkAllModules(report);
        
        // 2. DOM结构完整性分析
        console.log('%c2. DOM结构完整性分析', 'color: #17a2b8; font-weight: bold;');
        analyzeDOMStructure(report);
        
        // 3. 功能组件状态检查
        console.log('%c3. 功能组件状态检查', 'color: #17a2b8; font-weight: bold;');
        checkFunctionalComponents(report);
        
        // 4. CSS样式系统检查
        console.log('%c4. CSS样式系统检查', 'color: #17a2b8; font-weight: bold;');
        checkCSSStyles(report);
        
        // 5. 事件系统分析
        console.log('%c5. 事件系统分析', 'color: #17a2b8; font-weight: bold;');
        analyzeEventSystem(report);
        
        // 6. 数据流检查
        console.log('%c6. 数据流检查', 'color: #17a2b8; font-weight: bold;');
        checkDataFlow(report);
        
        // 7. 生成最终报告
        console.log('%c7. 问题汇总与建议', 'color: #17a2b8; font-weight: bold;');
        generateFinalReport(report);
        
        return report;
    }
    
    // 检查所有模块状态
    function checkAllModules(report) {
        const modules = {
            '销售运营模块': '.sales-operations-container',
            '仓库模块': '.warehouse-container', 
            '产品管理模块': '.product-management-container',
            '任务画廊': '.published-tasks-gallery',
            '翻转容器': '.task-flip-container',
            '任务正面': '.task-front',
            '任务背面': '.task-back'
        };
        
        console.log('🏢 模块存在性检查:');
        Object.entries(modules).forEach(([name, selector]) => {
            const element = document.querySelector(selector);
            const count = document.querySelectorAll(selector).length;
            const status = element ? '✅ 存在' : '❌ 缺失';
            
            console.log(`   ${name}: ${status} (${count} 个)`);
            report.modules[name] = {
                exists: !!element,
                count: count,
                selector: selector
            };
            
            if (!element) {
                report.issues.push(`${name}模块缺失`);
            }
        });
    }
    
    // 分析DOM结构完整性
    function analyzeDOMStructure(report) {
        console.log('🧱 DOM结构分析:');
        
        // 检查翻转容器结构
        const containers = document.querySelectorAll('.task-flip-container');
        let completeStructures = 0;
        let partialStructures = 0;
        let brokenStructures = 0;
        
        containers.forEach(container => {
            const front = container.querySelector('.task-front');
            const back = container.querySelector('.task-back');
            
            if (front && back) {
                completeStructures++;
            } else if (front || back) {
                partialStructures++;
                report.issues.push(`容器 ${container.dataset.taskId || 'unknown'} 结构不完整`);
            } else {
                brokenStructures++;
                report.issues.push(`容器 ${container.dataset.taskId || 'unknown'} 完全损坏`);
            }
        });
        
        console.log(`   完整结构: ${completeStructures} 个`);
        console.log(`   部分结构: ${partialStructures} 个`);
        console.log(`   损坏结构: ${brokenStructures} 个`);
        
        report.domAnalysis = {
            totalContainers: containers.length,
            completeStructures,
            partialStructures,
            brokenStructures
        };
    }
    
    // 检查功能组件状态
    function checkFunctionalComponents(report) {
        console.log('⚙️ 功能组件检查:');
        
        const functions = {
            'toggleTaskCardFlip': typeof window.toggleTaskCardFlip === 'function',
            'loadWarehouseTasks': typeof window.loadWarehouseTasks === 'function',
            'performEmergencyFix': typeof window.performEmergencyFix === 'function',
            'diagnoseTaskCards': typeof window.diagnoseTaskCards === 'function'
        };
        
        Object.entries(functions).forEach(([name, exists]) => {
            const status = exists ? '✅ 可用' : '❌ 缺失';
            console.log(`   ${name}: ${status}`);
            
            if (!exists) {
                report.issues.push(`功能函数 ${name} 缺失`);
                report.recommendations.push(`需要实现或导入 ${name} 函数`);
            }
        });
        
        report.functions = functions;
    }
    
    // 检查CSS样式系统
    function checkCSSStyles(report) {
        console.log('🎨 CSS样式检查:');
        
        const criticalStyles = {
            '.task-flip-container': ['perspective', 'transform-style'],
            '.task-flip-container.flipped': ['transform'],
            '.task-front': ['backface-visibility'],
            '.task-back': ['backface-visibility', 'transform']
        };
        
        const missingStyles = [];
        
        Object.entries(criticalStyles).forEach(([selector, requiredProps]) => {
            const element = document.querySelector(selector);
            if (element) {
                const style = window.getComputedStyle(element);
                requiredProps.forEach(prop => {
                    if (!style[prop] || style[prop] === 'none') {
                        missingStyles.push(`${selector} 缺少 ${prop}`);
                    }
                });
            } else {
                missingStyles.push(`未找到 ${selector} 元素`);
            }
        });
        
        if (missingStyles.length > 0) {
            console.log('❌ 发现样式问题:');
            missingStyles.forEach(styleIssue => {
                console.log(`   ${styleIssue}`);
                report.issues.push(`样式问题: ${styleIssue}`);
            });
            report.recommendations.push('需要应用完整的翻转CSS样式');
        } else {
            console.log('✅ 所有关键样式正常');
        }
        
        report.cssIssues = missingStyles;
    }
    
    // 分析事件系统
    function analyzeEventSystem(report) {
        console.log('🖱️ 事件系统分析:');
        
        const containers = document.querySelectorAll('.task-flip-container');
        let clickableContainers = 0;
        let nonClickableContainers = 0;
        
        containers.forEach(container => {
            const front = container.querySelector('.task-front');
            if (front) {
                // 检查是否有点击事件监听器
                const hasClickHandler = front.onclick || 
                                      front._hasFlipListener ||
                                      container._hasFlipListener;
                
                if (hasClickHandler) {
                    clickableContainers++;
                } else {
                    nonClickableContainers++;
                    const taskId = container.dataset.taskId || 'unknown';
                    report.issues.push(`任务 ${taskId} 缺少点击事件`);
                }
            }
        });
        
        console.log(`   可点击容器: ${clickableContainers} 个`);
        console.log(`   不可点击容器: ${nonClickableContainers} 个`);
        
        report.eventSystem = {
            totalContainers: containers.length,
            clickable: clickableContainers,
            nonClickable: nonClickableContainers
        };
    }
    
    // 检查数据流
    function checkDataFlow(report) {
        console.log('📊 数据流检查:');
        
        // 检查任务数据是否存在
        const taskElements = document.querySelectorAll('[data-task-id]');
        const uniqueTaskIds = new Set();
        
        taskElements.forEach(el => {
            const taskId = el.dataset.taskId;
            if (taskId) uniqueTaskIds.add(taskId);
        });
        
        console.log(`   发现任务ID数量: ${uniqueTaskIds.size}`);
        
        if (uniqueTaskIds.size === 0) {
            report.issues.push('未发现任何任务数据');
            report.recommendations.push('需要加载或创建任务数据');
        }
        
        // 检查Utils对象
        const utilsExists = typeof window.Utils !== 'undefined';
        console.log(`   Utils对象: ${utilsExists ? '✅ 存在' : '❌ 缺失'}`);
        
        if (!utilsExists) {
            report.issues.push('Utils对象缺失');
            report.recommendations.push('需要初始化Utils对象');
        }
        
        report.dataFlow = {
            taskCount: uniqueTaskIds.size,
            utilsExists: utilsExists
        };
    }
    
    // 生成最终报告
    function generateFinalReport(report) {
        console.log('%c=== 诊断总结 ===', 'color: #ffc107; font-weight: bold; font-size: 16px;');
        
        console.log('🚨 发现的主要问题:');
        if (report.issues.length === 0) {
            console.log('   ✅ 系统状态良好，未发现明显问题');
        } else {
            report.issues.forEach((issue, index) => {
                console.log(`   ${index + 1}. ${issue}`);
            });
        }
        
        console.log('\n💡 修复建议:');
        if (report.recommendations.length === 0) {
            console.log('   ✅ 无需额外修复');
        } else {
            report.recommendations.forEach((rec, index) => {
                console.log(`   ${index + 1}. ${rec}`);
            });
        }
        
        // 系统健康评分
        const totalChecks = Object.keys(report.modules).length + 
                           Object.keys(report.functions).length + 
                           (report.cssIssues ? report.cssIssues.length : 0) + 3;
        const issuesCount = report.issues.length;
        const healthScore = Math.max(0, Math.round(((totalChecks - issuesCount) / totalChecks) * 100));
        
        console.log(`\n📊 系统健康评分: ${healthScore}% (${totalChecks - issuesCount}/${totalChecks})`);
        
        report.healthScore = healthScore;
        report.timestamp = new Date().toISOString();
    }
    
    // 自动修复系统
    function automaticSystemRepair() {
        console.log('%c🔧 启动自动系统修复...', 'color: #dc3545; font-weight: bold; font-size: 16px;');
        
        let repairsMade = 0;
        
        // 1. 修复缺失的函数
        if (typeof window.toggleTaskCardFlip !== 'function') {
            console.log('🔧 创建翻转函数...');
            createToggleFunction();
            repairsMade++;
        }
        
        // 2. 修复DOM结构
        console.log('🔧 修复DOM结构...');
        repairsMade += repairDOMStructure();
        
        // 3. 应用缺失的样式
        console.log('🔧 应用关键样式...');
        applyMissingStyles();
        repairsMade++;
        
        // 4. 绑定事件监听器
        console.log('🔧 绑定事件监听器...');
        bindEventListeners();
        repairsMade++;
        
        console.log(`%c✅ 自动修复完成，执行了 ${repairsMade} 项修复`, 'color: #28a745; font-weight: bold;');
        return repairsMade;
    }
    
    // 创建翻转函数
    function createToggleFunction() {
        window.toggleTaskCardFlip = function(taskId) {
            console.log(`🔄 翻转任务: ${taskId}`);
            
            // 多种选择器尝试
            const selectors = [
                `.task-flip-container[data-task-id="${taskId}"]`,
                `#${taskId}.task-flip-container`,
                `.task-flip-container[id="${taskId}"]`
            ];
            
            let container = null;
            for (const selector of selectors) {
                container = document.querySelector(selector);
                if (container) break;
            }
            
            if (!container) {
                console.error(`❌ 未找到任务容器: ${taskId}`);
                return;
            }
            
            container.classList.toggle('flipped');
            console.log(`✅ 翻转完成: ${container.classList.contains('flipped') ? '背面' : '正面'}`);
        };
        
        console.log('✅ 翻转函数已创建');
    }
    
    // 修复DOM结构
    function repairDOMStructure() {
        let repairs = 0;
        
        // 修复孤立的正面元素
        const orphanedFronts = document.querySelectorAll('.task-front:not(.task-flip-container .task-front)');
        orphanedFronts.forEach(front => {
            wrapInContainer(front);
            repairs++;
        });
        
        // 为缺少背面的容器添加背面
        document.querySelectorAll('.task-flip-container').forEach(container => {
            if (!container.querySelector('.task-back')) {
                addBackElement(container);
                repairs++;
            }
        });
        
        console.log(`✅ DOM结构修复完成 (${repairs} 项)`);
        return repairs;
    }
    
    // 应用缺失样式
    function applyMissingStyles() {
        const styleId = 'ultimate-system-fix-styles';
        const existing = document.getElementById(styleId);
        if (existing) existing.remove();
        
        const styles = `
            .task-flip-container {
                perspective: 1500px !important;
                transform-style: preserve-3d !important;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                position: relative !important;
                cursor: pointer !important;
            }
            
            .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
            }
            
            .task-front, .task-back {
                backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }
            
            .task-back {
                transform: rotateY(180deg) !important;
            }
        `;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = styles;
        document.head.appendChild(style);
        
        console.log('✅ 关键样式已应用');
    }
    
    // 绑定事件监听器
    function bindEventListeners() {
        document.querySelectorAll('.task-front').forEach(front => {
            if (!front._hasFlipListener) {
                front.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const container = this.closest('.task-flip-container');
                    if (container && container.dataset.taskId) {
                        window.toggleTaskCardFlip(container.dataset.taskId);
                    }
                });
                front._hasFlipListener = true;
            }
        });
        
        console.log('✅ 事件监听器已绑定');
    }
    
    // 辅助函数
    function wrapInContainer(frontElement) {
        const taskId = frontElement.id.replace('task-', '').replace('-front', '') || 'temp-' + Date.now();
        
        const container = document.createElement('div');
        container.className = 'task-flip-container';
        container.dataset.taskId = taskId;
        
        const parent = frontElement.parentNode;
        parent.replaceChild(container, frontElement);
        container.appendChild(frontElement);
        addBackElement(container);
        
        console.log(`✅ 元素已包装: ${taskId}`);
    }
    
    function addBackElement(container) {
        const taskId = container.dataset.taskId || 'unknown';
        
        const back = document.createElement('div');
        back.className = 'task-back';
        back.dataset.taskId = taskId;
        back.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #6c757d;">
                <i class="fas fa-file-alt fa-2x mb-3" style="color: #007bff;"></i>
                <h6>任务文件</h6>
                <p>本体码、条码、警示码等</p>
                <button onclick="toggleTaskCardFlip('${taskId}')" 
                        style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 15px;">
                    返回正面
                </button>
            </div>
        `;
        
        container.appendChild(back);
        console.log(`✅ 背面已添加: ${taskId}`);
    }
    
    // 导出到全局
    window.UltimateSystemDiagnosis = {
        diagnose: ultimateSystemDiagnosis,
        repair: automaticSystemRepair,
        getHealthScore: function() {
            const report = ultimateSystemDiagnosis();
            return report.healthScore;
        }
    };
    
    console.log('%c✅ 终极诊断系统已加载', 'color: #28a745; font-weight: bold;');
    console.log('%c💡 使用方法:', 'color: #ffc107; font-weight: bold;');
    console.log('   UltimateSystemDiagnosis.diagnose()  // 全面诊断');
    console.log('   UltimateSystemDiagnosis.repair()     // 自动修复');
    console.log('   UltimateSystemDiagnosis.getHealthScore()  // 获取健康评分');
    
})();
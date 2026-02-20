/**
 * 彻底的任务卡片翻转功能诊断和修复工具
 * 深度分析所有可能导致翻转失败的原因
 */

(function() {
    'use strict';
    
    console.log('%c🔍 启动全面翻转功能诊断...', 'color: #007bff; font-weight: bold; font-size: 16px;');
    
    // 全面诊断函数
    function comprehensiveFlipDiagnosis() {
        console.log('%c=== 全面翻转诊断报告 ===', 'color: #28a745; font-weight: bold; font-size: 18px;');
        
        // 1. 基础元素检查
        console.log('%c1. 基础元素状态检查', 'color: #17a2b8; font-weight: bold;');
        const taskFronts = document.querySelectorAll('.task-front');
        const taskBacks = document.querySelectorAll('.task-back');
        const flipContainers = document.querySelectorAll('.task-flip-container');
        const flippedContainers = document.querySelectorAll('.task-flip-container.flipped');
        
        console.log('📊 元素统计:');
        console.log('   - .task-front 元素: ' + taskFronts.length + ' 个');
        console.log('   - .task-back 元素: ' + taskBacks.length + ' 个');
        console.log('   - .task-flip-container 容器: ' + flipContainers.length + ' 个');
        console.log('   - 已翻转的容器: ' + flippedContainers.length + ' 个');
        
        // 2. 详细容器分析
        console.log('%c2. 翻转容器详细分析', 'color: #17a2b8; font-weight: bold;');
        flipContainers.forEach(function(container, index) {
            const taskId = container.dataset.taskId || '无ID';
            const front = container.querySelector('.task-front');
            const back = container.querySelector('.task-back');
            
            console.log('容器 #' + (index + 1) + ' (任务ID: ' + taskId + '):');
            console.log('   - 容器存在: ✅');
            console.log('   - 正面元素: ' + (front ? '✅ 存在' : '❌ 缺失'));
            console.log('   - 背面元素: ' + (back ? '✅ 存在' : '❌ 缺失'));
            console.log('   - 当前状态: ' + (container.classList.contains('flipped') ? '🔄 已翻转' : '📱 正面'));
            
            // 检查容器样式
            try {
                const style = window.getComputedStyle(container);
                console.log('   - perspective: ' + style.perspective);
                console.log('   - transformStyle: ' + style.transformStyle);
                console.log('   - transition: ' + style.transition);
                console.log('   - transform: ' + style.transform);
            } catch (e) {
                console.log('   - ❌ 样式检查失败: ' + e.message);
            }
            
            console.log('---');
        });
        
        // 3. 孤立元素检查
        console.log('%c3. 孤立元素检查', 'color: #17a2b8; font-weight: bold;');
        const orphanedFronts = Array.from(taskFronts).filter(front => {
            return !front.closest('.task-flip-container');
        });
        
        const orphanedBacks = Array.from(taskBacks).filter(back => {
            return !back.closest('.task-flip-container');
        });
        
        console.log('孤立正面元素: ' + orphanedFronts.length + ' 个');
        orphanedFronts.forEach(function(front, index) {
            console.log('   孤立正面 #' + (index + 1) + ': ' + front.id);
        });
        
        console.log('孤立背面元素: ' + orphanedBacks.length + ' 个');
        orphanedBacks.forEach(function(back, index) {
            console.log('   孤立背面 #' + (index + 1) + ': ' + back.className);
        });
        
        // 4. 翻转函数检查
        console.log('%c4. 翻转函数状态检查', 'color: #17a2b8; font-weight: bold;');
        console.log('toggleTaskCardFlip 函数: ' + (typeof window.toggleTaskCardFlip === 'function' ? '✅ 存在' : '❌ 缺失'));
        
        if (typeof window.toggleTaskCardFlip === 'function') {
            console.log('   函数源码预览:');
            console.log('   ' + window.toggleTaskCardFlip.toString().substring(0, 200) + '...');
        }
        
        // 5. CSS样式完整性检查
        console.log('%c5. 关键CSS样式检查', 'color: #17a2b8; font-weight: bold;');
        checkCriticalStyles();
        
        // 6. 事件监听器检查
        console.log('%c6. 事件监听器状态', 'color: #17a2b8; font-weight: bold;');
        checkEventListeners();
        
        // 输出总结
        console.log('%c=== 诊断总结 ===', 'color: #ffc107; font-weight: bold; font-size: 16px;');
        console.log('总任务卡片数: ' + flipContainers.length);
        console.log('完整结构卡片数: ' + Array.from(flipContainers).filter(c => 
            c.querySelector('.task-front') && c.querySelector('.task-back')
        ).length);
        console.log('可翻转卡片数: ' + (typeof window.toggleTaskCardFlip === 'function' ? flipContainers.length : 0));
        
        return {
            totalContainers: flipContainers.length,
            completeStructures: Array.from(flipContainers).filter(c => 
                c.querySelector('.task-front') && c.querySelector('.task-back')
            ).length,
            flipFunctionExists: typeof window.toggleTaskCardFlip === 'function',
            orphanedFronts: orphanedFronts.length,
            orphanedBacks: orphanedBacks.length
        };
    }
    
    // 检查关键CSS样式
    function checkCriticalStyles() {
        const criticalSelectors = [
            '.task-flip-container',
            '.task-flip-container.flipped',
            '.task-front',
            '.task-back'
        ];
        
        criticalSelectors.forEach(selector => {
            try {
                const element = document.querySelector(selector);
                if (element) {
                    const style = window.getComputedStyle(element);
                    console.log(selector + ':');
                    console.log('   display: ' + style.display);
                    console.log('   position: ' + style.position);
                    if (style.perspective) console.log('   perspective: ' + style.perspective);
                    if (style.transformStyle) console.log('   transformStyle: ' + style.transformStyle);
                    if (style.backfaceVisibility) console.log('   backfaceVisibility: ' + style.backfaceVisibility);
                } else {
                    console.log(selector + ': ❌ 未找到匹配元素');
                }
            } catch (e) {
                console.log(selector + ': ❌ 样式检查失败 - ' + e.message);
            }
        });
    }
    
    // 检查事件监听器
    function checkEventListeners() {
        const containers = document.querySelectorAll('.task-flip-container');
        let clickableCount = 0;
        
        containers.forEach(container => {
            const front = container.querySelector('.task-front');
            if (front) {
                const events = getEventListeners(front);
                if (events.click && events.click.length > 0) {
                    clickableCount++;
                    console.log('✅ 容器 ' + container.dataset.taskId + ' 有点击事件');
                } else {
                    console.log('❌ 容器 ' + container.dataset.taskId + ' 缺少点击事件');
                }
            }
        });
        
        console.log('具有点击事件的容器: ' + clickableCount + '/' + containers.length);
    }
    
    // 获取元素事件监听器（Chrome DevTools API）
    function getEventListeners(element) {
        // 这是一个DevTools API，在生产环境中可能不可用
        if (typeof window.getEventListeners === 'function') {
            return window.getEventListeners(element);
        }
        return {};
    }
    
    // 自动修复函数
    function automaticFlipRepair() {
        console.log('%c🔧 开始自动修复...', 'color: #dc3545; font-weight: bold; font-size: 16px;');
        
        let repairsMade = 0;
        
        // 1. 修复孤立的正面元素
        const orphanedFronts = document.querySelectorAll('.task-front:not(.task-flip-container .task-front)');
        orphanedFronts.forEach(front => {
            console.log('🔧 修复孤立正面元素: ' + front.id);
            wrapInFlipContainer(front);
            repairsMade++;
        });
        
        // 2. 确保每个容器都有背面元素
        document.querySelectorAll('.task-flip-container').forEach(container => {
            if (!container.querySelector('.task-back')) {
                console.log('🔧 为容器 ' + container.dataset.taskId + ' 添加背面元素');
                addBackElement(container);
                repairsMade++;
            }
        });
        
        // 3. 确保翻转函数存在
        if (typeof window.toggleTaskCardFlip !== 'function') {
            console.log('🔧 创建翻转函数');
            createFlipFunction();
            repairsMade++;
        }
        
        // 4. 应用关键CSS样式
        console.log('🔧 应用关键CSS样式');
        applyCriticalStyles();
        repairsMade++;
        
        console.log('%c✅ 自动修复完成，共执行 ' + repairsMade + ' 项修复', 'color: #28a745; font-weight: bold;');
        return repairsMade;
    }
    
    // 将孤立元素包装进翻转容器
    function wrapInFlipContainer(frontElement) {
        const taskId = frontElement.id.replace('task-', '').replace('-front', '') || 'unknown';
        
        const container = document.createElement('div');
        container.className = 'task-flip-container';
        container.dataset.taskId = taskId;
        
        // 设置容器样式
        Object.assign(container.style, {
            'perspective': '1500px',
            'transformStyle': 'preserve-3d',
            'transition': 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            'position': 'relative',
            'cursor': 'pointer',
            'width': '100%',
            'height': '100%',
            'display': 'block'
        });
        
        // 重构DOM
        const parent = frontElement.parentNode;
        parent.replaceChild(container, frontElement);
        container.appendChild(frontElement);
        
        // 添加背面元素
        addBackElement(container);
        
        console.log('✅ 孤立元素已包装进翻转容器');
    }
    
    // 添加背面元素
    function addBackElement(container) {
        const taskId = container.dataset.taskId || 'unknown';
        
        const backElement = document.createElement('div');
        backElement.className = 'task-back';
        backElement.dataset.taskId = taskId;
        
        // 设置背面样式
        Object.assign(backElement.style, {
            'backfaceVisibility': 'hidden',
            'WebkitBackfaceVisibility': 'hidden',
            'position': 'absolute',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'backgroundColor': 'white',
            'borderRadius': '10px',
            'boxShadow': '0 3px 8px rgba(0, 0, 0, 0.08)',
            'transform': 'rotateY(180deg)',
            'zIndex': '1',
            'display': 'flex',
            'flexDirection': 'column',
            'alignItems': 'center',
            'justifyContent': 'center',
            'padding': '20px'
        });
        
        // 添加背面内容
        backElement.innerHTML = `
            <div style="text-align: center; color: #6c757d;">
                <i class="fas fa-file-alt fa-2x mb-3" style="color: #007bff;"></i>
                <h6>任务文件清单</h6>
                <p style="font-size: 14px;">本体码、条码、警示码、说明书、箱唛、其他文件</p>
                <button onclick="toggleTaskCardFlip('${taskId}')" 
                        style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 15px;">
                    <i class="fas fa-arrow-left me-1"></i>返回正面
                </button>
            </div>
        `;
        
        container.appendChild(backElement);
        console.log('✅ 背面元素已添加');
    }
    
    // 创建翻转函数
    function createFlipFunction() {
        window.toggleTaskCardFlip = function(taskId) {
            console.log('🔄 执行翻转 - 任务ID: ' + taskId);
            
            // 支持多种选择器格式
            const selectors = [
                `.task-flip-container[data-task-id="${taskId}"]`,
                `.task-flip-container[data-task-id="task-${taskId}"]`,
                `#${taskId}.task-flip-container`,
                `.task-flip-container[id="${taskId}"]`
            ];
            
            let flipContainer = null;
            for (const selector of selectors) {
                flipContainer = document.querySelector(selector);
                if (flipContainer) {
                    console.log('✅ 使用选择器找到容器: ' + selector);
                    break;
                }
            }
            
            if (!flipContainer) {
                console.error('❌ 未找到翻转容器，尝试的ID: ' + taskId);
                console.log('可用的容器ID:');
                document.querySelectorAll('.task-flip-container').forEach(c => {
                    console.log('   - ' + c.dataset.taskId);
                });
                return;
            }
            
            // 执行翻转
            flipContainer.classList.toggle('flipped');
            const isFlipped = flipContainer.classList.contains('flipped');
            
            console.log('✅ 翻转完成 - 当前状态: ' + (isFlipped ? '背面' : '正面'));
        };
        
        console.log('✅ 翻转函数已创建');
    }
    
    // 应用关键CSS样式
    function applyCriticalStyles() {
        const styleId = 'comprehensive-flip-fix-styles';
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }
        
        const styles = `
            .task-flip-container {
                perspective: 1500px !important;
                -webkit-perspective: 1500px !important;
                transform-style: preserve-3d !important;
                -webkit-transform-style: preserve-3d !important;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
                position: relative !important;
                cursor: pointer !important;
                width: 100% !important;
                height: 100% !important;
                display: block !important;
                will-change: transform !important;
            }
            
            .task-flip-container.flipped {
                transform: rotateY(180deg) !important;
                -webkit-transform: rotateY(180deg) !important;
            }
            
            .task-front, .task-back {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }
            
            .task-front {
                z-index: 2 !important;
                transform: rotateY(0deg) !important;
                -webkit-transform: rotateY(0deg) !important;
            }
            
            .task-back {
                z-index: 1 !important;
                transform: rotateY(180deg) !important;
                -webkit-transform: rotateY(180deg) !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = styleId;
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        console.log('✅ 关键CSS样式已应用');
    }
    
    // 导出到全局
    window.ComprehensiveFlipDiagnosis = {
        diagnose: comprehensiveFlipDiagnosis,
        repair: automaticFlipRepair,
        createFlipFunction: createFlipFunction,
        applyStyles: applyCriticalStyles
    };
    
    console.log('%c✅ 全面诊断工具已加载', 'color: #28a745; font-weight: bold;');
    console.log('%c💡 使用方法:', 'color: #ffc107; font-weight: bold;');
    console.log('   ComprehensiveFlipDiagnosis.diagnose()  // 运行全面诊断');
    console.log('   ComprehensiveFlipDiagnosis.repair()     // 自动修复问题');
    
})();
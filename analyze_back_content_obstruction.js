/**
 * 深度分析任务卡背面内容被遮挡问题
 * 专门诊断 .task-back-actions 元素对文件内容的遮挡情况
 */

(function() {
    'use strict';
    
    console.log('%c🔍 启动任务卡背面遮挡问题深度分析...', 'color: #007bff; font-weight: bold; font-size: 16px;');
    
    // 主要诊断函数
    function analyzeBackContentObstruction() {
        console.log('\n%c=== 任务卡背面遮挡问题诊断报告 ===', 'color: #28a745; font-weight: bold; font-size: 18px;');
        
        const analysis = {
            timestamp: new Date().toISOString(),
            taskCards: [],
            obstructionIssues: [],
            zIndexConflicts: [],
            layoutProblems: []
        };
        
        // 1. 查找所有翻转后的任务卡片
        console.log('\n%c1. 任务卡片状态检查', 'color: #17a2b8; font-weight: bold;');
        const flippedContainers = document.querySelectorAll('.task-flip-container.flipped');
        console.log(`📊 已翻转的任务卡片数量: ${flippedContainers.length}`);
        
        if (flippedContainers.length === 0) {
            console.log('⚠️  没有找到已翻转的任务卡片，请先翻转一个任务卡片再进行分析');
            return analysis;
        }
        
        // 2. 详细分析每个翻转卡片
        flippedContainers.forEach((container, index) => {
            console.log(`\n--- 卡片 ${index + 1} ---`);
            const taskId = container.dataset.taskId || 'unknown';
            console.log(`任务ID: ${taskId}`);
            
            const backElement = container.querySelector('.task-back');
            const actionsElement = container.querySelector('.task-back-actions');
            const contentElement = container.querySelector('.task-back-content');
            const filesContainer = container.querySelector('.task-files-container');
            
            // 基本元素检查
            console.log('元素存在性检查:');
            console.log(`  背面元素: ${backElement ? '✅' : '❌'}`);
            console.log(`  操作区域: ${actionsElement ? '✅' : '❌'}`);
            console.log(`  内容容器: ${contentElement ? '✅' : '❌'}`);
            console.log(`  文件容器: ${filesContainer ? '✅' : '❌'}`);
            
            if (!backElement || !actionsElement) {
                console.log('❌ 关键元素缺失，跳过此卡片分析');
                return;
            }
            
            // 3. 层级和定位分析
            console.log('\n%c层级和定位分析:', 'color: #ffc107; font-weight: bold;');
            analyzeElementHierarchy(backElement, actionsElement, contentElement, filesContainer, analysis);
            
            // 4. 尺寸和位置分析
            console.log('\n%c尺寸和位置分析:', 'color: #ffc107; font-weight: bold;');
            analyzeElementDimensions(backElement, actionsElement, contentElement, filesContainer, taskId);
            
            // 5. CSS样式冲突检查
            console.log('\n%cCSS样式检查:', 'color: #ffc107; font-weight: bold;');
            checkCSSConflicts(actionsElement, contentElement, filesContainer);
        });
        
        // 6. 生成问题总结
        generateProblemSummary(analysis);
        
        return analysis;
    }
    
    // 分析元素层级关系
    function analyzeElementHierarchy(backElement, actionsElement, contentElement, filesContainer, analysis) {
        // 获取计算样式
        const backStyle = window.getComputedStyle(backElement);
        const actionsStyle = window.getComputedStyle(actionsElement);
        const contentStyle = contentElement ? window.getComputedStyle(contentElement) : null;
        const filesStyle = filesContainer ? window.getComputedStyle(filesContainer) : null;
        
        console.log('Position属性:');
        console.log(`  背面: ${backStyle.position}`);
        console.log(`  操作区: ${actionsStyle.position}`);
        console.log(`  内容区: ${contentStyle?.position || 'N/A'}`);
        console.log(`  文件区: ${filesStyle?.position || 'N/A'}`);
        
        console.log('Z-index值:');
        console.log(`  背面: ${backStyle.zIndex}`);
        console.log(`  操作区: ${actionsStyle.zIndex}`);
        console.log(`  内容区: ${contentStyle?.zIndex || 'N/A'}`);
        console.log(`  文件区: ${filesStyle?.zIndex || 'N/A'}`);
        
        // 检查z-index冲突
        const backZ = parseInt(backStyle.zIndex) || 0;
        const actionsZ = parseInt(actionsStyle.zIndex) || 0;
        
        if (actionsZ >= backZ) {
            analysis.zIndexConflicts.push({
                type: 'z-index冲突',
                issue: `操作区域z-index(${actionsZ}) >= 背面z-index(${backZ})`
            });
            console.log('❌ 发现z-index层级冲突');
        } else {
            console.log('✅ z-index层级正常');
        }
    }
    
    // 分析元素尺寸和位置
    function analyzeElementDimensions(backElement, actionsElement, contentElement, filesContainer, taskId) {
        const backRect = backElement.getBoundingClientRect();
        const actionsRect = actionsElement.getBoundingClientRect();
        const contentRect = contentElement ? contentElement.getBoundingClientRect() : null;
        const filesRect = filesContainer ? filesContainer.getBoundingClientRect() : null;
        
        console.log('尺寸信息:');
        console.log(`  背面: ${Math.round(backRect.width)}×${Math.round(backRect.height)}px`);
        console.log(`  操作区: ${Math.round(actionsRect.width)}×${Math.round(actionsRect.height)}px`);
        console.log(`  内容区: ${contentRect ? `${Math.round(contentRect.width)}×${Math.round(contentRect.height)}px` : 'N/A'}`);
        console.log(`  文件区: ${filesRect ? `${Math.round(filesRect.width)}×${Math.round(filesRect.height)}px` : 'N/A'}`);
        
        // 位置关系分析
        console.log('位置关系:');
        console.log(`  操作区相对位置: top=${Math.round(actionsRect.top - backRect.top)}px, bottom=${Math.round(backRect.bottom - actionsRect.bottom)}px`);
        
        // 检查遮挡情况
        if (contentRect && filesRect) {
            const contentBottom = contentRect.bottom;
            const actionsTop = actionsRect.top;
            const overlap = contentBottom > actionsTop;
            
            if (overlap) {
                const overlapAmount = contentBottom - actionsTop;
                console.log(`❌ 内容区域被遮挡: ${Math.round(overlapAmount)}px`);
            } else {
                console.log('✅ 内容区域未被遮挡');
            }
        }
    }
    
    // 检查CSS样式冲突
    function checkCSSConflicts(actionsElement, contentElement, filesContainer) {
        // 检查flex属性
        const actionsStyle = window.getComputedStyle(actionsElement);
        const contentStyle = contentElement ? window.getComputedStyle(contentElement) : null;
        
        console.log('Flex布局属性:');
        console.log(`  操作区 - flex-shrink: ${actionsStyle.flexShrink}`);
        console.log(`  操作区 - flex-grow: ${actionsStyle.flexGrow}`);
        console.log(`  操作区 - flex-basis: ${actionsStyle.flexBasis}`);
        console.log(`  内容区 - flex-shrink: ${contentStyle?.flexShrink || 'N/A'}`);
        console.log(`  内容区 - flex-grow: ${contentStyle?.flexGrow || 'N/A'}`);
        
        // 检查margin和padding
        console.log('间距属性:');
        console.log(`  操作区 - margin-top: ${actionsStyle.marginTop}`);
        console.log(`  操作区 - margin-bottom: ${actionsStyle.marginBottom}`);
        console.log(`  操作区 - padding: ${actionsStyle.padding}`);
    }
    
    // 生成问题总结
    function generateProblemSummary(analysis) {
        console.log('\n%c=== 问题诊断总结 ===', 'color: #dc3545; font-weight: bold; font-size: 16px;');
        
        if (analysis.zIndexConflicts.length > 0) {
            console.log('🚨 发现的层级冲突问题:');
            analysis.zIndexConflicts.forEach((conflict, index) => {
                console.log(`  ${index + 1}. ${conflict.issue}`);
            });
        }
        
        console.log('\n💡 可能的解决方案:');
        console.log('  1. 调整 .task-back-actions 的 z-index 值');
        console.log('  2. 修改 .task-back-content 的 flex 属性');
        console.log('  3. 调整 .task-back-actions 的 margin/padding');
        console.log('  4. 重新组织背面DOM结构');
        
        console.log('\n🔧 建议的CSS修复:');
        console.log(`
.task-back-actions {
    z-index: 10 !important;
    position: relative !important;
    margin-top: auto !important;
    flex-shrink: 0 !important;
}

.task-back-content {
    flex: 1 1 auto !important;
    overflow: hidden !important;
    max-height: calc(100% - 60px) !important;
}`);
    }
    
    // 执行诊断
    setTimeout(() => {
        const result = analyzeBackContentObstruction();
        window.backContentAnalysis = result;
        console.log('\n✅ 诊断完成，结果已保存到 window.backContentAnalysis');
    }, 1000);
    
})();
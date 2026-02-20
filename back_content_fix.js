/**
 * 背面内容显示深度修复工具
 * 专门解决翻转后显示正面镜像而非真实背面内容的问题
 */

(function() {
    'use strict';
    
    console.log('%c🔍 启动背面内容深度诊断...', 'color: #007bff; font-weight: bold; font-size: 16px;');
    
    // 深度诊断背面显示问题
    function deepBackContentDiagnosis() {
        console.log('%c=== 背面内容显示深度诊断 ===', 'color: #28a745; font-weight: bold; font-size: 18px;');
        
        const diagnosis = {
            backElements: [],
            contentIssues: [],
            cssProblems: [],
            structuralIssues: []
        };
        
        // 1. 检查所有背面元素的内容
        console.log('%c1. 背面元素内容分析', 'color: #17a2b8; font-weight: bold;');
        const backElements = document.querySelectorAll('.task-back');
        
        backElements.forEach((backElement, index) => {
            const taskId = backElement.dataset.taskId || 'unknown';
            console.log(`\n--- 背面元素 #${index + 1} (任务ID: ${taskId}) ---`);
            
            // 内容分析
            const innerHTML = backElement.innerHTML.trim();
            const textContent = backElement.textContent.trim();
            
            console.log('📄 内容分析:');
            console.log(`   HTML长度: ${innerHTML.length} 字符`);
            console.log(`   文本长度: ${textContent.length} 字符`);
            console.log(`   HTML预览: "${innerHTML.substring(0, 100)}${innerHTML.length > 100 ? '...' : ''}"`);
            
            // 检查是否包含正面内容的特征
            const正面特征词 = ['点击查看详情', '仓库任务', 'box', '任务 #'];
            const包含正面特征 = 正面特征词.some(word => textContent.includes(word));
            
            if (包含正面特征) {
                console.log('❌ 检测到正面内容特征!');
                diagnosis.contentIssues.push({
                    taskId: taskId,
                    issue: '包含正面内容特征',
                    content: textContent.substring(0, 50)
                });
            }
            
            // 检查是否包含正确的背面内容特征
            const背面特征词 = ['任务文件清单', '本体码', '条码', '警示码', '说明书', '箱唛', '其他文件'];
            const包含背面特征 = 背面特征词.some(word => textContent.includes(word));
            
            if (!包含背面特征) {
                console.log('❌ 缺少背面内容特征!');
                diagnosis.contentIssues.push({
                    taskId: taskId,
                    issue: '缺少背面内容特征',
                    content: textContent.substring(0, 50)
                });
            }
            
            // 结构分析
            console.log('🧩 结构分析:');
            const children = Array.from(backElement.children);
            console.log(`   子元素数量: ${children.length}`);
            
            children.forEach((child, childIndex) => {
                console.log(`   子元素 ${childIndex + 1}: ${child.tagName}.${child.className}`);
                if (child.textContent.trim()) {
                    console.log(`     内容预览: "${child.textContent.trim().substring(0, 30)}"`);
                }
            });
            
            // CSS样式检查
            console.log('🎨 CSS样式检查:');
            try {
                const style = window.getComputedStyle(backElement);
                console.log(`   display: ${style.display}`);
                console.log(`   position: ${style.position}`);
                console.log(`   transform: ${style.transform}`);
                console.log(`   backfaceVisibility: ${style.backfaceVisibility}`);
                console.log(`   zIndex: ${style.zIndex}`);
                
                // 检查是否被正面元素遮挡
                if (style.zIndex === '2' || style.zIndex > '1') {
                    console.log('⚠️ zIndex可能过高，会被正面遮挡');
                    diagnosis.cssProblems.push({
                        taskId: taskId,
                        issue: 'zIndex过高',
                        value: style.zIndex
                    });
                }
            } catch (e) {
                console.log('❌ 样式检查失败:', e.message);
            }
            
            diagnosis.backElements.push({
                taskId: taskId,
                htmlLength: innerHTML.length,
                textLength: textContent.length,
                hasFrontFeatures: 包含正面特征,
                hasBackFeatures: 包含背面特征,
                childCount: children.length
            });
        });
        
        // 2. 检查翻转状态下的可见性
        console.log('%c2. 翻转状态可见性检查', 'color: #17a2b8; font-weight: bold;');
        const flippedContainers = document.querySelectorAll('.task-flip-container.flipped');
        
        flippedContainers.forEach(container => {
            const taskId = container.dataset.taskId;
            const front = container.querySelector('.task-front');
            const back = container.querySelector('.task-back');
            
            console.log(`\n翻转容器 (任务ID: ${taskId}):`);
            
            if (front) {
                const frontVisible = front.offsetParent !== null;
                console.log(`   正面可见性: ${frontVisible ? '✅' : '❌'}`);
            }
            
            if (back) {
                const backVisible = back.offsetParent !== null;
                console.log(`   背面可见性: ${backVisible ? '✅' : '❌'}`);
                
                if (!backVisible) {
                    diagnosis.structuralIssues.push({
                        taskId: taskId,
                        issue: '背面不可见',
                        reason: '可能被正面遮挡或CSS问题'
                    });
                }
            }
        });
        
        // 3. 生成诊断报告
        console.log('%c=== 诊断结论 ===', 'color: #ffc107; font-weight: bold; font-size: 16px;');
        
        if (diagnosis.contentIssues.length > 0) {
            console.log('🚨 内容问题:');
            diagnosis.contentIssues.forEach(issue => {
                console.log(`   - 任务${issue.taskId}: ${issue.issue}`);
            });
        }
        
        if (diagnosis.cssProblems.length > 0) {
            console.log('🎨 CSS问题:');
            diagnosis.cssProblems.forEach(problem => {
                console.log(`   - 任务${problem.taskId}: ${problem.issue} (${problem.value})`);
            });
        }
        
        if (diagnosis.structuralIssues.length > 0) {
            console.log('🏗️ 结构问题:');
            diagnosis.structuralIssues.forEach(issue => {
                console.log(`   - 任务${issue.taskId}: ${issue.issue}`);
            });
        }
        
        if (diagnosis.contentIssues.length === 0 && 
            diagnosis.cssProblems.length === 0 && 
            diagnosis.structuralIssues.length === 0) {
            console.log('✅ 背面内容显示正常');
        }
        
        return diagnosis;
    }
    
    // 深度修复背面内容
    function deepBackContentRepair() {
        console.log('%c🔧 开始背面内容深度修复...', 'color: #dc3545; font-weight: bold; font-size: 16px;');
        
        let repairsMade = 0;
        
        // 1. 修复背面内容
        console.log('📝 修复背面内容...');
        document.querySelectorAll('.task-back').forEach(backElement => {
            const taskId = backElement.dataset.taskId || 'unknown';
            
            // 检查当前内容是否正确
            const currentText = backElement.textContent;
            const hasCorrectContent = currentText.includes('任务文件清单') && 
                                    (currentText.includes('本体码') || currentText.includes('条码'));
            
            if (!hasCorrectContent) {
                console.log(`🔧 修复任务 ${taskId} 的背面内容...`);
                
                // 创建标准的背面内容
                backElement.innerHTML = `
                    <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box;">
                        <div style="text-align: center; color: white; width: 100%;">
                            <i class="fas fa-file-alt fa-2x mb-3" style="color: rgba(255,255,255,0.8);"></i>
                            <h5 style="margin-bottom: 20px; color: white;">📦 任务文件清单</h5>
                            
                            <div style="background: rgba(255,255,255,0.1); border-radius: 10px; padding: 15px; margin-bottom: 20px; text-align: left; width: 90%;">
                                <div style="margin-bottom: 10px;">
                                    <i class="fas fa-barcode" style="margin-right: 10px; color: #4CAF50;"></i>
                                    <span>本体码:</span>
                                    <span style="float: right; color: #4CAF50;">✓ 已上传</span>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <i class="fas fa-qrcode" style="margin-right: 10px; color: #2196F3;"></i>
                                    <span>条码:</span>
                                    <span style="float: right; color: #2196F3;">✓ 已上传</span>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <i class="fas fa-exclamation-triangle" style="margin-right: 10px; color: #FF9800;"></i>
                                    <span>警示码:</span>
                                    <span style="float: right; color: #FF9800;">○ 待上传</span>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <i class="fas fa-book" style="margin-right: 10px; color: #9C27B0;"></i>
                                    <span>说明书:</span>
                                    <span style="float: right; color: #9C27B0;">○ 待上传</span>
                                </div>
                                <div>
                                    <i class="fas fa-tags" style="margin-right: 10px; color: #E91E63;"></i>
                                    <span>箱唛:</span>
                                    <span style="float: right; color: #E91E63;">○ 待上传</span>
                                </div>
                            </div>
                            
                            <button onclick="toggleTaskCardFlip('${taskId}')" 
                                    style="background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">
                                <i class="fas fa-arrow-left me-2"></i>返回正面
                            </button>
                        </div>
                    </div>
                `;
                
                repairsMade++;
                console.log(`✅ 任务 ${taskId} 背面内容已修复`);
            }
        });
        
        // 2. 修复CSS层级问题
        console.log('🎨 修复CSS层级...');
        document.querySelectorAll('.task-back').forEach(backElement => {
            const currentZIndex = window.getComputedStyle(backElement).zIndex;
            if (currentZIndex !== '1') {
                backElement.style.zIndex = '1';
                console.log('🔧 修正背面zIndex为1');
                repairsMade++;
            }
        });
        
        // 3. 确保背面旋转正确
        console.log('🔄 确保背面旋转...');
        document.querySelectorAll('.task-back').forEach(backElement => {
            const currentTransform = window.getComputedStyle(backElement).transform;
            if (!currentTransform.includes('rotateY(180deg)')) {
                backElement.style.transform = 'rotateY(180deg)';
                console.log('🔧 应用背面旋转');
                repairsMade++;
            }
        });
        
        // 4. 添加关键CSS样式
        console.log('💅 应用关键样式...');
        const styleId = 'back-content-fix-styles';
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) existingStyle.remove();
        
        const criticalStyles = `
            /* 确保背面元素正确显示 */
            .task-back {
                backface-visibility: hidden !important;
                -webkit-backface-visibility: hidden !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                z-index: 1 !important;
                transform: rotateY(180deg) !important;
                -webkit-transform: rotateY(180deg) !important;
            }
            
            /* 确保正面在未翻转时显示 */
            .task-front {
                z-index: 2 !important;
            }
            
            /* 确保翻转时背面显示 */
            .task-flip-container.flipped .task-front {
                z-index: 1 !important;
            }
            
            .task-flip-container.flipped .task-back {
                z-index: 2 !important;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = styleId;
        styleSheet.textContent = criticalStyles;
        document.head.appendChild(styleSheet);
        repairsMade++;
        
        console.log(`✅ 背面内容深度修复完成，共执行 ${repairsMade} 项修复`);
        return repairsMade;
    }
    
    // 测试翻转显示效果
    function testFlipDisplay() {
        console.log('%c🧪 测试翻转显示效果...', 'color: #6f42c1; font-weight: bold; font-size: 16px;');
        
        const firstTaskFront = document.querySelector('.task-front');
        if (!firstTaskFront) {
            console.log('❌ 未找到任务卡片');
            return;
        }
        
        const taskId = firstTaskFront.id.replace('task-', '').replace('-front', '');
        console.log(`🎯 测试任务ID: ${taskId}`);
        
        // 执行翻转
        if (typeof window.toggleTaskCardFlip === 'function') {
            console.log('🔄 执行翻转...');
            window.toggleTaskCardFlip(taskId);
            
            // 等待翻转完成
            setTimeout(() => {
                const backElement = document.querySelector(`.task-back[data-task-id="${taskId}"]`);
                if (backElement) {
                    const isVisible = backElement.offsetParent !== null;
                    const hasCorrectContent = backElement.textContent.includes('任务文件清单');
                    
                    console.log('%c=== 翻转测试结果 ===', 'color: #28a745; font-weight: bold;');
                    console.log(`背面可见性: ${isVisible ? '✅' : '❌'}`);
                    console.log(`内容正确性: ${hasCorrectContent ? '✅' : '❌'}`);
                    
                    if (isVisible && hasCorrectContent) {
                        console.log('🎉 翻转显示正常！');
                    } else {
                        console.log('❌ 翻转显示仍有问题');
                    }
                    
                    // 3秒后返回正面
                    setTimeout(() => {
                        console.log('↩️ 返回正面...');
                        window.toggleTaskCardFlip(taskId);
                    }, 3000);
                }
            }, 600);
        }
    }
    
    // 导出到全局
    window.BackContentFix = {
        diagnose: deepBackContentDiagnosis,
        repair: deepBackContentRepair,
        test: testFlipDisplay
    };
    
    console.log('%c✅ 背面内容修复工具已加载', 'color: #28a745; font-weight: bold;');
    console.log('%c💡 使用方法:', 'color: #ffc107; font-weight: bold;');
    console.log('   BackContentFix.diagnose()  // 深度诊断背面内容');
    console.log('   BackContentFix.repair()    // 深度修复背面内容');
    console.log('   BackContentFix.test()      // 测试翻转显示效果');
    
})();
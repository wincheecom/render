// 文件预览快速修复脚本
// 在浏览器控制台中执行此脚本来快速修复文件预览问题

console.log('=== 文件预览快速修复工具 ===');

async function quickFixFilePreview() {
    console.log('开始快速修复...\n');
    
    // 步骤1: 检查基本依赖
    console.log('1. 检查基本依赖...');
    if (typeof DataManager === 'undefined' || typeof Utils === 'undefined') {
        console.error('✗ 缺少必要组件，请刷新页面');
        return false;
    }
    console.log('✓ 基本依赖正常');
    
    // 步骤2: 检查网络连接
    console.log('2. 检查网络连接...');
    try {
        const response = await fetch('/api/health');
        if (response.ok) {
            console.log('✓ 服务器连接正常');
        } else {
            console.warn('⚠ 服务器响应异常');
        }
    } catch (error) {
        console.error('✗ 无法连接到服务器');
        return false;
    }
    
    // 步骤3: 验证previewTaskFile函数
    console.log('3. 验证预览函数...');
    if (typeof previewTaskFile !== 'function') {
        console.error('✗ previewTaskFile函数不存在');
        // 尝试重新定义函数
        try {
            eval(await fetch('/index.html').then(r => r.text()).then(text => {
                const match = text.match(/async function previewTaskFile\([^}]+\{[\s\S]*?\n\}/);
                return match ? match[0] : '';
            }));
            console.log('✓ 重新定义previewTaskFile函数');
        } catch (e) {
            console.error('✗ 无法重新定义函数');
            return false;
        }
    } else {
        console.log('✓ previewTaskFile函数存在');
    }
    
    // 步骤4: 测试具体任务
    console.log('4. 测试具体任务...');
    try {
        const tasks = await DataManager.getTasks();
        if (tasks.length === 0) {
            console.log('ℹ 没有任务可供测试');
            return true;
        }
        
        // 找到第一个有文件的任务
        const taskWithFile = tasks.find(task => 
            task.bodyCodeImage || task.barcodeImage || task.warningCodeImage ||
            task.labelImage || task.manualImage || task.otherImage
        );
        
        if (taskWithFile) {
            console.log(`✓ 找到带文件的任务: ${taskWithFile.taskNumber}`);
            
            // 测试预览调用
            const fileType = taskWithFile.bodyCodeImage ? 'bodyCode' :
                           taskWithFile.barcodeImage ? 'barcode' :
                           taskWithFile.warningCodeImage ? 'warningCode' :
                           taskWithFile.labelImage ? 'label' :
                           taskWithFile.manualImage ? 'manual' : 'other';
            
            console.log(`  测试文件类型: ${fileType}`);
            
            // 直接调用预览函数进行测试
            try {
                await previewTaskFile(taskWithFile.id, fileType);
                console.log('✓ 文件预览功能正常');
                return true;
            } catch (previewError) {
                console.error('✗ 预览调用失败:', previewError.message);
                
                // 分析错误原因
                if (previewError.message.includes('任务不存在')) {
                    console.log('  建议: 检查任务ID是否正确');
                } else if (previewError.message.includes('文件未上传')) {
                    console.log('  建议: 该任务确实没有上传相应文件');
                } else if (previewError.message.includes('服务器错误')) {
                    console.log('  建议: 检查服务器日志');
                }
                return false;
            }
        } else {
            console.log('ℹ 没有找到带文件的任务进行测试');
            console.log('  建议: 上传一个文件到任务后再测试');
            return true;
        }
    } catch (error) {
        console.error('✗ 获取任务数据失败:', error);
        return false;
    }
}

// 提供用户友好的修复选项
function showRepairOptions() {
    console.log('\n=== 修复选项 ===');
    console.log('1. 全自动修复 - 运行完整诊断和修复流程');
    console.log('2. 快速检查 - 只检查基本功能');
    console.log('3. 手动测试 - 测试特定任务的预览功能');
    console.log('4. 重新加载 - 刷新页面重新初始化');
    
    // 提供便捷的调用方式
    window.filePreviewRepair = {
        quickFix: quickFixFilePreview,
        fullDiagnosis: () => {
            // 加载完整诊断工具
            fetch('/debug_file_preview.js')
                .then(r => r.text())
                .then(eval)
                .then(() => debugFilePreview.diagnose());
        },
        testTask: async (taskId, fileType = 'bodyCode') => {
            if (typeof previewTaskFile === 'function') {
                try {
                    await previewTaskFile(taskId, fileType);
                    console.log('✓ 测试成功');
                } catch (error) {
                    console.error('✗ 测试失败:', error.message);
                }
            } else {
                console.error('✗ previewTaskFile函数不可用');
            }
        },
        reload: () => {
            console.log('正在刷新页面...');
            location.reload();
        }
    };
    
    console.log('\n使用方法:');
    console.log('filePreviewRepair.quickFix()     // 快速修复');
    console.log('filePreviewRepair.fullDiagnosis() // 完整诊断');
    console.log('filePreviewRepair.testTask(任务ID, "文件类型") // 测试特定任务');
    console.log('filePreviewRepair.reload()       // 重新加载页面');
}

// 立即执行快速修复
quickFixFilePreview().then(success => {
    if (success) {
        console.log('\n🎉 快速修复完成！');
    } else {
        console.log('\n🔧 需要进一步诊断...');
    }
    showRepairOptions();
});

// 导出全局函数
window.quickFixFilePreview = quickFixFilePreview;
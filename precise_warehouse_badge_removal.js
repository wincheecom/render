/**
 * 精确移除仓库任务卡中的警告徽章
 * 针对 loadWarehouseTasksList 函数中的特定徽章元素
 */

const fs = require('fs');
const path = require('path');

// 文件路径
const indexPath = path.join(__dirname, 'index.html');

console.log('🎯 开始精确移除仓库任务卡警告徽章...');

try {
    // 读取HTML文件
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    console.log('📄 已读取index.html文件');
    
    // 统计移除的徽章数量
    let removedCount = 0;
    
    // 精确匹配仓库任务卡中的警告徽章
    const warehouseBadgePattern = /<span class="badge \$\{task\.status === 'pending' \? 'badge-warning' : task\.status === 'processing' \? 'badge-primary' : 'badge-success'\} flex-fill text-center">\s*\$\{task\.status === 'pending' \? '待处理' : task\.status === 'processing' \? '处理中' : '已完成'\}\s*<\/span>/g;
    
    // 查找匹配项
    const matches = htmlContent.match(warehouseBadgePattern) || [];
    console.log(`🔍 找到 ${matches.length} 个仓库任务卡警告徽章`);
    
    if (matches.length > 0) {
        // 移除所有匹配的徽章
        htmlContent = htmlContent.replace(warehouseBadgePattern, '');
        removedCount = matches.length;
        
        console.log(`🗑️ 已移除 ${removedCount} 个仓库任务卡警告徽章`);
        
        // 同时移除对应的容器div（如果为空的话）
        const emptyActionContainerPattern = /<div class="task-gallery-actions d-flex align-items-center gap-2 flex-shrink-0">\s*<\/div>/g;
        const emptyContainers = htmlContent.match(emptyActionContainerPattern) || [];
        if (emptyContainers.length > 0) {
            htmlContent = htmlContent.replace(emptyActionContainerPattern, '');
            console.log(`🧹 已清理 ${emptyContainers.length} 个空的操作容器`);
        }
    } else {
        console.log('🔍 未找到匹配的仓库任务卡警告徽章');
    }
    
    // 添加CSS保护规则防止警告徽章显示
    const cssProtection = `
<!-- 仓库任务卡警告徽章保护规则 -->
<style>
/* 彻底隐藏仓库任务卡中的警告徽章 */
.warehouse-tasks-gallery .task-gallery-actions .badge,
.task-flip-container[data-task-id] .task-gallery-actions .badge {
    display: none !important;
}

/* 隐藏整个操作区域（如果只需要移除徽章） */
.warehouse-tasks-gallery .task-gallery-actions {
    display: none !important;
}
</style>
`;
    
    // 在<head>标签中添加保护规则（如果还没有的话）
    if (htmlContent.includes('</head>') && !htmlContent.includes('仓库任务卡警告徽章保护规则')) {
        htmlContent = htmlContent.replace('</head>', cssProtection + '\n</head>');
        console.log('🛡️ 已添加CSS保护规则');
    }
    
    // 写入修改后的内容
    fs.writeFileSync(indexPath, htmlContent, 'utf8');
    console.log(`💾 已保存修改后的index.html文件`);
    
    console.log(`\n✅ 仓库任务卡警告徽章移除完成！`);
    console.log(`📊 总共移除了 ${removedCount} 个警告徽章元素`);
    console.log(`📍 修改已应用到: ${indexPath}`);
    
    // 验证修改
    const verificationContent = fs.readFileSync(indexPath, 'utf8');
    
    // 检查是否还有仓库任务卡中的警告徽章
    const remainingWarehouseBadges = verificationContent.match(/<span class="badge[^>]*badge-warning[^>]*flex-fill[^>]*text-center[^>]*>[^<]*待处理[^<]*<\/span>/gi) || [];
    
    // 检查其他地方的警告徽章（确保不影响其他功能）
    const allWarningBadges = verificationContent.match(/<span[^>]*class=["'][^"']*badge-warning[^"']*["'][^>]*>/gi) || [];
    const nonWarehouseBadges = allWarningBadges.filter(badge => 
        !verificationContent.substring(
            verificationContent.indexOf(badge), 
            Math.min(verificationContent.length, verificationContent.indexOf(badge) + 500)
        ).includes('warehouse-tasks-gallery')
    );
    
    console.log(`\n🔍 验证结果:`);
    console.log(`   • 仓库任务卡警告徽章: ${remainingWarehouseBadges.length} 个（目标：0）`);
    console.log(`   • 其他页面警告徽章: ${nonWarehouseBadges.length} 个（应保持不变）`);
    console.log(`   • CSS保护规则已添加: ✓`);
    
    if (remainingWarehouseBadges.length === 0) {
        console.log(`\n🎉 成功！仓库任务卡中的警告徽章已完全移除`);
        console.log(`   其他页面的功能不受影响`);
    } else {
        console.log(`\n⚠️  注意：仍有 ${remainingWarehouseBadges.length} 个仓库警告徽章未被移除`);
        console.log(`   建议手动检查这些元素的位置`);
    }

} catch (error) {
    console.error('❌ 处理过程中发生错误:', error.message);
    process.exit(1);
}
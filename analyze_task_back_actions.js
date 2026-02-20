// 分析 .task-back-actions 元素的诊断脚本
console.log('🔍 开始分析 .task-back-actions 元素...');

// 查找所有的 .task-back-actions 元素
const actionsElements = document.querySelectorAll('.task-back-actions');
console.log(`🎯 找到 ${actionsElements.length} 个 .task-back-actions 元素`);

actionsElements.forEach((element, index) => {
    console.log(`\n=== 元素 ${index + 1} ===`);
    
    // 基本信息
    console.log('📋 基本信息:');
    console.log(`  标签名: ${element.tagName}`);
    console.log(`  类名: ${element.className}`);
    console.log(`  ID: ${element.id || '无'}`);
    console.log(`  父元素: ${element.parentElement?.className || '未知'}`);
    
    // 计算样式
    const computedStyle = window.getComputedStyle(element);
    console.log('\n🎨 计算样式:');
    console.log(`  position: ${computedStyle.position}`);
    console.log(`  z-index: ${computedStyle.zIndex}`);
    console.log(`  display: ${computedStyle.display}`);
    console.log(`  flex-direction: ${computedStyle.flexDirection}`);
    console.log(`  background-color: ${computedStyle.backgroundColor}`);
    console.log(`  width: ${computedStyle.width}`);
    console.log(`  height: ${computedStyle.height}`);
    console.log(`  margin-top: ${computedStyle.marginTop}`);
    console.log(`  margin-bottom: ${computedStyle.marginBottom}`);
    console.log(`  padding-top: ${computedStyle.paddingTop}`);
    console.log(`  padding-bottom: ${computedStyle.paddingBottom}`);
    
    // 位置信息
    const rect = element.getBoundingClientRect();
    console.log('\n📍 位置信息:');
    console.log(`  top: ${rect.top}px`);
    console.log(`  left: ${rect.left}px`);
    console.log(`  width: ${rect.width}px`);
    console.log(`  height: ${rect.height}px`);
    
    // 层级关系
    console.log('\n🏗️ 层级关系:');
    let parent = element.parentElement;
    let level = 0;
    while (parent && level < 5) {
        const parentStyle = window.getComputedStyle(parent);
        console.log(`  Level ${level}: ${parent.className || parent.tagName} - position: ${parentStyle.position}, z-index: ${parentStyle.zIndex}`);
        parent = parent.parentElement;
        level++;
    }
});

// 检查相关的CSS规则
console.log('\n📚 相关CSS规则:');
const relevantSelectors = [
    '.task-back-actions',
    '.published-tasks-gallery .task-back-actions',
    '#warehouseTasks .task-back-actions',
    '.task-back .task-back-actions'
];

relevantSelectors.forEach(selector => {
    try {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            console.log(`  ${selector}: 匹配 ${elements.length} 个元素`);
        }
    } catch (e) {
        console.log(`  ${selector}: 选择器无效`);
    }
});

// 检查可能的遮挡元素
console.log('\n🚫 检查可能的遮挡情况:');
const task97Back = document.querySelector('#task-97-front')?.closest('.task-flip-container')?.querySelector('.task-back');
if (task97Back) {
    const backRect = task97Back.getBoundingClientRect();
    console.log(`任务97背面位置: top=${backRect.top}, left=${backRect.left}, width=${backRect.width}, height=${backRect.height}`);
    
    // 检查actions元素是否在背面区域内
    actionsElements.forEach((actionsEl, index) => {
        const actionsRect = actionsEl.getBoundingClientRect();
        const isOverlapping = !(actionsRect.right < backRect.left || 
                               actionsRect.left > backRect.right || 
                               actionsRect.bottom < backRect.top || 
                               actionsRect.top > backRect.bottom);
        
        console.log(`元素 ${index + 1} 是否重叠: ${isOverlapping ? '是' : '否'}`);
        if (isOverlapping) {
            console.log(`  Actions位置: top=${actionsRect.top}, height=${actionsRect.height}`);
        }
    });
}

console.log('\n✅ 分析完成');
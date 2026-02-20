/**
 * 移除仓库布局验证结果显示框
 * 直接在浏览器控制台执行此脚本
 */

(function() {
    'use strict';
    
    // 移除验证结果显示框
    const verificationBox = document.getElementById('warehouse-layout-verification-result');
    if (verificationBox) {
        verificationBox.remove();
        console.log('✅ 已移除仓库布局验证结果显示框');
    } else {
        console.log('ℹ️ 未找到验证结果显示框');
    }
    
    // 移除可能的验证脚本相关事件监听器
    document.removeEventListener('DOMContentLoaded', window.runVerification);
    if (window.runVerification) {
        delete window.runVerification;
    }
    
    console.log('✅ 仓库布局验证相关清理完成');
})();
/**
 * 临时禁用仓库任务错误提示脚本
 * 用于屏蔽重复的容器缺失错误提示
 */

(function() {
    'use strict';
    
    console.log('🔇 启动错误提示屏蔽系统...');
    
    // 保存原始的showAlert函数
    const originalShowAlert = window.Utils?.showAlert;
    
    // 需要屏蔽的错误消息列表
    const blockedMessages = [
        '仓库任务显示异常，请刷新页面重试',
        '仓库任务显示异常，请刷新页面',
        '稳定性修复启动失败'
    ];
    
    // 等待Utils对象加载完成
    function waitForUtils(callback, maxAttempts = 50) {
        let attempts = 0;
        
        function checkUtils() {
            attempts++;
            
            // 检查多种可能的Utils对象
            const utilsCandidates = [
                window.Utils,
                window.utils,
                window.AppUtils, 
                window.ApplicationUtils,
                window.globalUtils,
                window.utilities
            ];
            
            // 寻找有效的Utils对象
            let foundUtils = null;
            for (const candidate of utilsCandidates) {
                if (candidate && typeof candidate.showAlert === 'function') {
                    foundUtils = candidate;
                    break;
                }
            }
            
            if (foundUtils) {
                console.log('✅ Utils对象已加载，激活屏蔽系统');
                // 确保全局引用一致
                window.Utils = foundUtils;
                callback();
                return;
            }
            
            // 检查是否超时
            if (attempts >= maxAttempts) {
                console.info('ℹ️ Utils对象未找到，使用备用方案');
                // 创建基础的Utils对象以避免错误
                if (!window.Utils) {
                    window.Utils = {
                        showAlert: function(message, type) {
                            // 基础实现，避免错误
                            if (type === 'error') {
                                console.error('Error:', message);
                            } else {
                                console.log(type + ':', message);
                            }
                        }
                    };
                }
                callback();
                return;
            }
            
            // 继续等待
            setTimeout(checkUtils, 200);
        }
        
        checkUtils();
    }
    
    // 激活屏蔽系统
    function activateSuppression() {
        // 保存原始的showAlert函数
        const originalShowAlert = window.Utils.showAlert;
        
        // 重写showAlert函数
        window.Utils.showAlert = function(message, type, callback) {
            // 检查是否是需要屏蔽的消息
            if (type === 'error' && blockedMessages.some(blockedMsg => 
                message.includes(blockedMsg) || blockedMsg.includes(message)
            )) {
                console.log('🔇 屏蔽错误提示:', message);
                return; // 直接返回，不显示提示
            }
            
            // 其他消息正常显示
            return originalShowAlert.call(this, message, type, callback);
        };
        
        console.log('✅ 错误提示屏蔽系统已激活');
        
        // 同时屏蔽alertify的直接调用
        const originalAlertifyError = window.alertify?.error;
        if (originalAlertifyError) {
            window.alertify.error = function(message, wait) {
                if (blockedMessages.some(blockedMsg => 
                    message.includes(blockedMsg) || blockedMsg.includes(message)
                )) {
                    console.log('🔇 屏蔽alertify错误:', message);
                    return this; // 返回alertify对象以保持链式调用
                }
                return originalAlertifyError.call(this, message, wait);
            };
            console.log('✅ alertify错误屏蔽已激活');
        }
    }
    
    // 启动系统
    waitForUtils(activateSuppression);
    
    // 监控并移除已存在的错误提示
    function removeExistingErrors() {
        const errorMessages = document.querySelectorAll('.ajs-message.ajs-error.ajs-visible');
        errorMessages.forEach(msg => {
            const text = msg.textContent || msg.innerText;
            if (blockedMessages.some(blockedMsg => text.includes(blockedMsg))) {
                console.log('🧹 移除现有错误提示:', text.trim());
                msg.remove();
            }
        });
    }
    
    // 立即执行一次清理
    setTimeout(removeExistingErrors, 100);
    
    // 定期清理（每2秒检查一次）
    setInterval(removeExistingErrors, 2000);
    
    console.log('✅ 错误提示屏蔽系统启动完成');
    
})();
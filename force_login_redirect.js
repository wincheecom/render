/**
 * 强制登录跳转修复脚本
 * 直接解决"卡在登录页面无法进入系统"的问题
 */

(function() {
    console.log('🚀 执行强制登录跳转修复...');
    
    // 1. 直接强制跳转函数
    function forceSystemRedirect() {
        console.log('🚪 执行强制系统跳转...');
        
        try {
            // 检查用户登录状态
            const userStr = localStorage.getItem('funseek_user');
            const token = localStorage.getItem('funseek_token');
            const isLoggedIn = !!(userStr && token);
            
            console.log('登录状态检查:', isLoggedIn ? '已登录' : '未登录');
            
            if (isLoggedIn) {
                // 强制隐藏登录页面
                const loginPage = document.getElementById('loginPage');
                if (loginPage) {
                    loginPage.style.display = 'none';
                    loginPage.style.visibility = 'hidden';
                    console.log('✅ 登录页面已强制隐藏');
                }
                
                // 强制显示主系统
                const mainSystem = document.getElementById('mainSystem');
                if (mainSystem) {
                    mainSystem.style.display = 'block';
                    mainSystem.style.visibility = 'visible';
                    console.log('✅ 主系统已强制显示');
                }
                
                // 强制显示总览页面
                const dashboard = document.getElementById('dashboard');
                if (dashboard) {
                    // 隐藏所有其他模块
                    document.querySelectorAll('.module-content').forEach(module => {
                        module.style.display = 'none';
                        module.classList.remove('active');
                    });
                    
                    // 显示总览模块
                    dashboard.style.display = 'block';
                    dashboard.classList.add('active');
                    console.log('✅ 总览页面已强制显示');
                }
                
                // 设置用户信息显示
                try {
                    const user = JSON.parse(userStr);
                    const currentUserEl = document.getElementById('currentUser');
                    const currentRoleEl = document.getElementById('currentRole');
                    
                    if (currentUserEl) {
                        currentUserEl.textContent = user.name;
                        currentUserEl.style.display = 'inline';
                    }
                    if (currentRoleEl) {
                        currentRoleEl.textContent = user.role;
                        currentRoleEl.style.display = 'inline';
                    }
                    console.log('✅ 用户信息已设置显示');
                } catch (e) {
                    console.warn('用户信息设置警告:', e);
                }
                
                console.log('🎉 强制跳转完成！');
                return true;
            } else {
                console.log('ℹ️ 未检测到登录状态，保持登录页面');
                return false;
            }
            
        } catch (error) {
            console.error('❌ 强制跳转执行失败:', error);
            return false;
        }
    }
    
    // 2. 创建紧急跳转按钮（如果需要的话）
    function createEmergencyButton() {
        // 检查是否已经有按钮
        if (document.getElementById('emergency-redirect-btn')) {
            return;
        }
        
        const button = document.createElement('button');
        button.id = 'emergency-redirect-btn';
        button.textContent = '🚀 紧急进入系统';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 999999;
            background: #ff4757;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        button.onclick = function() {
            console.log('🚨 用户点击紧急跳转按钮');
            forceSystemRedirect();
            // 隐藏按钮
            button.style.display = 'none';
        };
        
        document.body.appendChild(button);
        console.log('✅ 紧急跳转按钮已创建');
    }
    
    // 3. 自动执行跳转
    function autoExecuteRedirect() {
        console.log('⏱️ 开始自动跳转执行...');
        
        // 立即执行一次
        const success = forceSystemRedirect();
        
        if (!success) {
            // 如果没有登录，创建紧急按钮
            console.log('⚠️ 未登录，创建紧急按钮');
            createEmergencyButton();
            
            // 定期检查登录状态
            const checkInterval = setInterval(() => {
                const userStr = localStorage.getItem('funseek_user');
                const token = localStorage.getItem('funseek_token');
                
                if (userStr && token) {
                    console.log('✅ 检测到登录状态，执行跳转');
                    forceSystemRedirect();
                    // 移除紧急按钮
                    const btn = document.getElementById('emergency-redirect-btn');
                    if (btn) btn.style.display = 'none';
                    clearInterval(checkInterval);
                }
            }, 1000);
            
            // 30秒后停止检查
            setTimeout(() => {
                clearInterval(checkInterval);
                console.log('⏱️ 自动检查已停止');
            }, 30000);
        }
    }
    
    // 4. DOM加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoExecuteRedirect);
    } else {
        autoExecuteRedirect();
    }
    
    // 5. 提供全局访问接口
    window.forceLoginRedirect = {
        execute: forceSystemRedirect,
        createButton: createEmergencyButton,
        autoExecute: autoExecuteRedirect
    };
    
    console.log('🔧 强制登录跳转工具已就绪');
    console.log('使用方法:');
    console.log('  window.forceLoginRedirect.execute()  // 立即执行跳转');
    console.log('  window.forceLoginRedirect.createButton()  // 创建紧急按钮');
    
})();
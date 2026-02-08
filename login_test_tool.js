// 登录功能测试工具
// 在浏览器控制台中执行此脚本来测试登录功能

console.log('=== 登录功能测试工具 ===');

// 测试配置
const API_BASE = 'http://localhost:3000';
const TEST_USERS = [
    { email: 'test@admin.com', password: 'admin123', name: '测试管理员', role: 'sales' },
    { email: 'warehouse@test.com', password: 'warehouse123', name: '仓库管理员', role: 'warehouse' }
];

// 1. 测试API连接
async function testAPIConnection() {
    console.log('\n1. 测试API连接...');
    
    try {
        const response = await fetch(`${API_BASE}/api/tasks`);
        console.log(`  HTTP状态码: ${response.status}`);
        
        if (response.ok) {
            console.log('  ✓ API连接正常');
            return true;
        } else {
            console.log('  ✗ API连接异常');
            return false;
        }
    } catch (error) {
        console.error('  ✗ API连接失败:', error.message);
        return false;
    }
}

// 2. 注册测试用户
async function registerTestUsers() {
    console.log('\n2. 注册测试用户...');
    
    const results = [];
    
    for (const user of TEST_USERS) {
        try {
            console.log(`  注册用户: ${user.email}`);
            
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                    name: user.name,
                    role: user.role
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                console.log(`  ✓ 用户注册成功: ${user.email}`);
                results.push({ ...user, token: data.token, registered: true });
            } else {
                console.log(`  ℹ 用户可能已存在: ${user.email} (${data.error})`);
                results.push({ ...user, registered: false, error: data.error });
            }
        } catch (error) {
            console.error(`  ✗ 注册失败 ${user.email}:`, error.message);
            results.push({ ...user, registered: false, error: error.message });
        }
    }
    
    return results;
}

// 3. 测试登录功能
async function testLogin(users) {
    console.log('\n3. 测试登录功能...');
    
    const results = [];
    
    for (const user of users) {
        try {
            console.log(`  测试登录: ${user.email}`);
            
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                console.log(`  ✓ 登录成功: ${user.email}`);
                console.log(`    Token: ${data.token.substring(0, 30)}...`);
                console.log(`    用户角色: ${data.user.role}`);
                results.push({ ...user, loginSuccess: true, token: data.token, userData: data.user });
            } else {
                console.log(`  ✗ 登录失败: ${user.email} (${data.error})`);
                results.push({ ...user, loginSuccess: false, error: data.error });
            }
        } catch (error) {
            console.error(`  ✗ 登录异常 ${user.email}:`, error.message);
            results.push({ ...user, loginSuccess: false, error: error.message });
        }
    }
    
    return results;
}

// 4. 测试受保护的API访问
async function testProtectedAPI(token) {
    console.log('\n4. 测试受保护的API访问...');
    
    try {
        console.log('  测试获取任务列表...');
        
        const response = await fetch(`${API_BASE}/api/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log(`  HTTP状态码: ${response.status}`);
        
        if (response.ok) {
            const tasks = await response.json();
            console.log(`  ✓ 成功获取 ${tasks.length} 个任务`);
            return true;
        } else {
            const error = await response.json();
            console.log(`  ✗ 访问失败: ${error.error || '未知错误'}`);
            return false;
        }
    } catch (error) {
        console.error('  ✗ API访问异常:', error.message);
        return false;
    }
}

// 5. 测试错误情况
async function testErrorCases() {
    console.log('\n5. 测试错误情况...');
    
    const errorTests = [
        {
            name: '错误邮箱',
            data: { email: 'wrong@email.com', password: 'admin123' }
        },
        {
            name: '错误密码',
            data: { email: 'test@admin.com', password: 'wrongpassword' }
        },
        {
            name: '缺少邮箱',
            data: { password: 'admin123' }
        },
        {
            name: '缺少密码',
            data: { email: 'test@admin.com' }
        }
    ];
    
    for (const test of errorTests) {
        try {
            console.log(`  测试: ${test.name}`);
            
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(test.data)
            });
            
            const data = await response.json();
            
            if (response.status === 400 || response.status === 401) {
                console.log(`  ✓ 正确返回错误: ${data.error}`);
            } else {
                console.log(`  ✗ 未正确处理错误`);
            }
        } catch (error) {
            console.error(`  ✗ 测试异常:`, error.message);
        }
    }
}

// 主测试函数
async function runFullLoginTest() {
    console.log('开始完整的登录功能测试...\n');
    
    // 步骤1: 测试API连接
    const apiConnected = await testAPIConnection();
    if (!apiConnected) {
        console.log('\n✗ API连接失败，终止测试');
        return;
    }
    
    // 步骤2: 注册测试用户
    const registeredUsers = await registerTestUsers();
    
    // 步骤3: 测试登录
    const loginResults = await testLogin(registeredUsers);
    
    // 步骤4: 测试受保护的API
    const successfulLogins = loginResults.filter(u => u.loginSuccess);
    if (successfulLogins.length > 0) {
        await testProtectedAPI(successfulLogins[0].token);
    }
    
    // 步骤5: 测试错误情况
    await testErrorCases();
    
    // 输出总结
    console.log('\n=== 测试总结 ===');
    console.log(`总用户数: ${registeredUsers.length}`);
    console.log(`登录成功: ${loginResults.filter(u => u.loginSuccess).length}`);
    console.log(`登录失败: ${loginResults.filter(u => !u.loginSuccess).length}`);
    
    if (successfulLogins.length > 0) {
        console.log('\n✓ 登录功能正常工作');
        console.log('\n可用于登录的测试账户:');
        successfulLogins.forEach(user => {
            console.log(`  邮箱: ${user.email}`);
            console.log(`  密码: ${user.password}`);
            console.log(`  角色: ${user.userData.role}`);
            console.log('');
        });
    } else {
        console.log('\n✗ 登录功能存在问题');
    }
}

// 提供便捷的测试函数
window.loginTest = {
    run: runFullLoginTest,
    testConnection: testAPIConnection,
    registerUsers: registerTestUsers,
    testLogin: testLogin,
    testProtectedAPI: testProtectedAPI,
    testErrors: testErrorCases
};

// 立即运行测试
runFullLoginTest();

console.log('\n提示: 可以随时调用 loginTest.run() 重新运行完整测试');
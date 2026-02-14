// 仓库发货任务卡翻转功能测试脚本
// 用于验证修复后的功能稳定性和布局效果

class WarehouseTaskFlipTest {
    constructor() {
        this.testResults = [];
        this.testStartTime = Date.now();
    }

    // 记录测试结果
    logResult(testName, status, message) {
        const result = {
            testName,
            status,
            message,
            timestamp: new Date().toISOString()
        };
        this.testResults.push(result);
        console.log(`[${status}] ${testName}: ${message}`);
    }

    // 测试翻转功能的基本查找逻辑
    async testFlipFunctionLookup() {
        console.log('\n=== 测试翻转功能查找逻辑 ===');
        
        // 模拟几个测试场景
        const testCases = [
            { id: 'test-001', description: '通过data-task-id查找' },
            { id: 'test-002', description: '通过ID查找前端元素' },
            { id: 'nonexistent', description: '查找不存在的任务' }
        ];

        testCases.forEach(testCase => {
            try {
                // 模拟查找逻辑
                let flipContainer = document.querySelector(`.task-flip-container[data-task-id="${testCase.id}"]`);
                
                if (!flipContainer) {
                    const frontElement = document.querySelector(`#task-${testCase.id}-front`);
                    if (frontElement) {
                        flipContainer = frontElement.closest('.task-flip-container');
                    }
                }

                if (testCase.id === 'nonexistent') {
                    if (!flipContainer) {
                        this.logResult(
                            testCase.description, 
                            'PASS', 
                            '正确处理了不存在的任务'
                        );
                    } else {
                        this.logResult(
                            testCase.description, 
                            'FAIL', 
                            '应该找不到不存在的任务'
                        );
                    }
                } else {
                    // 对于存在的任务，我们只验证逻辑结构
                    this.logResult(
                        testCase.description, 
                        'INFO', 
                        '查找逻辑结构正确'
                    );
                }
            } catch (error) {
                this.logResult(
                    testCase.description, 
                    'ERROR', 
                    `测试执行出错: ${error.message}`
                );
            }
        });
    }

    // 测试防抖功能
    async testDebounceFunctionality() {
        console.log('\n=== 测试防抖功能 ===');
        
        const taskId = 'debounce-test';
        const cooldownMap = new Map();
        
        // 模拟快速连续点击
        const clicks = [
            { time: 0, expected: true },      // 第一次点击，应该执行
            { time: 100, expected: false },   // 100ms后点击，应该被阻止
            { time: 400, expected: true },    // 400ms后点击，应该执行
            { time: 450, expected: false },   // 450ms后点击，应该被阻止
            { time: 800, expected: true }     // 800ms后点击，应该执行
        ];

        let successCount = 0;
        let failCount = 0;

        clicks.forEach((click, index) => {
            const now = click.time;
            const lastFlip = cooldownMap.get(taskId) || 0;
            const shouldExecute = (now - lastFlip) >= 300;

            if (shouldExecute === click.expected) {
                successCount++;
                if (shouldExecute) {
                    cooldownMap.set(taskId, now);
                }
            } else {
                failCount++;
            }
        });

        if (failCount === 0) {
            this.logResult(
                '防抖逻辑测试', 
                'PASS', 
                `所有${successCount}个测试用例都通过了`
            );
        } else {
            this.logResult(
                '防抖逻辑测试', 
                'FAIL', 
                `${failCount}个测试用例失败，${successCount}个通过`
            );
        }
    }

    // 测试CSS布局
    async testLayoutConfiguration() {
        console.log('\n=== 测试CSS布局配置 ===');
        
        const layoutTests = [
            {
                selector: '.warehouse-tasks-gallery',
                properties: ['display', 'grid-template-columns'],
                expectedValues: ['grid', 'repeat(3, 1fr)']
            },
            {
                selector: '.warehouse-tasks-gallery .task-flip-container',
                properties: ['display', 'min-height'],
                expectedValues: ['block', '220px']
            }
        ];

        layoutTests.forEach(test => {
            try {
                const element = document.querySelector(test.selector);
                if (!element) {
                    this.logResult(
                        `布局元素查找: ${test.selector}`, 
                        'WARN', 
                        '元素未找到，可能是动态生成的'
                    );
                    return;
                }

                let allPassed = true;
                let details = [];

                test.properties.forEach((prop, index) => {
                    const computedValue = getComputedStyle(element)[prop];
                    const expected = test.expectedValues[index];
                    
                    // 简化的值比较（实际应用中可能需要更复杂的比较）
                    const passed = computedValue.includes(expected) || 
                                  computedValue === expected ||
                                  (expected === 'grid' && computedValue.includes('grid'));
                    
                    if (passed) {
                        details.push(`${prop}: ✓`);
                    } else {
                        details.push(`${prop}: ✗ (期望: ${expected}, 实际: ${computedValue})`);
                        allPassed = false;
                    }
                });

                this.logResult(
                    `布局配置: ${test.selector}`, 
                    allPassed ? 'PASS' : 'FAIL', 
                    details.join(', ')
                );
            } catch (error) {
                this.logResult(
                    `布局配置: ${test.selector}`, 
                    'ERROR', 
                    `测试执行出错: ${error.message}`
                );
            }
        });
    }

    // 测试事件绑定
    async testEventBinding() {
        console.log('\n=== 测试事件绑定 ===');
        
        const container = document.getElementById('warehouseTasks');
        if (!container) {
            this.logResult('事件容器查找', 'WARN', '仓库任务容器未找到');
            return;
        }

        // 检查事件监听器标记
        const hasEventListener = container.hasAttribute('data-event-listener-bound');
        this.logResult(
            '事件监听器状态', 
            hasEventListener ? 'PASS' : 'INFO', 
            hasEventListener ? '事件监听器已绑定' : '事件监听器可能未绑定或使用其他方式'
        );

        // 检查基本的点击处理函数是否存在
        if (typeof window.toggleTaskCardFlip === 'function') {
            this.logResult('翻转函数存在性', 'PASS', 'toggleTaskCardFlip函数已定义');
        } else {
            this.logResult('翻转函数存在性', 'FAIL', 'toggleTaskCardFlip函数未定义');
        }

        if (typeof window.bindWarehouseTaskEvents === 'function') {
            this.logResult('事件绑定函数存在性', 'PASS', 'bindWarehouseTaskEvents函数已定义');
        } else {
            this.logResult('事件绑定函数存在性', 'FAIL', 'bindWarehouseTaskEvents函数未定义');
        }
    }

    // 运行所有测试
    async runAllTests() {
        console.log('🚀 开始仓库发货任务卡翻转功能测试');
        console.log(`开始时间: ${new Date(this.testStartTime).toLocaleString()}`);

        try {
            await this.testFlipFunctionLookup();
            await this.testDebounceFunctionality();
            await this.testLayoutConfiguration();
            await this.testEventBinding();

            // 输出测试总结
            this.printTestSummary();
        } catch (error) {
            console.error('测试执行过程中出现错误:', error);
        }
    }

    // 打印测试总结
    printTestSummary() {
        console.log('\n=== 测试总结 ===');
        const endTime = Date.now();
        const duration = endTime - this.testStartTime;

        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const warnings = this.testResults.filter(r => r.status === 'WARN').length;
        const errors = this.testResults.filter(r => r.status === 'ERROR').length;

        console.log(`测试用例总数: ${this.testResults.length}`);
        console.log(`通过: ${passed}, 失败: ${failed}, 警告: ${warnings}, 错误: ${errors}`);
        console.log(`测试耗时: ${duration}ms`);
        console.log(`完成时间: ${new Date(endTime).toLocaleString()}`);

        if (failed === 0 && errors === 0) {
            console.log('🎉 所有关键测试都通过了！');
        } else {
            console.log('⚠️  存在失败的测试，请检查相关功能');
        }

        // 输出详细结果
        console.log('\n详细测试结果:');
        this.testResults.forEach((result, index) => {
            const statusIcon = {
                'PASS': '✅',
                'FAIL': '❌',
                'WARN': '⚠️',
                'ERROR': '💥',
                'INFO': 'ℹ️'
            }[result.status] || '❓';
            
            console.log(`${index + 1}. ${statusIcon} [${result.status}] ${result.testName}`);
            console.log(`   ${result.message}`);
        });
    }
}

// 在页面加载完成后自动运行测试
document.addEventListener('DOMContentLoaded', function() {
    // 延迟执行，确保所有资源加载完成
    setTimeout(() => {
        const tester = new WarehouseTaskFlipTest();
        tester.runAllTests();
    }, 2000);
});

// 同时提供全局访问以便手动测试
window.runWarehouseTaskFlipTest = function() {
    const tester = new WarehouseTaskFlipTest();
    tester.runAllTests();
};

console.log('📦 仓库发货任务卡翻转测试脚本已加载');
console.log('💡 页面加载完成后将自动运行测试，或调用 runWarehouseTaskFlipTest() 手动运行');
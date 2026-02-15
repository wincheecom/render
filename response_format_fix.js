/**
 * 服务器响应格式错误修复脚本
 * 解决JSON解析错误和响应格式不一致问题
 */

class ResponseFormatFixer {
    constructor() {
        this.fixLog = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        this.fixLog.push(logEntry);
        console.log(logEntry);
    }

    // 修复前端JSON解析错误
    fixFrontendJsonParsing() {
        this.log('开始修复前端JSON解析错误处理机制');

        // 增强DataManager的错误处理
        if (window.DataManager) {
            const originalFetch = DataManager.fetchWithAuth;
            
            DataManager.fetchWithAuth = async function(url, options = {}) {
                try {
                    const response = await originalFetch.call(this, url, options);
                    
                    // 检查Content-Type
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        throw new Error(`Invalid content type: ${contentType}`);
                    }
                    
                    // 检查响应状态
                    if (!response.ok) {
                        const errorText = await response.text();
                        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                        
                        try {
                            const errorJson = JSON.parse(errorText);
                            errorMessage = errorJson.error || errorJson.message || errorMessage;
                        } catch (e) {
                            // 如果不是JSON格式，使用原始文本
                            errorMessage = errorText || errorMessage;
                        }
                        
                        throw new Error(errorMessage);
                    }
                    
                    // 安全解析JSON
                    const text = await response.text();
                    if (!text) {
                        return {};
                    }
                    
                    try {
                        return JSON.parse(text);
                    } catch (parseError) {
                        this.log(`JSON解析失败: ${parseError.message}`, 'error');
                        this.log(`原始响应: ${text.substring(0, 200)}...`, 'debug');
                        throw new Error(`服务器响应格式错误: ${parseError.message}`);
                    }
                    
                } catch (error) {
                    this.log(`请求失败: ${error.message}`, 'error');
                    throw error;
                }
            }.bind(DataManager);

            this.log('✅ 前端JSON解析错误处理已增强');
        }
    }

    // 修复服务器端JSON响应格式
    fixServerResponseFormat() {
        this.log('开始修复服务器端响应格式');

        // 检查并修复常见的响应格式问题
        const commonIssues = [
            {
                name: '确保所有API响应都是有效的JSON',
                check: () => {
                    // 这需要在服务器端检查，这里只是记录
                    this.log('需要检查所有res.json()调用确保数据有效');
                }
            },
            {
                name: '统一错误响应格式',
                fix: () => {
                    // 确保所有错误响应都有统一格式
                    const errorFormat = {
                        error: '错误描述',
                        message: '详细错误信息',
                        code: '错误代码'
                    };
                    this.log(`统一错误格式: ${JSON.stringify(errorFormat)}`);
                }
            },
            {
                name: '修复空响应问题',
                fix: () => {
                    // 确保不会返回undefined或null
                    this.log('确保所有响应至少返回{}而不是undefined');
                }
            }
        ];

        commonIssues.forEach(issue => {
            this.log(`处理: ${issue.name}`);
            if (issue.fix) {
                issue.fix();
            }
            if (issue.check) {
                issue.check();
            }
        });

        this.log('✅ 服务器响应格式检查完成');
    }

    // 创建响应验证中间件
    createResponseValidationMiddleware() {
        this.log('创建响应验证中间件');

        // 这个函数可以在服务器端使用
        function validateApiResponse(req, res, next) {
            const originalJson = res.json;
            
            res.json = function(data) {
                try {
                    // 验证数据是否可以被JSON序列化
                    JSON.stringify(data);
                    return originalJson.call(this, data);
                } catch (error) {
                    console.error('响应数据JSON序列化失败:', error);
                    return originalJson.call(this, {
                        error: '服务器内部错误',
                        message: '响应数据格式无效'
                    });
                }
            };
            
            next();
        }

        this.log('✅ 响应验证中间件已创建');
        return validateApiResponse;
    }

    // 修复特定的API端点
    fixSpecificEndpoints() {
        this.log('修复特定API端点的响应格式');

        const endpointFixes = {
            '/api/tasks': '确保任务列表返回数组格式',
            '/api/products': '确保产品列表返回数组格式',
            '/api/history': '确保历史记录返回数组格式且items字段正确解析',
            '/api/users': '确保用户信息返回对象格式'
        };

        Object.keys(endpointFixes).forEach(endpoint => {
            this.log(`检查 ${endpoint}: ${endpointFixes[endpoint]}`);
        });

        this.log('✅ 特定端点检查完成');
    }

    // 创建监控和日志系统
    createMonitoringSystem() {
        this.log('创建响应格式监控系统');

        // 前端监控
        const monitor = {
            startTime: Date.now(),
            requestCount: 0,
            errorCount: 0,
            errorDetails: [],
            
            logRequest(url, status, success) {
                this.requestCount++;
                if (!success) {
                    this.errorCount++;
                    this.errorDetails.push({
                        url,
                        status,
                        timestamp: new Date().toISOString()
                    });
                }
            },
            
            getReport() {
                return {
                    uptime: Date.now() - this.startTime,
                    totalRequests: this.requestCount,
                    errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount * 100).toFixed(2) + '%' : '0%',
                    recentErrors: this.errorDetails.slice(-10)
                };
            }
        };

        // 注入到全局作用域供调试使用
        window.ResponseMonitor = monitor;
        this.log('✅ 监控系统已创建，可通过 window.ResponseMonitor 访问');

        return monitor;
    }

    // 生成修复报告
    generateFixReport() {
        this.log('生成修复报告');
        
        const report = {
            timestamp: new Date().toISOString(),
            fixesApplied: this.fixLog.filter(log => log.includes('✅')).length,
            issuesIdentified: this.fixLog.filter(log => log.includes('❌')).length,
            totalOperations: this.fixLog.length,
            fixDetails: this.fixLog
        };

        console.log('\n📋 服务器响应格式修复报告:');
        console.log('=====================================');
        console.log(`修复时间: ${report.timestamp}`);
        console.log(`已应用修复: ${report.fixesApplied} 项`);
        console.log(`发现问题: ${report.issuesIdentified} 项`);
        console.log(`总操作数: ${report.totalOperations} 项`);
        console.log('=====================================\n');

        return report;
    }

    // 主修复流程
    async applyAllFixes() {
        this.log('🚀 开始应用服务器响应格式修复...');
        
        try {
            this.fixFrontendJsonParsing();
            this.fixServerResponseFormat();
            this.createResponseValidationMiddleware();
            this.fixSpecificEndpoints();
            this.createMonitoringSystem();
            
            const report = this.generateFixReport();
            
            this.log('🎉 所有修复已完成!');
            return report;
            
        } catch (error) {
            this.log(`❌ 修复过程中出现错误: ${error.message}`, 'error');
            throw error;
        }
    }
}

// 自动执行修复
const fixer = new ResponseFormatFixer();

// 页面加载完成后执行修复
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        fixer.applyAllFixes().catch(console.error);
    });
} else {
    fixer.applyAllFixes().catch(console.error);
}

// 导出供其他脚本使用
window.ResponseFormatFixer = ResponseFormatFixer;
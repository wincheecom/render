/**
 * 服务器响应格式错误修复验证脚本
 * 测试修复后的系统是否正常工作
 */

const http = require('http');

class ResponseFormatTester {
    constructor() {
        this.baseUrl = 'http://localhost:3002';
        this.testResults = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
    }

    // 发送HTTP请求的通用方法
    async makeRequest(path, options = {}) {
        return new Promise((resolve, reject) => {
            const url = new URL(path, this.baseUrl);
            const requestOptions = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };

            const req = http.request(requestOptions, (res) => {
                let data = '';
                
                res.on('data', chunk => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        // 尝试解析JSON
                        let jsonData = null;
                        let isJson = false;
                        
                        if (data.trim()) {
                            try {
                                jsonData = JSON.parse(data);
                                isJson = true;
                            } catch (parseError) {
                                // 不是有效的JSON
                                isJson = false;
                            }
                        }
                        
                        resolve({
                            statusCode: res.statusCode,
                            headers: res.headers,
                            data: data,
                            jsonData: jsonData,
                            isJson: isJson,
                            contentType: res.headers['content-type']
                        });
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (options.body) {
                req.write(JSON.stringify(options.body));
            }

            req.end();
        });
    }

    // 测试基本连接
    async testBasicConnection() {
        this.log('测试基本服务器连接...');
        
        try {
            const response = await this.makeRequest('/');
            this.testResults.push({
                test: '基本连接',
                status: 'PASS',
                statusCode: response.statusCode,
                message: `服务器响应状态: ${response.statusCode}`
            });
            this.log(`✅ 基本连接测试通过 (状态码: ${response.statusCode})`);
        } catch (error) {
            this.testResults.push({
                test: '基本连接',
                status: 'FAIL',
                error: error.message
            });
            this.log(`❌ 基本连接测试失败: ${error.message}`, 'error');
        }
    }

    // 测试API端点响应格式
    async testApiEndpoints() {
        const endpoints = [
            { path: '/api/products', name: '产品API' },
            { path: '/api/tasks', name: '任务API' },
            { path: '/api/history', name: '历史记录API' }
        ];

        for (const endpoint of endpoints) {
            this.log(`测试 ${endpoint.name}...`);
            
            try {
                const response = await this.makeRequest(endpoint.path);
                
                let status = 'PASS';
                let message = '';
                
                // 检查状态码
                if (response.statusCode !== 200) {
                    status = 'WARN';
                    message = `非200状态码: ${response.statusCode}`;
                }
                
                // 检查Content-Type
                if (!response.contentType || !response.contentType.includes('application/json')) {
                    status = 'FAIL';
                    message = `Content-Type不正确: ${response.contentType}`;
                }
                
                // 检查JSON格式
                if (response.data && !response.isJson) {
                    status = 'FAIL';
                    message = '响应不是有效的JSON格式';
                }
                
                // 检查数据结构
                if (response.isJson) {
                    if (Array.isArray(response.jsonData)) {
                        message += ` 返回数组，长度: ${response.jsonData.length}`;
                    } else if (typeof response.jsonData === 'object') {
                        message += ' 返回对象';
                    } else {
                        status = 'WARN';
                        message += ' 返回非数组非对象数据';
                    }
                }
                
                this.testResults.push({
                    test: endpoint.name,
                    status: status,
                    statusCode: response.statusCode,
                    contentType: response.contentType,
                    isJson: response.isJson,
                    message: message.trim()
                });
                
                if (status === 'PASS') {
                    this.log(`✅ ${endpoint.name} 测试通过`);
                } else if (status === 'WARN') {
                    this.log(`⚠️ ${endpoint.name} 测试警告: ${message}`);
                } else {
                    this.log(`❌ ${endpoint.name} 测试失败: ${message}`, 'error');
                }
                
            } catch (error) {
                this.testResults.push({
                    test: endpoint.name,
                    status: 'FAIL',
                    error: error.message
                });
                this.log(`❌ ${endpoint.name} 测试失败: ${error.message}`, 'error');
            }
        }
    }

    // 测试错误响应格式
    async testErrorResponse() {
        this.log('测试错误响应格式...');
        
        try {
            // 请求一个不存在的端点来触发404错误
            const response = await this.makeRequest('/api/nonexistent-endpoint');
            
            let status = 'PASS';
            let message = '';
            
            // 检查错误状态码
            if (response.statusCode < 400) {
                status = 'FAIL';
                message = '应该返回错误状态码';
            }
            
            // 检查错误响应是否为JSON格式
            if (!response.isJson) {
                status = 'FAIL';
                message = '错误响应不是JSON格式';
            }
            
            // 检查错误响应结构
            if (response.isJson) {
                const errorData = response.jsonData;
                if (errorData.error && typeof errorData.error === 'string') {
                    message = `错误信息: ${errorData.error}`;
                } else {
                    status = 'WARN';
                    message = '错误响应格式不标准';
                }
            }
            
            this.testResults.push({
                test: '错误响应格式',
                status: status,
                statusCode: response.statusCode,
                isJson: response.isJson,
                message: message
            });
            
            if (status === 'PASS') {
                this.log('✅ 错误响应格式测试通过');
            } else {
                this.log(`⚠️ 错误响应格式测试: ${message}`);
            }
            
        } catch (error) {
            this.testResults.push({
                test: '错误响应格式',
                status: 'FAIL',
                error: error.message
            });
            this.log(`❌ 错误响应格式测试失败: ${error.message}`, 'error');
        }
    }

    // 测试边界情况
    async testEdgeCases() {
        this.log('测试边界情况...');
        
        const edgeCases = [
            { path: '/api/products?limit=-1', name: '负数参数' },
            { path: '/api/tasks?invalid_param=test', name: '无效参数' },
            { path: '/api/history?page=999999', name: '超出范围的页码' }
        ];

        for (const testCase of edgeCases) {
            try {
                const response = await this.makeRequest(testCase.path);
                
                let status = 'PASS';
                let message = `状态码: ${response.statusCode}`;
                
                // 边界情况应该优雅处理，不应该导致服务器崩溃
                if (response.statusCode >= 500) {
                    status = 'FAIL';
                    message = `服务器内部错误: ${response.statusCode}`;
                }
                
                this.testResults.push({
                    test: `边界情况 - ${testCase.name}`,
                    status: status,
                    statusCode: response.statusCode,
                    message: message
                });
                
                if (status === 'PASS') {
                    this.log(`✅ ${testCase.name} 测试通过`);
                } else {
                    this.log(`❌ ${testCase.name} 测试失败: ${message}`, 'error');
                }
                
            } catch (error) {
                this.testResults.push({
                    test: `边界情况 - ${testCase.name}`,
                    status: 'FAIL',
                    error: error.message
                });
                this.log(`❌ ${testCase.name} 测试失败: ${error.message}`, 'error');
            }
        }
    }

    // 生成测试报告
    generateTestReport() {
        this.log('生成测试报告...');
        
        const report = {
            timestamp: new Date().toISOString(),
            totalTests: this.testResults.length,
            passed: this.testResults.filter(r => r.status === 'PASS').length,
            warnings: this.testResults.filter(r => r.status === 'WARN').length,
            failed: this.testResults.filter(r => r.status === 'FAIL').length,
            details: this.testResults
        };

        console.log('\n🧪 服务器响应格式测试报告:');
        console.log('=====================================');
        console.log(`测试时间: ${report.timestamp}`);
        console.log(`总测试数: ${report.totalTests}`);
        console.log(`✅ 通过: ${report.passed}`);
        console.log(`⚠️ 警告: ${report.warnings}`);
        console.log(`❌ 失败: ${report.failed}`);
        console.log('=====================================\n');

        // 详细结果
        console.log('详细测试结果:');
        this.testResults.forEach((result, index) => {
            const statusIcon = result.status === 'PASS' ? '✅' : 
                              result.status === 'WARN' ? '⚠️' : '❌';
            console.log(`${index + 1}. ${statusIcon} ${result.test}`);
            if (result.message) {
                console.log(`   ${result.message}`);
            }
            if (result.error) {
                console.log(`   错误: ${result.error}`);
            }
        });

        // 保存报告
        const fs = require('fs');
        const path = require('path');
        const reportPath = path.join(__dirname, 'response_format_test_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        this.log(`📝 详细报告已保存到: ${reportPath}`);

        return report;
    }

    // 主测试流程
    async runAllTests() {
        this.log('🚀 开始服务器响应格式测试...');
        
        try {
            await this.testBasicConnection();
            await this.testApiEndpoints();
            await this.testErrorResponse();
            await this.testEdgeCases();
            
            const report = this.generateTestReport();
            
            this.log('🎉 所有测试完成!');
            
            // 返回测试成功率
            const successRate = ((report.passed + report.warnings) / report.totalTests * 100).toFixed(1);
            this.log(`📊 测试成功率: ${successRate}%`);
            
            return report;
            
        } catch (error) {
            this.log(`❌ 测试过程中出现错误: ${error.message}`, 'error');
            throw error;
        }
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const tester = new ResponseFormatTester();
    tester.runAllTests().catch(error => {
        console.error('测试失败:', error);
        process.exit(1);
    });
}

module.exports = ResponseFormatTester;
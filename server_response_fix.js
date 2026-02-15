/**
 * 服务器端响应格式错误修复脚本
 * 专门解决Express服务器的JSON响应问题
 */

const fs = require('fs');
const path = require('path');

class ServerResponseFixer {
    constructor() {
        this.serverFilePath = path.join(__dirname, 'server.js');
        this.backupFilePath = path.join(__dirname, 'server.js.backup');
        this.fixLog = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        this.fixLog.push(logEntry);
        console.log(logEntry);
    }

    // 备份原文件
    backupServerFile() {
        if (fs.existsSync(this.serverFilePath)) {
            fs.copyFileSync(this.serverFilePath, this.backupFilePath);
            this.log('✅ 服务器文件已备份');
            return true;
        } else {
            this.log('❌ 未找到server.js文件', 'error');
            return false;
        }
    }

    // 修复JSON响应格式问题
    fixJsonResponses() {
        this.log('开始修复JSON响应格式问题');

        const fixes = [
            {
                pattern: /res\.json\(\s*(\w+)\s*\)/g,
                replacement: (match, dataVar) => {
                    return `res.json(${dataVar} || {})`;
                },
                description: '修复可能为undefined的JSON响应'
            },
            {
                pattern: /res\.status\(500\)\.json\(\{/g,
                replacement: 'res.status(500).json({',
                description: '确保500错误响应格式正确'
            },
            {
                pattern: /res\.status\(400\)\.json\(\{/g,
                replacement: 'res.status(400).json({',
                description: '确保400错误响应格式正确'
            }
        ];

        let serverContent = fs.readFileSync(this.serverFilePath, 'utf8');

        fixes.forEach(fix => {
            const before = (serverContent.match(fix.pattern) || []).length;
            serverContent = serverContent.replace(fix.pattern, fix.replacement);
            const after = (serverContent.match(new RegExp(fix.pattern.source)) || []).length;
            
            if (before > after) {
                this.log(`✅ 应用了修复: ${fix.description} (${before - after} 处)`);
            }
        });

        // 添加全局错误处理中间件
        const errorHandler = `
// 全局错误处理中间件 - 确保所有错误响应格式一致
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    
    // 确保响应是有效的JSON格式
    const errorResponse = {
        error: err.message || '服务器内部错误',
        message: err.message || '未知错误',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
    
    res.status(err.status || 500).json(errorResponse);
});

// 响应格式验证中间件
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function(data) {
        try {
            // 验证数据可以被JSON序列化
            JSON.stringify(data);
            return originalJson.call(this, data);
        } catch (serializationError) {
            console.error('响应数据序列化失败:', serializationError);
            return originalJson.call(this, {
                error: '服务器内部错误',
                message: '响应数据格式无效'
            });
        }
    };
    next();
});
`;

        // 在适当位置插入错误处理中间件
        if (!serverContent.includes('全局错误处理中间件')) {
            const insertPoint = serverContent.lastIndexOf('app.listen') || serverContent.length;
            serverContent = serverContent.slice(0, insertPoint) + errorHandler + '\n' + serverContent.slice(insertPoint);
            this.log('✅ 添加了全局错误处理中间件');
        }

        fs.writeFileSync(this.serverFilePath, serverContent);
        this.log('✅ JSON响应格式修复完成');
    }

    // 修复特定API端点
    fixApiEndpoints() {
        this.log('修复特定API端点响应格式');

        let serverContent = fs.readFileSync(this.serverFilePath, 'utf8');

        const endpointFixes = [
            {
                route: '/api/tasks',
                fix: (content) => {
                    // 确保任务API总是返回数组
                    return content.replace(
                        /(app\.get\('\/api\/tasks'[^}]*res\.json\()([^)]+)(\))/g,
                        '$1Array.isArray($2) ? $2 : ($2 || [])$3'
                    );
                }
            },
            {
                route: '/api/products',
                fix: (content) => {
                    // 确保产品API总是返回数组
                    return content.replace(
                        /(app\.get\('\/api\/products'[^}]*res\.json\()([^)]+)(\))/g,
                        '$1Array.isArray($2) ? $2 : ($2 || [])$3'
                    );
                }
            },
            {
                route: '/api/history',
                fix: (content) => {
                    // 修复历史记录的items字段
                    const historyPattern = /(app\.get\('\/api\/history'[\s\S]*?res\.json\()([^)]+)(\))/;
                    if (historyPattern.test(content)) {
                        content = content.replace(historyPattern, (match, prefix, data, suffix) => {
                            return `${prefix}(function() {
    const rows = ${data};
    return rows.map(row => {
        // 确保items字段正确解析
        if (typeof row.items === 'string') {
            try {
                row.items = JSON.parse(row.items);
            } catch (e) {
                row.items = [];
            }
        }
        return row;
    });
})()${suffix}`;
                        });
                    }
                    return content;
                }
            }
        ];

        endpointFixes.forEach(fix => {
            const beforeLength = serverContent.length;
            serverContent = fix.fix(serverContent);
            if (serverContent.length !== beforeLength) {
                this.log(`✅ 修复了${fix.route}端点`);
            }
        });

        fs.writeFileSync(this.serverFilePath, serverContent);
        this.log('✅ API端点修复完成');
    }

    // 添加响应头验证
    addResponseHeaders() {
        this.log('添加响应头验证');

        let serverContent = fs.readFileSync(this.serverFilePath, 'utf8');

        const headerMiddleware = `
// 确保所有API响应都有正确的Content-Type
app.use('/api', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});
`;

        if (!serverContent.includes('Content-Type')) {
            // 插入到中间件配置区域
            const middlewareInsertPoint = serverContent.indexOf('app.use(express.json())');
            if (middlewareInsertPoint > 0) {
                const insertPos = serverContent.indexOf('\n', middlewareInsertPoint) + 1;
                serverContent = serverContent.slice(0, insertPos) + headerMiddleware + serverContent.slice(insertPos);
                this.log('✅ 添加了响应头验证中间件');
            }
        }

        fs.writeFileSync(this.serverFilePath, serverContent);
        this.log('✅ 响应头验证添加完成');
    }

    // 验证修复结果
    verifyFixes() {
        this.log('验证修复结果');

        try {
            const serverContent = fs.readFileSync(this.serverFilePath, 'utf8');
            
            const checks = [
                { pattern: /res\.json\([^)]*\|\| \{\}/, desc: '默认空对象响应' },
                { pattern: /全局错误处理中间件/, desc: '全局错误处理' },
                { pattern: /响应格式验证中间件/, desc: '响应格式验证' },
                { pattern: /Content-Type.*application\/json/, desc: 'JSON Content-Type' }
            ];

            let allPassed = true;
            checks.forEach(check => {
                if (check.pattern.test(serverContent)) {
                    this.log(`✅ ${check.desc} 已正确配置`);
                } else {
                    this.log(`❌ ${check.desc} 未找到`, 'warn');
                    allPassed = false;
                }
            });

            if (allPassed) {
                this.log('✅ 所有修复验证通过');
            } else {
                this.log('⚠️ 部分修复需要手动验证', 'warn');
            }

        } catch (error) {
            this.log(`❌ 验证过程中出错: ${error.message}`, 'error');
        }
    }

    // 生成修复报告
    generateReport() {
        this.log('生成服务器修复报告');
        
        const report = {
            timestamp: new Date().toISOString(),
            backupCreated: fs.existsSync(this.backupFilePath),
            fixesApplied: this.fixLog.filter(log => log.includes('✅')).length,
            warnings: this.fixLog.filter(log => log.includes('⚠️')).length,
            errors: this.fixLog.filter(log => log.includes('❌')).length,
            details: this.fixLog
        };

        console.log('\n🔧 服务器响应格式修复报告:');
        console.log('=====================================');
        console.log(`备份文件: ${report.backupCreated ? '已创建' : '未创建'}`);
        console.log(`已应用修复: ${report.fixesApplied} 项`);
        console.log(`警告: ${report.warnings} 项`);
        console.log(`错误: ${report.errors} 项`);
        console.log('=====================================\n');

        // 保存报告到文件
        const reportPath = path.join(__dirname, 'server_response_fix_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        this.log(`📝 详细报告已保存到: ${reportPath}`);

        return report;
    }

    // 主修复流程
    async applyAllFixes() {
        this.log('🚀 开始服务器响应格式修复...');
        
        try {
            if (!this.backupServerFile()) {
                throw new Error('无法备份服务器文件');
            }

            this.fixJsonResponses();
            this.fixApiEndpoints();
            this.addResponseHeaders();
            this.verifyFixes();
            
            const report = this.generateReport();
            
            this.log('🎉 服务器响应格式修复完成!');
            this.log('💡 请重启服务器使更改生效');
            
            return report;
            
        } catch (error) {
            this.log(`❌ 修复过程中出现错误: ${error.message}`, 'error');
            // 尝试恢复备份
            if (fs.existsSync(this.backupFilePath)) {
                fs.copyFileSync(this.backupFilePath, this.serverFilePath);
                this.log('🔄 已恢复原始服务器文件');
            }
            throw error;
        }
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const fixer = new ServerResponseFixer();
    fixer.applyAllFixes().catch(error => {
        console.error('修复失败:', error);
        process.exit(1);
    });
}

module.exports = ServerResponseFixer;
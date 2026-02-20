# 统计分析数据清空指南

## 概述
本文档介绍了如何清空数据库中的统计分析相关数据。

## 清空的数据表
执行清空操作后，以下数据表将被清空：
- **tasks表** - 任务数据
- **history表** - 历史记录数据  
- **activities表** - 活动日志数据

## 保留的数据表
以下数据表不会被清空：
- **users表** - 用户数据
- **products表** - 产品数据

## 使用方法

### 方法一：使用命令行脚本（推荐）
```bash
cd /Users/zhouyun/Downloads/funseeks
使用 reset_system.js 进行完整系统重置
```

脚本会提示确认操作，输入 `YES` 确认清空。

### 方法二：通过API接口
启动服务器后，可以通过POST请求清空数据：

```bash
# 需要管理员权限，先获取token
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'

# 使用获得的token清空统计分析数据
curl -X POST http://localhost:3002/api/clear-statistics-data \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 方法三：直接数据库操作
```sql
DELETE FROM activities;
DELETE FROM history;
DELETE FROM tasks;
```

## 验证清空结果
可以使用以下命令验证数据是否已清空：

```bash
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/funseek'
});

async function checkData() {
  try {
    const tasksCount = await pool.query('SELECT COUNT(*) as count FROM tasks');
    const historyCount = await pool.query('SELECT COUNT(*) as count FROM history');
    const activitiesCount = await pool.query('SELECT COUNT(*) as count FROM activities');
    
    console.log('tasks表数据条数:', tasksCount.rows[0].count);
    console.log('history表数据条数:', historyCount.rows[0].count);
    console.log('activities表数据条数:', activitiesCount.rows[0].count);
  } finally {
    await pool.end();
  }
}

checkData();
"
```

## 注意事项
1. ⚠️ **此操作不可逆** - 清空的数据将永久丢失
2. 建议在执行前备份重要数据
3. 仅在开发环境或测试环境中使用
4. 生产环境中请谨慎操作
5. 需要管理员权限才能通过API接口清空数据

## 相关文件
- `reset_system.js` - 系统集成重置脚本（推荐使用）
- `server.js` - 包含 `/api/clear-statistics-data` API端点
- `STATISTICS_DATA_CLEAR_GUIDE.md` - 本使用说明文档
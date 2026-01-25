# R2 配置更新指南

## 当前状态
系统检测到 R2 配置存在问题，认证失败（Unauthorized）。当前系统在保持 `R2_ENABLED=true` 的情况下，临时使用 base64 存储作为后备方案。

## 需要更新的配置项

### 1. 获取正确的 R2 凭证
从 Cloudflare R2 控制台获取以下信息：

- **Account ID**: 在 R2 仪表板右上角
- **Access Key ID**: API Token 的 Access Key ID
- **Secret Access Key**: API Token 的 Secret Access Key
- **Bucket Name**: 确保存储桶存在

### 2. 更新 .env 文件
将以下环境变量更新为正确的值：

```env
# Cloudflare R2 Configuration
R2_ENABLED=true
R2_ENDPOINT=https://<YOUR_ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<YOUR_CORRECT_ACCESS_KEY_ID>
R2_SECRET_ACCESS_KEY=<YOUR_CORRECT_SECRET_ACCESS_KEY>
R2_BUCKET_NAME=<YOUR_EXISTING_BUCKET_NAME>
R2_PUBLIC_URL=https://<YOUR_PUBLIC_GATEWAY_DOMAIN>
```

## 验证步骤

### 1. 验证存储桶存在
确保在 Cloudflare R2 控制台中存在指定名称的存储桶。

### 2. 测试连接
运行以下命令测试 R2 连接：

```bash
node verify_r2_config_full.js
```

### 3. 重启服务器
更新配置后，重启服务器：

```bash
pkill -f "node server.js"
node server.js
```

## 注意事项

1. **保持 R2_ENABLED=true**: 根据项目要求，不得将此值设为 false
2. **凭证安全**: 确保将凭证视为敏感信息，不要泄露到公共代码库
3. **权限验证**: 确保提供的凭证具有对指定存储桶的读写权限
4. **端点格式**: 确保端点格式为 `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`

## 故障排除

如果继续遇到认证错误：

1. 检查 API Token 是否具有对存储桶的读写权限
2. 确认 Account ID、Access Key ID 和 Secret Access Key 是否正确复制
3. 验证存储桶名称拼写是否正确
4. 确认网络连接允许访问 Cloudflare R2 服务

## 重要提醒

- 系统在 R2 配置修复前将继续使用 base64 存储作为临时方案
- 所有现有数据将保持不变
- 一旦 R2 配置修复，新上传的文件将存储到 R2 并使用公共 URL
- 现有 base64 数据将继续正常工作
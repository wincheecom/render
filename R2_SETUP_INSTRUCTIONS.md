# Cloudflare R2 集成说明

本指南介绍如何配置和使用 Cloudflare R2 对象存储来存储图片文件。

## 配置步骤

### 1. 获取 Cloudflare R2 凭据

1. 登录到 Cloudflare 控制台
2. 导航到 R2 存储服务
3. 创建一个新的 R2 存储桶（bucket）
4. 生成 R2 API 凭据（Access Key ID 和 Secret Access Key）

### 2. 配置环境变量

编辑 `.env` 文件，更新以下配置：

```env
# 启用 R2 存储
R2_ENABLED=true

# R2 端点 URL（替换为您的账户 ID）
R2_ENDPOINT=https://<您的账户ID>.r2.cloudflarestorage.com

# R2 访问凭据
R2_ACCESS_KEY_ID=<您的R2访问密钥ID>
R2_SECRET_ACCESS_KEY=<您的R2秘密访问密钥>

# 存储桶名称
R2_BUCKET_NAME=<您的存储桶名称>

# 公共访问 URL（如果使用 Cloudflare 的公共访问网关）
R2_PUBLIC_URL=https://<您的公共网关域名>
```

### 3. 安装依赖项

```bash
npm install
```

## 功能说明

集成 R2 后，以下类型的图片将被上传到 R2 存储：

1. **产品图片** - 产品添加/编辑时上传的产品主图
2. **任务相关图片** - 包括：
   - 本体码图片
   - 条码图片
   - 警示码图片
   - 箱唛图片

## 技术实现细节

- 图片仍以 base64 格式从前端发送
- 服务器接收后上传到 R2 存储
- 数据库中存储的是 R2 的公共访问 URL，而不是 base64 数据
- 如果 R2 未启用或上传失败，系统会回退到原始 base64 存储方式

## 故障转移机制

如果 R2 配置有问题或上传失败，系统会自动回退到原始的 base64 存储方式，确保功能可用性。

## 数据库变更

products 表增加了 `image` 字段，用于存储产品图片的 URL。

## 注意事项

1. 确保 R2 存储桶具有适当的权限设置，允许公开读取（如果需要）
2. 检查网络连接，确保服务器可以访问 Cloudflare R2 服务
3. 适当设置 R2 存储桶的生命周期规则以管理存储成本
4. 定期备份重要数据
# 在 Render 上配置 Cloudflare R2 指南

本指南将详细介绍如何在 Render 平台上配置 Cloudflare R2 对象存储以存储图片文件。

## 第一步：获取 Cloudflare R2 凭据

1. 登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 导航到 R2 存储服务
3. 创建一个新的 R2 存储桶（bucket），例如命名为 `funseek-images`
4. 在 R2 仪表板中，点击 "Manage R2 API Tokens"
5. 点击 "Create API Token" 按钮
6. 记录下 Account ID（在 R2 仪表板右上角）

## 第二步：生成 R2 API 凭据

1. 在 R2 API Tokens 页面，点击 "Create API Token"
2. 输入令牌名称，例如 `funseek-r2-token`
3. 在权限部分，选择：
   - Permission Type: `Edit`
   - Permissions: `Workers R2 Storage: Write` 和 `Workers R2 Storage: Read`
4. 在 Buckets 部分，选择您创建的存储桶
5. 点击 "Continue to Summary" 然后 "Create API Token"
6. 保存生成的 Access Key ID 和 Secret Access Key（只会显示一次！）

## 第三步：配置 Render 环境变量

1. 部署您的应用到 Render 后，在 Render Dashboard 中打开您的服务
2. 点击 "Environment" 选项卡
3. 您会看到以下需要配置的 R2 相关环境变量：

### 必需的环境变量：

- `R2_ENABLED`: 设置为 `true` 以启用 R2 存储
- `R2_ENDPOINT`: 设置为 `https://<YOUR_ACCOUNT_ID>.r2.cloudflarestorage.com`
- `R2_ACCESS_KEY_ID`: 您在第二步中获得的 Access Key ID
- `R2_SECRET_ACCESS_KEY`: 您在第二步中获得的 Secret Access Key
- `R2_BUCKET_NAME`: 您的 R2 存储桶名称（例如 `funseek-images`）
- `R2_PUBLIC_URL`: 您的 R2 公共访问 URL，格式为 `https://<UNIQUE_SUBDOMAIN>.r2.edge.cf.co` （如果您设置了自定义域名）

### 示例配置：
```
R2_ENABLED=true
R2_ENDPOINT=https://abc123def456.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_actual_access_key_id_here
R2_SECRET_ACCESS_KEY=your_actual_secret_access_key_here
R2_BUCKET_NAME=funseek-images
R2_PUBLIC_URL=https://public.fra1.your-unique-subdomain.r2.edge.cf.co
```

## 第四步：部署和验证

1. 在 Render 上重新部署您的应用以应用新配置
2. 应用启动后，R2 集成将自动生效
3. 当您上传产品图片或任务相关图片时，它们将被上传到 R2 存储
4. 数据库中将只存储指向 R2 的 URL，而不是完整的 base64 图片数据

## 验证配置

1. 上传一张产品图片或任务图片
2. 检查数据库中的记录，确认图片字段包含 R2 URL 而不是 base64 数据
3. 尝试访问图片 URL，确认图片可以从 R2 正常加载

## 重要注意事项

1. **安全性**：确保将 R2 凭据视为敏感信息，不要将它们暴露在客户端代码中
2. **费用**：请注意 R2 存储和传输会产生费用，请参阅 Cloudflare 的定价页面
3. **备份**：定期备份重要的图片资源
4. **故障转移**：如果 R2 配置有问题，系统将自动回退到原始的 base64 存储方式

## 故障排除

- 如果图片上传失败，请检查 R2 凭据是否正确
- 如果无法访问图片，请确认 R2 存储桶的权限设置允许公共读取
- 检查 R2_ENDPOINT 和 R2_PUBLIC_URL 是否正确匹配您的账户和设置

## 更多信息

有关 Cloudflare R2 的更多信息，请参阅 [官方文档](https://developers.cloudflare.com/r2/)。
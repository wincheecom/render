# Funseek Shipment Management System

这是一个基于 Web 的发货管理系统，用于管理产品和发货任务，使用 PostgreSQL 作为数据库。

## 新增功能：Cloudflare R2 集成

系统现已支持使用 Cloudflare R2 对象存储来存储图片文件，包括产品图片和任务相关文档。这提高了性能并降低了数据库负载。

### 在 Render 上配置 R2

如果在 Render 上部署此应用并希望使用 R2 存储，请按照以下步骤操作：

1. 在 Cloudflare 控制台创建 R2 存储桶并获取 API 凭据
2. 在 Render 服务的环境变量中配置以下参数：
   - `R2_ENABLED=true`
   - `R2_ENDPOINT`：您的 R2 端点 URL
   - `R2_ACCESS_KEY_ID`：您的访问密钥 ID
   - `R2_SECRET_ACCESS_KEY`：您的秘密访问密钥
   - `R2_BUCKET_NAME`：您的存储桶名称
   - `R2_PUBLIC_URL`：R2 公共访问 URL

详细配置步骤请参考 [RENDER_R2_CONFIGURATION.md](./RENDER_R2_CONFIGURATION.md) 文件。

## 功能特性

- 产品管理：添加、编辑、删除产品
- 发货任务管理：创建、处理、完成发货任务
- 库存管理：实时跟踪产品库存
- 数据统计：发货统计和分析
- 数据库管理：通过 Adminer 管理 PostgreSQL 数据库

## 部署到 Render

1. Fork 这个仓库到你的 GitHub 账户
2. 登录 Render 账户
3. 点击 "New +" 按钮，选择 "Web Service"
4. 选择你刚刚 fork 的仓库
5. Render 会自动检测到 `render.yaml` 配置文件，该文件配置了 PostgreSQL 数据库
6. 点击 "Create Web Service" 开始部署

## 本地运行

如果你想在本地运行这个应用（需要先安装 PostgreSQL）：

1. 确保你已经安装了 Node.js 和 PostgreSQL
2. 克隆或下载这个仓库
3. 在 PostgreSQL 中创建数据库并运行项目：
   
   ```sql
   CREATE DATABASE funseek;
   ```

   在项目根目录运行：
   
   ```bash
   npm install
   npm start
   ```
   
   然后打开浏览器访问 `http://localhost:3000`

## 数据库管理

- 访问 `/adminer` 路径进入 Adminer 界面（需要单独部署 Adminer 或使用本地工具）
- 或使用你喜欢的 PostgreSQL 客户端连接数据库

## 登录信息

- 管理员账户：admin / 123456
- 销售运营：sales / 123456
- 仓库管理：warehouse / 123456

## 技术栈

- 前端：HTML, CSS, JavaScript
- 后端：Node.js + Express
- 数据库：PostgreSQL
- 数据库管理：Adminer

## API 接口

- 获取产品列表：GET /api/products
- 添加产品：POST /api/products
- 获取任务列表：GET /api/tasks
- 添加任务：POST /api/tasks

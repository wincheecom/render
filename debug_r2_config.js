require('dotenv').config();
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// 从环境变量获取 R2 配置
const accountId = process.env.R2_ENDPOINT?.match(/https:\/\/([^.]+)\.r2\.cloudflarestorage\.com/)?.[1];

console.log('=== R2 配置调试信息 ===');
console.log('R2_ENABLED:', process.env.R2_ENABLED);
console.log('R2_ENDPOINT:', process.env.R2_ENDPOINT);
console.log('R2_ACCESS_KEY_ID:', process.env.R2_ACCESS_KEY_ID ? '已设置' : '未设置');
console.log('R2_SECRET_ACCESS_KEY:', process.env.R2_SECRET_ACCESS_KEY ? '已设置' : '未设置');
console.log('R2_BUCKET_NAME:', process.env.R2_BUCKET_NAME);
console.log('R2_PUBLIC_URL:', process.env.R2_PUBLIC_URL);
console.log('从端点解析的 ACCOUNT_ID:', accountId);
console.log('');

if (process.env.R2_ENABLED !== 'true') {
    console.log('❌ R2 未启用 (R2_ENABLED != true)');
    process.exit(1);
}

if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || 
    !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
    console.log('❌ R2 配置不完整');
    process.exit(1);
}

// R2 配置 - 使用 Cloudflare R2 标准配置
const r2Config = {
    region: 'auto',  // Cloudflare R2 使用 'auto'
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    // Cloudflare R2 特定配置
    forcePathStyle: false, // 使用虚拟主机样式的端点
    signatureVersion: 'v4',  // 使用 v4 签名版本
    s3ForcePathStyle: false,
};

async function debugR2Connection() {
    console.log('=== 测试 R2 连接 ===');
    
    try {
        console.log('1. 创建 R2 客户端...');
        const r2Client = new S3Client(r2Config);
        
        console.log('2. 测试列出存储桶中的对象...');
        const listCommand = new ListObjectsV2Command({
            Bucket: process.env.R2_BUCKET_NAME,
            MaxKeys: 5  // 只获取最多5个对象
        });
        
        const listResult = await r2Client.send(listCommand);
        console.log('✅ 成功列出存储桶内容');
        console.log('   对象数量:', listResult.Contents ? listResult.Contents.length : 0);
        if (listResult.Contents && listResult.Contents.length > 0) {
            console.log('   前几个对象:', listResult.Contents.slice(0, 3).map(obj => obj.Key));
        }
        
        console.log('\\n3. 测试上传一个小文件...');
        const testData = Buffer.from('R2 连接测试 ' + new Date().toISOString(), 'utf8');
        const testFileName = `debug-test-${Date.now()}.txt`;
        
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: `debug/${testFileName}`,
            Body: testData,
            ContentType: 'text/plain',
        });
        
        await r2Client.send(uploadCommand);
        console.log('✅ 成功上传测试文件');
        console.log('   文件路径:', `debug/${testFileName}`);
        console.log('   公共URL:', `${process.env.R2_PUBLIC_URL}/debug/${testFileName}`);
        
        console.log('\\n✅ R2 配置和连接测试成功！');
        console.log('\\n💡 建议:');
        console.log('   - 如果之前上传的文件仍然存储为 base64，');
        console.log('     可能是 uploadImageToR2 函数中的错误处理导致回退到 base64');
        console.log('   - 检查服务器端的上传日志以获得更多详细信息');
        
    } catch (error) {
        console.log('\\n❌ R2 连接测试失败:');
        console.log('   错误类型:', error.name);
        console.log('   错误消息:', error.message);
        
        if (error.name === 'NoSuchBucket') {
            console.log('\\n🚨 存储桶不存在错误:');
            console.log('   - 确认 R2_BUCKET_NAME 设置正确');
            console.log('   - 确认该存储桶在 Cloudflare R2 中确实存在');
        } else if (error.name === 'SignatureDoesNotMatch' || error.message.includes('Unauthorized')) {
            console.log('\\n🚨 认证失败错误:');
            console.log('   - 检查 R2_ACCESS_KEY_ID 和 R2_SECRET_ACCESS_KEY 是否正确');
            console.log('   - 确认这些凭证有访问指定存储桶的权限');
            console.log('   - 检查 R2_ENDPOINT 格式是否正确');
        } else {
            console.log('\\n💡 其他错误，可能需要检查网络连接或 R2 服务状态');
        }
        
        console.log('\\n   完整错误对象:', error);
    }
}

debugR2Connection();
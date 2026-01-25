const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// R2 配置
const r2Config = {
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
};

async function testR2Upload() {
  console.log('开始测试 R2 上传功能...');
  console.log('R2 配置检查:');
  console.log('- R2_ENABLED:', process.env.R2_ENABLED);
  console.log('- R2_ENDPOINT:', process.env.R2_ENDPOINT);
  console.log('- R2_ACCESS_KEY_ID 存在:', !!process.env.R2_ACCESS_KEY_ID);
  console.log('- R2_SECRET_ACCESS_KEY 存在:', !!process.env.R2_SECRET_ACCESS_KEY);
  console.log('- R2_BUCKET_NAME:', process.env.R2_BUCKET_NAME);
  console.log('');

  if (!process.env.R2_ENABLED || process.env.R2_ENABLED !== 'true') {
    console.log('❌ R2 未启用');
    return;
  }

  if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || 
      !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
    console.log('❌ R2 配置不完整');
    return;
  }

  try {
    console.log('✅ 创建 R2 客户端...');
    const r2Client = new S3Client(r2Config);
    
    // 创建测试数据
    const testData = Buffer.from('这是一个测试文件，用于验证 R2 上传功能', 'utf8');
    
    const testFileName = `test-upload-${Date.now()}.txt`;
    
    const params = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `images/${testFileName}`,
      Body: testData,
      ContentType: 'text/plain',
    };
    
    console.log('📤 开始上传测试文件...');
    const command = new PutObjectCommand(params);
    await r2Client.send(command);
    
    console.log('✅ R2 上传测试成功!');
    const imageUrl = `${process.env.R2_PUBLIC_URL}/images/${testFileName}`;
    console.log('🔗 测试文件 URL:', imageUrl);
    
    // 验证 URL 可访问性（简单检查 URL 格式）
    console.log('\\n📋 验证信息:');
    console.log('- 上传的文件路径:', `images/${testFileName}`);
    console.log('- 生成的公共 URL:', imageUrl);
    console.log('- URL 格式正确:', imageUrl.startsWith(process.env.R2_PUBLIC_URL));
    
  } catch (error) {
    console.log('❌ R2 上传测试失败:', error.message);
    console.log('详细错误信息:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testR2Upload().then(() => {
    console.log('\\n测试完成');
  }).catch(console.error);
}

module.exports = { testR2Upload };
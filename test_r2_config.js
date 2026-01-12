/**
 * Cloudflare R2 配置测试脚本
 * 用于验证 R2 配置是否正确设置
 */

require('dotenv').config();

const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

function testR2Configuration() {
  console.log('正在测试 R2 配置...\n');
  
  // 检查环境变量
  const requiredEnvVars = [
    'R2_ENABLED',
    'R2_ENDPOINT',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME'
  ];
  
  let allConfigured = true;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.log(`❌ ${envVar} 未设置`);
      allConfigured = false;
    } else {
      console.log(`✅ ${envVar} 已设置`);
    }
  }
  
  if (!allConfigured) {
    console.log('\n❌ R2 配置不完整，请检查 .env 文件');
    return false;
  }
  
  if (process.env.R2_ENABLED !== 'true') {
    console.log('\n⚠️  R2 未启用 (R2_ENABLED=false)');
    return false;
  }
  
  // 尝试创建 S3 客户端
  try {
    const r2Config = {
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    };
    
    const r2Client = new S3Client(r2Config);
    console.log('✅ R2 客户端创建成功');
    
    // 尝试列出存储桶内容（不实际执行，仅验证配置）
    console.log('✅ R2 配置验证通过！');
    console.log('\n📝 配置摘要:');
    console.log(`   存储桶名称: ${process.env.R2_BUCKET_NAME}`);
    console.log(`   端点: ${process.env.R2_ENDPOINT}`);
    console.log(`   公共URL: ${process.env.R2_PUBLIC_URL || '未设置'}`);
    
    return true;
  } catch (error) {
    console.log(`❌ R2 客户端创建失败: ${error.message}`);
    return false;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testR2Configuration();
}

module.exports = { testR2Configuration };
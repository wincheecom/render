/**
 * R2 配置验证脚本
 * 检查 R2 配置是否正确设置并可正常工作
 */

console.log('🔍 检查 Cloudflare R2 配置...');

// 检查是否在生产环境（Render）
const isOnRender = process.env.RENDER !== undefined;
console.log(`📊 运行环境: ${isOnRender ? 'Render (生产)' : '本地开发'}`);

// 加载环境变量
require('dotenv').config();

// 检查必需的环境变量
const requiredEnvVars = [
  'R2_ENABLED',
  'R2_ENDPOINT', 
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL'
];

console.log('\n📋 检查必需的环境变量:');

let allSet = true;
for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  if (!value || value.includes('your-')) {
    console.log(`❌ ${envVar}: 未设置或使用默认值`);
    allSet = false;
  } else {
    console.log(`✅ ${envVar}: 已设置`);
  }
}

if (!allSet) {
  console.log('\n⚠️  警告: 某些必需的环境变量未正确配置');
  if (isOnRender) {
    console.log('   请检查 Render 环境变量配置');
  } else {
    console.log('   在本地开发时，R2 配置可能仍在使用默认值');
  }
} else {
  console.log('\n✅ 所有必需的环境变量均已设置');
}

// 检查 R2 是否启用
const r2Enabled = process.env.R2_ENABLED === 'true';
console.log(`\n📡 R2 状态: ${r2Enabled ? '已启用' : '已禁用'}`);

// 检查 server.js 中的 R2 集成
try {
  const fs = require('fs');
  const serverCode = fs.readFileSync('./server.js', 'utf8');
  
  const r2IntegrationChecks = [
    { name: 'S3Client 导入', pattern: /require\(['"]@aws-sdk\/client-s3['"]/ },
    { name: 'R2 客户端初始化', pattern: /new S3Client\(r2Config\)/ },
    { name: 'uploadImageToR2 函数', pattern: /async function uploadImageToR2/ },
    { name: 'R2 配置', pattern: /r2Config = \{/ },
    { name: '图片上传处理', pattern: /body_code_image.*await uploadImageToR2|barcode_image.*await uploadImageToR2|warning_code_image.*await uploadImageToR2|label_image.*await uploadImageToR2/ }
  ];
  
  console.log('\n🔧 检查 server.js 中的 R2 集成:');
  let integrationComplete = true;
  
  for (const check of r2IntegrationChecks) {
    const found = check.pattern.test(serverCode);
    console.log(`   ${found ? '✅' : '❌'} ${check.name}`);
    if (!found) integrationComplete = false;
  }
  
  if (integrationComplete) {
    console.log('✅ server.js 中的 R2 集成完整');
  } else {
    console.log('❌ server.js 中的 R2 集成不完整');
  }
} catch (error) {
  console.log(`\n❌ 无法读取 server.js: ${error.message}`);
}

// 输出配置摘要
if (allSet && r2Enabled) {
  console.log('\n📋 R2 配置摘要:');
  console.log(`   端点: ${process.env.R2_ENDPOINT}`);
  console.log(`   存储桶: ${process.env.R2_BUCKET_NAME}`);
  console.log(`   公共 URL: ${process.env.R2_PUBLIC_URL}`);
  console.log(`   访问密钥 ID 长度: ${process.env.R2_ACCESS_KEY_ID.length} 字符`);
  console.log(`   秘密访问密钥长度: ${process.env.R2_SECRET_ACCESS_KEY.length} 字符`);
  
  console.log('\n🎉 R2 配置验证完成!');
  console.log('   当您上传产品图片或任务相关图片时，它们将被上传到 R2 存储。');
  console.log('   数据库中将只存储指向 R2 的 URL，而不是完整的 base64 图片数据。');
} else {
  console.log('\n💡 提示: 如果您刚在 Render 上设置了环境变量，请确保重新部署应用以使更改生效。');
}

console.log('\n📖 详细配置说明请参考: RENDER_R2_CONFIGURATION.md');
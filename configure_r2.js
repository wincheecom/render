/**
 * Cloudflare R2 配置助手
 * 此脚本会引导用户完成 R2 配置
 */

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function configureR2() {
  console.log('🔍 Cloudflare R2 配置向导\n');
  
  console.log('在开始之前，请确保您已经:');
  console.log('1. 登录 Cloudflare Dashboard');
  console.log('2. 创建了一个 R2 存储桶');
  console.log('3. 生成了 R2 API 令牌 (Access Keys)\n');
  
  const enableR2 = await askQuestion('是否启用 R2 存储? (y/n): ');
  
  if (enableR2.toLowerCase() !== 'y' && enableR2.toLowerCase() !== 'yes') {
    console.log('❌ R2 配置已取消');
    rl.close();
    return;
  }
  
  console.log('\n📋 请输入您的 R2 配置信息:\n');
  
  const endpoint = await askQuestion('R2 端点 URL (例如: https://abc123.r2.cloudflarestorage.com): ');
  const accessKeyId = await askQuestion('R2 Access Key ID: ');
  const secretAccessKey = await askQuestion('R2 Secret Access Key: ');
  const bucketName = await askQuestion('R2 存储桶名称: ');
  const publicUrl = await askQuestion('R2 公共访问 URL (例如: https://public.r2 gateway): ') || endpoint.replace('.r2.cloudflarestorage.com', '.public.r2 gateway');
  
  // 读取当前 .env 文件
  let envContent = '';
  try {
    envContent = fs.readFileSync('.env', 'utf8');
  } catch (error) {
    console.log('⚠️  未找到 .env 文件，将创建新的 .env 文件');
    envContent = '';
  }
  
  // 替换或添加 R2 配置
  const r2Config = `# Cloudflare R2 Configuration
R2_ENABLED=true
R2_ENDPOINT=${endpoint}
R2_ACCESS_KEY_ID=${accessKeyId}
R2_SECRET_ACCESS_KEY=${secretAccessKey}
R2_BUCKET_NAME=${bucketName}
R2_PUBLIC_URL=${publicUrl}`;

  // 检查是否已有 R2 配置部分
  if (envContent.includes('# Cloudflare R2 Configuration')) {
    // 替换现有的 R2 配置部分
    const lines = envContent.split('\n');
    const newLines = [];
    let inR2Section = false;
    
    for (const line of lines) {
      if (line.startsWith('# Cloudflare R2 Configuration')) {
        inR2Section = true;
        newLines.push(...r2Config.split('\n'));
        // 跳过原 R2 配置段落直到遇到下一个注释或文件结束
        continue;
      }
      
      if (inR2Section) {
        if (line.startsWith('# ') && !line.includes('Cloudflare R2')) {
          inR2Section = false;
          newLines.push(line);
        } else if (line.trim() === '') {
          // 继续在 R2 部分
          continue;
        } else {
          // 继续在 R2 部分
          continue;
        }
      } else {
        newLines.push(line);
      }
    }
    
    envContent = newLines.join('\n');
  } else {
    // 添加 R2 配置到文件末尾
    envContent += '\n' + r2Config + '\n';
  }
  
  // 确保 R2_ENABLED 设置为 true
  envContent = envContent.replace(/R2_ENABLED\s*=.*/, 'R2_ENABLED=true');
  
  // 写回 .env 文件
  fs.writeFileSync('.env', envContent);
  
  console.log('\n✅ R2 配置已完成!');
  console.log('\n📝 更新后的配置:');
  console.log(`   R2_ENABLED: true`);
  console.log(`   R2_ENDPOINT: ${endpoint}`);
  console.log(`   R2_BUCKET_NAME: ${bucketName}`);
  console.log(`   R2_PUBLIC_URL: ${publicUrl}`);
  console.log('\n🔄 请重启服务器以使配置生效');
  
  rl.close();
}

// 如果直接运行此脚本
if (require.main === module) {
  configureR2().catch(error => {
    console.error('❌ 配置过程中出现错误:', error);
    rl.close();
  });
}

module.exports = { configureR2 };
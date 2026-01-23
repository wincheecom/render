/**
 * R2 存储桶清理脚本
 * 用于删除 R2 存储桶中的所有对象
 */

require('dotenv').config();
const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');

async function clearR2Bucket() {
  // 检查 R2 配置
  const requiredEnvVars = [
    'R2_ENABLED',
    'R2_ENDPOINT', 
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME'
  ];

  console.log('检查 R2 配置...');
  let allSet = true;
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    if (!value) {
      console.log(`❌ ${envVar}: 未设置`);
      allSet = false;
    } else {
      console.log(`✅ ${envVar}: 已设置`);
    }
  }

  if (!allSet) {
    console.error('❌ R2 配置不完整，无法继续');
    return false;
  }

  if (process.env.R2_ENABLED !== 'true') {
    console.error('❌ R2 未启用 (R2_ENABLED != true)，无法继续');
    return false;
  }

  try {
    console.log('正在初始化 R2 客户端...');
    
    // 创建 R2 客户端
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
    
    const bucketName = process.env.R2_BUCKET_NAME;
    
    console.log(`正在列出存储桶 "${bucketName}" 中的所有对象...`);
    
    // 分批删除对象
    let hasMoreObjects = true;
    let continuationToken = undefined;
    
    while (hasMoreObjects) {
      // 列出对象
      const listParams = {
        Bucket: bucketName,
        MaxKeys: 1000, // 最多一次列出1000个对象
      };
      
      if (continuationToken) {
        listParams.ContinuationToken = continuationToken;
      }
      
      const listCommand = new ListObjectsV2Command(listParams);
      const listResponse = await r2Client.send(listCommand);
      
      const objects = listResponse.Contents;
      
      if (objects && objects.length > 0) {
        console.log(`找到 ${objects.length} 个对象，正在删除...`);
        
        // 准备删除参数
        const deleteParams = {
          Bucket: bucketName,
          Delete: {
            Objects: objects.map(obj => ({ Key: obj.Key })),
            Quiet: false
          }
        };
        
        // 执行删除
        const deleteCommand = new DeleteObjectsCommand(deleteParams);
        const deleteResponse = await r2Client.send(deleteCommand);
        
        console.log(`✅ 成功删除 ${objects.length} 个对象`);
        
        if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
          console.log('⚠️ 删除过程中出现一些错误:', deleteResponse.Errors);
        }
      } else {
        console.log('存储桶中没有更多对象');
      }
      
      // 检查是否还有更多对象
      hasMoreObjects = listResponse.IsTruncated === true;
      continuationToken = listResponse.NextContinuationToken;
      
      if (hasMoreObjects) {
        console.log('继续处理下一批对象...');
      }
    }
    
    console.log('\n✅ R2 存储桶已成功清空！');
    return true;
    
  } catch (error) {
    console.error('❌ 清空 R2 存储桶时发生错误:', error);
    return false;
  }
}

// 执行存储桶清理
if (require.main === module) {
  clearR2Bucket().then(success => {
    if (success) {
      console.log('R2 存储桶清理完成');
      process.exit(0);
    } else {
      console.error('R2 存储桶清理失败');
      process.exit(1);
    }
  }).catch(err => {
    console.error('R2 存储桶清理过程中发生错误:', err);
    process.exit(1);
  });
}

module.exports = {
  clearR2Bucket
};
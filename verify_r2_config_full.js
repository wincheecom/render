require('dotenv').config();
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

console.log('=== 全面的 R2 配置验证 ===');
console.log('R2_ENABLED:', process.env.R2_ENABLED);
console.log('R2_ENDPOINT:', process.env.R2_ENDPOINT);
console.log('R2_ACCESS_KEY_ID 存在:', !!process.env.R2_ACCESS_KEY_ID);
console.log('R2_SECRET_ACCESS_KEY 存在:', !!process.env.R2_SECRET_ACCESS_KEY);
console.log('R2_BUCKET_NAME:', process.env.R2_BUCKET_NAME);
console.log('R2_PUBLIC_URL:', process.env.R2_PUBLIC_URL);
console.log('');

// 检查 R2 端点格式是否正确
const endpointRegex = /^https:\/\/[a-z0-9]+(?:-[a-z0-9]+)*\.r2\.cloudflarestorage\.com$/;
const isEndpointValidFormat = endpointRegex.test(process.env.R2_ENDPOINT || '');
console.log('端点格式是否符合 Cloudflare R2 标准:', isEndpointValidFormat);

if (!isEndpointValidFormat) {
    console.log('❌ 端点格式不正确。Cloudflare R2 端点应为: https://<ACCOUNT_ID>.r2.cloudflarestorage.com');
    console.log('   当前格式:', process.env.R2_ENDPOINT);
} else {
    console.log('✅ 端点格式正确');
}

// 检查账户 ID 部分
const accountId = process.env.R2_ENDPOINT?.match(/https:\/\/([^.]+)\.r2\.cloudflarestorage\.com/)?.[1];
console.log('解析出的账户 ID:', accountId);

// 验证所有必需配置
const requiredConfigs = [
    { name: 'R2_ENABLED', value: process.env.R2_ENABLED, expected: 'true' },
    { name: 'R2_ENDPOINT', value: process.env.R2_ENDPOINT, required: true },
    { name: 'R2_ACCESS_KEY_ID', value: process.env.R2_ACCESS_KEY_ID, required: true },
    { name: 'R2_SECRET_ACCESS_KEY', value: process.env.R2_SECRET_ACCESS_KEY, required: true },
    { name: 'R2_BUCKET_NAME', value: process.env.R2_BUCKET_NAME, required: true },
];

let allValid = true;
for (const config of requiredConfigs) {
    if (config.expected && config.value !== config.expected) {
        console.log(`❌ ${config.name} 应该是 "${config.expected}"，当前是 "${config.value}"`);
        allValid = false;
    } else if (config.required && !config.value) {
        console.log(`❌ ${config.name} 未设置`);
        allValid = false;
    } else if (config.value) {
        console.log(`✅ ${config.name} 已设置`);
    }
}

if (!allValid) {
    console.log('\n❌ R2 配置不完整或不正确');
    process.exit(1);
}

// 尝试使用不同的配置参数测试连接
async function testR2WithDifferentConfigs() {
    console.log('\n=== 测试不同的 R2 客户端配置 ===');
    
    // 测试配置1: 基础配置
    const configsToTest = [
        {
            name: '基础配置',
            config: {
                region: 'auto',
                endpoint: process.env.R2_ENDPOINT,
                credentials: {
                    accessKeyId: process.env.R2_ACCESS_KEY_ID,
                    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
                },
                forcePathStyle: false,
            }
        },
        {
            name: '带 v4 签名的配置',
            config: {
                region: 'auto',
                endpoint: process.env.R2_ENDPOINT,
                credentials: {
                    accessKeyId: process.env.R2_ACCESS_KEY_ID,
                    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
                },
                signatureVersion: 'v4',
                forcePathStyle: false,
            }
        },
        {
            name: '兼容性配置',
            config: {
                region: 'auto',
                endpoint: process.env.R2_ENDPOINT,
                credentials: {
                    accessKeyId: process.env.R2_ACCESS_KEY_ID,
                    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
                },
                forcePathStyle: false,
                s3ForcePathStyle: false,
                signatureVersion: 'v4',
            }
        }
    ];

    for (const testConfig of configsToTest) {
        console.log(`\n测试配置: ${testConfig.name}`);
        try {
            const client = new S3Client(testConfig.config);
            
            // 尝试列出对象（不实际获取数据，只是测试连接）
            const listCommand = new ListObjectsV2Command({
                Bucket: process.env.R2_BUCKET_NAME,
                MaxKeys: 1
            });
            
            const result = await client.send(listCommand);
            console.log(`✅ ${testConfig.name} - 连接成功`);
            console.log(`   对象数量: ${result.Contents ? result.Contents.length : 0}`);
            return true; // 成功了就返回
            
        } catch (error) {
            console.log(`❌ ${testConfig.name} - 连接失败:`, error.message);
        }
    }
    
    console.log('\n所有配置测试均失败');
    return false;
}

testR2WithDifferentConfigs().then(success => {
    if (success) {
        console.log('\n✅ R2 配置验证成功！');
    } else {
        console.log('\n❌ 所有 R2 配置测试均失败，可能存在以下问题：');
        console.log('   1. R2 凭证不正确（ACCESS_KEY_ID 或 SECRET_ACCESS_KEY）');
        console.log('   2. R2 存储桶不存在或名称不正确');
        console.log('   3. 网络连接问题');
        console.log('   4. R2 存储桶权限配置问题');
    }
});
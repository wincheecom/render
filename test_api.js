const axios = require('axios');

async function testApiEndpoint() {
    try {
        // 测试API端点
        const response = await axios.get('http://localhost:3003/api/task/26/file/bodyCode', {
            // 只获取响应头信息而不下载整个文件内容
            responseType: 'stream'
        });

        console.log('API端点测试成功');
        console.log('状态码:', response.status);
        console.log('内容类型:', response.headers['content-type']);
        console.log('内容长度:', response.headers['content-length']);

        // 立即取消流以避免下载大量数据
        response.data.destroy();

    } catch (error) {
        console.error('API端点测试失败:', error.message);
        if (error.response) {
            console.error('状态码:', error.response.status);
            console.error('响应:', error.response.data);
        }
    }
}

testApiEndpoint();
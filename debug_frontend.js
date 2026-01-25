// 模拟前端获取任务数据的过程
const axios = require('axios');

async function debugFrontendProcess() {
    console.log('开始调试前端获取任务数据的过程...');
    
    try {
        // 1. 首先获取JWT token (模拟localStorage.getItem)
        // 注意：这里需要先登录获取token
        console.log('\n1. 尝试获取JWT token...');
        
        // 先尝试登录获取token
        const loginResponse = await axios.post('http://localhost:3003/api/auth/login', {
            email: 'admin@example.com',
            password: '123456'
        });
        
        const token = loginResponse.data.token;
        console.log('成功获取JWT token');
        
        // 2. 使用DataManager.getTaskById类似的方式获取任务数据
        console.log('\n2. 获取任务ID 26的数据...');
        const taskResponse = await axios.get('http://localhost:3003/api/tasks/26', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('任务数据获取成功');
        console.log('任务ID:', taskResponse.data.id);
        console.log('任务编号:', taskResponse.data.task_number);
        console.log('body_code_image字段是否存在:', !!taskResponse.data.body_code_image);
        console.log('body_code_image字段长度:', taskResponse.data.body_code_image ? taskResponse.data.body_code_image.length : 0);
        
        // 3. 检查字段映射 - 模拟DataManager.getTaskById中的处理
        console.log('\n3. 检查字段映射...');
        const task = taskResponse.data;
        const mappedTask = {
            id: task.id,
            taskNumber: task.task_number || task.taskNumber || '',
            status: task.status,
            items: task.items || [],
            bodyCodeImage: task.body_code_image || task.bodyCodeImage || '',
            bodyCodeFileName: task.body_code_file_name || task.bodyCodeFileName || '',
            bodyCodeType: task.body_code_type || task.bodyCodeType || null,
            barcodeImage: task.barcode_image || task.barcodeImage || '',
            barcodeFileName: task.barcode_file_name || task.barcodeFileName || '',
            barcodeType: task.barcode_type || task.barcodeType || null,
            warningCodeImage: task.warning_code_image || task.warningCodeImage || '',
            warningCodeFileName: task.warning_code_file_name || task.warningCodeFileName || '',
            warningCodeType: task.warning_code_type || task.warningCodeType || null,
            labelImage: task.label_image || task.labelImage || '',
            labelFileName: task.label_file_name || task.labelFileName || '',
            labelType: task.label_type || task.labelType || null,
            manualImage: task.manual_image || task.manualImage || '',
            manualFileName: task.manual_file_name || task.manualFileName || '',
            manualType: task.manual_type || task.manualType || null,
            otherImage: task.other_image || task.otherImage || '',
            otherFileName: task.other_file_name || task.otherFileName || '',
            otherType: task.other_type || task.otherType || null,
            createdAt: task.created_at || task.createdAt || '',
            completedAt: task.completed_at || task.completedAt || '',
            creator_name: task.creator_name || task.creatorName || ''
        };
        
        console.log('映射后的任务数据:');
        console.log('- bodyCodeImage字段是否存在:', !!mappedTask.bodyCodeImage);
        console.log('- bodyCodeImage字段长度:', mappedTask.bodyCodeImage ? mappedTask.bodyCodeImage.length : 0);
        console.log('- bodyCodeType:', mappedTask.bodyCodeType);
        console.log('- bodyCodeFileName:', mappedTask.bodyCodeFileName);
        
        // 4. 检查previewTaskFile中的文件存在检查逻辑
        console.log('\n4. 检查previewTaskFile中的文件存在检查逻辑...');
        const fileUrl = mappedTask.bodyCodeImage || mappedTask.body_code_image || '';
        console.log('- fileUrl值:', fileUrl ? '存在' : '不存在');
        console.log('- fileUrl是否为空字符串:', fileUrl === '');
        console.log('- fileUrl是否为null:', fileUrl === null);
        console.log('- fileUrl是否为undefined:', fileUrl === undefined);
        console.log('- fileUrl是否等于"null":', fileUrl === 'null');
        console.log('- fileUrl是否等于"undefined":', fileUrl === 'undefined');
        console.log('- fileUrl是否等于"data:":', fileUrl === 'data:');
        
        const isFileMissing = !fileUrl || fileUrl.trim() === '' || fileUrl === 'null' || fileUrl === 'undefined' || fileUrl === 'data:';
        console.log('- 文件是否缺失:', isFileMissing);
        
        if (!isFileMissing) {
            console.log('\n✅ 所有组件工作正常！');
            console.log('API端点、数据库和前端函数都能正确处理任务ID 26的文件数据。');
            console.log('问题可能出现在其他地方，例如DOM元素上的任务ID或文件类型参数。');
        } else {
            console.log('\n❌ 发现问题！');
            console.log('前端检查逻辑认为文件不存在，但实际上数据库中有数据。');
        }
        
    } catch (error) {
        console.error('\n❌ 调试过程中出现错误:', error.message);
        if (error.response) {
            console.error('状态码:', error.response.status);
            console.error('响应:', error.response.data);
        }
    }
}

debugFrontendProcess();
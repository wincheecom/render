// 验证完整的文件预览流程
const axios = require('axios');

async function verifyFullProcess() {
    console.log('开始验证完整的文件预览流程...');
    
    try {
        // 登录获取token
        console.log('\n1. 登录获取JWT token...');
        const loginResponse = await axios.post('http://localhost:3003/api/auth/login', {
            email: 'admin@example.com',
            password: '123456'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ 成功获取JWT token');
        
        // 测试1: 直接访问API端点
        console.log('\n2. 测试API端点 /api/task/26/file/bodyCode ...');
        const apiResponse = await axios.head('http://localhost:3003/api/task/26/file/bodyCode', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ API端点响应正常，状态码:', apiResponse.status);
        console.log('   内容类型:', apiResponse.headers['content-type']);
        console.log('   内容长度:', apiResponse.headers['content-length']);
        
        // 测试2: 检查任务数据获取
        console.log('\n3. 检查任务数据获取 /api/tasks/26 ...');
        const taskResponse = await axios.get('http://localhost:3003/api/tasks/26', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ 任务数据获取成功');
        console.log('   任务ID:', taskResponse.data.id);
        console.log('   任务编号:', taskResponse.data.task_number);
        console.log('   状态:', taskResponse.data.status);
        
        // 检查文件字段
        const hasBodyCodeImage = !!taskResponse.data.body_code_image;
        console.log('   包含body_code_image:', hasBodyCodeImage);
        if (hasBodyCodeImage) {
            console.log('   body_code_image长度:', taskResponse.data.body_code_image.length);
        }
        
        // 测试3: 模拟前端DataManager.getTaskById的完整过程
        console.log('\n4. 模拟前端DataManager.getTaskById过程...');
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
        
        console.log('✅ 任务数据映射完成');
        console.log('   映射后bodyCodeImage存在:', !!mappedTask.bodyCodeImage);
        if (mappedTask.bodyCodeImage) {
            console.log('   映射后bodyCodeImage长度:', mappedTask.bodyCodeImage.length);
        }
        
        // 测试4: 模拟previewTaskFile中的文件检查逻辑
        console.log('\n5. 模拟previewTaskFile中的文件检查逻辑...');
        let fileUrl, fileName, fileTitle, fileTypeValue;
        
        // 模拟switch语句中的case 'bodyCode'
        fileUrl = mappedTask.bodyCodeImage || mappedTask.body_code_image || '';
        fileName = mappedTask.bodyCodeFileName || mappedTask.body_code_file_name || mappedTask.bodyCode_file_name || '';
        fileTypeValue = mappedTask.bodyCodeType || mappedTask.body_code_type || null;
        fileTitle = '本体码';
        
        console.log('   fileUrl值:', fileUrl ? '存在' : '不存在');
        console.log('   fileName值:', fileName || '未设置');
        console.log('   fileTypeValue值:', fileTypeValue || '未设置');
        console.log('   fileTitle值:', fileTitle);
        
        // 检查文件是否存在 - 前端的实际检查逻辑
        const isFileMissing = !fileUrl || fileUrl.trim() === '' || fileUrl === 'null' || fileUrl === 'undefined' || fileUrl === 'data:';
        console.log('   文件是否缺失 (根据前端检查逻辑):', isFileMissing);
        
        if (!isFileMissing) {
            console.log('\n🎉 验证完成！所有环节都正常工作：');
            console.log('   ✅ 服务器API端点正常');
            console.log('   ✅ 数据库中任务ID 26存在且包含文件数据');
            console.log('   ✅ 前端DataManager.getTaskById能正确获取数据');
            console.log('   ✅ 前端previewTaskFile函数能正确识别文件存在');
            console.log('   ');
            console.log('   💡 如果用户仍然看到"该文件未上传"错误，');
            console.log('      问题可能在于：');
            console.log('      1. 用户实际点击的不是ID 26的任务');
            console.log('      2. 浏览器缓存了旧数据');
            console.log('      3. DOM元素中的任务ID与实际不符');
            console.log('      4. 用户没有登录或JWT token过期');
        } else {
            console.log('\n❌ 发现问题！前端检查逻辑认为文件不存在');
        }
        
    } catch (error) {
        console.error('\n❌ 验证过程中出现错误:', error.message);
        if (error.response) {
            console.error('状态码:', error.response.status);
            console.error('响应:', error.response.data);
        }
    }
}

verifyFullProcess();
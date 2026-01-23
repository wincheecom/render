/**
 * 系统重置脚本
 * 完全重置系统，包括：
 * 1. 删除并重新创建数据库中的所有表
 * 2. 清除 R2 存储中的所有对象
 * 3. 确保服务器能从干净状态开始运行
 */

require('dotenv').config();

const { dropAllTables } = require('./drop_tables');
const { createAllTables } = require('./create_tables');
const { clearR2Bucket } = require('./clear_r2_bucket');

async function resetSystem() {
  console.log('🚀 开始执行系统重置...\n');
  
  try {
    // 步骤 1: 清除 R2 存储桶中的所有对象
    console.log('🗑️ 第一步: 清除 R2 存储桶中的所有对象');
    const r2Cleared = await clearR2Bucket();
    if (!r2Cleared) {
      console.log('⚠️ R2 清理失败或未配置，将继续执行其他步骤');
    } else {
      console.log('✅ R2 存储桶已清空\n');
    }
    
    // 步骤 2: 删除所有数据库表
    console.log('🗑️ 第二步: 删除所有数据库表');
    await dropAllTables();
    console.log('✅ 所有数据库表已删除\n');
    
    // 步骤 3: 重新创建所有数据库表
    console.log('🏗️  第三步: 重新创建所有数据库表');
    await createAllTables();
    console.log('✅ 所有数据库表已重建\n');
    
    console.log('🎉 系统重置完成！');
    console.log('✅ 数据库表结构已恢复到初始状态');
    console.log('✅ R2 存储桶已清空（如已配置）');
    console.log('✅ 系统现在处于干净状态，可以重新开始使用');
    
    return true;
  } catch (error) {
    console.error('❌ 系统重置过程中发生错误:', error);
    return false;
  }
}

// 执行系统重置
if (require.main === module) {
  resetSystem().then(success => {
    if (success) {
      console.log('\n✅ 系统重置成功完成');
      process.exit(0);
    } else {
      console.error('\n❌ 系统重置失败');
      process.exit(1);
    }
  }).catch(err => {
    console.error('\n❌ 系统重置过程中发生错误:', err);
    process.exit(1);
  });
}

module.exports = {
  resetSystem
};
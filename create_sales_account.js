const bcrypt = require('bcrypt');
const db = require('./db');

async function createSalesAccount() {
  try {
    const saltRounds = 10;
    
    // 设置账户信息
    const email = 'sales_fanqu@example.com';
    const password = 'FanQu2023!'; // 设置一个安全的密码
    const name = '泛趣';
    const role = 'sales';
    const companyName = '泛趣';

    // 对密码进行哈希处理
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 检查是否已存在相同邮箱的用户
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      console.log(`用户 ${email} 已存在，正在更新...`);
      // 如果用户已存在，更新用户信息
      await db.query(
        `UPDATE users 
         SET name = $1, role = $2, company_name = $3, updated_at = CURRENT_TIMESTAMP 
         WHERE email = $4`,
        [name, role, companyName, name]
      );
      console.log(`用户 ${name} 信息已更新`);
    } else {
      // 插入新用户
      await db.query(
        `INSERT INTO users (email, password_hash, name, role, company_name) 
         VALUES ($1, $2, $3, $4, $5)`,
        [email, passwordHash, name, role, companyName]
      );
      console.log(`销售运营账户创建成功！`);
      console.log(`账户名称: ${name}`);
      console.log(`邮箱: ${email}`);
      console.log(`密码: ${password}`); // 实际部署时不应该打印密码
      console.log(`角色: ${role}`);
      console.log(`公司名称: ${companyName}`);
    }
  } catch (error) {
    console.error('创建销售运营账户时出错:', error);
  }
}

// 执行创建账户函数
createSalesAccount().then(() => {
  console.log('销售运营账户创建完成');
  process.exit(0);
}).catch((error) => {
  console.error('创建销售运营账户失败:', error);
  process.exit(1);
});
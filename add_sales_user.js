const bcrypt = require('bcrypt');
const db = require('./db.js');

async function addSalesUser() {
  try {
    console.log('Adding test sales user...');
    
    // Hash the password
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if the first test user already exists
    let existingUserResult = await db.query(
      'SELECT id FROM users WHERE email = $1',
      ['test-sales@example.com']
    );
    
    let insertResult;
    
    if (existingUserResult.rows.length > 0) {
      console.log('First test sales user already exists');
      
      // Also add a second test user with different details
      existingUserResult = await db.query(
        'SELECT id FROM users WHERE email = $1',
        ['test-sales2@example.com']
      );
      
      if (existingUserResult.rows.length > 0) {
        console.log('Second test sales user also already exists');
        return;
      }
      
      // Insert the second sales user
      insertResult = await db.query(
        `INSERT INTO users (email, password_hash, name, role, company_name, currency, language, settings, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING id, email, name, role`,
        [
          'test-sales2@example.com', 
          hashedPassword, 
          '测试销售员2', 
          'sales', 
          '测试公司2', 
          'CNY', 
          'zh-CN', 
          '{}', 
          true
        ]
      );
      
      console.log('Successfully added second test sales user:');
      console.log('- Email:', insertResult.rows[0].email);
      console.log('- Password: 123456');
      console.log('- Role:', insertResult.rows[0].role);
      console.log('- Name:', insertResult.rows[0].name);
      console.log('User ID:', insertResult.rows[0].id);
    } else {
      // Insert the first sales user
      insertResult = await db.query(
        `INSERT INTO users (email, password_hash, name, role, company_name, currency, language, settings, is_active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING id, email, name, role`,
        [
          'test-sales@example.com', 
          hashedPassword, 
          '测试销售员', 
          'sales', 
          '测试公司', 
          'CNY', 
          'zh-CN', 
          '{}', 
          true
        ]
      );
      
      console.log('Successfully added first test sales user:');
      console.log('- Email:', insertResult.rows[0].email);
      console.log('- Password: 123456');
      console.log('- Role:', insertResult.rows[0].role);
      console.log('- Name:', insertResult.rows[0].name);
      console.log('User ID:', insertResult.rows[0].id);
    }
    
  } catch (error) {
    console.error('Error adding sales user:', error);
  }
}

// Run the function
addSalesUser();
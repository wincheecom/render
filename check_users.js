const db = require('./db.js');

async function checkSalesUsers() {
  try {
    console.log('Checking sales users in database...');
    
    // Query all sales users
    const result = await db.query(
      'SELECT id, email, name, role, created_at FROM users WHERE role = $1',
      ['sales']
    );
    
    console.log(`Found ${result.rows.length} sales users:`);
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.created_at}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error checking sales users:', error);
  }
}

// Run the function
checkSalesUsers();
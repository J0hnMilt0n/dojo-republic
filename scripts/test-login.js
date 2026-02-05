const bcrypt = require('bcryptjs');

// Test password hashing - this is the hash stored in database
const storedHash = '$2b$10$chZB9wtDq0LFs/p5IDy1dOgraHLqcbC9czO33sBcS.sJvaDMvq1M2';
const testPassword = 'password123';

bcrypt.compare(testPassword, storedHash).then(result => {
  console.log('Password match:', result);
  
  // Also test creating a session ID
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  console.log('Sample session ID:', sessionId);
}).catch(err => {
  console.error('Error:', err);
});

require('dotenv').config({ path: '.env.local' });

console.log('\n=== Environment Check ===');
console.log('MONGODB_URI found:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI value:', process.env.MONGODB_URI?.substring(0, 30) + '...');
console.log('Process CWD:', process.cwd());
console.log('\nTrying to connect to MongoDB...\n');

const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    const Student = mongoose.model('Student', new mongoose.Schema({}, { strict: false }));
    const count = await Student.countDocuments();
    console.log(`Found ${count} students in database`);
    
    const Dojo = mongoose.model('Dojo', new mongoose.Schema({}, { strict: false }));
    const dojoCount = await Dojo.countDocuments();
    console.log(`Found ${dojoCount} dojos in database`);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testConnection();

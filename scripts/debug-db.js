const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function debugDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Clear sessions
    try {
      await mongoose.connection.db.collection('sessions').drop();
      console.log('✅ Cleared sessions collection\n');
    } catch (error) {
      console.log('No sessions collection to clear\n');
    }

    // Check users
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`Found ${users.length} users in database:`);
    users.forEach(u => {
      console.log(`  - ${u.email} (${u.role}) - Approved: ${u.isApproved}`);
    });
    
    console.log('\n✅ Database check complete');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

debugDatabase();

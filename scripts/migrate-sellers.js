const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dojo-republic';

console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

// Simple schemas
const UserSchema = new mongoose.Schema({}, { strict: false });
const SellerSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Seller = mongoose.models.Seller || mongoose.model('Seller', SellerSchema);

async function migrateSellers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with role='seller'
    const sellerUsers = await User.find({ role: 'seller' });
    console.log(`Found ${sellerUsers.length} seller users`);

    let created = 0;
    let skipped = 0;

    for (const user of sellerUsers) {
      // Check if seller profile already exists
      const existingSeller = await Seller.findOne({ userId: user._id.toString() });
      
      if (existingSeller) {
        console.log(`Seller profile already exists for ${user.email} - skipping`);
        skipped++;
        continue;
      }

      // Create seller profile
      await Seller.create({
        userId: user._id.toString(),
        businessName: `${user.name}'s Store`,
        description: 'Martial arts equipment and gear seller',
        address: 'To be updated',
        phoneNumber: user.phoneNumber || '',
        email: user.email,
        logo: '',
        isApproved: user.isApproved || false,
        commissionRate: 10,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log(`✓ Created seller profile for ${user.email}`);
      created++;
    }

    console.log('\n✅ Migration complete!');
    console.log(`   Created: ${created} seller profiles`);
    console.log(`   Skipped: ${skipped} (already exist)`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateSellers();

const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

// Schema definitions
const UserSchema = new mongoose.Schema({}, { strict: false });
const DojoSchema = new mongoose.Schema({}, { strict: false });
const PlayerProfileSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Dojo = mongoose.models.Dojo || mongoose.model('Dojo', DojoSchema);
const PlayerProfile = mongoose.models.PlayerProfile || mongoose.model('PlayerProfile', PlayerProfileSchema);

async function createMissingProfiles() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with role 'player'
    const playerUsers = await User.find({ role: 'player' });
    console.log(`\nFound ${playerUsers.length} player users`);

    // Get all existing player profiles
    const existingProfiles = await PlayerProfile.find();
    const existingUserIds = existingProfiles.map(p => p.userId);
    console.log(`Found ${existingProfiles.length} existing player profiles`);

    // Find users without profiles
    const usersWithoutProfiles = playerUsers.filter(
      user => !existingUserIds.includes(user._id.toString())
    );

    console.log(`\n${usersWithoutProfiles.length} players need profiles\n`);

    if (usersWithoutProfiles.length === 0) {
      console.log('✅ All players already have profiles!');
      return;
    }

    // Get first available dojo for placeholder
    const firstDojo = await Dojo.findOne({ isApproved: true });
    if (!firstDojo) {
      console.error('❌ No approved dojos found. Please create at least one dojo first.');
      return;
    }

    const createdProfiles = [];

    // Create profiles for users without them
    for (const user of usersWithoutProfiles) {
      console.log(`Creating profile for: ${user.name} (${user.email})`);

      // Calculate approximate age (default to 25 if not available)
      const currentYear = new Date().getFullYear();
      const age = 25;
      const birthYear = currentYear - age;

      const profile = {
        userId: user._id.toString(),
        name: user.name,
        age: age,
        dateOfBirth: `${birthYear}-01-01`, // Placeholder date
        gender: 'male', // Default - user can update
        beltCategory: 'White Belt', // Default - user can update
        dojoId: firstDojo._id.toString(),
        city: 'Not specified', // User needs to update
        country: 'Not specified', // User needs to update
        weight: undefined,
        height: undefined,
        profileImage: undefined,
        achievements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const created = await PlayerProfile.create(profile);
      createdProfiles.push(created);
      console.log(`  ✅ Profile created with ID: ${created._id}`);
    }

    console.log(`\n🎉 Successfully created ${createdProfiles.length} player profiles!`);
    console.log('\n📝 Note: These profiles have placeholder data.');
    console.log('   Users should log in and update their profiles with correct information.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

createMissingProfiles();

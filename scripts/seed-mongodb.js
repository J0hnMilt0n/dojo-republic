const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dojo-republic';

console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Log URI with hidden password

// Simple schema definitions for seeding
const UserSchema = new mongoose.Schema({}, { strict: false });
const DojoSchema = new mongoose.Schema({}, { strict: false });
const PlayerProfileSchema = new mongoose.Schema({}, { strict: false });
const TournamentSchema = new mongoose.Schema({}, { strict: false });
const ProductSchema = new mongoose.Schema({}, { strict: false });
const SellerSchema = new mongoose.Schema({}, { strict: false });
const StudentSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Dojo = mongoose.models.Dojo || mongoose.model('Dojo', DojoSchema);
const PlayerProfile = mongoose.models.PlayerProfile || mongoose.model('PlayerProfile', PlayerProfileSchema);
const Tournament = mongoose.models.Tournament || mongoose.model('Tournament', TournamentSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Seller = mongoose.models.Seller || mongoose.model('Seller', SellerSchema);
const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Dojo.deleteMany({}),
      PlayerProfile.deleteMany({}),
      Tournament.deleteMany({}),
      Product.deleteMany({}),
      Seller.deleteMany({}),
      Student.deleteMany({}),
    ]);
    console.log('Data cleared');

    // Read JSON files
    const dataDir = path.join(__dirname, '..', 'data');
    
    const usersData = JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json'), 'utf8'));
    const dojosData = JSON.parse(fs.readFileSync(path.join(dataDir, 'dojos.json'), 'utf8'));
    const playersData = JSON.parse(fs.readFileSync(path.join(dataDir, 'players.json'), 'utf8'));
    const tournamentsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'tournaments.json'), 'utf8'));
    const productsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf8'));
    const sellersData = JSON.parse(fs.readFileSync(path.join(dataDir, 'sellers.json'), 'utf8'));
    const studentsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'students.json'), 'utf8'));

    // Note: Passwords in users.json are already hashed, so we don't need to hash them again
    console.log('Preparing data...');

    // Insert data
    console.log('Inserting users...');
    const insertedUsers = await User.insertMany(usersData);
    console.log(`Inserted ${insertedUsers.length} users`);

    console.log('Inserting dojos...');
    const insertedDojos = await Dojo.insertMany(dojosData);
    console.log(`Inserted ${insertedDojos.length} dojos`);

    console.log('Inserting players...');
    const insertedPlayers = await PlayerProfile.insertMany(playersData);
    console.log(`Inserted ${insertedPlayers.length} players`);

    console.log('Inserting tournaments...');
    const insertedTournaments = await Tournament.insertMany(tournamentsData);
    console.log(`Inserted ${insertedTournaments.length} tournaments`);

    console.log('Inserting products...');
    const insertedProducts = await Product.insertMany(productsData);
    console.log(`Inserted ${insertedProducts.length} products`);

    console.log('Inserting sellers...');
    const insertedSellers = await Seller.insertMany(sellersData);
    console.log(`Inserted ${insertedSellers.length} sellers`);

    console.log('Inserting students...');
    const insertedStudents = await Student.insertMany(studentsData);
    console.log(`Inserted ${insertedStudents.length} students`);

    console.log('\\n✅ Database seeded successfully!');
    console.log('\\nYou can now login with:');
    console.log('- Admin: admin@demo.com / password123');
    console.log('- Dojo Owner: owner@demo.com / password123');
    console.log('- Student: student@demo.com / password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\\nMongoDB connection closed');
  }
}

seedDatabase();

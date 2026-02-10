const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment');
  process.exit(1);
}

// Define schemas
const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  dojoId: String,
  beltLevel: String,
  parentId: String,
  age: Number,
  isActive: Boolean,
}, { collection: 'students' });

const DojoSchema = new mongoose.Schema({
  name: String,
  ownerId: String,
}, { collection: 'dojos' });

const Student = mongoose.model('Student', StudentSchema);
const Dojo = mongoose.model('Dojo', DojoSchema);

async function fixStudentDojos() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');

    // Find all students with invalid dojoId
    const students = await Student.find({});
    console.log(`\nFound ${students.length} total students`);

    let fixedCount = 0;
    let invalidCount = 0;

    // Get all available dojos
    const allDojos = await Dojo.find({});
    console.log(`Found ${allDojos.length} dojos`);
    
    if (allDojos.length === 0) {
      console.log('⚠️  No dojos found. Please create a dojo first.');
      return;
    }

    const firstDojo = allDojos[0];
    console.log(`Will assign students to: "${firstDojo.name}" (${firstDojo._id})`);

    for (const student of students) {
      // Check if dojoId is invalid or missing
      const hasInvalidDojo = !student.dojoId || !mongoose.Types.ObjectId.isValid(student.dojoId);
      
      if (hasInvalidDojo) {
        console.log(`\n❌ Invalid/missing dojoId for student: ${student.name} (${student.email}) - current: ${student.dojoId || 'null'}`);
        invalidCount++;

        await Student.updateOne(
          { _id: student._id },
          { dojoId: firstDojo._id.toString() }
        );
        console.log(`  ✅ Fixed: Assigned to dojo "${firstDojo.name}" (${firstDojo._id})`);
        fixedCount++;
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Total students: ${students.length}`);
    console.log(`Invalid dojoIds found: ${invalidCount}`);
    console.log(`Fixed: ${fixedCount}`);
    console.log(`\nDone!`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

fixStudentDojos();

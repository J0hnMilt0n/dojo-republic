require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dojo-republic';

console.log('Using MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

async function fixStudentDojos() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Student = mongoose.model('Student', new mongoose.Schema({}, { strict: false }));
    const Dojo = mongoose.model('Dojo', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find students without dojoId or with invalid dojoId
    const allStudents = await Student.find({});
    console.log(`\nChecking ${allStudents.length} students...`);

    let fixed = 0;
    let noDojoFound = 0;

    for (const student of allStudents) {
      let needsFix = false;
      let dojoExists = false;

      // Check if dojoId exists and is valid
      if (!student.dojoId) {
        needsFix = true;
        console.log(`\n❌ Student "${student.name}" has no dojoId`);
      } else {
        const dojo = await Dojo.findById(student.dojoId);
        if (!dojo) {
          needsFix = true;
          console.log(`\n❌ Student "${student.name}" has invalid dojoId: ${student.dojoId}`);
        } else {
          dojoExists = true;
          console.log(`\n✅ Student "${student.name}" correctly linked to "${dojo.name}"`);
        }
      }

      if (needsFix) {
        // Try to find a dojo to assign
        // First, check if there's a default/first dojo
        const dojos = await Dojo.find({});
        
        if (dojos.length > 0) {
          const dojo = dojos[0]; // Assign to first dojo as default
          console.log(`   📝 Assigning to dojo: "${dojo.name}" (${dojo._id})`);
          
          await Student.findByIdAndUpdate(student._id, {
            dojoId: dojo._id.toString()
          });
          
          fixed++;
        } else {
          console.log('   ⚠️  No dojos found in system to assign!');
          noDojoFound++;
        }
      }
    }

    console.log(`\n\n=== Summary ===`);
    console.log(`✅ Fixed: ${fixed} students`);
    console.log(`⚠️  No dojo available: ${noDojoFound} students`);
    console.log(`Total checked: ${allStudents.length}`);

    // Show current dojo count
    const dojoCount = await Dojo.countDocuments();
    console.log(`\nTotal dojos in system: ${dojoCount}`);
    
    if (dojoCount === 0) {
      console.log('\n⚠️  WARNING: No dojos found! Dojo owners need to create dojos first.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

fixStudentDojos();

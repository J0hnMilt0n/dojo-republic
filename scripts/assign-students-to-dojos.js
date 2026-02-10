require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dojo-republic';

console.log('Using MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials

async function assignStudentsToDojos() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const Student = mongoose.model('Student', new mongoose.Schema({}, { strict: false }));
    const Dojo = mongoose.model('Dojo', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Get all students
    const students = await Student.find({});
    console.log(`Found ${students.length} students\n`);

    // Get all dojos
    const dojos = await Dojo.find({});
    console.log(`Found ${dojos.length} dojos\n`);

    if (dojos.length === 0) {
      console.log('❌ No dojos found! Dojo owners must create dojos first.');
      console.log('   Parents can see their children, but they will show "No dojo assigned"');
      console.log('   until a dojo owner creates a dojo and assigns the students.\n');
      return;
    }

    let updated = 0;
    let alreadyAssigned = 0;
    let errors = 0;

    for (const student of students) {
      try {
        // Check if student already has a valid dojoId
        if (student.dojoId) {
          const dojoExists = await Dojo.findById(student.dojoId);
          if (dojoExists) {
            console.log(`✅ ${student.name} - already assigned to "${dojoExists.name}"`);
            alreadyAssigned++;
            continue;
          }
        }

        // Student needs dojo assignment
        // Strategy: Assign to the first dojo (or implement more sophisticated logic)
        const targetDojo = dojos[0];
        
        await Student.findByIdAndUpdate(student._id, {
          dojoId: targetDojo._id.toString()
        });

        console.log(`✏️  ${student.name} - assigned to "${targetDojo.name}"`);
        updated++;

      } catch (error) {
        console.log(`❌ ${student.name} - error: ${error.message}`);
        errors++;
      }
    }

    console.log('\n=== Summary ===');
    console.log(`✅ Already correctly assigned: ${alreadyAssigned}`);
    console.log(`✏️  Updated: ${updated}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📊 Total: ${students.length} students\n`);

    // Show dojo summary
    console.log('=== Dojo Summary ===');
    for (const dojo of dojos) {
      const studentCount = await Student.countDocuments({ dojoId: dojo._id.toString() });
      const owner = await User.findById(dojo.ownerId);
      console.log(`🥋 ${dojo.name}`);
      console.log(`   Owner: ${owner?.name || 'Unknown'} (${owner?.email || 'N/A'})`);
      console.log(`   Students: ${studentCount}\n`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

assignStudentsToDojos();

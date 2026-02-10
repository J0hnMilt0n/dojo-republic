require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dojo-republic';

console.log('Using MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

async function checkStudentDojos() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Student = mongoose.model('Student', new mongoose.Schema({}, { strict: false }));
    const Dojo = mongoose.model('Dojo', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find the parent user
    const parent = await User.findOne({ email: 'vineethjoseph868@gmail.com' });
    if (!parent) {
      console.log('Parent not found');
      return;
    }

    console.log('\nParent Info:');
    console.log('- ID:', parent._id.toString());
    console.log('- Name:', parent.name);
    console.log('- LinkedStudents:', parent.linkedStudents);

    // Find students linked to this parent
    const students = await Student.find({ 
      parentId: parent._id.toString() 
    });

    console.log('\n=== Students linked to parent ===');
    console.log(`Found ${students.length} students\n`);

    for (const student of students) {
      console.log(`Student: ${student.name}`);
      console.log(`  - ID: ${student._id}`);
      console.log(`  - Email: ${student.email}`);
      console.log(`  - DojoId: ${student.dojoId || 'NOT SET'}`);
      console.log(`  - ParentId: ${student.parentId || 'NOT SET'}`);
      
      if (student.dojoId) {
        const dojo = await Dojo.findById(student.dojoId);
        if (dojo) {
          console.log(`  - Dojo Name: ${dojo.name}`);
          console.log(`  - Dojo Owner: ${dojo.ownerId}`);
        } else {
          console.log(`  - Dojo: NOT FOUND (invalid ID)`);
        }
      }
      console.log('');
    }

    // Check all dojos in the system
    const allDojos = await Dojo.find({});
    console.log('\n=== All Dojos in System ===');
    console.log(`Found ${allDojos.length} dojos\n`);
    
    for (const dojo of allDojos) {
      console.log(`Dojo: ${dojo.name}`);
      console.log(`  - ID: ${dojo._id}`);
      console.log(`  - Owner ID: ${dojo.ownerId}`);
      const owner = await User.findById(dojo.ownerId);
      if (owner) {
        console.log(`  - Owner Name: ${owner.name} (${owner.email})`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

checkStudentDojos();

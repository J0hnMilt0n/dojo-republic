const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testStudentCreation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Import models
    const StudentSchema = new mongoose.Schema({
      userId: String,
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: String,
      age: { type: Number, required: true },
      gender: String,
      dojoId: { type: String, required: true },
      beltLevel: { type: String, required: true },
      parentId: String,
      enrollmentDate: { type: String, default: () => new Date().toISOString() },
      isActive: { type: Boolean, default: true },
      createdAt: { type: String, default: () => new Date().toISOString() },
      updatedAt: { type: String, default: () => new Date().toISOString() },
    });

    const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

    // Test data
    const testStudent = {
      name: 'Test Student',
      email: 'test@example.com',
      phone: '+1 555-1234',
      age: 10,
      gender: 'male',
      dojoId: 'dojo-1',
      beltLevel: 'White Belt',
    };

    console.log('Creating student with data:', testStudent);
    
    const student = await Student.create(testStudent);
    console.log('✅ Student created successfully!');
    console.log('Student ID:', student._id.toString());

    // Cleanup - delete the test student
    await Student.deleteOne({ _id: student._id });
    console.log('✅ Test student cleaned up');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      console.error('Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

testStudentCreation();

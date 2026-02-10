import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { StudentModel } from '@/lib/models';
import { getSession } from '@/lib/auth';

// GET all students
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const sessionId = request.cookies.get('session')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dojoId = searchParams.get('dojoId');
    const myStudents = searchParams.get('myStudents');
    const linkedToMe = searchParams.get('linkedToMe');

    let query: any = {};

    // Get user for role-based filtering
    const { UserModel } = await import('@/lib/models');
    const user = await UserModel.findById(session.userId).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert _id to id for consistency
    const userId = user._id.toString();

    // If parent requesting linked students
    if (linkedToMe === 'true' && user.role === 'parent') {
      // Query students by parentId for more reliable results
      console.log('Querying students with parentId:', userId);
      const students = await StudentModel.find({
        parentId: userId
      }).sort({ createdAt: -1 }).lean();
      
      console.log('Found students:', students.length, students.map(s => ({ id: s._id, name: s.name, parentId: s.parentId })));
      
      // Populate dojo information
      const { DojoModel } = await import('@/lib/models');
      const mongoose = await import('mongoose');
      const formattedStudents = await Promise.all(students.map(async (s) => {
        let dojoName = null;
        if (s.dojoId && mongoose.default.Types.ObjectId.isValid(s.dojoId)) {
          const dojo = await DojoModel.findById(s.dojoId).lean();
          dojoName = dojo?.name || null;
        }
        return {
          ...s,
          id: s._id?.toString() || s.id,
          dojoName,
          _id: undefined
        };
      }));

      return NextResponse.json({ students: formattedStudents });
    }

    // If requesting "my students", return students from user's dojo
    if (myStudents === 'true') {
      let userDojoId = user?.dojoId;
      
      // If user doesn't have dojoId set, try to find their dojo
      if (!userDojoId && user.role === 'dojo_owner') {
        const { DojoModel } = await import('@/lib/models');
        const dojo = await DojoModel.findOne({ ownerId: userId }).lean();
        
        if (dojo) {
          userDojoId = dojo._id.toString();
          // Update user's dojoId for future requests
          await UserModel.findByIdAndUpdate(userId, { dojoId: userDojoId });
        }
      }
      
      if (userDojoId) {
        query.dojoId = userDojoId;
      } else {
        // If still no dojo found, return empty array
        return NextResponse.json({ students: [] });
      }
    } else if (dojoId) {
      query.dojoId = dojoId;
    }

    const students = await StudentModel.find(query).sort({ createdAt: -1 }).lean();
    
    // Populate dojo information
    const { DojoModel } = await import('@/lib/models');
    const mongoose = await import('mongoose');
    const formattedStudents = await Promise.all(students.map(async (s) => {
      let dojoName = null;
      if (s.dojoId && mongoose.default.Types.ObjectId.isValid(s.dojoId)) {
        const dojo = await DojoModel.findById(s.dojoId).lean();
        dojoName = dojo?.name || null;
      }
      return {
        ...s,
        id: s._id?.toString() || s.id,
        dojoName,
        _id: undefined
      };
    }));

    return NextResponse.json({ students: formattedStudents });
  } catch (error) {
    console.error('Failed to fetch students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

// POST create new student
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const sessionId = request.cookies.get('session')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { UserModel } = await import('@/lib/models');
    const user = await UserModel.findById(session.userId).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert _id to id for consistency
    const userId = user._id.toString();

    // Only dojo_owner and coach can add students
    if (user.role !== 'dojo_owner' && user.role !== 'coach' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, phone, age, beltLevel, gender, dojoId: explicitDojoId } = body;

    if (!name || !email || !age || !beltLevel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get dojoId - priority: explicit dojoId from request, user's dojoId, find by ownerId
    let dojoId = explicitDojoId || user.dojoId;
    
    // If explicit dojoId provided, verify user owns it
    if (explicitDojoId && user.role === 'dojo_owner') {
      const { DojoModel } = await import('@/lib/models');
      const dojo = await DojoModel.findById(explicitDojoId).lean();
      
      if (!dojo || dojo.ownerId !== userId) {
        return NextResponse.json({ 
          error: 'You do not have permission to add students to this dojo'
        }, { status: 403 });
      }
      
      dojoId = explicitDojoId;
    }
    
    if (!dojoId && user.role === 'dojo_owner') {
      // Try to find dojo by ownerId
      const { DojoModel } = await import('@/lib/models');
      const dojo = await DojoModel.findOne({ ownerId: userId }).lean();
      
      if (dojo) {
        dojoId = dojo._id.toString();
        // Update user's dojoId for future
        await UserModel.findByIdAndUpdate(userId, { dojoId });
      }
    }

    if (!dojoId) {
      // Allow dojo owners to create students even without a dojo
      // The students will be automatically assigned when the dojo is created
      if (user.role === 'dojo_owner') {
        console.log(`⚠️  Dojo owner ${user.name} is creating student without a dojo. Student will be assigned when dojo is created.`);
        // Set dojoId to null - will be updated when dojo is created
        dojoId = null;
      } else if (user.role === 'admin') {
        // Admin can create students without dojo
        dojoId = null;
      } else {
        return NextResponse.json({ 
          error: 'Your account is not associated with any dojo. Please contact your dojo owner.',
          code: 'NO_DOJO'
        }, { status: 400 });
      }
    }

    const studentData = {
      name,
      email,
      phone: phone || '',
      age: parseInt(age),
      gender: gender || '',
      dojoId: dojoId,
      beltLevel,
      enrollmentDate: new Date().toISOString(),
      isActive: true,
    };

    const student = await StudentModel.create(studentData);

    // Ensure user's dojoId is updated if it exists
    if (dojoId && user.dojoId !== dojoId) {
      await UserModel.findByIdAndUpdate(userId, { dojoId });
    }

    return NextResponse.json({
      message: 'Student added successfully',
      student: {
        ...student.toObject(),
        id: student._id.toString(),
        _id: undefined
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create student:', error);
    const errorMessage = error.message || 'Failed to create student';
    return NextResponse.json({ 
      error: errorMessage,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : undefined
    }, { status: 500 });
  }
}

// PUT update student
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const sessionId = request.cookies.get('session')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { UserModel } = await import('@/lib/models');
    const user = await UserModel.findById(session.userId).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only dojo_owner and coach can update students
    if (user.role !== 'dojo_owner' && user.role !== 'coach' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, email, phone, age, beltLevel, gender, isActive, dojoId } = body;

    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (age) updateData.age = parseInt(age);
    if (beltLevel) updateData.beltLevel = beltLevel;
    if (gender !== undefined) updateData.gender = gender;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Handle dojo assignment change
    if (dojoId) {
      // Verify user has permission to assign to this dojo
      if (user.role === 'dojo_owner') {
        const { DojoModel } = await import('@/lib/models');
        const dojo = await DojoModel.findById(dojoId).lean();
        
        if (!dojo || dojo.ownerId !== userId) {
          return NextResponse.json({ 
            error: 'You do not have permission to assign students to this dojo'
          }, { status: 403 });
        }
      }
      updateData.dojoId = dojoId;
    }

    const student = await StudentModel.findByIdAndUpdate(id, updateData, { new: true }).lean();

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Student updated successfully',
      student: {
        ...student,
        id: student._id?.toString() || id,
        _id: undefined
      }
    });
  } catch (error) {
    console.error('Failed to update student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}

// DELETE student
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const sessionId = request.cookies.get('session')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { UserModel } = await import('@/lib/models');
    const user = await UserModel.findById(session.userId).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only dojo_owner and coach can delete students
    if (user.role !== 'dojo_owner' && user.role !== 'coach' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const result = await StudentModel.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Failed to delete student:', error);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}

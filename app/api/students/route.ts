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

    // If parent requesting linked students
    if (linkedToMe === 'true' && user.role === 'parent') {
      if (user.linkedStudents && user.linkedStudents.length > 0) {
        const students = await StudentModel.find({
          _id: { $in: user.linkedStudents }
        }).sort({ createdAt: -1 }).lean();
        
        const formattedStudents = students.map(s => ({
          ...s,
          id: s._id?.toString() || s.id,
          _id: undefined
        }));

        return NextResponse.json({ students: formattedStudents });
      } else {
        return NextResponse.json({ students: [] });
      }
    }

    // If requesting "my students", return students from user's dojo
    if (myStudents === 'true') {
      if (user?.dojoId) {
        query.dojoId = user.dojoId;
      } else {
        // If user doesn't have a dojoId, return empty array
        return NextResponse.json({ students: [] });
      }
    } else if (dojoId) {
      query.dojoId = dojoId;
    }

    const students = await StudentModel.find(query).sort({ createdAt: -1 }).lean();
    
    const formattedStudents = students.map(s => ({
      ...s,
      id: s._id?.toString() || s.id,
      _id: undefined
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
      
      if (!dojo || dojo.ownerId !== user._id.toString()) {
        return NextResponse.json({ 
          error: 'You do not have permission to add students to this dojo'
        }, { status: 403 });
      }
      
      dojoId = explicitDojoId;
    }
    
    if (!dojoId && user.role === 'dojo_owner') {
      // Try to find dojo by ownerId
      const { DojoModel } = await import('@/lib/models');
      const dojo = await DojoModel.findOne({ ownerId: user._id.toString() }).lean();
      
      if (dojo) {
        dojoId = dojo._id.toString();
        // Update user's dojoId for future
        await UserModel.findByIdAndUpdate(user._id, { dojoId });
      }
    }

    if (!dojoId) {
      if (user.role === 'dojo_owner') {
        return NextResponse.json({ 
          error: 'Please create a dojo first before adding students',
          code: 'NO_DOJO'
        }, { status: 400 });
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
    const { id, name, email, phone, age, beltLevel, gender, isActive } = body;

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

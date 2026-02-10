import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { StudentModel, UserModel } from '@/lib/models';
import { getUserFromSession } from '@/lib/auth';
import mongoose from 'mongoose';

// POST - Link student to parent
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const sessionId = request.cookies.get('session')?.value;
    const user = await getUserFromSession(sessionId);

    if (!user || user.role !== 'parent') {
      return NextResponse.json({ error: 'Unauthorized. Only parents can link students.' }, { status: 403 });
    }

    const body = await request.json();
    const { studentId, email, name } = body;

    let student;

    // Try to find student by ID, email, or name
    if (studentId) {
      // Check if it's a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(studentId)) {
        student = await StudentModel.findById(studentId).lean();
      } else {
        return NextResponse.json({ 
          error: 'Invalid student ID format. Please use email or contact your dojo for the correct ID.' 
        }, { status: 400 });
      }
    } else if (email) {
      // Search by email
      student = await StudentModel.findOne({ 
        email: email.toLowerCase().trim() 
      }).lean();
      
      if (!student) {
        return NextResponse.json({ 
          error: 'No student found with that email address. Please check and try again.' 
        }, { status: 404 });
      }
    } else if (name) {
      // Search by exact name match
      const students = await StudentModel.find({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
      }).lean();
      
      if (students.length === 0) {
        return NextResponse.json({ 
          error: 'No student found with that name. Please try using their email address instead.' 
        }, { status: 404 });
      } else if (students.length > 1) {
        return NextResponse.json({ 
          error: 'Multiple students found with that name. Please use their email address for precise matching.' 
        }, { status: 400 });
      }
      student = students[0];
    } else {
      return NextResponse.json({ 
        error: 'Please provide either student ID, email, or name' 
      }, { status: 400 });
    }

    if (!student) {
      return NextResponse.json({ error: 'Student not found. Please check the information and try again.' }, { status: 404 });
    }

    const studentIdStr = student._id.toString();

    // Check if student is already linked to this parent
    const parentUser = await UserModel.findById(user.id);
    if (parentUser?.linkedStudents?.includes(studentIdStr)) {
      return NextResponse.json({ error: 'This student is already linked to your account.' }, { status: 400 });
    }

    // Check if student is already linked to another parent
    if (student.parentId && student.parentId !== user.id) {
      return NextResponse.json({ 
        error: 'This student is already linked to another parent account.' 
      }, { status: 400 });
    }

    console.log('Linking student:', studentIdStr, 'to parent:', user.id);

    // Link student to parent
    await UserModel.findByIdAndUpdate(
      user.id,
      { $addToSet: { linkedStudents: studentIdStr } }
    );

    // Update student's parentId
    await StudentModel.findByIdAndUpdate(
      studentIdStr,
      { parentId: user.id }
    );

    console.log('Student linked successfully. parentId set to:', user.id);

    return NextResponse.json({ 
      message: 'Student linked successfully',
      student: {
        id: student._id.toString(),
        name: student.name,
        beltLevel: student.beltLevel
      }
    });
  } catch (error: any) {
    console.error('Link student error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to link student' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { StudentModel, UserModel } from '@/lib/models';
import { getUserFromSession } from '@/lib/auth';

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
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Find the student
    const student = await StudentModel.findById(studentId).lean();

    if (!student) {
      return NextResponse.json({ error: 'Student not found. Please check the ID and try again.' }, { status: 404 });
    }

    // Check if student is already linked to this parent
    const parentUser = await UserModel.findById(user.id);
    if (parentUser?.linkedStudents?.includes(studentId)) {
      return NextResponse.json({ error: 'This student is already linked to your account.' }, { status: 400 });
    }

    // Link student to parent
    await UserModel.findByIdAndUpdate(
      user.id,
      { $addToSet: { linkedStudents: studentId } }
    );

    // Update student's parentId
    await StudentModel.findByIdAndUpdate(
      studentId,
      { parentId: user.id }
    );

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

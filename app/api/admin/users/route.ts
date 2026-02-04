import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserModel } from '@/lib/models';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const sessionId = request.cookies.get('session')?.value;
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(session.userId).lean();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get all users
    const users = await UserModel.find({}).select('-password').lean();

    return NextResponse.json({ 
      users: users.map(u => ({
        ...u,
        id: u._id.toString(),
        _id: u._id.toString(),
      }))
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

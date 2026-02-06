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

    const session = await getSession(sessionId);
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

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const sessionId = request.cookies.get('session')?.value;
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = await getSession(sessionId);
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

    const { userId, isApproved } = await request.json();

    // Update user approval status
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isApproved, updatedAt: new Date() },
      { new: true }
    ).select('-password').lean();

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      user: {
        ...updatedUser,
        id: updatedUser._id.toString(),
        _id: updatedUser._id.toString(),
      }
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const sessionId = request.cookies.get('session')?.value;
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const session = await getSession(sessionId);
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if trying to delete admin user
    const userToDelete = await UserModel.findById(userId).lean();
    if (!userToDelete) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (userToDelete.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 403 }
      );
    }

    // Delete the user
    await UserModel.findByIdAndDelete(userId);

    // Optional: Clean up related data (sessions, etc.)
    const { SessionModel } = await import('@/lib/models');
    await SessionModel.deleteMany({ userId });

    return NextResponse.json({ 
      message: 'User deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}


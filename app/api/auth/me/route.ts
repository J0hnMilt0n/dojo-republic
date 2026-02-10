import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserModel } from '@/lib/models';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Try to connect to DB, but handle gracefully if it fails
    try {
      await connectDB();
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json({ user: null }, { status: 503 });
    }
    
    const sessionId = request.cookies.get('session')?.value;
    if (!sessionId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    
    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    
    const user = await UserModel.findById(session.userId).lean();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phoneNumber: user.phoneNumber,
      isApproved: user.isApproved,
    };
    
    return NextResponse.json({ user: userResponse });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}


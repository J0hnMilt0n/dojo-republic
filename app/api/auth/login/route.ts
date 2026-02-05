import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UserModel } from '@/lib/models';
import { comparePassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is approved (for certain roles)
    if (!user.isApproved && ['dojo_owner', 'coach', 'referee', 'judge', 'seller'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Your account is pending approval' },
        { status: 403 }
      );
    }

    const userId = user._id.toString();
    // Create session
    const sessionId = await createSession(userId);

    // Set cookie
    const response = NextResponse.json({
      user: {
        id: userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}


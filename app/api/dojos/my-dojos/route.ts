import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { DojoModel } from '@/lib/models';
import { getUserFromSession } from '@/lib/auth';

// GET dojos owned by current user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const sessionId = request.cookies.get('session')?.value;
    const user = await getUserFromSession(sessionId);

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let query: any = {};

    // Get dojos based on role
    if (user.role === 'dojo_owner') {
      query.ownerId = user.id;
    } else if (user.role === 'admin') {
      // Admins can see all dojos
      query = {};
    } else {
      // Other roles can only see their assigned dojo
      if (user.dojoId) {
        query._id = user.dojoId;
      } else {
        return NextResponse.json({ dojos: [] });
      }
    }

    const dojos = await DojoModel.find(query).lean();

    const formattedDojos = dojos.map(dojo => ({
      ...dojo,
      id: dojo._id?.toString() || dojo.id,
      _id: undefined
    }));

    return NextResponse.json({ dojos: formattedDojos });
  } catch (error) {
    console.error('Failed to fetch user dojos:', error);
    return NextResponse.json({ error: 'Failed to fetch dojos' }, { status: 500 });
  }
}

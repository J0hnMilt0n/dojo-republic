import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TournamentModel, UserModel } from '@/lib/models';
import { getSession } from '@/lib/auth';
import { Tournament } from '@/lib/types';

// GET all tournaments
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');
    const upcoming = searchParams.get('upcoming');
    const city = searchParams.get('city');
    const myTournaments = searchParams.get('myTournaments');

    let query: any = {};

    // Check if user is authenticated and wants their own tournaments
    const sessionId = request.cookies.get('session')?.value;
    let currentUserId: string | null = null;
    
    if (sessionId) {
      const session = await getSession(sessionId);
      if (session) {
        currentUserId = session.userId;
      }
    }

    // If requesting "my tournaments", return user's own tournaments regardless of approval
    if (myTournaments === 'true' && currentUserId) {
      query.organizerId = currentUserId;
    } else {
      // Filter by approval (public only sees approved)
      if (approved === 'true' || !searchParams.has('approved')) {
        query.isApproved = true;
        query.isPublished = true;
      }
    }

    // Filter upcoming tournaments
    if (upcoming === 'true') {
      query.startDate = { $gt: new Date().toISOString() };
    }

    // Filter by city
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const tournaments = await TournamentModel.find(query).sort({ startDate: 1 }).lean();
    
    const formattedTournaments = tournaments.map(t => ({
      ...t,
      id: t._id?.toString() || t.id,
      _id: undefined
    }));

    return NextResponse.json({ tournaments: formattedTournaments });
  } catch (error) {
    console.error('Failed to fetch tournaments:', error);
    return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
  }
}

// POST create tournament
export async function POST(request: NextRequest) {
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
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userDoc = await UserModel.findById(session.userId).lean();
    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const user = {
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name,
      role: userDoc.role,
    };

    // Check if user has required role
    const allowedRoles = ['dojo_owner', 'coach', 'referee', 'judge', 'admin'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      martialArt,
      startDate,
      endDate,
      registrationDeadline,
      venue,
      city,
      country,
      categories,
      rules,
      contactEmail,
      contactPhone,
      maxParticipants,
      registrationFee,
      posterImage,
    } = body;

    // Validation
    if (!name || !description || !startDate || !endDate || !venue || !city) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const tournamentData = {
      name,
      description,
      organizerId: user.id,
      organizerType: user.role as any,
      martialArt: martialArt || 'Karate',
      startDate,
      endDate,
      registrationDeadline: registrationDeadline || startDate,
      venue,
      city,
      country: country || 'India',
      categories: categories || [],
      rules: rules || '',
      contactEmail: contactEmail || user.email,
      contactPhone: contactPhone || '',
      maxParticipants,
      registrationFee: registrationFee || 0,
      posterImage,
      isApproved: user.role === 'admin', // Auto-approve if admin
      isPublished: user.role === 'admin',
      participants: [],
      results: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createdTournament = await TournamentModel.create(tournamentData);
    const tournament = {
      ...createdTournament.toObject(),
      id: createdTournament._id.toString(),
      _id: undefined
    };

    return NextResponse.json({ tournament }, { status: 201 });
  } catch (error: any) {
    console.error('Tournament creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create tournament' },
      { status: 500 }
    );
  }
}

// PUT update tournament
export async function PUT(request: NextRequest) {
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
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userDoc = await UserModel.findById(session.userId).lean();
    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const user = {
      id: userDoc._id.toString(),
      role: userDoc.role,
    };

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Tournament ID required' },
        { status: 400 }
      );
    }

    // Find tournament
    const tournament = await TournamentModel.findById(id);
    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    // Check if user is owner or admin
    if (tournament.organizerId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to update this tournament' },
        { status: 403 }
      );
    }

    // Update tournament
    Object.assign(tournament, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
    
    await tournament.save();

    const updatedTournament = {
      ...tournament.toObject(),
      id: tournament._id.toString(),
      _id: undefined
    };

    return NextResponse.json({ tournament: updatedTournament });
  } catch (error: any) {
    console.error('Tournament update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update tournament' },
      { status: 500 }
    );
  }
}

// DELETE tournament
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
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userDoc = await UserModel.findById(session.userId).lean();
    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const user = {
      id: userDoc._id.toString(),
      role: userDoc.role,
    };

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Tournament ID required' },
        { status: 400 }
      );
    }

    // Find tournament
    const tournament = await TournamentModel.findById(id);
    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      );
    }

    // Check if user is owner or admin
    if (tournament.organizerId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to delete this tournament' },
        { status: 403 }
      );
    }

    await TournamentModel.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Tournament deleted successfully' });
  } catch (error: any) {
    console.error('Tournament deletion error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete tournament' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TournamentModel } from '@/lib/models';
import { getUserFromSession, requireRole } from '@/lib/auth';
import { Tournament } from '@/lib/types';

// GET all tournaments
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');
    const upcoming = searchParams.get('upcoming');
    const city = searchParams.get('city');

    let query: any = {};

    // Filter by approval (public only sees approved)
    if (approved === 'true' || !searchParams.has('approved')) {
      query.isApproved = true;
      query.isPublished = true;
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
    const sessionId = request.cookies.get('session')?.value;
    const user = getUserFromSession(sessionId);
    requireRole(user, ['dojo_owner', 'coach', 'referee', 'judge', 'admin']);

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

    const newTournament: Tournament = {
      id: generateId(),
      name,
      description,
      organizerId: user!.id,
      organizerType: user!.role as any,
      martialArt: martialArt || 'Karate',
      startDate,
      endDate,
      registrationDeadline: registrationDeadline || startDate,
      venue,
      city,
      country: country || 'India',
      categories: categories || [],
      rules: rules || '',
      contactEmail: contactEmail || user!.email,
      contactPhone: contactPhone || '',
      maxParticipants,
      registrationFee: registrationFee || 0,
      posterImage,
      isApproved: user!.role === 'admin', // Auto-approve if admin
      isPublished: user!.role === 'admin',
      participants: [],
      results: [],
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    tournamentsDB.create(newTournament);

    return NextResponse.json({ tournament: newTournament }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create tournament' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PlayerProfileModel } from '@/lib/models';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const players = await PlayerProfileModel.find().lean();
    
    const formattedPlayers = players.map(player => ({
      ...player,
      id: player._id?.toString() || player.id,
      _id: undefined
    }));

    return NextResponse.json({ players: formattedPlayers });
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Check if player profile already exists for this user
    const existingProfile = await PlayerProfileModel.findOne({ userId: user.id });
    if (existingProfile) {
      return NextResponse.json({ error: 'Player profile already exists' }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      age,
      dateOfBirth,
      gender,
      beltCategory,
      dojoId,
      city,
      country,
      weight,
      height,
      profileImage
    } = body;

    // Validate required fields
    if (!name || !age || !dateOfBirth || !gender || !beltCategory || !dojoId || !city || !country) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    const playerProfile = await PlayerProfileModel.create({
      userId: user.id,
      name,
      age,
      dateOfBirth,
      gender,
      beltCategory,
      dojoId,
      city,
      country,
      weight,
      height,
      profileImage,
      achievements: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true,
      player: {
        ...playerProfile.toObject(),
        id: playerProfile._id.toString(),
        _id: undefined
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create player profile:', error);
    return NextResponse.json({ error: 'Failed to create player profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { 
      playerId,
      name,
      age,
      dateOfBirth,
      gender,
      beltCategory,
      dojoId,
      city,
      country,
      weight,
      height,
      profileImage,
      achievements
    } = body;

    // Find the player profile
    const playerProfile = await PlayerProfileModel.findById(playerId);
    if (!playerProfile) {
      return NextResponse.json({ error: 'Player profile not found' }, { status: 404 });
    }

    // Check if user owns this profile or is admin
    if (playerProfile.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update player profile
    if (name !== undefined) playerProfile.name = name;
    if (age !== undefined) playerProfile.age = age;
    if (dateOfBirth !== undefined) playerProfile.dateOfBirth = dateOfBirth;
    if (gender !== undefined) playerProfile.gender = gender;
    if (beltCategory !== undefined) playerProfile.beltCategory = beltCategory;
    if (dojoId !== undefined) playerProfile.dojoId = dojoId;
    if (city !== undefined) playerProfile.city = city;
    if (country !== undefined) playerProfile.country = country;
    if (weight !== undefined) playerProfile.weight = weight;
    if (height !== undefined) playerProfile.height = height;
    if (profileImage !== undefined) playerProfile.profileImage = profileImage;
    if (achievements !== undefined) playerProfile.achievements = achievements;
    
    playerProfile.updatedAt = new Date().toISOString();

    await playerProfile.save();

    return NextResponse.json({
      success: true,
      player: {
        ...playerProfile.toObject(),
        id: playerProfile._id.toString(),
        _id: undefined
      }
    });
  } catch (error) {
    console.error('Failed to update player profile:', error);
    return NextResponse.json({ error: 'Failed to update player profile' }, { status: 500 });
  }
}


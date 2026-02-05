import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PlayerProfileModel } from '@/lib/models';

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


import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { DojoModel } from '@/lib/models';
import { getUserFromSession, requireRole } from '@/lib/auth';
import { Dojo } from '@/lib/types';

// GET all dojos (public + filtered)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const martialArt = searchParams.get('martialArt');
    const approved = searchParams.get('approved');

    let query: any = {};

    // Filter by approval status (public views only see approved)
    if (approved === 'true' || !searchParams.has('approved')) {
      query.isApproved = true;
    }

    // Filter by city
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Filter by martial art
    if (martialArt) {
      query.martialArts = { $regex: martialArt, $options: 'i' };
    }

    const dojos = await DojoModel.find(query).lean();
    
    // Convert MongoDB _id to id
    const formattedDojos = dojos.map(dojo => ({
      ...dojo,
      id: dojo._id?.toString() || dojo.id,
      _id: undefined
    }));

    return NextResponse.json({ dojos: formattedDojos });
  } catch (error) {
    console.error('Failed to fetch dojos:', error);
    return NextResponse.json({ error: 'Failed to fetch dojos' }, { status: 500 });
  }
}

// POST create new dojo
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const sessionId = request.cookies.get('session')?.value;
    const user = getUserFromSession(sessionId);
    requireRole(user, ['dojo_owner', 'admin']);

    const body = await request.json();
    const {
      name,
      description,
      martialArts,
      address,
      city,
      country,
      phoneNumber,
      email,
      website,
      images,
      pricing,
      schedule,
      latitude,
      longitude,
    } = body;

    // Validation
    if (!name || !description || !martialArts || !address || !city || !phoneNumber || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newDojo = await DojoModel.create({
      name,
      ownerId: user!.id,
      description,
      martialArts,
      address,
      city,
      country: country || 'India',
      latitude,
      longitude,
      phoneNumber,
      email,
      website,
      images: images || [],
      pricing: pricing || [],
      schedule: schedule || [],
      isApproved: user!.role === 'admin', // Auto-approve if admin
    });

    const formattedDojo = {
      ...newDojo.toObject(),
      id: newDojo._id.toString(),
      _id: undefined
    };

    return NextResponse.json({ dojo: formattedDojo }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create dojo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create dojo' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}

// PATCH update dojo (for approval or editing)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const sessionId = request.cookies.get('session')?.value;
    const user = getUserFromSession(sessionId);
    
    const body = await request.json();
    const { id, isApproved, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Dojo ID required' }, { status: 400 });
    }
    
    // Check permissions
    if (isApproved !== undefined) {
      requireRole(user, ['admin']);
    }
    
    const updateData: any = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (Object.keys(updates).length > 0) {
      Object.assign(updateData, updates);
    }
    updateData.updatedAt = new Date().toISOString();
    
    const dojo = await DojoModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    
    if (!dojo) {
      return NextResponse.json({ error: 'Dojo not found' }, { status: 404 });
    }
    
    const formattedDojo = {
      ...dojo,
      id: dojo._id.toString(),
      _id: undefined
    };
    
    return NextResponse.json({ dojo: formattedDojo });
  } catch (error: any) {
    console.error('Failed to update dojo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update dojo' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}


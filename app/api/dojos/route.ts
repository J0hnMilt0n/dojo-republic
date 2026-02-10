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

    // Check if user is admin
    const sessionId = request.cookies.get('session')?.value;
    const user = sessionId ? await getUserFromSession(sessionId) : null;
    const isAdmin = user?.role === 'admin';

    let query: any = {};

    // Filter by approval status (public views only see approved, admins see all)
    if (!isAdmin) {
      if (approved === 'true' || !searchParams.has('approved')) {
        query.isApproved = true;
      }
    } else if (approved === 'true') {
      query.isApproved = true;
    } else if (approved === 'false') {
      query.isApproved = false;
    }
    // If admin and no approved param, show all dojos

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
    const user = await getUserFromSession(sessionId);
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

    const newDojoId = newDojo._id.toString();

    // Update user's dojoId
    const { UserModel, StudentModel } = await import('@/lib/models');
    await UserModel.findByIdAndUpdate(user!.id, { dojoId: newDojoId });

    // IMPORTANT: Assign all students without a valid dojoId to this new dojo
    // This handles the case where the owner created students before creating the dojo
    try {
      // Step 1: Get all valid dojo IDs
      const validDojos = await DojoModel.find({}, { _id: 1 }).lean();
      const validDojoIds = validDojos.map(d => d._id.toString());

      // Step 2: Find students with no dojoId or invalid dojoId
      const studentsToUpdate = await StudentModel.find({
        $or: [
          { dojoId: { $exists: false } },
          { dojoId: null },
          { dojoId: '' },
          { dojoId: { $nin: validDojoIds } }
        ]
      }).lean();

      if (studentsToUpdate.length > 0) {
        const studentIds = studentsToUpdate.map(s => s._id);
        const updateResult = await StudentModel.updateMany(
          { _id: { $in: studentIds } },
          { $set: { dojoId: newDojoId } }
        );
        
        console.log(`✅ Assigned ${updateResult.modifiedCount} students to new dojo "${name}" (ID: ${newDojoId})`);
      } else {
        console.log(`ℹ️  No unassigned students found when creating dojo "${name}"`);
      }
    } catch (error) {
      console.error('Error assigning students to new dojo:', error);
      // Don't fail the dojo creation if student assignment fails
    }

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
    const user = await getUserFromSession(sessionId);
    
    const body = await request.json();
    const { id, isApproved, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Dojo ID required' }, { status: 400 });
    }
    
    // Find the dojo first to check ownership
    const existingDojo = await DojoModel.findById(id).lean();
    if (!existingDojo) {
      return NextResponse.json({ error: 'Dojo not found' }, { status: 404 });
    }
    
    // Check permissions
    if (isApproved !== undefined) {
      requireRole(user, ['admin']);
    } else {
      // For regular updates, check if user owns the dojo or is admin
      if (user!.role !== 'admin' && existingDojo.ownerId !== user!.id) {
        return NextResponse.json({ 
          error: 'Unauthorized. You can only edit your own dojo.' 
        }, { status: 403 });
      }
    }
    
    const updateData: any = {};
    
    // Handle approval
    if (isApproved !== undefined) {
      updateData.isApproved = isApproved;
    }
    
    // Handle other updates
    if (Object.keys(updates).length > 0) {
      // Allowed fields for update
      const allowedFields = [
        'name', 'description', 'martialArts', 'address', 'city', 'country',
        'phoneNumber', 'email', 'website', 'images', 'pricing', 'schedule',
        'latitude', 'longitude'
      ];
      
      for (const key of allowedFields) {
        if (updates[key] !== undefined) {
          updateData[key] = updates[key];
        }
      }
    }
    
    updateData.updatedAt = new Date().toISOString();
    
    const dojo = await DojoModel.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).lean();
    
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
      { 
        error: error.message || 'Failed to update dojo',
        details: error.errors ? Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        })) : undefined
      },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}

// DELETE dojo
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const sessionId = request.cookies.get('session')?.value;
    const user = await getUserFromSession(sessionId);
    requireRole(user, ['admin', 'dojo_owner']);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Dojo ID required' }, { status: 400 });
    }

    const dojo = await DojoModel.findById(id).lean();
    if (!dojo) {
      return NextResponse.json({ error: 'Dojo not found' }, { status: 404 });
    }

    // Check ownership
    if (user!.role !== 'admin' && dojo.ownerId !== user!.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await DojoModel.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Dojo deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete dojo:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete dojo' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { SellerModel } from '@/lib/models';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const sellers = await SellerModel.find({}).lean();
    
    const formattedSellers = sellers.map(s => ({
      ...s,
      id: s._id?.toString() || s.id,
      _id: undefined
    }));

    return NextResponse.json({ sellers: formattedSellers });
  } catch (error) {
    console.error('Failed to fetch sellers:', error);
    return NextResponse.json({ error: 'Failed to fetch sellers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { businessName, description, address, phoneNumber, email, logo, commissionRate } = data;

    if (!businessName || !description || !address || !phoneNumber || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newSeller = await SellerModel.create({
      userId: user.id,
      businessName,
      description,
      address,
      phoneNumber,
      email,
      logo,
      commissionRate: commissionRate || 10,
      isApproved: user.role === 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true,
      seller: {
        ...newSeller.toObject(),
        id: newSeller._id.toString(),
        _id: undefined
      }
    });
  } catch (error) {
    console.error('Failed to create seller:', error);
    return NextResponse.json({ error: 'Failed to create seller' }, { status: 500 });
  }
}

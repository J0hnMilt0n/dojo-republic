import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { SellerModel, UserModel } from '@/lib/models';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sellerId, isApproved } = await request.json();

    if (!sellerId || isApproved === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const seller = await SellerModel.findByIdAndUpdate(
      sellerId,
      { 
        isApproved,
        updatedAt: new Date().toISOString()
      },
      { new: true }
    );

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    // Update user's isApproved status as well
    await UserModel.findByIdAndUpdate(seller.userId, { isApproved });

    return NextResponse.json({ 
      success: true,
      seller: {
        ...seller.toObject(),
        id: seller._id.toString(),
        _id: undefined
      }
    });
  } catch (error) {
    console.error('Failed to update seller approval:', error);
    return NextResponse.json({ error: 'Failed to update seller approval' }, { status: 500 });
  }
}

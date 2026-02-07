import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ProductModel } from '@/lib/models';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, isApproved } = await request.json();

    if (!productId || isApproved === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { 
        isApproved,
        updatedAt: new Date().toISOString()
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      product: {
        ...product.toObject(),
        id: product._id.toString(),
        _id: undefined
      }
    });
  } catch (error) {
    console.error('Failed to update product approval:', error);
    return NextResponse.json({ error: 'Failed to update product approval' }, { status: 500 });
  }
}

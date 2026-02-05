import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ProductModel } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');

    let query: any = {};

    // Filter by approval status
    if (approved === 'true') {
      query.isApproved = true;
      query.isActive = true;
    }

    const products = await ProductModel.find(query).lean();
    
    const formattedProducts = products.map(p => ({
      ...p,
      id: p._id?.toString() || p.id,
      _id: undefined
    }));

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}


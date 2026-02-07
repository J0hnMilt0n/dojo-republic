import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ProductModel } from '@/lib/models';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const approved = searchParams.get('approved');
    const myProducts = searchParams.get('myProducts');

    let query: any = {};

    // Filter by approval status
    if (approved === 'true') {
      query.isApproved = true;
      query.isActive = true;
    }

    // Filter by seller's own products
    if (myProducts === 'true') {
      const user = await verifyAuth(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      query.sellerId = user.id;
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { name, description, category, price, stock } = data;

    if (!name || !description || !category || price === undefined || stock === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await ProductModel.create({
      name,
      description,
      category,
      price,
      stock,
      sellerId: user.id,
      images: [],
      specifications: {},
      isActive: true,
      isApproved: user.role === 'admin', // Auto-approve for admins
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true,
      product: {
        ...newProduct.toObject(),
        id: newProduct._id.toString(),
        _id: undefined
      }
    });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, name, description, category, price, stock, isActive } = data;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Find the product
    const product = await ProductModel.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if user owns the product or is admin
    if (product.sellerId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        price,
        stock,
        isActive,
        updatedAt: new Date().toISOString(),
      },
      { new: true }
    );

    return NextResponse.json({ 
      success: true,
      product: {
        ...updatedProduct?.toObject(),
        id: updatedProduct?._id.toString(),
        _id: undefined
      }
    });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Find the product
    const product = await ProductModel.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if user owns the product or is admin
    if (product.sellerId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the product
    await ProductModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { OrderModel, ProductModel, UserModel } from '@/lib/models';
import { getUserFromSession } from '@/lib/auth';

// GET orders (for sellers to view their orders)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const sessionId = request.cookies.get('session')?.value;
    const user = sessionId ? await getUserFromSession(sessionId) : null;

    const { searchParams } = new URL(request.url);
    const myOrders = searchParams.get('myOrders');

    let query: any = {};

    if (myOrders === 'true' && user) {
      // If user is a seller, show their orders
      if (user.role === 'seller') {
        // Get seller document to find sellerId
        const { SellerModel } = await import('@/lib/models');
        const seller = await SellerModel.findOne({ userId: user.id }).lean();
        
        if (seller) {
          query.sellerId = seller._id.toString();
        } else {
          return NextResponse.json({ orders: [] });
        }
      } else if (user.role === 'admin') {
        // Admin sees all orders
        query = {};
      } else {
        // Regular users see their own orders as customer
        query.customerId = user.id;
      }
    } else {
      // Public: no orders visible without authentication
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const orders = await OrderModel.find(query).sort({ createdAt: -1 }).lean();

    // Format orders
    const formattedOrders = orders.map(order => ({
      ...order,
      id: order._id?.toString() || order.id,
      _id: undefined
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST create new order (for customers)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const sessionId = request.cookies.get('session')?.value;
    const user = await getUserFromSession(sessionId);

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const {
      productItems,
      shippingAddress,
      paymentMethod
    } = body;

    if (!productItems || !productItems.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate total amount and group by seller
    const sellerOrders: { [sellerId: string]: any[] } = {};
    
    for (const item of productItems) {
      const product = await ProductModel.findById(item.productId).lean();
      
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      const sellerId = product.sellerId;
      
      if (!sellerOrders[sellerId]) {
        sellerOrders[sellerId] = [];
      }

      sellerOrders[sellerId].push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create separate orders for each seller
    const createdOrders = [];

    for (const [sellerId, products] of Object.entries(sellerOrders)) {
      const totalAmount = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
      
      // Get seller's commission rate
      const { SellerModel } = await import('@/lib/models');
      const seller = await SellerModel.findById(sellerId).lean();
      const commissionRate = seller?.commissionRate || 0.1;
      const commissionAmount = totalAmount * commissionRate;

      const order = await OrderModel.create({
        customerId: user.id,
        sellerId,
        products,
        totalAmount,
        commissionAmount,
        status: 'pending',
        shippingAddress,
        paymentStatus: 'pending',
        paymentMethod
      });

      // Update product stock
      for (const product of products) {
        await ProductModel.findByIdAndUpdate(
          product.productId,
          { $inc: { stock: -product.quantity } }
        );
      }

      createdOrders.push({
        ...order.toObject(),
        id: order._id.toString(),
        _id: undefined
      });
    }

    return NextResponse.json({ orders: createdOrders }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}

// PATCH update order status (for sellers and admins)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const sessionId = request.cookies.get('session')?.value;
    const user = await getUserFromSession(sessionId);

    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, status, trackingNumber } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const order = await OrderModel.findById(orderId).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user owns this order (for sellers)
    if (user.role === 'seller') {
      const { SellerModel } = await import('@/lib/models');
      const seller = await SellerModel.findOne({ userId: user.id }).lean();
      
      if (!seller || order.sellerId !== seller._id.toString()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (status) updateData.status = status;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).lean();

    const formattedOrder = {
      ...updatedOrder,
      id: updatedOrder!._id.toString(),
      _id: undefined
    };

    return NextResponse.json({ order: formattedOrder });
  } catch (error: any) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}

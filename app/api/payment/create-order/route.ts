import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession } from '@/lib/auth';

// Razorpay payment order creation
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    const user = await getUserFromSession(sessionId);

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, currency = 'INR', planId, planName } = body;

    if (!amount || !planId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if Razorpay credentials are configured
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeyId || !razorpayKeySecret || 
        razorpayKeyId === 'your_razorpay_key_id_here' ||
        razorpayKeySecret === 'your_razorpay_key_secret_here') {
      return NextResponse.json({ 
        error: 'Payment gateway not configured. Please contact administrator.' 
      }, { status: 503 });
    }

    // Create Razorpay order using fetch (no SDK needed)
    const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
    
    const razorpayOrder = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          userId: user.id,
          planId,
          planName: planName || 'Tournament Hosting Plan'
        }
      })
    });

    if (!razorpayOrder.ok) {
      const errorData = await razorpayOrder.json();
      console.error('Razorpay order creation failed:', errorData);
      return NextResponse.json({ 
        error: 'Failed to create payment order' 
      }, { status: 500 });
    }

    const orderData = await razorpayOrder.json();

    return NextResponse.json({
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId: razorpayKeyId
    });
  } catch (error: any) {
    console.error('Payment order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

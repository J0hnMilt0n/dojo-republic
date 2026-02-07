import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromSession } from '@/lib/auth';
import crypto from 'crypto';

// Verify Razorpay payment signature
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
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      planId,
      planName,
      amount
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!razorpayKeySecret || razorpayKeySecret === 'your_razorpay_key_secret_here') {
      return NextResponse.json({ 
        error: 'Payment gateway not configured' 
      }, { status: 503 });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ 
        error: 'Payment verification failed. Invalid signature.' 
      }, { status: 400 });
    }

    // Payment verified successfully
    // Here you can store payment details in database
    const paymentRecord = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      planId,
      planName,
      amount: amount / 100, // Convert from paise to rupees
      status: 'success',
      paymentDate: new Date().toISOString()
    };

    // TODO: Save payment record to database if you want to track payments
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      payment: paymentRecord
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}

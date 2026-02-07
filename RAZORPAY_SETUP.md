# Razorpay Payment Gateway Integration

This guide helps you set up Razorpay payment gateway for tournament hosting pricing plans.

## Prerequisites

1. **Razorpay Account**: Sign up at [https://razorpay.com](https://razorpay.com)
2. **API Keys**: Get your API keys from the Razorpay Dashboard

## Setup Instructions

### 1. Get Razorpay API Keys

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings** → **API Keys**
3. Generate keys (you'll get Key ID and Key Secret)
4. **Important**: Use Test Mode for development, Live Mode for production

### 2. Configure Environment Variables

Open `.env.local` file and replace the placeholder values:

```env
# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET_HERE
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
```

**Note**: 
- Test keys start with `rzp_test_`
- Live keys start with `rzp_live_`
- Never commit your `.env.local` file to version control (it's already in `.gitignore`)

### 3. How It Works

#### Payment Flow:

1. **User selects a plan** on `/pricing` page
2. **Order creation**: Frontend calls `/api/payment/create-order`
   - Server creates a Razorpay order
   - Returns order ID and amount
3. **Razorpay Checkout** opens in a modal
   - User enters payment details
   - Razorpay processes the payment
4. **Payment verification**: Frontend calls `/api/payment/verify`
   - Server verifies the signature
   - Payment is confirmed

#### Security:

- All payment processing is handled by Razorpay (PCI DSS compliant)
- Payment verification uses HMAC SHA256 signature
- No card details are stored on our servers
- Server-side validation ensures payment authenticity

### 4. Testing

#### Test Cards (in Test Mode):

- **Success**: 4111 1111 1111 1111
- **Failed**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

#### Test UPI:

- **Success**: success@razorpay
- **Failed**: failure@razorpay

### 5. Webhook Setup (Optional)

For production, set up webhooks to handle payment events:

1. Go to **Settings** → **Webhooks** in Razorpay Dashboard
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Save webhook secret in `.env.local`

### 6. Going Live

Before going live:

1. Complete KYC verification in Razorpay Dashboard
2. Switch to Live API keys
3. Update `.env.local` with live keys
4. Test with real transactions (small amounts)
5. Enable required payment methods (Cards, UPI, Netbanking, Wallets)

## Features Implemented

- ✅ Razorpay Checkout integration
- ✅ Order creation API
- ✅ Payment signature verification
- ✅ Multiple payment methods (Cards, UPI, Netbanking, Wallets)
- ✅ Responsive payment modal
- ✅ Error handling
- ✅ Loading states
- ✅ Success/failure callbacks

## Pricing Plans

Current plans available:

1. **Basic Tournament Hosting** - ₹5,000
   - Up to 50 participants
   - Basic scoreboard
   - 3 categories

2. **Standard Tournament Hosting** - ₹15,000
   - Up to 200 participants
   - Live scoreboard
   - 10 categories
   - Result reports

3. **Premium Tournament Hosting** - ₹30,000
   - Unlimited participants
   - Live streaming support
   - Unlimited categories
   - Advanced analytics
   - Certificate generation

## API Endpoints

### Create Payment Order
```
POST /api/payment/create-order
```

**Request:**
```json
{
  "amount": 5000,
  "planId": "1",
  "planName": "Basic Tournament Hosting"
}
```

**Response:**
```json
{
  "orderId": "order_xxxxx",
  "amount": 500000,
  "currency": "INR",
  "keyId": "rzp_test_xxxxx"
}
```

### Verify Payment
```
POST /api/payment/verify
```

**Request:**
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx",
  "planId": "1",
  "planName": "Basic Tournament Hosting",
  "amount": 500000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "payment": {
    "userId": "user_id",
    "orderId": "order_xxxxx",
    "paymentId": "pay_xxxxx",
    "amount": 5000,
    "status": "success"
  }
}
```

## Troubleshooting

### Common Issues:

1. **"Payment gateway not configured"**
   - Check if Razorpay keys are set in `.env.local`
   - Restart the development server after changing .env

2. **Signature verification fails**
   - Ensure Key Secret matches the Key ID
   - Check if keys are from same environment (test/live)

3. **Payment modal doesn't open**
   - Check browser console for errors
   - Ensure Razorpay script is loaded
   - Check if Key ID is correct and public

4. **Test payments don't work**
   - Make sure you're using Test Mode keys
   - Use correct test card numbers
   - Check Razorpay Dashboard for payment logs

## Support

- **Razorpay Documentation**: [https://razorpay.com/docs](https://razorpay.com/docs)
- **Support Email**: support@razorpay.com
- **Integration Issues**: Check Razorpay Dashboard → Logs

## Security Best Practices

1. ✅ Never expose Key Secret in frontend code
2. ✅ Always verify payment signature on server
3. ✅ Use HTTPS in production
4. ✅ Store payment records securely
5. ✅ Implement rate limiting on payment APIs
6. ✅ Log all payment transactions
7. ✅ Monitor for suspicious activities

---

**Note**: This is a production-ready integration. Make sure to test thoroughly before going live with real payments.

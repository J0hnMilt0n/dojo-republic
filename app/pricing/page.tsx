'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CreditCard, 
  Check, 
  ArrowLeft,
  Trophy,
  Users,
  BarChart,
  Award,
  FileText,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

interface PricingPlan {
  id: string;
  name: string;
  type: string;
  features: string[];
  price: number;
  duration?: string;
}

// Extend Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPlansPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    checkAuth();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
      await fetchPlans();
    } catch (error) {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      // Load from static data
      const response = await fetch('/data/pricing-plans.json');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleSelectPlan = async (plan: PricingPlan) => {
    if (!razorpayLoaded) {
      showToast('Payment gateway loading, please wait...', 'info');
      return;
    }

    setProcessingPayment(plan.id);

    try {
      // Create order on server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: plan.price,
          planId: plan.id,
          planName: plan.name
        })
      });

      if (!orderRes.ok) {
        const error = await orderRes.json();
        throw new Error(error.error || 'Failed to create payment order');
      }

      const orderData = await orderRes.json();

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Dojo Republic',
        description: plan.name,
        order_id: orderData.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phoneNumber || ''
        },
        theme: {
          color: '#111827' // gray-900
        },
        handler: async function (response: any) {
          // Payment successful, verify on server
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
                planName: plan.name,
                amount: orderData.amount
              })
            });

            if (verifyRes.ok) {
              showToast(`Payment successful! ${plan.name} activated.`, 'success');
              router.push('/dashboard');
            } else {
              const errorData = await verifyRes.json();
              showToast(errorData.error || 'Payment verification failed', 'error');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            showToast('Payment verification failed', 'error');
          } finally {
            setProcessingPayment(null);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(null);
            showToast('Payment cancelled', 'info');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      showToast(error.message || 'Payment failed', 'error');
      setProcessingPayment(null);
    }
  };

  const getPlanIcon = (features: string[]) => {
    if (features.length <= 3) return <Trophy className="w-8 h-8" />;
    if (features.length <= 4) return <Users className="w-8 h-8" />;
    return <Award className="w-8 h-8" />;
  };

  const getPlanColor = (index: number) => {
    const colors = [
      { bg: 'bg-blue-50', icon: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
      { bg: 'bg-purple-50', icon: 'text-purple-600', button: 'bg-purple-600 hover:bg-purple-700' },
      { bg: 'bg-orange-50', icon: 'text-orange-600', button: 'bg-orange-600 hover:bg-orange-700' }
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tournament Hosting Plans</h1>
                <p className="text-gray-600 mt-1">Choose the perfect plan for your tournament</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {plans.map((plan, index) => {
            const colors = getPlanColor(index);
            const isProcessing = processingPayment === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition ${
                  index === 1 ? 'border-2 border-purple-600 transform md:scale-105' : ''
                }`}
              >
                {index === 1 && (
                  <div className="bg-purple-600 text-white text-center py-2 text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <div className={`w-16 h-16 ${colors.bg} rounded-lg flex items-center justify-center mb-4 ${colors.icon}`}>
                    {getPlanIcon(plan.features)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                    <span className="text-gray-600 ml-2">/ tournament</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition ${
                      isProcessing 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : colors.button
                    } flex items-center justify-center`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Select Plan'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Real-time Scoring</h3>
                <p className="text-sm text-gray-600">
                  Live scoreboard updates for all participants and spectators
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Automated Reports</h3>
                <p className="text-sm text-gray-600">
                  Generate detailed tournament reports and statistics automatically
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Digital Certificates</h3>
                <p className="text-sm text-gray-600">
                  Issue professional certificates to winners and participants
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <CreditCard className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Secure Payment with Razorpay</h3>
              <p className="text-blue-800 text-sm">
                All payments are processed securely through Razorpay. We accept credit cards, debit cards, 
                net banking, UPI, and wallets. Your payment information is never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

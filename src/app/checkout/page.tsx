'use client';

import { useStore } from '@/store/useStore';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { cart } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCheckout = async () => {
      try {
        setLoading(true);
        setError(null);

        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe failed to initialize');

        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cart }),
        });

        const { sessionId } = await response.json();
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          setError(error.message || 'An error occurred');
        }
      } catch (err) {
        setError('An error occurred during checkout');
        console.error('Checkout error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (cart.length > 0) {
      handleCheckout();
    }
  }, [cart]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Return to Menu
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to checkout...</p>
      </div>
    </div>
  );
} 
'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { cart, clearCart, addOrder } = useStore();

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      const order = {
        id: searchParams.get('session_id') || Date.now().toString(),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'completed' as const,
        createdAt: new Date().toISOString(),
      };

      addOrder(order);
      clearCart();
    }
  }, [searchParams, cart, addOrder, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We&apos;ll start preparing your food right away.
        </p>
        <a
          href="/orders"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          View Orders
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
} 
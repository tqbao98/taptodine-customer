'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart, addOrder } = useStore();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId && cart.length > 0) {
      // Create a new order
      const order = {
        id: sessionId,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'completed' as const,
        createdAt: new Date(),
      };

      addOrder(order);
      clearCart();
    }
  }, [searchParams, cart, addOrder, clearCart]);

  return (
    <div className="py-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        <button
          onClick={() => router.push('/orders')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          View Orders
        </button>
      </div>
    </div>
  );
} 
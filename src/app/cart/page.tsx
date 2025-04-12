'use client';

import { useStore } from '@/store/useStore';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-cover rounded-md"
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                  {item.options && item.options.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.options.join(', ')}
                    </p>
                  )}
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="text-gray-500 hover:text-gray-700"
                    >
                      -
                    </button>
                    <span className="text-gray-600">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t pt-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Total</p>
            <p>${total.toFixed(2)}</p>
          </div>
          <div className="mt-6">
            <button
              onClick={handleCheckout}
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useStore } from '@/store/useStore';
import { TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="py-6">
        <div className="flex items-center space-x-4 mb-8 px-4 sm:px-6">
          <button
            onClick={() => router.push('/')}
            className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-full"
            aria-label="Back to menu"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        </div>
        <p className="text-gray-500 px-4 sm:px-6" role="alert">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="py-6 pb-24">
      <div className="flex items-center space-x-4 mb-8 px-4 sm:px-6">
        <button
          onClick={() => router.push('/')}
          className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-full"
          aria-label="Back to menu"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
      </div>
      <div className="divide-y divide-gray-200 px-4 sm:px-6">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-4">
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
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2" role="group" aria-label="Quantity controls">
                <button
                  onClick={() =>
                    handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
                  }
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-gray-600" role="spinbutton" aria-valuenow={item.quantity} aria-valuemin={1}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={`Remove ${item.name} from cart`}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <button
            onClick={handleCheckout}
            className="w-full flex justify-between items-center px-6 py-4 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cart.length === 0}
            aria-label={`Checkout with ${totalItems} items for $${total.toFixed(2)}`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg font-medium">Checkout</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
            <span className="text-lg font-medium">${total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
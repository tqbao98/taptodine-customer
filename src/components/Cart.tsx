'use client';

import { useStore } from '@/store/useStore';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function Cart() {
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = cart.length === 0;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {isEmpty ? (
        <div className="text-gray-500 text-center py-4" role="status" aria-label="Empty cart">
          Your cart is empty
        </div>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="py-4 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span 
                  className="text-gray-600"
                  role="spinbutton" 
                  aria-valuenow={item.quantity} 
                  aria-valuemin={0} 
                  aria-valuemax={99}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
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
                aria-label="Remove item"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))
      )}
      <div className="py-4">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-900">Total</span>
          <span className="text-lg font-medium text-gray-900">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => window.location.href = '/checkout'}
          className="mt-4 w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isEmpty}
          aria-label="Proceed to checkout"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
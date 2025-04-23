'use client';

import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart } = useStore();
  const restaurantName = useStore((state) => state.restaurantName);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    // Create order and clear cart
    const order = {
      id: Date.now().toString(),
      restaurantName: restaurantName,
      items: cart,
      total,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    useStore.getState().addOrder(order);
    useStore.getState().clearCart();
    router.push('/success');
  };

  if (cart.length === 0) {
    return (
      <div className="py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <p className="text-gray-500 px-4 sm:px-6">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
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
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex justify-between text-lg font-medium text-gray-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { menuItems } from '@/data/menu';
import { useStore } from '@/store/useStore';
import Image from 'next/image';
import { CartItem } from '@/types';
import PlaceholderImage from '@/components/PlaceholderImage';

export default function MenuPage() {
  const { addToCart } = useStore();

  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  const handleAddToCart = (item: typeof menuItems[0]) => {
    const cartItem: CartItem = {
      ...item,
      quantity: 1,
    };
    addToCart(cartItem);
  };

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Menu</h1>
      {categories.map((category) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{category}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems
              .filter((item) => item.category === category)
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <PlaceholderImage item={item} />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
} 
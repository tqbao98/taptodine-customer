'use client';

import { useStore, MenuItem } from '@/store/useStore';
import { useState } from 'react';
import DishModal from '@/components/DishModal';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MenuPage() {
  const { menu, addToCart } = useStore();
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const router = useRouter();

  const handleDishClick = (dish: MenuItem) => {
    setSelectedDish(dish);
  };

  const handleAddToCart = (dish: MenuItem, quantity: number) => {
    addToCart(dish, quantity);
    setSelectedDish(null);
    router.push('/cart');
  };

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleDishClick(dish)}
          >
            <div className="aspect-w-16 aspect-h-9">
              <Image
                src={dish.image}
                alt={dish.name}
                width={384}
                height={192}
                className="object-cover w-full h-48"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{dish.name}</h3>
              <p className="text-gray-500 mt-1">{dish.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">
                  ${dish.price.toFixed(2)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDishClick(dish);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDish && (
        <DishModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
} 
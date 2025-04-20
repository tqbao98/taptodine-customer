'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dish } from '@/types/menu';
import { useStore } from '@/store/useStore';
import LoadingSpinner from '@/components/LoadingSpinner';

interface DishModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
}

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNjMGMwYzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

export default function DishModal({ dish, isOpen, onClose }: DishModalProps) {
  const { addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState('regular');
  const [extras, setExtras] = useState<Record<string, boolean>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    const customizedDish = {
      ...dish,
      size: selectedSize,
      extras: Object.keys(extras).filter(key => extras[key]),
      specialInstructions,
    };
    addToCart(customizedDish, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="relative h-64 w-full">
          {isImageLoading && <LoadingSpinner />}
          <Image
            src={dish.image}
            alt={dish.name}
            width={800}
            height={400}
            className={`object-cover w-full h-full ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            priority
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              const img = document.querySelector(`img[alt="${dish.name}"]`);
              if (img) {
                img.setAttribute('src', placeholderImage);
              }
              setIsImageLoading(false);
            }}
          />
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{dish.name}</h2>
              <p className="text-gray-600">{dish.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-lg font-medium text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Size</h3>
            <div className="flex gap-2">
              {['small', 'regular', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-full ${
                    selectedSize === size
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Extras</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Extra Meat', 'Extra Cheese', 'Extra Vegetables', 'Spicy'].map((extra) => (
                <label key={extra} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={extras[extra] || false}
                    onChange={(e) => setExtras({ ...extras, [extra]: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-900">{extra}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Special Instructions</h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any special requests?"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              rows={3}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">
              ${(dish.price * quantity).toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
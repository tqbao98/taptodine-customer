'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dish } from '@/types/menu';
import { useStore } from '@/store/useStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import PlaceholderImage from '@/components/PlaceholderImage';

interface DishModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
}

export default function DishModal({ dish, isOpen, onClose }: DishModalProps) {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('regular');
  const [extras, setExtras] = useState<Record<string, boolean>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [imageState, setImageState] = useState({ loading: true, error: false });

  if (!isOpen) return null;

  const handleImageLoad = () => {
    setImageState({ loading: false, error: false });
  };

  const handleImageError = () => {
    setImageState({ loading: false, error: true });
  };

  const handleAddToCart = () => {
    const item = {
      ...dish,
      quantity
    };
    addToCart(item, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 p-6">
            <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
              {dish.image && !imageState.error ? (
                <>
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    quality={90}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                  {imageState.loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                      <LoadingSpinner />
                    </div>
                  )}
                </>
              ) : (
                <PlaceholderImage className="w-full h-full" />
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{dish.name}</h3>
            <p className="text-gray-600 mb-3">{dish.description}</p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-gray-900">
                ${dish.price.toFixed(2)}
              </span>
            </div>

            {/* Size Options */}
            <div className="mb-5">
              <h3 className="text-base font-semibold mb-2 text-gray-900">Size</h3>
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

            {/* Extra Options */}
            <div className="mb-5">
              <h3 className="text-base font-semibold mb-2 text-gray-900">Extras</h3>
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

            {/* Special Instructions */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-900">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests?"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                rows={3}
              />
            </div>
          </div>

          {/* Fixed Action Buttons */}
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4" role="group" aria-label="Quantity controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  aria-label="Decrease quantity"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-lg font-semibold" role="spinbutton" aria-valuenow={quantity} aria-valuemin={1}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  aria-label="Increase quantity"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 ml-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                aria-label={`Add to cart`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
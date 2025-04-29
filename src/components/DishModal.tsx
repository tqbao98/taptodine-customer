'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { MenuItem } from '@/types';
import PlaceholderImage from './PlaceholderImage';

interface DishModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function DishModal({ item, isOpen, onClose }: DishModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageState, setImageState] = useState({ error: false });
  const addToCart = useStore((state) => state.addToCart);

  if (!isOpen) return null;

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(item, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
            {item.image && !imageState.error ? (
              <>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={() => setImageState({ error: true })}
                />
              </>
            ) : (
              <PlaceholderImage />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h2>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDecrement}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span role="spinbutton" aria-valuenow={quantity} aria-valuemin={1} aria-valuemax={99}>
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <span className="text-xl font-bold text-gray-900">
              ${(item.price * quantity).toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            aria-label="Add to cart"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { MenuItem } from '@/types';
import { useStore } from '@/store/useStore';
import Image from 'next/image';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DishModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function DishModal({ item, isOpen, onClose }: DishModalProps) {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});

  const handleAddToCart = () => {
    const cartItem = {
      ...item,
      quantity,
      options: Object.entries(selectedOptions)
        .filter(([_, selected]) => selected)
        .map(([option]) => option),
    };
    addToCart(cartItem);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="relative h-48 w-full mb-4">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-lg"
              sizes="100vw"
            />
          </div>

          <p className="text-gray-600 mb-4">{item.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Customize your order</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedOptions['Extra Cheese'] || false}
                  onChange={(e) => setSelectedOptions({
                    ...selectedOptions,
                    'Extra Cheese': e.target.checked,
                  })}
                  className="rounded text-indigo-600"
                />
                <span>Extra Cheese (+$1.50)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedOptions['Extra Spicy'] || false}
                  onChange={(e) => setSelectedOptions({
                    ...selectedOptions,
                    'Extra Spicy': e.target.checked,
                  })}
                  className="rounded text-indigo-600"
                />
                <span>Extra Spicy</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedOptions['No Onions'] || false}
                  onChange={(e) => setSelectedOptions({
                    ...selectedOptions,
                    'No Onions': e.target.checked,
                  })}
                  className="rounded text-indigo-600"
                />
                <span>No Onions</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                +
              </button>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              ${(item.price * quantity).toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Add to Order
          </button>
        </div>
      </div>
    </>
  );
} 
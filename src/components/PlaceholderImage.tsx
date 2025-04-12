'use client';

import { MenuItem } from '@/types';

interface PlaceholderImageProps {
  item: MenuItem;
}

export default function PlaceholderImage({ item }: PlaceholderImageProps) {
  return (
    <div className="relative h-48 bg-gray-200 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-2">🍽️</div>
        <p className="text-sm text-gray-500">{item.name}</p>
      </div>
    </div>
  );
} 
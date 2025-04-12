'use client';

import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

export default function Cart() {
  const { cart } = useStore();

  return (
    <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900">
      <ShoppingCartIcon className="h-6 w-6" />
      {cart.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cart.length}
        </span>
      )}
    </Link>
  );
} 
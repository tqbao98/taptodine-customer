'use client';

import Link from "next/link";
import { useStore } from "@/store/useStore";

export default function RestaurantHeader() {
  const restaurantName = useStore((state) => state.restaurantName);
  
  return (
    <div className="flex items-center">
      <Link href="/" className="text-xl font-bold text-gray-900">
        {restaurantName || 'Restaurant Name'}
      </Link>
    </div>
  );
}
'use client';

import { menuItems } from '@/data/menu';
import { useStore } from '@/store/useStore';
import Image from 'next/image';
import { CartItem } from '@/types';
import { useRef, useState, useEffect } from 'react';
import DishModal from '@/components/DishModal';

export default function Home() {
  const { addToCart } = useStore();
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [selectedItem, setSelectedItem] = useState<typeof menuItems[0] | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');

  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory(category);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const category = entry.target.getAttribute('data-category');
            if (category) {
              setActiveCategory(category);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    categories.forEach((category) => {
      const element = categoryRefs.current[category];
      if (element) {
        element.setAttribute('data-category', category);
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [categories]);

  return (
    <div className="py-4">
      {/* Category Navigation */}
      <div className="sticky top-16 z-40 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="flex space-x-4 px-4 py-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => scrollToCategory(category)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="mt-4">
        {categories.map((category) => (
          <div
            key={category}
            ref={(el) => {
              categoryRefs.current[category] = el;
            }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 px-4">{category}</h2>
            <div className="space-y-2 px-4">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white rounded-lg shadow-sm overflow-hidden flex items-center cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 p-4">
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <span className="text-lg font-medium text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <DishModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

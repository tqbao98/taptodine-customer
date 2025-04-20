'use client';

import { useEffect, useState, useRef } from 'react';
import { menu } from '@/data/menu';
import Image from 'next/image';
import DishModal from '@/components/DishModal';
import { Dish } from '@/types/menu';
import LoadingSpinner from '@/components/LoadingSpinner';

const categories = [
  { id: 'main', name: 'Main Dishes' },
  { id: 'appetizer', name: 'Appetizers' },
  { id: 'dessert', name: 'Desserts' },
  { id: 'vegan', name: 'Vegan' },
  { id: 'drink', name: 'Drinks' },
];

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNjMGMwYzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const dishesByCategory = menu.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {} as Record<string, typeof menu>);

  useEffect(() => {
    // Create an Intersection Observer to track which category is in view
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryId = entry.target.getAttribute('data-category');
            if (categoryId) {
              setActiveCategory(categoryId);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );

    // Observe all category sections
    Object.values(categoryRefs.current).forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const scrollToCategory = (categoryId: string) => {
    const element = categoryRefs.current[categoryId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveCategory(categoryId);
    }
  };

  const handleImageLoad = (dishId: string) => {
    setLoadingImages(prev => ({ ...prev, [dishId]: false }));
  };

  return (
    <div className="py-6">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div 
            ref={sliderRef}
            className="flex space-x-4 overflow-x-auto py-4 hide-scrollbar"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToCategory(category.id)}
                className={`whitespace-nowrap px-6 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {categories.map((category) => (
          <div
            key={category.id}
            ref={(el) => {
              categoryRefs.current[category.id] = el;
            }}
            data-category={category.id}
            className="py-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishesByCategory[category.id]?.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => setSelectedDish(dish)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="flex">
                    <div className="flex-1 p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {dish.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {dish.description}
                      </p>
                      <div className="mt-2">
                        <span className="text-base font-bold text-gray-900">
                          ${dish.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="relative w-32 h-32">
                      {loadingImages[dish.id] && <LoadingSpinner />}
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        width={128}
                        height={128}
                        className={`object-cover w-full h-full ${loadingImages[dish.id] ? 'opacity-0' : 'opacity-100'}`}
                        priority
                        onLoad={() => handleImageLoad(dish.id)}
                        onError={() => {
                          const img = document.querySelector(`img[alt="${dish.name}"]`);
                          if (img) {
                            img.setAttribute('src', placeholderImage);
                          }
                          setLoadingImages(prev => ({ ...prev, [dish.id]: false }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedDish && (
        <DishModal
          dish={selectedDish}
          isOpen={!!selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

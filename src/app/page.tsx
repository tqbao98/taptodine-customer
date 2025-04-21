'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import DishModal from '@/components/DishModal';
import { Dish } from '@/types/menu';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useStore } from '@/store/useStore';

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNjMGMwYzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

export default function MenuPage() {
  const { menu, fetchMenu, isLoading: isMenuLoading, error } = useStore();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const dishesByCategory = useMemo(() => {
    if (!Array.isArray(menu)) {
      return {};
    }
    
    return menu.reduce((acc, dish) => {
      if (!dish.category) {
        console.warn('Dish missing category:', dish);
        return acc;
      }
      
      if (!acc[dish.category]) {
        acc[dish.category] = [];
      }
      acc[dish.category].push(dish);
      return acc;
    }, {} as Record<string, Dish[]>);
  }, [menu]);

  const categories = useMemo(() => {
    return ['all', ...Object.keys(dishesByCategory)];
  }, [dishesByCategory]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const category = entry.target.getAttribute('data-category');
          if (category) {
            setActiveCategory(category);
          }
        }
      });
    }, options);

    Object.values(categoryRefs.current).forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [menu]);

  const handleImageLoad = (dishId: string) => {
    setLoadingImages(prev => ({ ...prev, [dishId]: false }));
  };

  if (isMenuLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Menu</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchMenu()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(menu) || menu.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No menu items available</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div
        ref={sliderRef}
        className="flex space-x-4 overflow-x-auto pb-4 mb-6 scrollbar-hide"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
              const element = categoryRefs.current[category];
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full ${
              activeCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {categories.map((category) => {
          if (category === 'all') return null;
          const dishes = dishesByCategory[category];
          return (
            <div
              key={category}
              ref={(el) => {
                if (el) {
                  categoryRefs.current[category] = el;
                }
              }}
              data-category={category}
              className="scroll-mt-20"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 px-4 sm:px-6">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <div className="bg-white rounded-lg divide-y divide-gray-200">
                {dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="flex cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedDish(dish)}
                  >
                    {/* Left side - Text content */}
                    <div className="flex-1 p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {dish.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {dish.description}
                      </p>
                      <span className="text-base font-bold text-gray-900">
                        ${dish.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Right side - Image */}
                    <div className="relative w-32 h-32">
                      {loadingImages[dish.id] && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <LoadingSpinner />
                        </div>
                      )}
                      <Image
                        src={dish.image}
                        alt={dish.name}
                        width={128}
                        height={128}
                        className={`object-cover w-full h-full ${
                          loadingImages[dish.id] ? 'opacity-0' : 'opacity-100'
                        }`}
                        priority
                        onLoadingComplete={() => handleImageLoad(dish.id)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = placeholderImage;
                          handleImageLoad(dish.id);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDish && (
        <DishModal
          dish={selectedDish}
          isOpen={!!selectedDish}
          onClose={() => setSelectedDish(null)}
        />
      )}
    </div>
  );
}

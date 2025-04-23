'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import DishModal from '@/components/DishModal';
import { Dish } from '@/types/menu';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useStore } from '@/store/useStore';
import PlaceholderImage from '@/components/PlaceholderImage';

export default function MenuPage() {
  const { menu, fetchMenu, isLoading: isMenuLoading, error } = useStore();
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [imageStates, setImageStates] = useState<Record<string, { loading: boolean; error: boolean }>>({});
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
    setImageStates(prev => ({ 
      ...prev, 
      [dishId]: { loading: false, error: false }
    }));
  };

  const handleImageError = (dishId: string) => {
    setImageStates(prev => ({ 
      ...prev, 
      [dishId]: { loading: false, error: true }
    }));
  };

  const initImageLoading = (dishId: string) => {
    if (!imageStates[dishId]) {
      setImageStates(prev => ({ 
        ...prev, 
        [dishId]: { loading: true, error: false }
      }));
    }
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
                {dishes.map((dish) => {
                  const imageState = imageStates[dish.id] || { loading: true, error: false };
                  return (
                    <div
                      key={dish.id}
                      className="flex cursor-pointer hover:bg-gray-50 transition-colors p-4"
                      onClick={() => setSelectedDish(dish)}
                    >
                      <div className="flex-1 pr-4">
                        <h3 className="text-base font-medium text-gray-900">{dish.name}</h3>
                        <p className="mt-0.5 text-sm text-gray-500 line-clamp-2">{dish.description}</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">${dish.price.toFixed(2)}</p>
                      </div>
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        {dish.image && !imageState.error ? (
                          <>
                            <Image
                              src={dish.image}
                              alt={dish.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 96px, 128px"
                              quality={85}
                              priority={false}
                              onLoadingComplete={() => handleImageLoad(dish.id)}
                              onError={() => handleImageError(dish.id)}
                              onLoadStart={() => initImageLoading(dish.id)}
                            />
                            {imageState.loading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                                <LoadingSpinner />
                              </div>
                            )}
                          </>
                        ) : (
                          <PlaceholderImage />
                        )}
                      </div>
                    </div>
                  );
                })}
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

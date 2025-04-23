'use client';

interface PlaceholderImageProps {
  className?: string;
}

export default function PlaceholderImage({ className = '' }: PlaceholderImageProps) {
  return (
    <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="text-4xl mb-2">🍽️</div>
        <p className="text-sm text-gray-500">No Image Available</p>
      </div>
    </div>
  );
}
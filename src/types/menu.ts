export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'main' | 'appetizer' | 'dessert' | 'vegan' | 'drink';
  size?: string;
  extras?: string[];
  specialInstructions?: string;
} 
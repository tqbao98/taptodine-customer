export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  size?: string;
  extras?: string[];
  specialInstructions?: string;
} 
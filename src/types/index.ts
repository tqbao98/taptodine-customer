export interface MenuItem {
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

export interface CartItem extends MenuItem {
  quantity: number;
  options?: string[];
}

export interface Order {
  id: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}
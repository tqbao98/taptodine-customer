export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extras?: string[];
  specialInstructions?: string;
}

export interface Order {
  id: string;
  restaurantName: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
} 
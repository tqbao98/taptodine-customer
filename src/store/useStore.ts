import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  options?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Order {
  id: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface StoreState {
  cart: CartItem[];
  menu: MenuItem[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  restaurantName: string;
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  fetchOrders: () => Promise<void>;
  addOrder: (order: Order) => void;
  fetchMenu: () => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  cart: [],
  menu: [],
  orders: [],
  isLoading: false,
  error: null,
  restaurantName: '',
  addToCart: (item, quantity) =>
    set((state) => {
      const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          ),
        };
      }
      return {
        cart: [...state.cart, { ...item, quantity }],
      };
    }),
  removeFromCart: (itemId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== itemId),
    })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ cart: [] }),
  fetchOrders: async () => {
    // In a real app, this would fetch orders from an API
    const mockOrders: Order[] = [
      {
        id: '1',
        restaurantName: 'Pizza Palace',
        items: [
          {
            id: '1',
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce, mozzarella, and basil',
            price: 12.99,
            quantity: 2,
            image: '/images/margherita.jpg',
          },
        ],
        total: 25.98,
        status: 'completed',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        restaurantName: 'Pizza Palace',
        items: [
          {
            id: '2',
            name: 'Pepperoni Pizza',
            description: 'Pizza with tomato sauce, mozzarella, and pepperoni',
            price: 14.99,
            quantity: 1,
            image: '/images/pepperoni.jpg',
          },
          {
            id: '3',
            name: 'Caesar Salad',
            description: 'Romaine lettuce, croutons, parmesan, and Caesar dressing',
            price: 8.99,
            quantity: 2,
            image: '/images/caesar.jpg',
          },
        ],
        total: 32.97,
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
    ];
    set({ orders: mockOrders });
  },
  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
  fetchMenu: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching menu from API...');
      const response = await fetch('/api/menu', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format: expected an object');
      }
      
      if (!data.menu || !Array.isArray(data.menu)) {
        console.error('Invalid menu data structure:', data);
        throw new Error('Invalid menu data format: expected an array in menu property');
      }
      
      console.log('Setting menu with items:', data.menu);
      set({ 
        menu: data.menu, 
        restaurantName: data.restaurantName || '',
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching menu:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch menu',
        isLoading: false 
      });
    }
  },
}));
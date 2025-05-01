import { create } from 'zustand';
import { CartItem, MenuItem, Order } from '@/types';

export interface StoreState {
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
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/orders', {
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
      set({ orders: data.orders, isLoading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false 
      });
    }
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
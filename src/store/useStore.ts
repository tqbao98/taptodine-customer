import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
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
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface StoreState {
  cart: CartItem[];
  menu: MenuItem[];
  orders: Order[];
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  fetchOrders: () => Promise<void>;
}

const useStore = create<StoreState>((set) => ({
  cart: [],
  menu: [
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      price: 12.99,
      image: '/images/margherita.jpg',
      category: 'Pizza',
    },
    {
      id: '2',
      name: 'Pepperoni Pizza',
      description: 'Pizza with tomato sauce, mozzarella, and pepperoni',
      price: 14.99,
      image: '/images/pepperoni.jpg',
      category: 'Pizza',
    },
    {
      id: '3',
      name: 'Caesar Salad',
      description: 'Romaine lettuce, croutons, parmesan, and Caesar dressing',
      price: 8.99,
      image: '/images/caesar.jpg',
      category: 'Salads',
    },
    {
      id: '4',
      name: 'Chicken Wings',
      description: 'Crispy chicken wings with your choice of sauce',
      price: 10.99,
      image: '/images/wings.jpg',
      category: 'Appetizers',
    },
  ],
  orders: [],
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
    ];
    set({ orders: mockOrders });
  },
}));

export default useStore; 
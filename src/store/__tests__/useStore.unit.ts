import { createStore, StoreApi } from 'zustand/vanilla';
import type { StoreState } from '../useStore';

describe('useStore (Unit)', () => {
  const mockMenuItem = {
    id: '1',
    name: 'Test Pizza',
    description: 'Test Description',
    price: 10.99,
    image: 'test.jpg',
    category: 'Pizza'
  };

  let store: StoreApi<StoreState>;

  beforeEach(() => {
    store = createStore<StoreState>((set) => ({
      cart: [],
      menu: [],
      orders: [],
      error: null,
      isLoading: false,
      restaurantName: '',
      addToCart: (item, quantity) => {
        set((state) => ({
          ...state,
          cart: [...state.cart, { ...item, quantity }]
        }));
      },
      removeFromCart: (itemId) => {
        set((state) => ({
          ...state,
          cart: state.cart.filter((item) => item.id !== itemId)
        }));
      },
      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          ...state,
          cart: state.cart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          )
        }));
      },
      clearCart: () => {
        set((state) => ({ ...state, cart: [] }));
      },
      fetchMenu: async () => {
        set((state) => ({ ...state, isLoading: true, error: null }));
        try {
          const response = await fetch('/api/menu');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          set((state) => ({ 
            ...state,
            menu: data.items, 
            isLoading: false 
          }));
        } catch (error) {
          set((state) => ({ 
            ...state,
            error: error instanceof Error ? error.message : 'Failed to fetch menu',
            isLoading: false 
          }));
        }
      },
      fetchOrders: async () => {
        // Placeholder for fetchOrders implementation
      },
      addOrder: () => {
        // Placeholder for addOrder implementation
      }
    }));
  });

  describe('Cart Operations', () => {
    // Tests if items are correctly added to the cart with specified quantity
    test('addToCart adds item correctly', () => {
      store.getState().addToCart(mockMenuItem, 2);
      const { cart } = store.getState();
      expect(cart).toHaveLength(1);
      expect(cart[0]).toEqual({
        ...mockMenuItem,
        quantity: 2
      });
    });

    // Tests if items are correctly removed from the cart
    test('removeFromCart removes item correctly', () => {
      store.getState().addToCart(mockMenuItem, 1);
      store.getState().removeFromCart(mockMenuItem.id);
      expect(store.getState().cart).toHaveLength(0);
    });

    // Tests if item quantities are correctly updated
    test('updateQuantity updates item quantity correctly', () => {
      store.getState().addToCart(mockMenuItem, 1);
      store.getState().updateQuantity(mockMenuItem.id, 3);
      expect(store.getState().cart[0].quantity).toBe(3);
    });

    // Tests if clearCart removes all items from the cart
    test('clearCart removes all items', () => {
      store.getState().addToCart(mockMenuItem, 1);
      store.getState().clearCart();
      expect(store.getState().cart).toHaveLength(0);
    });
  });

  describe('Menu Operations', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    // Tests if menu is correctly updated after successful fetch
    test('fetchMenu should update menu state', async () => {
      const mockResponse = { items: [mockMenuItem] };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await store.getState().fetchMenu();
      const state = store.getState();

      expect(state.menu).toEqual(mockResponse.items);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    // Tests if errors are handled correctly during menu fetch
    test('fetchMenu should handle errors', async () => {
      const errorMessage = 'Failed to fetch';
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await store.getState().fetchMenu();
      const state = store.getState();

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.menu).toEqual([]);
    });

    // Tests if non-200 responses are handled correctly
    test('fetchMenu should handle non-ok responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await store.getState().fetchMenu();
      const state = store.getState();

      expect(state.error).toBe('HTTP error! status: 404');
      expect(state.isLoading).toBe(false);
      expect(state.menu).toEqual([]);
    });
  });
});
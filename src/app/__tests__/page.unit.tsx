import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import MenuPage from '../page';
import { useStore } from '@/store/useStore';
import type { StoreState } from '@/store/useStore';
import Image from 'next/image';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation(callback => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));
window.IntersectionObserver = mockIntersectionObserver;

// Mock useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock menu store
const mockUseStore = useStore as unknown as jest.Mock<
  StoreState | (<U>(selector: (state: StoreState) => U) => U)
>;
jest.mock('@/store/useStore', () => {
  const actual = jest.requireActual('@/store/useStore');
  return {
    ...actual,
    useStore: jest.fn(),
  };
});

// Mock components to simplify tests
jest.mock('@/components/DishModal', () => {
  return function MockDishModal({ onClose }: { onClose: () => void }) {
    return <div data-testid="dish-modal" onClick={onClose}>Mock Dish Modal</div>;
  };
});

jest.mock('@/components/LoadingSpinner', () => {
  return function MockLoadingSpinner() {
    return <div>Loading...</div>;
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />
  },
}));

describe('MenuPage Component (Unit)', () => {
  const mockDish = {
    id: '1',
    name: 'Test Pizza',
    description: 'Test Description',
    price: 10.99,
    image: '/test.jpg',
    category: 'Pizza',
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock the useStore implementation for each test
    mockUseStore.mockImplementation((selector) => {
      const state: StoreState = {
        menu: [mockDish],
        cart: [],
        orders: [],
        isLoading: false,
        error: null,
        restaurantName: 'Test Restaurant',
        addToCart: jest.fn(),
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        fetchMenu: jest.fn(),
        fetchOrders: jest.fn(),
        addOrder: jest.fn(),
      };
      return selector ? selector(state) : state;
    });
  });

  afterEach(() => {
    cleanup(); // Clean up after each test
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  // Tests if floating cart button is not shown when cart is empty
  test('floating cart button is hidden when cart is empty', () => {
    render(<MenuPage />);
    expect(screen.queryByRole('button', { name: /view cart/i })).not.toBeInTheDocument();
  });

  // Tests if floating cart button shows correct details when cart has items
  test('floating cart button shows correct details when cart has items', () => {
    // Add items to cart
    mockUseStore.mockImplementation((selector) => {
      const state: StoreState = {
        menu: [mockDish],
        cart: [
          { ...mockDish, quantity: 2 },
          { ...mockDish, id: '2', price: 12.99, quantity: 1 }
        ],
        orders: [],
        isLoading: false,
        error: null,
        restaurantName: 'Test Restaurant',
        addToCart: jest.fn(),
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        fetchMenu: jest.fn(),
        fetchOrders: jest.fn(),
        addOrder: jest.fn(),
      };
      return selector ? selector(state) : state;
    });

    render(<MenuPage />);
    
    // Check if total items are displayed correctly (3 items)
    expect(screen.getByText('3 items')).toBeInTheDocument();
    
    // Check if total price is displayed correctly (2 * 10.99 + 12.99 = 34.97)
    expect(screen.getByText('$34.97')).toBeInTheDocument();
  });

  // Tests if floating cart button shows singular "item" text when only one item
  test('floating cart button shows singular item text when cart has one item', () => {
    mockUseStore.mockImplementation((selector) => {
      const state: StoreState = {
        menu: [mockDish],
        cart: [{ ...mockDish, quantity: 1 }],
        orders: [],
        isLoading: false,
        error: null,
        restaurantName: 'Test Restaurant',
        addToCart: jest.fn(),
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        fetchMenu: jest.fn(),
        fetchOrders: jest.fn(),
        addOrder: jest.fn(),
      };
      return selector ? selector(state) : state;
    });

    render(<MenuPage />);
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  // Tests if floating cart button is greyed out when dish modal is open
  test('floating cart button is disabled when dish modal is open', () => {
    // Set up cart with an item
    mockUseStore.mockImplementation((selector) => {
      const state: StoreState = {
        menu: [mockDish],
        cart: [{ ...mockDish, quantity: 1 }],
        orders: [],
        isLoading: false,
        error: null,
        restaurantName: 'Test Restaurant',
        addToCart: jest.fn(),
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        fetchMenu: jest.fn(),
        fetchOrders: jest.fn(),
        addOrder: jest.fn(),
      };
      return selector ? selector(state) : state;
    });

    render(<MenuPage />);

    // Click on a dish to open the modal
    const dishElement = screen.getByText('Test Pizza');
    fireEvent.click(dishElement);

    // Check if the wrapper div has the correct styling classes
    const buttonWrapper = screen.getByText('View Cart').closest('div[class*="fixed bottom-0"]');
    expect(buttonWrapper).toHaveClass('opacity-50', 'pointer-events-none');
  });

  // Tests if floating cart button navigates to cart page when clicked
  test('floating cart button navigates to cart page when clicked', () => {
    mockUseStore.mockImplementation((selector) => {
      const state: StoreState = {
        menu: [mockDish],
        cart: [{ ...mockDish, quantity: 1 }],
        orders: [],
        isLoading: false,
        error: null,
        restaurantName: 'Test Restaurant',
        addToCart: jest.fn(),
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        fetchMenu: jest.fn(),
        fetchOrders: jest.fn(),
        addOrder: jest.fn(),
      };
      return selector ? selector(state) : state;
    });

    render(<MenuPage />);

    const cartButton = screen.getByText('View Cart').closest('button');
    fireEvent.click(cartButton!);

    expect(mockPush).toHaveBeenCalledWith('/cart');
  });
});
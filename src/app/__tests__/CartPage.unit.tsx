import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import CartPage from '../cart/page'
import { useStore } from '../../store/useStore'
//import * as navigation from 'next/navigation'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

describe('CartPage Component (Unit)', () => {
  beforeEach(() => {
    // Reset the store before each test
    useStore.setState({
      cart: [],
      menu: [],
      orders: [],
      isLoading: false,
      error: null,
      restaurantName: '',
    })
    mockPush.mockClear()
  })

  afterEach(() => {
    cleanup() // Clean up after each test
    jest.clearAllMocks() // Clear all mocks
  })

  // Tests if the empty cart message is displayed when there are no items
  test('renders empty cart message when cart is empty', () => {
    render(<CartPage />)
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  // Tests if cart items are displayed correctly with their details
  test('renders cart items correctly', () => {
    const cartItems = [
      {
        id: '1',
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        quantity: 2,
        image: '/test.jpg',
        category: 'pizza',
      },
    ]

    useStore.setState({ cart: cartItems })

    render(<CartPage />)
    
    expect(screen.getByText('Test Pizza')).toBeInTheDocument()
    expect(screen.getByText('$10.99 x 2')).toBeInTheDocument()
  })

  // Tests if quantity updates work correctly with increment and decrement buttons
  test('handles quantity updates correctly', () => {
    const cartItems = [
      {
        id: '1',
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        quantity: 1,
        image: '/test.jpg',
        category: 'pizza',
      },
    ]

    useStore.setState({ cart: cartItems })

    render(<CartPage />)

    const incrementButton = screen.getByRole('button', { name: /increase quantity/i })
    const decrementButton = screen.getByRole('button', { name: /decrease quantity/i })

    fireEvent.click(incrementButton)
    expect(screen.getByText('$10.99 x 2')).toBeInTheDocument()

    fireEvent.click(decrementButton)
    expect(screen.getByText('$10.99 x 1')).toBeInTheDocument()
  })

  // Tests if items are removed when their quantity reaches zero
  test('removes item when quantity becomes 0', () => {
    const cartItems = [
      {
        id: '1',
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        quantity: 1,
        image: '/test.jpg',
        category: 'pizza',
      },
    ]

    useStore.setState({ cart: cartItems })

    render(<CartPage />)

    const decrementButton = screen.getByRole('button', { name: /decrease quantity/i })
    fireEvent.click(decrementButton)

    expect(screen.queryByText('Test Pizza')).not.toBeInTheDocument()
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  // Tests if the total price is calculated correctly for multiple items
  test('calculates total correctly', () => {
    const cartItems = [
      {
        id: '1',
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        quantity: 2,
        image: '/test.jpg',
        category: 'pizza',
      },
      {
        id: '2',
        name: 'Test Pasta',
        description: 'Test Description',
        price: 12.99,
        quantity: 1,
        image: '/test.jpg',
        category: 'pasta',
      },
    ]

    useStore.setState({ cart: cartItems })

    render(<CartPage />)

    // Total should be (10.99 * 2) + 12.99 = 34.97
    expect(screen.getByText('$34.97')).toBeInTheDocument()
  })

  // Tests if checkout button is removed when cart is empty
  test('removes checkout button when cart is empty', () => {
    render(<CartPage />)
    expect(screen.queryByRole('button', { name: /checkout/i })).not.toBeInTheDocument()
  })

  // Tests if checkout button is enabled when cart has items
  test('checkout button is enabled when cart has items', () => {
    const cartItems = [
      {
        id: '1',
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        quantity: 1,
        image: '/test.jpg',
        category: 'pizza',
      },
    ]

    useStore.setState({ cart: cartItems })

    render(<CartPage />)

    const checkoutButton = screen.getByRole('button', { name: /checkout/i })
    expect(checkoutButton).toBeEnabled()
  })

  // Tests if back button is rendered and works correctly in empty cart
  test('back button navigates to menu in empty cart', () => {
    render(<CartPage />);
    const backButton = screen.getByRole('button', { name: /back to menu/i });
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  // Tests if back button is rendered and works correctly with items in cart
  test('back button navigates to menu with items in cart', () => {
    const cartItems = [{
      id: '1',
      name: 'Test Pizza',
      description: 'Test Description',
      price: 10.99,
      quantity: 1,
      image: '/test.jpg',
      category: 'pizza',
    }];
    useStore.setState({ cart: cartItems });

    render(<CartPage />);
    const backButton = screen.getByRole('button', { name: /back to menu/i });
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith('/');
  });
})
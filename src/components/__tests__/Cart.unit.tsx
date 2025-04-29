import { render, screen, fireEvent } from '@testing-library/react'
import Cart from '../Cart'
import { useStore } from '../../store/useStore'

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children
  }
})

describe('Cart Component (Unit)', () => {
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
  })

  // Tests if the empty cart message is displayed when there are no items
  test('renders empty cart message when cart is empty', () => {
    render(<Cart />)
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
      },
    ]

    useStore.setState({ cart: cartItems })

    render(<Cart />)
    
    expect(screen.getByText('Test Pizza')).toBeInTheDocument()
    expect(screen.getByText('$10.99')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
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
      },
    ]

    useStore.setState({ cart: cartItems })

    render(<Cart />)

    const incrementButton = screen.getByRole('button', { name: /increase quantity/i })
    const decrementButton = screen.getByRole('button', { name: /decrease quantity/i })

    fireEvent.click(incrementButton)
    expect(screen.getByText('2')).toBeInTheDocument()

    fireEvent.click(decrementButton)
    expect(screen.getByText('1')).toBeInTheDocument()
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
      },
    ]

    useStore.setState({ cart: cartItems })

    render(<Cart />)

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
      },
      {
        id: '2',
        name: 'Test Pasta',
        description: 'Test Description',
        price: 12.99,
        quantity: 1,
        image: '/test.jpg',
      },
    ]

    useStore.setState({ cart: cartItems })

    render(<Cart />)

    // Total should be (10.99 * 2) + 12.99 = 34.97
    expect(screen.getByText('$34.97')).toBeInTheDocument()
  })

  // Tests if checkout button is disabled when cart is empty
  test('checkout button is disabled when cart is empty', () => {
    render(<Cart />)

    const checkoutButton = screen.getByRole('button', { name: /checkout/i })
    expect(checkoutButton).toBeDisabled()
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
      },
    ]

    useStore.setState({ cart: cartItems })

    render(<Cart />)

    const checkoutButton = screen.getByRole('button', { name: /checkout/i })
    expect(checkoutButton).toBeEnabled()
  })
})
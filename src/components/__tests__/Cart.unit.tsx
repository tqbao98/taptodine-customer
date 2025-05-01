import { render, screen } from '@testing-library/react'
import Cart from '../Cart'
import { useStore } from '../../store/useStore'

// Mock the next/link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: { children: React.ReactNode, href: string }) => {
    return <a href={href} {...props}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
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

  test('renders cart icon correctly', () => {
    render(<Cart />)
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  test('shows cart count when items are present', () => {
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
    render(<Cart />)
    
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('hides cart count when cart is empty', () => {
    render(<Cart />)
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument()
  })

  test('shows total quantity of items in cart', () => {
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
        name: 'Test Salad',
        description: 'Test Description',
        price: 8.99,
        quantity: 3,
        image: '/test.jpg',
        category: 'salad',
      }
    ]

    useStore.setState({ cart: cartItems })
    render(<Cart />)
    
    // Should show 5 (2 pizzas + 3 salads)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  test('shows correct quantity for single item with multiple quantity', () => {
    const cartItems = [
      {
        id: '1',
        name: 'Test Pizza',
        description: 'Test Description',
        price: 10.99,
        quantity: 3,
        image: '/test.jpg',
        category: 'pizza',
      }
    ]

    useStore.setState({ cart: cartItems })
    render(<Cart />)
    
    // Should show 3 (3 pizzas)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
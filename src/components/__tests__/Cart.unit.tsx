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
    
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  test('hides cart count when cart is empty', () => {
    render(<Cart />)
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument()
  })
})
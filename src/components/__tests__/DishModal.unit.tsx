import { render, screen, fireEvent } from '@testing-library/react'
import DishModal from '../DishModal'
import { useStore } from '../../store/useStore'
import { MenuItem } from '../../types'

describe('DishModal Component (Unit)', () => {
  const mockItem: MenuItem = {
    id: '1',
    name: 'Test Pizza',
    description: 'Test Description',
    price: 10.99,
    image: '/test.jpg',
    category: 'pizza',
  }

  const mockOnClose = jest.fn()

  beforeEach(() => {
    // Reset the store and mocks before each test
    useStore.setState({
      cart: [],
      menu: [],
      orders: [],
      isLoading: false,
      error: null,
      restaurantName: '',
    })
    mockOnClose.mockClear()
  })

  // Tests if all dish details are displayed correctly when the modal is open
  test('renders dish details correctly when open', () => {
    render(<DishModal item={mockItem} isOpen={true} onClose={mockOnClose} />)

    expect(screen.getByText('Test Pizza')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('$10.99')).toBeInTheDocument()
  })

  // Tests if the modal is hidden when isOpen is false
  test('does not render when isOpen is false', () => {
    render(<DishModal item={mockItem} isOpen={false} onClose={mockOnClose} />)

    expect(screen.queryByText('Test Pizza')).not.toBeInTheDocument()
  })

  // Tests if the quantity starts at 1 by default
  test('initial quantity is 1', () => {
    render(<DishModal item={mockItem} isOpen={true} onClose={mockOnClose} />)

    const quantityInput = screen.getByRole('spinbutton')
    expect(quantityInput).toHaveValue(1)
  })

  // Tests if the quantity increases when clicking the increment button
  test('handles quantity increment correctly', () => {
    render(<DishModal item={mockItem} isOpen={true} onClose={mockOnClose} />)

    const incrementButton = screen.getByRole('button', { name: /increase quantity/i })
    const quantityInput = screen.getByRole('spinbutton')

    fireEvent.click(incrementButton)
    expect(quantityInput).toHaveValue(2)
  })

  // Tests if the quantity decreases when clicking the decrement button
  test('handles quantity decrement correctly', () => {
    render(<DishModal item={mockItem} isOpen={true} onClose={mockOnClose} />)

    const incrementButton = screen.getByRole('button', { name: /increase quantity/i })
    const decrementButton = screen.getByRole('button', { name: /decrease quantity/i })
    const quantityInput = screen.getByRole('spinbutton')

    // First increment to 2
    fireEvent.click(incrementButton)
    expect(quantityInput).toHaveValue(2)

    // Then decrement back to 1
    fireEvent.click(decrementButton)
    expect(quantityInput).toHaveValue(1)
  })

  // Tests if quantity can't go below 1
  test('prevents quantity from going below 1', () => {
    render(<DishModal item={mockItem} isOpen={true} onClose={mockOnClose} />)

    const decrementButton = screen.getByRole('button', { name: /decrease quantity/i })
    const quantityInput = screen.getByRole('spinbutton')

    fireEvent.click(decrementButton)
    expect(quantityInput).toHaveValue(1)
  })

  // Tests if items are added to cart with the correct quantity
  test('adds item to cart with correct quantity', () => {
    render(<DishModal item={mockItem} isOpen={true} onClose={mockOnClose} />)

    const incrementButton = screen.getByRole('button', { name: /increase quantity/i })
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })

    // Set quantity to 2
    fireEvent.click(incrementButton)
    
    // Add to cart
    fireEvent.click(addToCartButton)

    // Verify cart state
    const store = useStore.getState()
    expect(store.cart).toHaveLength(1)
    expect(store.cart[0]).toEqual({
      ...mockItem,
      quantity: 2,
    })
  })

  // Tests if modal closes after adding item to cart
  test('calls onClose when adding to cart', () => {
    render(<DishModal item={mockItem} isOpen={true} onClose={mockOnClose} />)

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  // Tests if modal closes when clicking the close button
  test('calls onClose when clicking close button', () => {
    render(<DishModal item={mockItem} isOpen={true} onClose={mockOnClose} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  // Tests if subtotal updates correctly when quantity changes
  test('updates subtotal when quantity changes', () => {
    render(<DishModal item={mockItem} isOpen={true} onClose={mockOnClose} />)

    const incrementButton = screen.getByRole('button', { name: /increase quantity/i })
    
    // Initial subtotal
    expect(screen.getByText('$10.99')).toBeInTheDocument()

    // Increase quantity to 2
    fireEvent.click(incrementButton)
    
    // New subtotal should be price * 2
    expect(screen.getByText('$21.98')).toBeInTheDocument()
  })
})
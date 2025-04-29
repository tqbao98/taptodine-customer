import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderDetailsModal from '../OrderDetailsModal';

describe('OrderDetailsModal Component (Unit)', () => {
  const testDate = new Date('2025-04-29T21:56:00Z');
  const mockOrder = {
    id: '123',
    createdAt: testDate.toISOString(),
    status: 'pending' as const,
    restaurantName: 'Test Restaurant',
    items: [
      { 
        id: '1', 
        name: 'Test Pizza', 
        description: 'Test Pizza Description',
        price: 10.99, 
        quantity: 2,
        image: '/images/test-pizza.jpg',
        category: 'Pizza'
      },
      { 
        id: '2', 
        name: 'Test Pasta', 
        description: 'Test Pasta Description',
        price: 12.99, 
        quantity: 1,
        image: '/images/test-pasta.jpg',
        category: 'Pasta'
      }
    ],
    total: 34.97
  };

  const mockOnClose = jest.fn();

  // Tests if all order details are displayed correctly when modal is open
  test('renders order details correctly when open', () => {
    render(<OrderDetailsModal order={mockOrder} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Test Pizza')).toBeInTheDocument();
    expect(screen.getByText('Test Pasta')).toBeInTheDocument();
    expect(screen.getByText('$34.97')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  // Tests if item quantities and prices are displayed correctly
  test('shows correct item quantities and prices', () => {
    render(<OrderDetailsModal order={mockOrder} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText(/2 x \$10\.99/)).toBeInTheDocument();
    expect(screen.getByText(/1 x \$12\.99/)).toBeInTheDocument();
    expect(screen.getByText('$21.98')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  // Tests if modal closes when clicking the close button
  test('calls onClose when close button is clicked', () => {
    render(<OrderDetailsModal order={mockOrder} isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /close details/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Tests if date is formatted correctly in the order details
  test('formats date correctly', () => {
    render(<OrderDetailsModal order={mockOrder} isOpen={true} onClose={mockOnClose} />);
    
    // Find the paragraph element containing the date (it's the only gray paragraph)
    const dateParagraph = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && 
             element?.className.includes('text-gray-500') &&
             content.includes('2025');
    });

    expect(dateParagraph).toBeInTheDocument();
    // Verify it contains the key date components
    expect(dateParagraph.textContent).toMatch(/April/);
    expect(dateParagraph.textContent).toMatch(/2025/);
    expect(dateParagraph.textContent).toMatch(/\d{1,2}:\d{2}/);
  });

  // Tests if empty order state is handled gracefully
  test('handles missing order data gracefully', () => {
    const incompleteOrder = {
      ...mockOrder,
      items: []
    };

    render(<OrderDetailsModal order={incompleteOrder} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('No items in this order')).toBeInTheDocument();
  });
});
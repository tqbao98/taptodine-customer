import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner Component (Unit)', () => {
  // Tests if the spinner renders with the default "Loading..." text
  test('renders with default text', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  // Tests if the spinner can display custom loading text provided as a prop
  test('renders with custom text', () => {
    render(<LoadingSpinner text="Please wait" />)
    expect(screen.getByText('Please wait')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  // Tests if custom CSS classes are properly applied to the spinner component
  test('applies custom class names', () => {
    render(<LoadingSpinner className="custom-class" />)
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('custom-class')
  })
})
import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '../../theme/ThemeProvider'
import { CartProvider } from '../../context/CartContext'
import { Checkout } from '../Checkout'
import { useCart } from '../../context/CartContext'
import { CartItem } from '../../types'

// Mock the cart hook
jest.mock('../../context/CartContext', () => ({
  ...jest.requireActual('../../context/CartContext'),
  useCart: jest.fn(),
}))

// Mock Paystack
jest.mock('../../server/mockPaystack', () => ({
  mockPaystack: jest.fn(),
}))

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <CartProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </CartProvider>
  </ThemeProvider>
)

describe('Checkout', () => {
  const mockItems: CartItem[] = [
    {
      productId: '1',
      model: 'iPhone 15',
      color: { name: 'Black', hex: '#000000' },
      storage: { capacity: '128GB', price: 799 },
      quantity: 1,
      price: 799,
      image: 'test.jpg',
    },
  ]

  beforeEach(() => {
    ;(useCart as jest.Mock).mockReturnValue({
      items: mockItems,
      getTotalPrice: () => 799,
      clearCart: jest.fn(),
    })
  })

  it('should render checkout form', () => {
    render(
      <TestWrapper>
        <Checkout />
      </TestWrapper>
    )

    expect(screen.getByText('Checkout')).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('should show warning when cart is empty', () => {
    ;(useCart as jest.Mock).mockReturnValue({
      items: [],
      getTotalPrice: () => 0,
      clearCart: jest.fn(),
    })

    render(
      <TestWrapper>
        <Checkout />
      </TestWrapper>
    )

    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument()
  })
})


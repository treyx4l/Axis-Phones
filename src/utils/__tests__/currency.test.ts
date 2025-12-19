import { formatCurrency } from '../currency'

describe('formatCurrency', () => {
  it('should format USD currency correctly', () => {
    expect(formatCurrency(100)).toBe('$100.00')
    expect(formatCurrency(999.99)).toBe('$999.99')
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('should handle large numbers', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00')
  })
})


import { validateEmail, validatePhone, validatePostalCode } from '../validators'

describe('validators', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('1234567890')).toBe(true)
      expect(validatePhone('+1 (234) 567-8900')).toBe(true)
      expect(validatePhone('123-456-7890')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('abc')).toBe(false)
    })
  })

  describe('validatePostalCode', () => {
    it('should validate postal codes with at least 4 characters', () => {
      expect(validatePostalCode('1234')).toBe(true)
      expect(validatePostalCode('12345')).toBe(true)
      expect(validatePostalCode('12345-6789')).toBe(true)
    })

    it('should reject short postal codes', () => {
      expect(validatePostalCode('123')).toBe(false)
      expect(validatePostalCode('')).toBe(false)
    })
  })
})


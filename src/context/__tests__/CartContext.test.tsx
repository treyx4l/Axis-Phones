import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '../CartContext'
import { CartItem } from '../../types'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    expect(result.current.items).toEqual([])
    expect(result.current.getTotalItems()).toBe(0)
    expect(result.current.getTotalPrice()).toBe(0)
  })

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    const item: CartItem = {
      productId: '1',
      model: 'iPhone 15',
      color: { name: 'Black', hex: '#000000' },
      storage: { capacity: '128GB', price: 799 },
      quantity: 1,
      price: 799,
      image: 'test.jpg',
    }

    act(() => {
      result.current.addItem(item)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.getTotalItems()).toBe(1)
    expect(result.current.getTotalPrice()).toBe(799)
  })

  it('should update quantity when adding same item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    const item: CartItem = {
      productId: '1',
      model: 'iPhone 15',
      color: { name: 'Black', hex: '#000000' },
      storage: { capacity: '128GB', price: 799 },
      quantity: 1,
      price: 799,
      image: 'test.jpg',
    }

    act(() => {
      result.current.addItem(item)
      result.current.addItem(item)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.getTotalItems()).toBe(2)
  })

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    const item: CartItem = {
      productId: '1',
      model: 'iPhone 15',
      color: { name: 'Black', hex: '#000000' },
      storage: { capacity: '128GB', price: 799 },
      quantity: 1,
      price: 799,
      image: 'test.jpg',
    }

    act(() => {
      result.current.addItem(item)
      result.current.removeItem('1')
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    const item: CartItem = {
      productId: '1',
      model: 'iPhone 15',
      color: { name: 'Black', hex: '#000000' },
      storage: { capacity: '128GB', price: 799 },
      quantity: 1,
      price: 799,
      image: 'test.jpg',
    }

    act(() => {
      result.current.addItem(item)
      result.current.updateQuantity('1', 3)
    })

    expect(result.current.items[0].quantity).toBe(3)
    expect(result.current.getTotalItems()).toBe(3)
  })

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    const item: CartItem = {
      productId: '1',
      model: 'iPhone 15',
      color: { name: 'Black', hex: '#000000' },
      storage: { capacity: '128GB', price: 799 },
      quantity: 1,
      price: 799,
      image: 'test.jpg',
    }

    act(() => {
      result.current.addItem(item)
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
  })
})


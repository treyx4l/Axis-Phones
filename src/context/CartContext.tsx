import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { CartItem } from '../types'
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '../utils/rateLimiter'
import { useNotification } from './NotificationContext'

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartState {
  items: CartItem[]
}

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.color.name === action.payload.color.name &&
          item.storage.capacity === action.payload.storage.capacity
      )

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return { items: updatedItems }
      }

      return { items: [...state.items, action.payload] }
    }

    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter((item) => item.productId !== action.payload),
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          items: state.items.filter((item) => item.productId !== action.payload.productId),
        }
      }

      return {
        items: state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    }

    case 'CLEAR_CART':
      return { items: [] }

    case 'LOAD_CART':
      return { items: action.payload }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { showRateLimitError, showNotification } = useNotification()

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: items })
      } catch (error) {
        // Failed to load cart from localStorage
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: CartItem) => {
    // Check rate limit
    const rateLimitCheck = checkRateLimit({
      ...RATE_LIMIT_CONFIGS.ADD_TO_CART,
      identifier: 'cart:add',
    })

    if (!rateLimitCheck.allowed) {
      showRateLimitError(rateLimitCheck.resetTime, 'adding items to cart')
      return
    }

    dispatch({ type: 'ADD_ITEM', payload: item })
    showNotification('Item added to cart!', 'success', 3000)
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}


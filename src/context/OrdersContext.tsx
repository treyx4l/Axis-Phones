import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  ref, 
  get, 
  set, 
  onValue,
  off,
} from 'firebase/database'
import { useAuth } from './AuthContext'
import { Order } from '../types'
import { db } from '../FirebaseConfig'
import type { Database } from 'firebase/database'

// Type assertion for Firebase instance
const typedDb: Database | null = db

interface OrdersContextType {
  orders: Order[]
  addOrder: (order: Order) => Promise<void>
  getOrderById: (id: string) => Promise<Order | undefined>
  getAllOrders: () => Promise<Order[]>
  updateOrderStatus: (orderId: string, status: string) => Promise<void>
  loading: boolean
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Load orders from Realtime Database when user changes
  useEffect(() => {
    if (!user || !typedDb) {
      setOrders([])
      setLoading(false)
      return
    }

    const ordersRef = ref(typedDb, 'orders')
    
    // Set up real-time listener for user's orders
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val()
      const loadedOrders: Order[] = []
      
      if (data) {
        Object.keys(data).forEach((key) => {
          const order = data[key]
          // Only include orders for current user
          if (order.userId === user.uid) {
            loadedOrders.push({
              id: key,
              ...order,
            } as Order)
          }
        })
        
        // Sort by creation date (newest first)
        loadedOrders.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })
      }
      
      setOrders(loadedOrders)
      setLoading(false)
    }, (error) => {
      console.error('Error loading orders:', error)
      setOrders([])
      setLoading(false)
    })

    // Cleanup listener on unmount
    return () => {
      off(ordersRef)
    }
  }, [user])

  const addOrder = async (order: Order) => {
    if (!user) {
      throw new Error('User not logged in. Please sign in to complete your order.')
    }
    
    if (!typedDb) {
      throw new Error('Realtime Database not initialized. Please check your Firebase configuration.')
    }

    try {
      const { id, ...orderData } = order
      
      // Prepare order data with all required fields
      const orderToSave = {
        ...orderData,
        reference: order.reference || order.id,
        userId: user.uid,
        userEmail: user.email || order.buyerDetails.email,
        createdAt: order.createdAt || new Date().toISOString(),
        status: order.status || 'processing',
      }
      
      console.log('Saving order to database:', {
        reference: orderToSave.reference,
        userId: orderToSave.userId,
        total: orderToSave.total,
        itemsCount: orderToSave.items?.length || 0,
      })
      
      // Use the reference as the key to ensure uniqueness and easy lookup
      const orderRef = ref(typedDb, `orders/${order.reference || order.id}`)
      await set(orderRef, orderToSave)
      
      console.log('Order saved successfully with reference:', order.reference || order.id)
      
      // Update local state
      const savedOrder = { ...order, id: order.reference || order.id }
      setOrders([savedOrder, ...orders])
    } catch (error: any) {
      console.error('Error adding order to database:', error)
      console.error('Error details:', {
        code: error?.code,
        message: error?.message,
        stack: error?.stack,
      })
      
      // Provide more specific error information
      if (error?.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Please check your Firebase Realtime Database security rules.')
      } else if (error?.code === 'DATABASE_ERROR') {
        throw new Error('Database error. Please check your Firebase configuration.')
      } else {
        throw new Error(error?.message || 'Failed to save order to database')
      }
    }
  }

  const getOrderById = async (id: string): Promise<Order | undefined> => {
    // First check local state
    const localOrder = orders.find(order => order.id === id || order.reference === id)
    if (localOrder) {
      return localOrder
    }
    
    // If not found locally, try to fetch from database
    if (!typedDb) {
      return undefined
    }
    
    try {
      const orderRef = ref(typedDb, `orders/${id}`)
      const snapshot = await get(orderRef)
      
      if (snapshot.exists()) {
        const orderData = snapshot.val()
        return {
          id: id,
          ...orderData,
        } as Order
      }
      
      // If not found by ID, search all orders by reference
      const ordersRef = ref(typedDb, 'orders')
      const allOrdersSnapshot = await get(ordersRef)
      
      if (allOrdersSnapshot.exists()) {
        const allOrders = allOrdersSnapshot.val()
        for (const [key, order] of Object.entries(allOrders)) {
          const orderObj = order as any
          if (orderObj.reference === id || orderObj.id === id) {
            return {
              id: key,
              ...orderObj,
            } as Order
          }
        }
      }
    } catch (error) {
      console.error('Error fetching order by ID:', error)
    }
    
    return undefined
  }

  const getAllOrders = async (): Promise<Order[]> => {
    if (!typedDb) {
      throw new Error('Realtime Database not initialized')
    }

    try {
      const ordersRef = ref(typedDb, 'orders')
      const snapshot = await get(ordersRef)
      const data = snapshot.val()
      
      const allOrders: Order[] = []
      if (data) {
        Object.keys(data).forEach((key) => {
          allOrders.push({
            id: key,
            ...data[key],
          } as Order)
        })
        
        // Sort by creation date (newest first)
        allOrders.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })
      }
      
      return allOrders
    } catch (error: any) {
      console.error('Error loading all orders:', error)
      throw error
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!typedDb) {
      throw new Error('Realtime Database not initialized')
    }

    try {
      const orderRef = ref(typedDb, `orders/${orderId}`)
      
      // Get current order data
      const snapshot = await get(orderRef)
      const currentData = snapshot.val()
      
      if (!currentData) {
        throw new Error('Order not found')
      }
      
      // Update order with new status
      await set(orderRef, {
        ...currentData,
        status,
        updatedAt: new Date().toISOString(),
      })
      
      // Update local state if this order belongs to current user
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: status as any } : order
      ))
      
      console.log('Order status updated:', orderId, status)
    } catch (error: any) {
      console.error('Error updating order status:', error)
      throw error
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        getOrderById,
        getAllOrders,
        updateOrderStatus,
        loading,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider')
  }
  return context
}

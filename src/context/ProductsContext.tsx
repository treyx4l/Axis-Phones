import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  ref, 
  get, 
  set, 
  push, 
  remove, 
  onValue, 
  off,
  query,
  orderByChild,
  equalTo
} from 'firebase/database'
import { Product } from '../types'
import { db } from '../FirebaseConfig'

interface ProductsContextType {
  products: Product[]
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => Promise<void>
  updateProduct: (id: string, product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  reloadProducts: () => Promise<void>
  loading: boolean
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    if (!db) {
      console.warn('Realtime Database not initialized - db is null')
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      console.log('Loading products from Realtime Database...')
      const productsRef = ref(db, 'products')
      
      // Set up real-time listener
      const unsubscribe = onValue(productsRef, (snapshot) => {
        const data = snapshot.val()
        const loadedProducts: Product[] = []
        
        if (data) {
          Object.keys(data).forEach((key) => {
            loadedProducts.push({
              id: key,
              ...data[key],
            } as Product)
          })
          
          // Sort by model name
          loadedProducts.sort((a, b) => a.model.localeCompare(b.model))
        }
        
        console.log(`Loaded ${loadedProducts.length} products from Realtime Database`)
        setProducts(loadedProducts)
        setLoading(false)
      }, (error) => {
        console.error('Error loading products:', error)
        setLoading(false)
      })

      // Return cleanup function
      return () => {
        off(productsRef)
      }
    } catch (error: any) {
      console.error('Error loading products:', error)
      console.error('Error code:', error?.code)
      console.error('Error message:', error?.message)
      setLoading(false)
    }
  }

  // Load products from Realtime Database on mount
  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setupListener = async () => {
      if (!db) {
        setLoading(false)
        return
      }

      try {
        const productsRef = ref(db, 'products')
        
        // Set up real-time listener
        onValue(productsRef, (snapshot) => {
          const data = snapshot.val()
          const loadedProducts: Product[] = []
          
          if (data) {
            Object.keys(data).forEach((key) => {
              loadedProducts.push({
                id: key,
                ...data[key],
              } as Product)
            })
            
            // Sort by model name
            loadedProducts.sort((a, b) => a.model.localeCompare(b.model))
          }
          
          console.log(`Loaded ${loadedProducts.length} products from Realtime Database`)
          setProducts(loadedProducts)
          setLoading(false)
        }, (error) => {
          console.error('Error loading products:', error)
          setLoading(false)
        })
      } catch (error: any) {
        console.error('Error setting up products listener:', error)
        setLoading(false)
      }
    }

    setupListener()

    // Cleanup listener on unmount
    return () => {
      if (db) {
        const productsRef = ref(db, 'products')
        off(productsRef)
      }
    }
  }, [])

  const reloadProducts = async () => {
    if (!db) {
      console.warn('Realtime Database not initialized')
      return
    }

    setLoading(true)
    try {
      const productsRef = ref(db, 'products')
      const snapshot = await get(productsRef)
      const data = snapshot.val()
      const loadedProducts: Product[] = []
      
      if (data) {
        Object.keys(data).forEach((key) => {
          loadedProducts.push({
            id: key,
            ...data[key],
          } as Product)
        })
        
        loadedProducts.sort((a, b) => a.model.localeCompare(b.model))
      }
      
      setProducts(loadedProducts)
      console.log('Products reloaded:', loadedProducts.length)
    } catch (error: any) {
      console.error('Error reloading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: Product) => {
    if (!db) {
      console.error('Realtime Database db is not initialized')
      throw new Error('Realtime Database not initialized. Please check your Firebase configuration.')
    }

    try {
      console.log('Preparing to add product to Realtime Database:', product)
      const productsRef = ref(db, 'products')
      const { id, ...productData } = product
      
      // Ensure all required fields are present
      const productToSave = {
        model: productData.model || '',
        sku: productData.sku || '',
        description: productData.description || '',
        basePrice: productData.basePrice || 0,
        stock: productData.stock || 0,
        releaseYear: productData.releaseYear || new Date().getFullYear(),
        images: productData.images || [],
        storageOptions: productData.storageOptions || [],
        colorVariants: productData.colorVariants || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      console.log('Saving product to Realtime Database:', productToSave)
      
      // Push new product (generates unique key)
      const newProductRef = push(productsRef)
      await set(newProductRef, productToSave)
      
      const newProductId = newProductRef.key
      console.log('Product saved with ID:', newProductId)
      
      // Reload products to ensure consistency
      await reloadProducts()
      console.log('Products reloaded after adding new product')
    } catch (error: any) {
      console.error('Error adding product to Realtime Database:', error)
      console.error('Error code:', error?.code)
      console.error('Error message:', error?.message)
      
      // Provide more specific error messages
      if (error?.code === 'PERMISSION_DENIED') {
        throw new Error('Permission denied. Please check your Realtime Database security rules.')
      } else if (error?.code === 'UNAVAILABLE') {
        throw new Error('Realtime Database is unavailable. Please check your internet connection.')
      }
      
      throw new Error(error?.message || 'Failed to add product to Realtime Database')
    }
  }

  const updateProduct = async (id: string, product: Product) => {
    if (!db) {
      throw new Error('Realtime Database not initialized')
    }

    try {
      const productRef = ref(db, `products/${id}`)
      const { id: _, ...productData } = product
      
      await set(productRef, {
        ...productData,
        updatedAt: new Date().toISOString(),
      })
      
      // Update local state
      setProducts(products.map((p) => (p.id === id ? product : p)))
      console.log('Product updated successfully:', id)
    } catch (error: any) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  const deleteProduct = async (id: string) => {
    if (!db) {
      throw new Error('Realtime Database not initialized')
    }

    try {
      const productRef = ref(db, `products/${id}`)
      await remove(productRef)
      
      // Update local state
      setProducts(products.filter((p) => p.id !== id))
      console.log('Product deleted successfully:', id)
    } catch (error: any) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        reloadProducts,
        loading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider')
  }
  return context
}

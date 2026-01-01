export interface ColorVariant {
  name: string
  hex: string
  imageUrl?: string
}

export interface StorageOption {
  capacity: string
  price: number
}

export interface Product {
  id: string
  model: string
  sku: string
  description: string
  images: string[]
  basePrice: number
  storageOptions: StorageOption[]
  colorVariants: ColorVariant[]
  stock: number
  releaseYear?: number
}

export interface CartItem {
  productId: string
  model: string
  color: ColorVariant
  storage: StorageOption
  quantity: number
  price: number
  image: string
}

export interface BuyerDetails {
  fullName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    region: string
  }
}

export interface Order {
  id: string
  reference: string
  items: CartItem[]
  buyerDetails: BuyerDetails
  subtotal: number
  tax: number
  shipping: number
  total: number
  createdAt: string
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus?: 'pending' | 'paid' | 'failed'
  userId?: string
  userEmail?: string
}


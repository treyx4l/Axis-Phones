import React, { useState } from 'react'
import { Container, Typography, Grid, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { useNotification } from '../context/NotificationContext'
import { BuyerDetails, Order } from '../types'
import { CheckoutForm } from '../components/CheckoutForm'
import { CartSummary } from '../components/CartSummary'
import { initializePaystack, generatePaystackReference, convertToKobo } from '../utils/paystack'
import { sendOrderNotification } from '../utils/notifications'
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '../utils/rateLimiter'

export const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { addOrder } = useOrders()
  const { showRateLimitError } = useNotification()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.01 // 1% tax
  const shipping = subtotal > 500 ? 0 : 15
  const total = subtotal + tax + shipping

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Your cart is empty. Please add items before checkout.</Alert>
      </Container>
    )
  }

  const handleSubmit = async (buyerDetails: BuyerDetails) => {
    // Check rate limit for checkout
    const checkoutRateLimit = checkRateLimit({
      ...RATE_LIMIT_CONFIGS.CHECKOUT,
      identifier: user ? `checkout:${user.uid}` : 'checkout:guest',
    })

    if (!checkoutRateLimit.allowed) {
      showRateLimitError(checkoutRateLimit.resetTime, 'checkout')
      return
    }

    // Check rate limit for order creation
    const orderRateLimit = checkRateLimit({
      ...RATE_LIMIT_CONFIGS.CREATE_ORDER,
      identifier: user ? `order:${user.uid}` : 'order:guest',
    })

    if (!orderRateLimit.allowed) {
      showRateLimitError(orderRateLimit.resetTime, 'creating orders')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

      if (!paystackPublicKey) {
        throw new Error(
          'Paystack public key is not configured. Please set VITE_PAYSTACK_PUBLIC_KEY in your .env file.'
        )
      }

      const reference = generatePaystackReference()
      const amountInKobo = convertToKobo(total)

      // Initialize Paystack payment
      await initializePaystack({
        key: paystackPublicKey,
        email: buyerDetails.email,
        amount: amountInKobo,
        reference,
        metadata: {
          order_items: items.map(item => ({
            product: item.model,
            quantity: item.quantity,
            price: item.price,
          })),
          buyer_name: buyerDetails.fullName,
          buyer_phone: buyerDetails.phone,
        },
        callback: async response => {
          // Payment successful
          try {
            const orderId = response.reference || reference

            // Verify user is still authenticated
            if (!user) {
              throw new Error('User session expired. Please sign in again.')
            }

            // Create order object
            const order: Order = {
              id: orderId,
              reference: orderId,
              items,
              buyerDetails,
              subtotal,
              tax,
              shipping,
              total,
              createdAt: new Date().toISOString(),
              status: 'processing',
              paymentStatus: 'paid',
            }

            // Save order to database
            await addOrder(order)

            // Send notification for paid orders (with rate limiting)
            await sendOrderNotification(order)

            clearCart()
            // Redirect to order confirmation page with order reference
            navigate(`/order-confirmation?reference=${orderId}`, { replace: true })
          } catch (orderError: any) {
            // Provide more specific error message
            let errorMessage =
              'Payment successful but failed to save order. Please contact support.'
            if (orderError?.message) {
              if (orderError.message.includes('not logged in')) {
                errorMessage =
                  'Your session expired. Please sign in again and contact support with your payment reference.'
              } else if (orderError.message.includes('not initialized')) {
                errorMessage =
                  'Database connection error. Please refresh the page and contact support if the issue persists.'
              } else if (orderError.message.includes('Permission denied')) {
                errorMessage = 'Permission error. Please ensure you are signed in and try again.'
              } else {
                errorMessage = `Failed to save order: ${orderError.message}. Please contact support with reference: ${reference}`
              }
            }

            setError(errorMessage)
            setLoading(false)
          }
        },
        onClose: () => {
          setLoading(false)
          // User closed payment window - don't show error, just stop loading
        },
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during payment'

      // Don't show error if user just closed the payment window
      if (errorMessage !== 'Payment window closed') {
        setError(errorMessage)
      }
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <CheckoutForm onSubmit={handleSubmit} loading={loading} />
        </Grid>

        <Grid item xs={12} md={5}>
          <CartSummary subtotal={subtotal} tax={tax} shipping={shipping} total={total} />
        </Grid>
      </Grid>
    </Container>
  )
}

import React from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  IconButton,
} from '@mui/material'
import { Delete, ShoppingCart } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../utils/currency'
import { CartSummary } from '../components/CartSummary'
import { QuantityInput } from '../components/QuantityInput'
import { AuthPrompt } from '../components/AuthPrompt'

export const Cart: React.FC = () => {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart()
  const { user } = useAuth()

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.01 // 1% tax
  const shipping = subtotal > 500 ? 0 : 15
  const total = subtotal + tax + shipping

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start adding some iPhones to your cart!
          </Typography>
          <Button variant="contained" onClick={() => navigate('/category')}>
            Browse Products
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      {!user && (
        <AuthPrompt message="Sign in to save your cart and checkout securely" />
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Paper key={`${item.productId}-${item.color.name}-${item.storage.capacity}`} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Box
                    component="img"
                    src={item.image || '/placeholder-phone.jpg'}
                    alt={item.model}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      maxHeight: 150,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">{item.model}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Color: {item.color.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Storage: {item.storage.capacity}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    {formatCurrency(item.price)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <QuantityInput
                      value={item.quantity}
                      onChange={(qty) => updateQuantity(item.productId, qty)}
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeItem(item.productId)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <CartSummary subtotal={subtotal} tax={tax} shipping={shipping} total={total} />
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}


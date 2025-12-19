import React, { useState, useEffect } from 'react'
import { Container, Typography, Box, Paper, Button, Divider, Alert, Grid, CircularProgress } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { formatCurrency } from '../utils/currency'
import { useOrders } from '../context/OrdersContext'
import { Order } from '../types'

export const OrderConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { getOrderById } = useOrders()
  const [order, setOrder] = useState<Order | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const reference = searchParams.get('reference') || 'N/A'
  
  useEffect(() => {
    const loadOrder = async () => {
      if (reference && reference !== 'N/A') {
        setLoading(true)
        try {
          const loadedOrder = await getOrderById(reference)
          setOrder(loadedOrder)
        } catch (error) {
          console.error('Error loading order:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    
    loadOrder()
  }, [reference, getOrderById])

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Order Confirmed!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Thank you for your purchase
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Details
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Order Reference
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>{reference}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Order Date
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>
                {order
                  ? new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : new Date().toLocaleDateString()}
              </strong>
            </Typography>
          </Grid>
          {order && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                  Items Ordered
                </Typography>
                {order.items.map((item, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                    • {item.quantity}x {item.model} - {item.color.name} - {item.storage.capacity} ({formatCurrency(item.price * item.quantity)})
                  </Typography>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">{formatCurrency(order.subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tax:</Typography>
                  <Typography variant="body2">{formatCurrency(order.tax)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping:</Typography>
                  <Typography variant="body2">{formatCurrency(order.shipping)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">{formatCurrency(order.total)}</Typography>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
        {order && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2" component="div">
              <strong>Payment Successful!</strong> Your order has been confirmed and will be processed shortly.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              A confirmation email has been sent to <strong>{order.buyerDetails.email}</strong> with order details and tracking information.
            </Typography>
          </Alert>
        )}
        {!order && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Your order has been confirmed. Order reference: <strong>{reference}</strong>
          </Alert>
        )}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          }}
        >
          Continue Shopping
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/orders')}
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          }}
        >
          View All Orders
        </Button>
      </Box>
    </Container>
  )
}


import React from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  Receipt,
  LocalShipping,
  CheckCircle,
  Schedule,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { formatCurrency } from '../utils/currency'
import { Order } from '../types'

const getOrderStatus = (order: Order): { label: string; color: 'default' | 'primary' | 'success' | 'warning' | 'error'; icon: React.ReactElement } => {
  const status = order.status || 'pending'
  
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'warning', icon: <Schedule /> }
    case 'processing':
      return { label: 'Processing', color: 'default', icon: <Schedule /> }
    case 'shipped':
      return { label: 'Shipped', color: 'primary', icon: <LocalShipping /> }
    case 'delivered':
      return { label: 'Delivered', color: 'success', icon: <CheckCircle /> }
    case 'cancelled':
      return { label: 'Cancelled', color: 'error', icon: <Receipt /> }
    default:
      return { label: 'Pending', color: 'warning', icon: <Schedule /> }
  }
}

export const Orders: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { orders, loading } = useOrders()

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please sign in to view your orders.
        </Alert>
      </Container>
    )
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Orders
        </Typography>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Receipt sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start shopping to see your orders here
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Browse Products
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            My Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
          </Typography>
        </Box>
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
          Browse Products
        </Button>
      </Box>

      <Grid container spacing={3}>
        {orders.map((order) => {
          const status = getOrderStatus(order)
          return (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Order #{order.reference}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                    <Chip
                      icon={status.icon}
                      label={status.label}
                      color={status.color}
                      size="small"
                      sx={{ '& .MuiChip-icon': { color: 'inherit' } }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {order.items.map((item, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                          • {item.quantity}x {item.model} - {item.color.name} - {item.storage.capacity}
                        </Typography>
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="h6">
                      Total: {formatCurrency(order.total)}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/order-confirmation?reference=${order.reference}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}


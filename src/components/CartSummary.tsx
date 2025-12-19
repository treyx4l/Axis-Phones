import React from 'react'
import { Box, Typography, Divider, Paper, Fade } from '@mui/material'
import { formatCurrency } from '../utils/currency'

interface CartSummaryProps {
  subtotal: number
  tax?: number
  shipping?: number
  total: number
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  tax = subtotal * 0.01, // 1% default tax
  shipping = subtotal > 500 ? 0 : 15,
  total,
}) => {
  return (
    <Fade in timeout={600}>
      <Paper 
        sx={{ 
          p: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Order Summary
        </Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Subtotal</Typography>
        <Typography>{formatCurrency(subtotal)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography>Tax (1%)</Typography>
        <Typography>{formatCurrency(tax)}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography>Shipping</Typography>
        <Typography>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6" color="primary">
          {formatCurrency(total)}
        </Typography>
      </Box>
      </Paper>
    </Fade>
  )
}


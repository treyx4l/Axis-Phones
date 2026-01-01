import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import { Close } from '@mui/icons-material'

interface AboutModalProps {
  open: boolean
  onClose: () => void
}

export const AboutModal: React.FC<AboutModalProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">About the Developer</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" paragraph color="text.secondary">
            AxisPhones is a modern e-commerce platform for mobile devices.
            <br /> Built with React, TypeScript, and Material-UI. Features a full product catalog,
            shopping cart, checkout flow, and Paystack payment integration. This application
            demonstrates best practices in frontend development, including state management,
            authentication, and user experience design.
            <br /> This was built by Axis Tech.
            <br />
            You can contact us at <br />
            <a href="mailto:axistech.digital@gmail.com">axistech.digital@gmail.com</a>
            <br />
            Or visit our website at <br />
            <a href="https://axis-tech.vercel.app/">https://axis-tech.vercel.app/</a>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            © 2025 AxisPhones. All rights reserved.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

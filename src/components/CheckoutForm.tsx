import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { BuyerDetails } from '../types'
import { validateEmail, validatePhone } from '../utils/validators'
import { useAuth } from '../context/AuthContext'
import { ref, get } from 'firebase/database'
import { db } from '../FirebaseConfig'
import type { Database } from 'firebase/database'

// Type assertion for Firebase instance
const typedDb: Database | null = db

interface CheckoutFormProps {
  onSubmit: (details: BuyerDetails) => void
  loading?: boolean
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, loading = false }) => {
  const { user, userProfile } = useAuth()
  const [formData, setFormData] = useState<BuyerDetails>({
    fullName: '',
    email: userProfile?.email || '',
    phone: '',
    address: {
      street: '',
      city: '',
      region: '',
    },
  })

  const [errors, setErrors] = useState<Partial<Record<keyof BuyerDetails | 'address', string>>>({})

  // Load saved checkout details
  useEffect(() => {
    const loadCheckoutDetails = async () => {
      if (!user || !typedDb) return

      try {
        const userCheckoutRef = ref(typedDb, `userCheckoutDetails/${user.uid}`)
        const snapshot = await get(userCheckoutRef)
        
        if (snapshot.exists()) {
          const data = snapshot.val()
          setFormData({
            fullName: data.fullName || '',
            email: data.email || userProfile?.email || '',
            phone: data.phone || '',
            address: {
              street: data.address?.street || '',
              city: data.address?.city || '',
              region: data.address?.region || '',
            },
          })
        } else if (userProfile?.email) {
          // At least pre-fill email
          setFormData(prev => ({
            ...prev,
            email: userProfile.email || prev.email,
          }))
        }
      } catch (error) {
        // Error loading checkout details
      }
    }

    loadCheckoutDetails()
  }, [user, userProfile?.email])

  const handleChange = (field: keyof BuyerDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleAddressChange = (field: keyof BuyerDetails['address'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }))
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number'
    }

    if (!formData.address.street.trim()) {
      newErrors.address = 'Street address is required'
    }
    if (!formData.address.city.trim()) {
      newErrors.address = 'City is required'
    }
    if (!formData.address.region.trim()) {
      newErrors.address = 'Region is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Shipping Information
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Active Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            value={formData.address.street}
            onChange={(e) => handleAddressChange('street', e.target.value)}
            error={!!errors.address}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            value={formData.address.city}
            onChange={(e) => handleAddressChange('city', e.target.value)}
            error={!!errors.address}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={!!errors.address}>
            <InputLabel>Region</InputLabel>
            <Select
              value={formData.address.region}
              label="Region"
              onChange={(e) => handleAddressChange('region', e.target.value)}
            >
              <MenuItem value="Ashanti">Ashanti</MenuItem>
              <MenuItem value="Greater Accra">Greater Accra</MenuItem>
              <MenuItem value="Volta">Volta</MenuItem>
              <MenuItem value="Northern">Northern</MenuItem>
              <MenuItem value="Upper East">Upper East</MenuItem>
              <MenuItem value="Upper West">Upper West</MenuItem>
              <MenuItem value="Central">Central</MenuItem>
              <MenuItem value="Eastern">Eastern</MenuItem>
              <MenuItem value="Western">Western</MenuItem>
              <MenuItem value="Ahafo">Ahafo</MenuItem>
              <MenuItem value="Bono">Bono</MenuItem>
              <MenuItem value="Bono East">Bono East</MenuItem>
              <MenuItem value="North East">North East</MenuItem>
              <MenuItem value="Oti">Oti</MenuItem>
              <MenuItem value="Savannah">Savannah</MenuItem>
            </Select>
            {errors.address && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.address}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>

      {errors.address && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.address}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
        sx={{
          py: 1.5,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover:not(:disabled)': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
          },
          '&:active:not(:disabled)': {
            transform: 'translateY(0)',
          },
        }}
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </Button>
    </Box>
  )
}


import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Alert,
  Divider,
  IconButton,
  CircularProgress,
  Link,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Save, PhotoCamera, Warning, Person, ShoppingCart, Lock } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useRef } from 'react'
import { ref, get, set } from 'firebase/database'
import { db } from '../FirebaseConfig'
import { BuyerDetails } from '../types'
import type { Database } from 'firebase/database'

// Type assertion for Firebase instance
const typedDb: Database | null = db

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export const Settings: React.FC = () => {
  const { user, userProfile, updateUserProfile, uploadProfilePicture } = useAuth()
  const [tabValue, setTabValue] = useState(0)
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Checkout details state
  const [checkoutDetails, setCheckoutDetails] = useState<BuyerDetails>({
    fullName: '',
    email: userProfile?.email || '',
    phone: '',
    address: {
      street: '',
      city: '',
      region: '',
    },
  })
  const [loadingCheckout, setLoadingCheckout] = useState(false)

  // Load checkout details from Realtime Database
  useEffect(() => {
    const loadCheckoutDetails = async () => {
      if (!user || !typedDb) return

      try {
        const userCheckoutRef = ref(typedDb, `userCheckoutDetails/${user.uid}`)
        const snapshot = await get(userCheckoutRef)
        
        if (snapshot.exists()) {
          const data = snapshot.val()
          setCheckoutDetails({
            fullName: data.fullName || '',
            email: data.email || userProfile?.email || '',
            phone: data.phone || '',
            address: {
              street: data.address?.street || '',
              city: data.address?.city || '',
              region: data.address?.region || '',
            },
          })
        } else {
          // Initialize with user email if available
          setCheckoutDetails(prev => ({
            ...prev,
            email: userProfile?.email || prev.email,
          }))
        }
      } catch (error) {
        console.error('Error loading checkout details:', error)
      }
    }

    loadCheckoutDetails()
  }, [user, userProfile?.email])

  // Update display name when userProfile changes
  useEffect(() => {
    if (userProfile?.displayName) {
      setDisplayName(userProfile.displayName)
    }
  }, [userProfile])

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please sign in to access your settings.
        </Alert>
      </Container>
    )
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setMessage(null)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB.' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      await uploadProfilePicture(file)
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload profile picture. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    setMessage(null)
    try {
      await updateUserProfile({
        displayName,
      })
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCheckoutDetails = async () => {
    if (!user || !typedDb) {
      setMessage({ type: 'error', text: 'User not logged in or database not available.' })
      return
    }

    setLoadingCheckout(true)
    setMessage(null)

    try {
      const userCheckoutRef = ref(typedDb, `userCheckoutDetails/${user.uid}`)
      await set(userCheckoutRef, {
        ...checkoutDetails,
        updatedAt: new Date().toISOString(),
      })
      setMessage({ type: 'success', text: 'Checkout details saved successfully!' })
    } catch (error) {
      console.error('Error saving checkout details:', error)
      setMessage({ type: 'error', text: 'Failed to save checkout details. Please try again.' })
    } finally {
      setLoadingCheckout(false)
    }
  }

  const handleCheckoutChange = (field: keyof BuyerDetails, value: string) => {
    setCheckoutDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (field: keyof BuyerDetails['address'], value: string) => {
    setCheckoutDetails((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }))
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
          <Tab icon={<Person />} iconPosition="start" label="Profile" />
          <Tab icon={<ShoppingCart />} iconPosition="start" label="Checkout Info" />
          <Tab icon={<Lock />} iconPosition="start" label="Security" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Avatar
              src={userProfile?.photoURL || undefined}
              sx={{ width: 100, height: 100 }}
            >
              {displayName[0]?.toUpperCase() || userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            {uploading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%',
                }}
              >
                <CircularProgress size={40} sx={{ color: 'white' }} />
              </Box>
            )}
            <IconButton
              color="primary"
              component="label"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'background.paper',
                border: 2,
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              disabled={uploading}
            >
              <PhotoCamera />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileSelect}
              />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Click camera icon to upload profile picture
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveProfile}
              disabled={loading}
            >
              Save Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
            Checkout Information
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Save your checkout details to speed up future purchases. This information will be pre-filled during checkout.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={checkoutDetails.fullName}
                onChange={(e) => handleCheckoutChange('fullName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
                value={checkoutDetails.email}
                onChange={(e) => handleCheckoutChange('email', e.target.value)}
                required
            />
          </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
                label="Phone Number"
                value={checkoutDetails.phone}
                onChange={(e) => handleCheckoutChange('phone', e.target.value)}
                required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
                label="Street Address"
                value={checkoutDetails.address.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={checkoutDetails.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Region</InputLabel>
                <Select
                  value={checkoutDetails.address.region}
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
              </FormControl>
            </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<Save />}
                onClick={handleSaveCheckoutDetails}
                disabled={loadingCheckout}
            >
                {loadingCheckout ? 'Saving...' : 'Save Checkout Details'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom color="error">
          <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
          Data Management
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="body1" paragraph color="text.secondary">
          You have the right to request deletion of your personal data. This action cannot be undone and will permanently delete:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 3 }}>
          <Typography component="li" variant="body2" color="text.secondary" paragraph>
            Your account and profile information
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" paragraph>
            Your order history
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" paragraph>
            All associated data stored in our systems
          </Typography>
        </Box>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Warning:</strong> Deleting your account is permanent and cannot be reversed. 
            Please ensure you have downloaded any important information before proceeding.
          </Typography>
        </Alert>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            To request data deletion, please contact us at:
          </Typography>
          <Link
            href="mailto:privacy@axisphones.com?subject=Data Deletion Request"
            target="_blank"
            rel="noopener"
            sx={{ display: 'inline-block', mt: 1 }}
          >
            privacy@axisphones.com
          </Link>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Or use our data deletion form:
          </Typography>
          <Link
            href="https://axisphones-gh.firebaseapp.com/data-deletion"
            target="_blank"
            rel="noopener"
            sx={{ display: 'inline-block', mt: 1 }}
          >
            https://axisphones-gh.firebaseapp.com/data-deletion
          </Link>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary">
          For more information about how we handle your data, please review our{' '}
          <Link href="/privacy-policy" target="_blank" rel="noopener">
            Privacy Policy
          </Link>
          .
        </Typography>
      </Paper>
      </TabPanel>
    </Container>
  )
}

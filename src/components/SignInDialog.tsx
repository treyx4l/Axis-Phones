import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  Link,
  Divider,
} from '@mui/material'
import {
  Google,
  Close,
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface SignInDialogProps {
  open: boolean
  onClose: () => void
}

export const SignInDialog: React.FC<SignInDialogProps> = ({ open, onClose }) => {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    try {
      await signInWithGoogle()
      onClose()
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Sign in failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Sign In with Google</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Sign in or create an account using your Google account
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<Google />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{
              py: 1.5,
              backgroundColor: '#4285F4',
              '&:hover': {
                backgroundColor: '#357AE8',
              },
            }}
          >
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="caption" color="text.secondary" align="center" display="block">
          By continuing, you agree to our{' '}
          <Link component={RouterLink} to="/terms-of-service" onClick={onClose} sx={{ textDecoration: 'underline' }}>
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link component={RouterLink} to="/privacy-policy" onClick={onClose} sx={{ textDecoration: 'underline' }}>
            Privacy Policy
          </Link>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

import React from 'react'
import { Alert, AlertTitle, Button } from '@mui/material'
import { Login } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

interface AuthPromptProps {
  message?: string
  action?: string
}

export const AuthPrompt: React.FC<AuthPromptProps> = ({
  message = 'Please sign in to continue',
  action = 'Sign In',
}) => {
  const { signInWithGoogle } = useAuth()
  const { showNotification } = useNotification()

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
      showNotification('Signed in successfully!', 'success')
    } catch (error: any) {
      // Only show notification if it's not a popup-closed error
      if (error.code !== 'auth/popup-closed-by-user' && error.message) {
        // Check if it's a rate limit error
        if (error.message.includes('Too many sign-in attempts')) {
          showNotification(error.message, 'warning', 8000)
        } else {
          showNotification(`Sign in failed: ${error.message}`, 'error')
        }
      }
    }
  }

  return (
    <Alert
      severity="info"
      action={
        <Button
          color="inherit"
          size="small"
          onClick={handleSignIn}
          startIcon={<Login />}
        >
          {action}
        </Button>
      }
      sx={{ mb: 2 }}
    >
      <AlertTitle>Sign In Required</AlertTitle>
      {message}
    </Alert>
  )
}


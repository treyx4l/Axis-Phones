import React from 'react'
import { Alert, AlertTitle, Button } from '@mui/material'
import { Login } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

interface AuthPromptProps {
  message?: string
  action?: string
}

export const AuthPrompt: React.FC<AuthPromptProps> = ({
  message = 'Please sign in to continue',
  action = 'Sign In',
}) => {
  const { signInWithGoogle } = useAuth()

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error: any) {
      console.error('Sign in failed:', error)
      // Only show alert if it's not a popup-closed error
      if (error.code !== 'auth/popup-closed-by-user' && error.message) {
        alert(`Sign in failed: ${error.message}`)
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


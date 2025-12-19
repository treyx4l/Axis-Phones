import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Container, Alert, Typography, Button } from '@mui/material'
import { Login } from '@mui/icons-material'
import { SignInDialog } from './SignInDialog'

interface ProtectedCheckoutRouteProps {
  children: React.ReactNode
}

export const ProtectedCheckoutRoute: React.FC<ProtectedCheckoutRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const [signInOpen, setSignInOpen] = React.useState(false)

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    )
  }

  if (!user) {
    return (
      <>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setSignInOpen(true)}
                startIcon={<Login />}
              >
                Sign In / Sign Up
              </Button>
            }
          >
            <Typography variant="h6" gutterBottom>
              Authentication Required
            </Typography>
            <Typography>
              Please sign in or create an account to proceed to checkout. This ensures secure payment processing and order tracking.
            </Typography>
          </Alert>
        </Container>
        <SignInDialog open={signInOpen} onClose={() => setSignInOpen(false)} />
      </>
    )
  }

  return <>{children}</>
}


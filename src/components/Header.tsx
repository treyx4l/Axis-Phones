import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Divider,
} from '@mui/material'
import {
  ShoppingCart,
  LightMode,
  DarkMode,
  Settings,
  Logout,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useThemeMode } from '../theme/ThemeProvider'
import { SearchBar } from './SearchBar'
import { SignInDialog } from './SignInDialog'

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const { getTotalItems } = useCart()
  const { user, userProfile, logout } = useAuth()
  const { mode, toggleTheme } = useThemeMode()
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [signInDialogOpen, setSignInDialogOpen] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogin = () => {
    setSignInDialogOpen(true)
  }

  const handleLogout = async () => {
    try {
      await logout()
      handleMenuClose()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AppBar position="sticky" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 0, mr: 3, cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => navigate('/')}
        >
          AxisPhones
        </Typography>

        <SearchBar />

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          color="inherit"
          onClick={toggleTheme}
          sx={{ mr: 1 }}
          title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {mode === 'light' ? <DarkMode /> : <LightMode />}
        </IconButton>

        {user ? (
          <>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ mr: 1 }}
              title="Account Menu"
            >
              <Avatar
                src={userProfile?.photoURL || undefined}
                sx={{ width: 32, height: 32 }}
              >
                {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">
                  {userProfile?.displayName || userProfile?.email}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                <Settings sx={{ mr: 1 }} /> Settings
              </MenuItem>
              <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
                <Typography sx={{ mr: 1 }}>📦</Typography> Orders
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button
              color="inherit"
              onClick={handleLogin}
              sx={{ 
                mr: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleLogin}
              sx={{ 
                mr: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            >
              Sign Up
            </Button>
          </>
        )}

        <IconButton 
          color="inherit" 
          onClick={() => navigate('/cart')}
          sx={{
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
            },
          }}
        >
          <Badge badgeContent={getTotalItems()} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Toolbar>
      <SignInDialog open={signInDialogOpen} onClose={() => setSignInDialogOpen(false)} />
    </AppBar>
  )
}


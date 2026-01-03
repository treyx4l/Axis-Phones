import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { ProductsProvider } from './context/ProductsContext'
import { OrdersProvider } from './context/OrdersContext'
import { NotificationProvider } from './context/NotificationContext'
import { Header } from './components/Header'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ProtectedCheckoutRoute } from './components/ProtectedCheckoutRoute'
import { Home } from './pages/Home'
import { Category } from './pages/Category'
import { ProductDetail } from './pages/ProductDetail'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderConfirmation } from './pages/OrderConfirmation'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'
import { Settings } from './pages/Settings'
import { Orders } from './pages/Orders'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { TermsOfService } from './pages/TermsOfService'
import { AboutModal } from './components/AboutModal'
import { Box, Container, Typography, Button } from '@mui/material'

function AppContent() {
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category" element={<Category />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <ProtectedCheckoutRoute>
                  <Checkout />
                </ProtectedCheckoutRoute>
              }
            />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        <Box
          component="footer"
          sx={{
            py: 3,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                © 2025 AxisPhones. All rights reserved.
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Contact:{' '}
                  <a
                    href="mailto:axis.phones.gh@gmail.com"
                    style={{ color: 'text.secondary', textDecoration: 'none' }}
                  >
                    axis.phones.gh@gmail.com
                  </a>
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setAboutOpen(true)}
                  sx={{ color: 'text.secondary' }}
                >
                  About
                </Button>
                <Button
                  variant="text"
                  size="small"
                  component={RouterLink}
                  to="/privacy-policy"
                  sx={{ color: 'text.secondary', textDecoration: 'none' }}
                >
                  Privacy Policy
                </Button>
                <Button
                  variant="text"
                  size="small"
                  component={RouterLink}
                  to="/terms-of-service"
                  sx={{ color: 'text.secondary', textDecoration: 'none' }}
                >
                  Terms of Service
                </Button>
              </Box>
            </Box>
          </Container>
          <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
        </Box>
      </Box>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <ProductsProvider>
              <OrdersProvider>
                <CartProvider>
                  <AppContent />
                </CartProvider>
              </OrdersProvider>
            </ProductsProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App

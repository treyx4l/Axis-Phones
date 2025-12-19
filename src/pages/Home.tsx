import React, { useState } from 'react'
import { Container, Typography, Box, Pagination, Fade, Grow } from '@mui/material'
import { ProductGrid } from '../components/ProductGrid'
import { useProducts } from '../context/ProductsContext'

const PRODUCTS_PER_PAGE = 12

export const Home: React.FC = () => {
  const { products } = useProducts()
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const paginatedProducts = products.slice(startIndex, endIndex)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            Welcome to AxisPhones
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              mt: 2,
              animation: 'fadeIn 0.8s ease-in',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(-10px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            Discover the latest iPhone models with premium quality and unbeatable prices
          </Typography>
        </Box>
      </Fade>

      <Grow in timeout={800}>
        <Box>
          <ProductGrid products={paginatedProducts} />
          
          {totalPages > 1 && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 6,
                mb: 4,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Grow>
    </Container>
  )
}

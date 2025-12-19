import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Grow,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Product } from '../types'
import { formatCurrency } from '../utils/currency'
import { ColorSwatch } from './ColorSwatch'

interface ProductCardProps {
  product: Product
  index?: number
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const minPrice = Math.min(...product.storageOptions.map((s) => s.price))
  const maxPrice = Math.max(...product.storageOptions.map((s) => s.price))
  const priceRange = minPrice === maxPrice 
    ? formatCurrency(minPrice) 
    : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
  
  // Truncate description: 60 chars on mobile, 100 chars on larger screens
  const maxDescriptionLength = isMobile ? 60 : 100
  const truncatedDescription = product.description 
    ? (product.description.length > maxDescriptionLength
        ? product.description.substring(0, maxDescriptionLength) + '...'
        : product.description)
    : ''

  return (
    <Grow in timeout={300 + (index * 50)}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
          },
          // Smaller padding on mobile
          '& .MuiCardContent-root': {
            p: { xs: 1.5, sm: 2 },
          },
        }}
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <Box
          sx={{
            position: 'relative',
            paddingTop: { xs: '60%', sm: '70%', md: '75%' }, // Smaller on mobile
            overflow: 'hidden',
            backgroundColor: 'grey.100',
          }}
        >
          <CardMedia
            component="img"
            image={product.images[0] || '/placeholder-phone.jpg'}
            alt={product.model}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              p: { xs: 1, sm: 1.5, md: 2 }, // Smaller padding on mobile
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
          {product.stock === 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'error.main',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              Out of Stock
            </Box>
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom 
            noWrap 
            fontWeight={600}
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem' }, // Smaller on mobile
            }}
          >
            {product.model}
          </Typography>
          <Box
            component="div"
            sx={{ 
              mb: { xs: 1, sm: 2 }, 
              minHeight: { xs: 30, sm: 40 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              color: 'text.secondary',
              '& p': { margin: 0, marginBottom: 0.5 },
              '& br': { display: 'block', content: '""', marginTop: '0.5em' },
              '& strong': { fontWeight: 600 },
              '& em': { fontStyle: 'italic' },
              '& ul, & ol': { paddingLeft: 2, margin: 0.5 },
              '& li': { marginBottom: 0.25 },
              '& h1, & h2, & h3, & h4, & h5, & h6': { 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                marginTop: 0.5, 
                marginBottom: 0.25 
              },
            }}
            dangerouslySetInnerHTML={{ 
              __html: truncatedDescription
            }}
          />
          <Box sx={{ mb: { xs: 1, sm: 2 }, display: 'flex', gap: { xs: 0.5, sm: 1 }, flexWrap: 'wrap', alignItems: 'center' }}>
            {product.colorVariants.slice(0, 4).map((color) => (
              <Box
                key={color.name}
                sx={{
                  width: { xs: 20, sm: 36, md: 40 },
                  height: { xs: 20, sm: 36, md: 40 },
                  flexShrink: 0,
                }}
              >
                <ColorSwatch color={color} size="100%" />
              </Box>
            ))}
            {product.colorVariants.length > 4 && (
              <Chip 
                label={`+${product.colorVariants.length - 4}`} 
                size="small" 
                variant="outlined"
              />
            )}
          </Box>
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              color="primary" 
              fontWeight="bold"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1.25rem' }, // Smaller on mobile
              }}
            >
              {priceRange}
            </Typography>
            {product.releaseYear && (
              <Chip 
                label={product.releaseYear} 
                size="small" 
                variant="outlined"
                sx={{ 
                  fontSize: '0.7rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  )
}

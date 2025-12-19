import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/currency'
import { ColorSwatch } from '../components/ColorSwatch'
import { QuantityInput } from '../components/QuantityInput'
import { Product } from '../types'

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { products } = useProducts()

  const product = products.find((p) => p.id === id)

  const [selectedColor, setSelectedColor] = useState(
    product?.colorVariants[0] || { name: '', hex: '', imageUrl: '' }
  )

  // Update selected color when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colorVariants[0] || { name: '', hex: '', imageUrl: '' })
    }
  }, [product])
  const [selectedStorage, setSelectedStorage] = useState(
    product?.storageOptions[0] || { capacity: '', price: 0 }
  )
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    )
  }

  const currentPrice = selectedStorage.price
  const isInStock = product.stock > 0

  // Get image for selected color, fallback to product images
  const getImageUrl = () => {
    if (selectedColor.imageUrl) {
      return selectedColor.imageUrl
    }
    return product.images[0] || '/placeholder-phone.jpg'
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      model: product.model,
      color: selectedColor,
      storage: selectedStorage,
      quantity,
      price: currentPrice,
      image: getImageUrl(),
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1">
          Product Details
        </Typography>
        <IconButton
          onClick={() => navigate(-1)}
          color="inherit"
          sx={{ border: 1, borderColor: 'divider' }}
          aria-label="go back"
        >
          <Close />
        </IconButton>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              component="img"
              src={getImageUrl()}
              alt={`${product.model} - ${selectedColor.name}`}
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                maxHeight: 600,
                transition: 'opacity 0.3s',
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.model}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            {formatCurrency(currentPrice)}
          </Typography>
          <Box 
            sx={{ 
              mb: 3,
              '& p': { marginBottom: 1 },
              '& ul, & ol': { paddingLeft: 2 },
              '& li': { marginBottom: 0.5 },
              '& strong': { fontWeight: 600 },
              '& em': { fontStyle: 'italic' },
              '& h1, & h2, & h3, & h4, & h5, & h6': { marginTop: 2, marginBottom: 1 },
            }}
            dangerouslySetInnerHTML={{ __html: product.description || '' }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Color: {selectedColor.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {product.colorVariants.map((color) => (
                <ColorSwatch
                  key={color.name}
                  color={color}
                  selected={selectedColor.name === color.name}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Storage</InputLabel>
              <Select
                value={selectedStorage.capacity}
                label="Storage"
                onChange={(e) => {
                  const storage = product.storageOptions.find(
                    (s) => s.capacity === e.target.value
                  )
                  if (storage) setSelectedStorage(storage)
                }}
              >
                {product.storageOptions.map((storage) => (
                  <MenuItem key={storage.capacity} value={storage.capacity}>
                    {storage.capacity} - {formatCurrency(storage.price)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Quantity
            </Typography>
            <QuantityInput
              value={quantity}
              onChange={setQuantity}
              max={product.stock}
              disabled={!isInStock}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {product.stock} in stock
            </Typography>
          </Box>

          {addedToCart && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Added to cart!
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleAddToCart}
              disabled={!isInStock}
              sx={{ flexGrow: 1 }}
            >
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/cart')}
            >
              View Cart
            </Button>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Specifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SKU: {product.sku}
            </Typography>
            {product.releaseYear && (
              <Typography variant="body2" color="text.secondary">
                Release Year: {product.releaseYear}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}


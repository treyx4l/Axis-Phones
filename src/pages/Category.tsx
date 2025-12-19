import React, { useState, useMemo } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Pagination,
  Fade,
} from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { ProductGrid } from '../components/ProductGrid'
import { useProducts } from '../context/ProductsContext'
import { Product } from '../types'

const PRODUCTS_PER_PAGE = 12

export const Category: React.FC = () => {
  const { products, loading } = useProducts()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const [filters, setFilters] = useState({
    model: '',
    color: '',
    sortBy: 'newest',
    minPrice: '',
    maxPrice: '',
  })
  const [page, setPage] = useState(1)

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return []
    }

    let filtered: Product[] = [...products]

    // Search filter - search in model, description, and SKU
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((p) => {
        const modelMatch = p.model.toLowerCase().includes(query)
        const descriptionMatch = p.description 
          ? p.description.toLowerCase().replace(/<[^>]*>/g, '').includes(query) // Strip HTML tags for search
          : false
        const skuMatch = p.sku.toLowerCase().includes(query)
        const colorMatch = p.colorVariants.some((c) => c.name.toLowerCase().includes(query))
        
        return modelMatch || descriptionMatch || skuMatch || colorMatch
      })
    }

    // Model filter
    if (filters.model) {
      filtered = filtered.filter((p) => p.model === filters.model)
    }

    // Color filter
    if (filters.color) {
      filtered = filtered.filter((p) =>
        p.colorVariants.some((c) => c.name === filters.color)
      )
    }

    // Price filter
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice)
      filtered = filtered.filter((p) =>
        p.storageOptions.some((s) => s.price >= min)
      )
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice)
      filtered = filtered.filter((p) =>
        p.storageOptions.some((s) => s.price <= max)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return Math.min(...a.storageOptions.map((s) => s.price)) -
            Math.min(...b.storageOptions.map((s) => s.price))
        case 'price-high':
          return Math.max(...b.storageOptions.map((s) => s.price)) -
            Math.max(...a.storageOptions.map((s) => s.price))
        case 'newest':
          return (b.releaseYear || 0) - (a.releaseYear || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, filters, products])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (page - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1)
  }, [searchQuery, filters])

  const uniqueModels = products.length > 0 
    ? Array.from(new Set(products.map((p) => p.model))).sort()
    : []
  const uniqueColors = products.length > 0
    ? Array.from(
        new Set(products.flatMap((p) => p.colorVariants?.map((c) => c.name) || []))
      ).sort()
    : []

  // Show loading state if products are still loading
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All iPhones'}
        </Typography>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            Loading products...
          </Typography>
        </Box>
      </Container>
    )
  }

  // Show message if no products are available
  if (!products || products.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All iPhones'}
        </Typography>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please check back later or contact support if you believe this is an error.
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {searchQuery ? `Search Results for "${searchQuery}"` : 'All iPhones'}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Model</InputLabel>
            <Select
              value={filters.model}
              label="Model"
              onChange={(e) => setFilters({ ...filters, model: e.target.value })}
            >
              <MenuItem value="">All Models</MenuItem>
              {uniqueModels.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Color</InputLabel>
            <Select
              value={filters.color}
              label="Color"
              onChange={(e) => setFilters({ ...filters, color: e.target.value })}
            >
              <MenuItem value="">All Colors</MenuItem>
              {uniqueColors.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            label="Min Price"
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            label="Max Price"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {Object.values(filters).some((f) => f) && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filters.model && (
            <Chip
              label={`Model: ${filters.model}`}
              onDelete={() => setFilters({ ...filters, model: '' })}
            />
          )}
          {filters.color && (
            <Chip
              label={`Color: ${filters.color}`}
              onDelete={() => setFilters({ ...filters, color: '' })}
            />
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <Chip
              label={`Price: ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}`}
              onDelete={() => setFilters({ ...filters, minPrice: '', maxPrice: '' })}
            />
          )}
        </Box>
      )}

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </Typography>

      {filteredProducts.length > 0 ? (
        <>
          <Fade in timeout={600}>
            <ProductGrid products={paginatedProducts} />
          </Fade>
          
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
        </>
      ) : (
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No products found matching your criteria
            </Typography>
          </Box>
        </Fade>
      )}
    </Container>
  )
}


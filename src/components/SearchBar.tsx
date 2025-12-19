import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  InputBase,
  Paper,
  Popper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Fade,
  ClickAwayListener,
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { Product } from '../types'
import { formatCurrency } from '../utils/currency'

export const SearchBar: React.FC = () => {
  const navigate = useNavigate()
  const { products } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  // Debounced search function
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setOpen(false)
      return
    }

    const searchTerm = query.toLowerCase().trim()
    const filtered = products
      .filter((p) => {
        const modelMatch = p.model.toLowerCase().includes(searchTerm)
        const descriptionMatch = p.description?.toLowerCase().includes(searchTerm)
        const skuMatch = p.sku.toLowerCase().includes(searchTerm)
        const colorMatch = p.colorVariants.some((c) => 
          c.name.toLowerCase().includes(searchTerm)
        )
        
        return modelMatch || descriptionMatch || skuMatch || colorMatch
      })
      .slice(0, 6) // Show up to 6 products
    
    setSearchResults(filtered)
    setOpen(filtered.length > 0 && searchTerm.length > 0)
  }, [products])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery)
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const searchTerm = searchQuery.trim()
    if (searchTerm) {
      navigate(`/category?search=${encodeURIComponent(searchTerm)}`)
      setSearchQuery('')
      setOpen(false)
    }
  }

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
    setSearchQuery('')
    setOpen(false)
  }

  const handleClickAway = () => {
    setOpen(false)
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        ref={anchorRef}
        component="form"
        onSubmit={handleSearch}
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 1,
          px: 1,
          mr: 2,
          maxWidth: 500,
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:focus-within': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Search sx={{ mr: 1, color: 'inherit' }} />
        <InputBase
          placeholder="Search iPhone models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchResults.length > 0) setOpen(true)
          }}
          sx={{ 
            color: 'inherit', 
            flexGrow: 1,
            '& input': {
              transition: 'all 0.3s ease',
            },
          }}
        />
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          transition
          sx={{ 
            zIndex: 1300, 
            width: anchorRef.current ? Math.max(anchorRef.current.offsetWidth, 600) : 600,
          }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper 
                sx={{ 
                  mt: 1, 
                  p: 2, 
                  maxHeight: 500, 
                  overflow: 'auto',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
                  Search Results ({searchResults.length})
                </Typography>
                <Grid container spacing={2}>
                  {searchResults.map((product, index) => {
                    const minPrice = Math.min(...product.storageOptions.map((s) => s.price))
                    return (
                      <Grid item xs={12} sm={6} key={product.id}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': { 
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            },
                          }}
                          onClick={() => handleProductClick(product.id)}
                        >
                          <CardMedia
                            component="img"
                            height="120"
                            image={product.images[0] || '/placeholder-phone.jpg'}
                            alt={product.model}
                            sx={{ 
                              objectFit: 'contain', 
                              p: 1,
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              },
                            }}
                          />
                          <CardContent>
                            <Typography variant="subtitle1" noWrap fontWeight={500}>
                              {product.model}
                            </Typography>
                            <Typography variant="body2" color="primary" fontWeight="bold">
                              {formatCurrency(minPrice)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  })}
                </Grid>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}

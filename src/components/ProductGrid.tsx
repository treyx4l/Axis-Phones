import React from 'react'
import { Grid, Fade } from '@mui/material'
import { Product } from '../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <Fade in timeout={600}>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {products.map((product, index) => (
          <Grid item xs={4} sm={3} md={3} lg={3} key={product.id}>
            <ProductCard product={product} index={index} />
          </Grid>
        ))}
      </Grid>
    </Fade>
  )
}

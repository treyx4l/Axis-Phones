import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material'
import { Add, Edit, Delete, Logout, Inventory, ShoppingCart } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useProducts } from '../context/ProductsContext'
import { useOrders } from '../context/OrdersContext'
import { Product, ColorVariant, StorageOption, Order } from '../types'
import { formatCurrency } from '../utils/currency'
import { products as initialProducts } from '../data/products'
import { db } from '../FirebaseConfig'

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAdminAuth()
  const { products, addProduct, updateProduct, deleteProduct, reloadProducts, loading: productsLoading } = useProducts()
  const { getAllOrders, updateOrderStatus } = useOrders()
  const [tabValue, setTabValue] = useState(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({
    model: '',
    sku: '',
    description: '',
    basePrice: 0,
    stock: 0,
    releaseYear: new Date().getFullYear(),
    images: [''],
    storageOptions: [{ capacity: '128GB', price: 0 }],
    colorVariants: [{ name: '', hex: '#000000' }],
  })

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData(product)
    } else {
      setEditingProduct(null)
      setFormData({
        model: '',
        sku: '',
        description: '',
        basePrice: 0,
        stock: 0,
        releaseYear: new Date().getFullYear(),
        images: [''],
        storageOptions: [{ capacity: '128GB', price: 0 }],
        colorVariants: [{ name: '', hex: '#000000' }],
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingProduct(null)
  }

  const handleSave = async () => {
    if (!formData.model || !formData.sku) {
      alert('Please fill in required fields')
      return
    }

    // Validate storage options
    if (!formData.storageOptions || formData.storageOptions.length === 0) {
      alert('Please add at least one storage option')
      return
    }

    // Validate color variants
    if (!formData.colorVariants || formData.colorVariants.length === 0) {
      alert('Please add at least one color variant')
      return
    }

    // Filter out empty storage options
    const validStorageOptions = formData.storageOptions.filter(
      (so) => so.capacity && so.capacity.trim() !== ''
    )

    // Filter out empty color variants
    const validColorVariants = formData.colorVariants.filter(
      (cv) => cv.name && cv.name.trim() !== ''
    )

    if (validStorageOptions.length === 0) {
      alert('Please add at least one valid storage option')
      return
    }

    if (validColorVariants.length === 0) {
      alert('Please add at least one valid color variant')
      return
    }

    const productData: Product = {
      id: editingProduct?.id || `iphone-${formData.model.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      model: formData.model!,
      sku: formData.sku!,
      description: formData.description || '',
      basePrice: formData.basePrice || 0,
      stock: formData.stock || 0,
      releaseYear: formData.releaseYear || new Date().getFullYear(),
      images: formData.images?.filter(img => img && img.trim() !== '') || [''],
      storageOptions: validStorageOptions,
      colorVariants: validColorVariants,
    }

    try {
      // Check if Firestore is initialized
      if (!db) {
        throw new Error('Firestore database is not initialized. Please check your Firebase configuration.')
      }

      if (editingProduct) {
        await updateProduct(productData.id, productData)
        alert('Product updated successfully!')
        // Reload products to ensure UI is in sync
        await reloadProducts()
      } else {
        console.log('Adding product:', productData)
        await addProduct(productData)
        console.log('Product added successfully to Firestore')
        // Reload products to ensure UI is in sync
        await reloadProducts()
        alert('Product added successfully!')
      }
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving product:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error details:', {
        message: errorMessage,
        error,
        productData,
        dbInitialized: !!db,
      })
      alert(`Failed to save product: ${errorMessage}\n\nPlease check:\n1. Your internet connection\n2. Firebase configuration\n3. Firestore database is enabled\n4. Browser console for more details`)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id)
      } catch (error) {
        alert('Failed to delete product. Please try again.')
      }
    }
  }

  const addStorageOption = () => {
    setFormData({
      ...formData,
      storageOptions: [...(formData.storageOptions || []), { capacity: '', price: 0 }],
    })
  }

  const updateStorageOption = (index: number, field: keyof StorageOption, value: string | number) => {
    const updated = [...(formData.storageOptions || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, storageOptions: updated })
  }

  const removeStorageOption = (index: number) => {
    setFormData({
      ...formData,
      storageOptions: formData.storageOptions?.filter((_, i) => i !== index) || [],
    })
  }

  const addColorVariant = () => {
    setFormData({
      ...formData,
      colorVariants: [...(formData.colorVariants || []), { name: '', hex: '#000000' }],
    })
  }

  const updateColorVariant = (index: number, field: keyof ColorVariant, value: string) => {
    const updated = [...(formData.colorVariants || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, colorVariants: updated })
  }

  const removeColorVariant = (index: number) => {
    setFormData({
      ...formData,
      colorVariants: formData.colorVariants?.filter((_, i) => i !== index) || [],
    })
  }

  // Load orders when Orders tab is selected
  useEffect(() => {
    if (tabValue === 1) {
      loadOrders()
    }
  }, [tabValue])

  const loadOrders = async () => {
    setOrdersLoading(true)
    try {
      const allOrders = await getAllOrders()
      setOrders(allOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      await loadOrders() // Reload orders
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'processing':
        return 'info'
      case 'shipped':
        return 'primary'
      case 'delivered':
        return 'success'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          Logout
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab icon={<Inventory />} iconPosition="start" label="Products" />
          <Tab icon={<ShoppingCart />} iconPosition="start" label="Orders" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <>
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add New Product
            </Button>
          </Box>

          {productsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Colors</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.model}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>${product.basePrice}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {product.colorVariants.slice(0, 3).map((color) => (
                      <Chip
                        key={color.name}
                        label={color.name}
                        size="small"
                        sx={{ backgroundColor: color.hex, color: '#fff' }}
                      />
                    ))}
                    {product.colorVariants.length > 3 && (
                      <Chip label={`+${product.colorVariants.length - 3}`} size="small" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(product)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(product.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
          )}
        </>
      )}

      {tabValue === 1 && (
        <>
          {ordersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                          No orders found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.reference}</TableCell>
                        <TableCell>{order.buyerDetails.fullName}</TableCell>
                        <TableCell>{order.buyerDetails.email}</TableCell>
                        <TableCell>
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </TableCell>
                        <TableCell>{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status || 'pending'}
                            color={getStatusColor(order.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={order.status || 'pending'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="processing">Processing</MenuItem>
                              <MenuItem value="shipped">Shipped</MenuItem>
                              <MenuItem value="delivered">Delivered</MenuItem>
                              <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Base Price"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Release Year"
                type="number"
                value={formData.releaseYear}
                onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) || new Date().getFullYear() })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Storage Options
              </Typography>
              {formData.storageOptions?.map((storage, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    label="Capacity"
                    value={storage.capacity}
                    onChange={(e) => updateStorageOption(index, 'capacity', e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="Price"
                    type="number"
                    value={storage.price}
                    onChange={(e) => updateStorageOption(index, 'price', parseFloat(e.target.value) || 0)}
                    size="small"
                  />
                  <IconButton onClick={() => removeStorageOption(index)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button size="small" onClick={addStorageOption}>
                Add Storage Option
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Color Variants
              </Typography>
              {formData.colorVariants?.map((color, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    label="Color Name"
                    value={color.name}
                    onChange={(e) => updateColorVariant(index, 'name', e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="Hex Code"
                    value={color.hex}
                    onChange={(e) => updateColorVariant(index, 'hex', e.target.value)}
                    size="small"
                    type="color"
                    sx={{ width: 100 }}
                  />
                  <TextField
                    label="Image URL (optional)"
                    value={color.imageUrl || ''}
                    onChange={(e) => {
                      const updated = [...(formData.colorVariants || [])]
                      updated[index] = { ...updated[index], imageUrl: e.target.value }
                      setFormData({ ...formData, colorVariants: updated })
                    }}
                    size="small"
                    sx={{ flexGrow: 1, minWidth: 200 }}
                    placeholder="https://example.com/iphone-black.jpg"
                  />
                  <IconButton onClick={() => removeColorVariant(index)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Button size="small" onClick={addColorVariant}>
                Add Color Variant
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.images?.[0] || ''}
                onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingProduct ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}


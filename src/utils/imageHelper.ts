/**
 * Generate image URL for iPhone model and color
 * In production, this would map to actual product images
 */
export const getProductImageUrl = (model: string, colorName: string): string => {
  // Base URL for placeholder images - replace with your actual image hosting
  const baseUrl = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
  
  // You can customize this to return different images based on model/color
  // For now, return a consistent placeholder
  // In production, you'd have actual image URLs like:
  // return `https://your-cdn.com/iphones/${model.toLowerCase().replace(/\s+/g, '-')}/${colorName.toLowerCase()}.jpg`
  
  return baseUrl
}


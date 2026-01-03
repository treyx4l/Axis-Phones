/**
 * Notification Service with Rate Limiting
 * 
 * Handles sending notifications (WhatsApp, email, SMS) with rate limiting
 * to prevent excessive API calls and abuse
 */

import { checkRateLimit, RATE_LIMIT_CONFIGS } from './rateLimiter'
import { Order } from '../types'
import { formatCurrency } from './currency'

const WHATSAPP_NUMBER = '+23354819278'

/**
 * Format order details into a notification message
 */
const formatOrderMessage = (order: Order): string => {
  const itemsList = order.items
    .map((item, index) => {
      return `${index + 1}. ${item.quantity}x ${item.model}\n   - Color: ${item.color.name}\n   - Storage: ${item.storage.capacity}\n   - Price: ${formatCurrency(item.price * item.quantity)}`
    })
    .join('\n\n')

  const message = `🛍️ *New Order Received*\n\n` +
    `*Order Reference:* ${order.reference}\n` +
    `*Date:* ${new Date(order.createdAt).toLocaleString()}\n\n` +
    `*Customer Details:*\n` +
    `Name: ${order.buyerDetails.fullName}\n` +
    `Email: ${order.buyerDetails.email}\n` +
    `Phone: ${order.buyerDetails.phone}\n\n` +
    `*Shipping Address:*\n` +
    `${order.buyerDetails.address.street}\n` +
    `${order.buyerDetails.address.city}, ${order.buyerDetails.address.region}\n\n` +
    `*Order Items:*\n${itemsList}\n\n` +
    `*Order Summary:*\n` +
    `Subtotal: ${formatCurrency(order.subtotal)}\n` +
    `Tax: ${formatCurrency(order.tax)}\n` +
    `Shipping: ${formatCurrency(order.shipping)}\n` +
    `*Total: ${formatCurrency(order.total)}*\n\n` +
    `*Payment Status:* ✅ Paid\n` +
    `*Order Status:* ${order.status || 'processing'}`

  return message
}

/**
 * Send WhatsApp notification with rate limiting
 */
export const sendWhatsAppNotification = async (order: Order): Promise<{
  success: boolean
  message: string
  rateLimited?: boolean
  resetTime?: number
}> => {
  // Check rate limit using order reference as identifier
  const rateLimitKey = `whatsapp:${order.reference}`
  const rateLimitCheck = checkRateLimit({
    ...RATE_LIMIT_CONFIGS.NOTIFICATION,
    identifier: rateLimitKey,
  })

  if (!rateLimitCheck.allowed) {
    const resetDate = new Date(rateLimitCheck.resetTime)
    return {
      success: false,
      message: `Rate limit exceeded. Please try again after ${resetDate.toLocaleTimeString()}`,
      rateLimited: true,
    }
  }

  try {
    const message = formatOrderMessage(order)
    
    // Try to send via backend API first (for automatic sending)
    const apiEndpoint = import.meta.env.VITE_WHATSAPP_API_ENDPOINT || '/api/whatsapp/send'
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: WHATSAPP_NUMBER,
          message: message,
          orderReference: order.reference,
        }),
      })
      
      if (response.ok) {
        return {
          success: true,
          message: 'WhatsApp notification sent successfully',
        }
      } else {
        // Backend API failed, fall back to Web link method
        throw new Error('Backend API returned error')
      }
    } catch (apiError) {
      // Backend API not available, use Web link method
      // This opens WhatsApp with a pre-filled message
      const encodedMessage = encodeURIComponent(message)
      const phoneNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, '')
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
      
      // Open WhatsApp Web with pre-filled message
      window.open(whatsappUrl, '_blank')
      
      return {
        success: true,
        message: 'WhatsApp notification link created',
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send notification',
    }
  }
}

/**
 * Send notification for paid orders
 * This is the main entry point for order notifications
 */
export const sendOrderNotification = async (order: Order): Promise<void> => {
  // Only send notifications for paid orders
  if (order.paymentStatus !== 'paid') {
    return
  }

  try {
    const result = await sendWhatsAppNotification(order)
    
    if (!result.success && result.rateLimited) {
      // Rate limited - don't throw error, just skip notification
      // This prevents blocking the order flow
      return
    }
    
    if (!result.success) {
      // Other error - log but don't throw to avoid blocking order
      return
    }
  } catch (error) {
    // Silent failure - don't block order completion if notification fails
    return
  }
}


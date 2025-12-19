/**
 * Paystack Payment Integration
 * 
 * This utility handles Paystack payment initialization using Paystack's inline payment
 * For production, you'll need to set up a backend endpoint to securely handle the payment initialization
 */

export interface PaystackConfig {
    key: string
    email: string
    amount: number // in pesewas for GHS (smallest currency unit)
    reference: string
    currency?: string // Currency code (default: 'GHS')
    metadata?: Record<string, any>
    callback?: (response: any) => void
    onClose?: () => void
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: PaystackConfig) => {
                openIframe: () => void
            }
        }
    }
}

/**
 * Initialize Paystack payment
 * This uses Paystack's inline payment popup
 */
export const initializePaystack = (config: PaystackConfig): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Check if Paystack script is loaded
        if (!window.PaystackPop) {
            // Load Paystack script dynamically
            const script = document.createElement('script')
            script.src = 'https://js.paystack.co/v1/inline.js'
            script.async = true
            script.onload = () => {
                openPaystackPopup(config, resolve, reject)
            }
            script.onerror = () => {
                reject(new Error('Failed to load Paystack script'))
            }
            document.head.appendChild(script)
        } else {
            openPaystackPopup(config, resolve, reject)
        }
    })
}

const openPaystackPopup = (
    config: PaystackConfig,
    resolve: (value: any) => void,
    reject: (reason: any) => void
) => {
    try {
        const handler = window.PaystackPop.setup({
            key: config.key,
            email: config.email,
            amount: config.amount,
            reference: config.reference,
            currency: config.currency || 'GHS', // Default to Ghana Cedis
            metadata: config.metadata || {},
            callback: (response: any) => {
                resolve(response)
                if (config.callback) {
                    config.callback(response)
                }
            },
            onClose: () => {
                reject(new Error('Payment window closed'))
                if (config.onClose) {
                    config.onClose()
                }
            },
        })

        handler.openIframe()
    } catch (error) {
        reject(error)
    }
}

/**
 * Generate a unique reference for Paystack
 */
export const generatePaystackReference = (): string => {
    return `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

/**
 * Convert amount to pesewas for GHS (smallest currency unit)
 * For GHS: 1 GHS = 100 pesewas
 */
export const convertToKobo = (amount: number): number => {
    return Math.round(amount * 100)
}


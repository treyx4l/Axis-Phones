# Paystack Payment Integration Setup

This guide will help you set up Paystack payment integration for your AxisPhones e-commerce store.

## Step 1: Create a Paystack Account

1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Sign up for a new account or log in to your existing account
3. Complete the account verification process (required for live mode)

## Step 2: Enable GHS Currency (Ghana Cedis)

1. In Paystack Dashboard, navigate to **Settings** > **Business**
2. Make sure **GHS (Ghana Cedis)** is enabled for your account
3. If GHS is not enabled, contact Paystack support to enable it for your account

**Important**: The application is configured to use GHS (Ghana Cedis) by default. Make sure your Paystack account supports GHS transactions.

## Step 3: Get Your API Keys

1. In Paystack Dashboard, navigate to **Settings** > **API Keys & Webhooks**
2. You'll see two keys:
   - **Public Key** (starts with `pk_test_` for test mode or `pk_live_` for live mode)
   - **Secret Key** (starts with `sk_test_` for test mode or `sk_live_` for live mode)

**Important**: 
- For development, use **Test Mode** keys (start with `pk_test_` and `sk_test_`)
- For production, use **Live Mode** keys (start with `pk_live_` and `sk_live_`)
- Only the **Public Key** is needed for the frontend integration

## Step 4: Add Public Key to Environment Variables

1. Create or edit the `.env` file in your `src` folder
2. Add your Paystack public key:

```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

**For Test Mode:**
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**For Live Mode (Production):**
```env
VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 5: Restart Development Server

After adding the environment variable:

1. **Stop** your dev server (Ctrl+C)
2. **Start** it again: `npm run dev`

Vite only loads environment variables when the server starts, so you MUST restart.

## Step 6: Test the Integration

### Using Test Cards

In test mode, you can use these test card numbers:

**Successful Payment:**
- Card Number: `4084084084084081`
- Expiry Date: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)
- PIN: Any 4 digits (e.g., `0000`)

**Declined Payment:**
- Card Number: `5060666666666666666`
- Expiry Date: Any future date
- CVV: Any 3 digits
- PIN: Any 4 digits

### Testing the Flow

1. Add products to your cart
2. Go to checkout page
3. Fill in your shipping details
4. Click "Proceed to Payment"
5. Paystack payment popup should open
6. Use a test card to complete the payment
7. On success, you should be redirected to the order confirmation page

## How It Works

1. **User initiates checkout**: User fills out checkout form and clicks "Proceed to Payment"
2. **Payment initialization**: The app calls Paystack's inline payment API
3. **Payment popup**: Paystack opens a secure payment popup
4. **User completes payment**: User enters card details in the Paystack popup
5. **Payment verification**: Paystack processes the payment
6. **Success callback**: On successful payment, the order is saved to Firebase and user is redirected
7. **Order confirmation**: User sees order confirmation page with order details

## Payment Flow Details

The integration uses Paystack's **Inline Payment** method, which:
- Opens a secure popup for payment
- Handles all payment processing securely
- Returns payment status via callbacks
- Supports all payment methods (cards, bank transfers, etc.)

## Security Notes

- **Public Key**: Safe to use in frontend code (already exposed in your app)
- **Secret Key**: NEVER expose in frontend code - only use on backend
- **Payment Verification**: For production, set up webhooks to verify payments on your backend
- **HTTPS Required**: Paystack requires HTTPS in production (works on localhost for development)

## Troubleshooting

### "Paystack public key is not configured"
- Check that `VITE_PAYSTACK_PUBLIC_KEY` is set in your `.env` file
- Make sure the variable name starts with `VITE_`
- Restart your dev server after adding the variable
- Verify the key is correct (starts with `pk_test_` or `pk_live_`)

### Payment popup doesn't open
- Check browser console for errors
- Verify Paystack script is loading (check Network tab)
- Make sure you're not blocking popups in your browser
- Check that your public key is valid

### Payment succeeds but order not saved
- Check browser console for errors
- Verify Firebase Realtime Database is configured
- Check that user is authenticated
- Verify database security rules allow order creation

### "Failed to load Paystack script"
- Check your internet connection
- Verify Paystack's CDN is accessible
- Check browser console for network errors
- Try refreshing the page

### "Currency not supported by merchant" or "We could not start this transaction - Currency not supported by merchant"
- **This error means your Paystack account doesn't have GHS (Ghana Cedis) enabled**
- The application is configured to use **GHS (Ghana Cedis)** by default
- To fix this:
  1. Go to Paystack Dashboard > **Settings** > **Business**
  2. Check if GHS (Ghana Cedis) is listed as an enabled currency
  3. If not, contact Paystack support to enable GHS for your account
  4. You may need to provide business documentation for Ghana-based operations
- **Alternative**: If you need to use a different currency temporarily, you can modify the currency in `src/utils/paystack.ts` (not recommended for production)

## Production Checklist

Before going live:

- [ ] Switch to Live Mode API keys
- [ ] Set up Paystack webhooks for payment verification
- [ ] Test with real payment methods (small amounts)
- [ ] Verify HTTPS is enabled on your domain
- [ ] Set up error monitoring for payment failures
- [ ] Configure email notifications in Paystack dashboard
- [ ] Test the complete payment flow end-to-end

## Webhook Setup (Recommended for Production)

For production, set up webhooks to verify payments on your backend:

1. In Paystack Dashboard, go to **Settings** > **API Keys & Webhooks**
2. Click **Add Webhook URL**
3. Enter your backend webhook endpoint (e.g., `https://yourdomain.com/api/paystack/webhook`)
4. Select events to listen for:
   - `charge.success` - Payment successful
   - `charge.failed` - Payment failed
   - `transfer.success` - Transfer successful

Your backend should verify the webhook signature and update order status accordingly.

## Support

- [Paystack Documentation](https://paystack.com/docs)
- [Paystack API Reference](https://paystack.com/docs/api)
- [Paystack Support](https://paystack.com/contact)


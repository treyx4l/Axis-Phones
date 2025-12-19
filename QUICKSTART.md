# Quick Start Guide

## First Time Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file** (optional for development)
   ```bash
   # Create .env file in the root directory
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
   VITE_PAYSTACK_REDIRECT_URL=http://localhost:5173/order-confirmation
   ```
   
   Note: The app works without these keys - it will use a mock payment system.

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173`

## Testing the App

1. **Browse products** - Click on any iPhone to see details
2. **Add to cart** - Select color and storage, then add to cart
3. **View cart** - Click the cart icon in the header
4. **Checkout** - Fill in buyer details and proceed to payment
5. **Order confirmation** - See your order confirmation page

## Running Tests

```bash
npm test
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Key Features to Test

- ✅ Theme toggle (light/dark mode) - persists to localStorage
- ✅ Product search and filtering
- ✅ Add to cart with color and storage selection
- ✅ Cart persistence (refresh page - cart remains)
- ✅ Checkout form validation
- ✅ Mock payment flow
- ✅ Order confirmation

## Troubleshooting

**Port already in use?**
- Vite will automatically try the next available port

**Tests failing?**
- Make sure all dependencies are installed: `npm install`
- Check Node.js version (requires 18+)

**Build errors?**
- Run `npm run lint` to check for code issues
- Run `npm run format` to auto-format code


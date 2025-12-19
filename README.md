# AxisPhones - iPhone E-commerce Store

A complete, production-quality iPhone e-commerce web application built with React (TypeScript), Vite, and Material-UI. Features a full product catalog, shopping cart, checkout flow, and Paystack payment integration.

## Features

- 🎨 **Dark & Light Themes** - Toggle between themes with persistent preference
- 📱 **Product Catalog** - Browse iPhone models from iPhone Xr to iPhone 17 Pro Max
- 🎨 **Color Variants** - View and filter by color options for each model
- 🛒 **Shopping Cart** - Add, remove, and update quantities with localStorage persistence
- 💳 **Checkout Flow** - Complete checkout with buyer details collection
- 💰 **Paystack Integration** - Mock payment processing with easy production swap
- 🔍 **Search & Filters** - Search by model, filter by color, price, and storage
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- ♿ **Accessible** - Semantic HTML and ARIA support
- 🧪 **Tested** - Unit and integration tests included

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: React Context API + useReducer
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier + Husky

## Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Git

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AxisPhones
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Paystack keys (optional for development - mock will be used if not provided):
   ```env
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
   VITE_PAYSTACK_REDIRECT_URL=http://localhost:5173/order-confirmation
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier

## Project Structure

```
AxisPhones/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ColorSwatch.tsx
│   │   ├── QuantityInput.tsx
│   │   ├── CartSummary.tsx
│   │   └── CheckoutForm.tsx
│   ├── pages/            # Page components
│   │   ├── Home.tsx
│   │   ├── Category.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   └── OrderConfirmation.tsx
│   ├── context/          # React Context providers
│   │   └── CartContext.tsx
│   ├── theme/            # Theme configuration
│   │   ├── theme.ts
│   │   └── ThemeProvider.tsx
│   ├── data/             # Product data
│   │   └── products.ts
│   ├── server/           # Mock API/serverless functions
│   │   └── mockPaystack.ts
│   ├── utils/            # Utility functions
│   │   ├── currency.ts
│   │   └── validators.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── test/             # Test setup
│   │   └── setup.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── tests/                # Test files
├── .env.example          # Environment variables template
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Paystack Integration

### Development (Mock)

The app uses a mock Paystack implementation by default. The mock function in `src/server/mockPaystack.ts` simulates payment initialization and returns a checkout URL that redirects to the order confirmation page.

### Production Setup

To use real Paystack payments, you need to:

1. **Set up a serverless function** (Netlify Functions, Vercel Functions, or your own backend)

2. **Create a payment initialization endpoint** that calls Paystack's API:

   ```typescript
   // Example: netlify/functions/create-payment.ts
   import { Handler } from '@netlify/functions'
   import axios from 'axios'

   export const handler: Handler = async (event) => {
     if (event.httpMethod !== 'POST') {
       return { statusCode: 405, body: 'Method Not Allowed' }
     }

     const { email, amount, metadata } = JSON.parse(event.body)
     const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

     try {
       const response = await axios.post(
         'https://api.paystack.co/transaction/initialize',
         {
           email,
           amount: amount * 100, // Convert to kobo (smallest currency unit)
           reference: `ORDER-${Date.now()}`,
           callback_url: process.env.PAYSTACK_REDIRECT_URL,
           metadata,
         },
         {
           headers: {
             Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
             'Content-Type': 'application/json',
           },
         }
       )

       return {
         statusCode: 200,
         body: JSON.stringify(response.data),
       }
     } catch (error) {
       return {
         statusCode: 500,
         body: JSON.stringify({ error: 'Payment initialization failed' }),
       }
     }
   }
   ```

3. **Update the frontend** to call your serverless function instead of the mock:

   ```typescript
   // In src/pages/Checkout.tsx
   const response = await fetch('/.netlify/functions/create-payment', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: buyerDetails.email,
       amount: total,
       metadata: { orderData },
     }),
   })
   const result = await response.json()
   ```

4. **Set environment variables** on your hosting platform:
   - `PAYSTACK_SECRET_KEY` - Your Paystack secret key (server-side only)
   - `VITE_PAYSTACK_PUBLIC_KEY` - Your Paystack public key (client-side)
   - `VITE_PAYSTACK_REDIRECT_URL` - Your redirect URL after payment

5. **Handle Paystack callback** - Set up a webhook endpoint to verify transactions and update order status

### Paystack API Documentation

- [Paystack API Docs](https://paystack.com/docs/api/)
- [Initialize Transaction](https://paystack.com/docs/api/transaction/#initialize)
- [Verify Transaction](https://paystack.com/docs/api/transaction/#verify)

## Testing

Run tests with:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

### Test Structure

- Unit tests for utilities (`src/utils/__tests__/`)
- Unit tests for context (`src/context/__tests__/`)
- Integration tests for pages (`src/pages/__tests__/`)

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory. You can preview it locally with:

```bash
npm run preview
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Push your code to GitHub
2. Create a new site in Netlify
3. Add build command: `npm run build`
4. Add publish directory: `dist`
5. Add environment variables
6. Deploy

### Other Platforms

The app can be deployed to any static hosting service that supports Node.js build processes:
- GitHub Pages (with GitHub Actions)
- AWS Amplify
- Firebase Hosting
- Cloudflare Pages

## Theme Customization

The app uses Material-UI theming with a custom primary color (`#5465ff`). To customize:

1. Edit `src/theme/theme.ts` to modify colors, typography, or component styles
2. The theme supports both light and dark modes
3. Theme preference is persisted to localStorage

## Product Data

Product data is stored in `src/data/products.ts`. To add or modify products:

1. Edit the `products` array
2. Each product must include:
   - `id`, `model`, `sku`, `description`
   - `images` (array of image URLs)
   - `basePrice`, `storageOptions`, `colorVariants`
   - `stock`, `releaseYear` (optional)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub or contact support@axisphones.com.

---

Built with ❤️ using React, TypeScript, and Material-UI


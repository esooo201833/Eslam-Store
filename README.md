# Shopify Store - E-Commerce MVP

A full-featured e-commerce MVP built with Angular, featuring product management, shopping cart, checkout, and payment integration with PayPal and Stripe.

## 🎯 Features

### Store Front
- **Landing Page**: Professional hero section with product showcase
- **Product Grid**: Responsive grid layout with product cards
- **Product Details**: Detailed product pages with images, descriptions, and pricing
- **Shopping Cart**: Add/remove items, quantity management, persistent cart (localStorage)
- **Search & Filter**: Real-time search and category/price filtering

### Admin Panel
- **Product Management**: Add, edit, and delete products
- **Order Tracking**: View order history and status
- **Analytics Dashboard**: Total products, orders, and revenue overview

### Payment Integration
- **PayPal Sandbox**: Integrated with test mode (merchant: eslammohamed201933@gmail.com)
- **Stripe Test Mode**: Credit card payment processing in test environment
- **Payment Flow**: Seamless checkout with success/error handling

### UI/UX
- **Modern Design**: Apple/Shopify-inspired clean aesthetic
- **Responsive**: Mobile-first, fully responsive design
- **Tailwind CSS**: Utility-first styling for rapid development
- **Toast Notifications**: User feedback for actions
- **Loading States**: Skeleton loaders and spinners

## 🏗️ Tech Stack

- **Frontend**: Angular 21.2.8
- **Styling**: TailwindCSS
- **State Management**: Angular Services with RxJS
- **Payments**: 
  - PayPal SDK (Sandbox Mode)
  - Stripe (Test Mode)
- **Data Persistence**: localStorage (Mock Data)
- **Build Tool**: Angular CLI

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Steps

1. **Navigate to project directory**
   ```bash
   cd shopify-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   
   Edit `src/environments/environment.ts` and add your API keys:
   ```typescript
   export const environment = {
     production: false,
     stripePublicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY',
     paypalClientId: 'YOUR_PAYPAL_SANDBOX_CLIENT_ID',
     paypalMerchantEmail: 'eslammohamed201933@gmail.com'
   };
   ```

## 💳 Payment Setup

### PayPal Sandbox Setup

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create a Sandbox account
3. Create a new app to get your Client ID
4. Update `paypalClientId` in `src/environments/environment.ts`
5. All transactions will be in test mode only

### Stripe Test Mode Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Ensure Test Mode is enabled
3. Get your publishable key (pk_test_...)
4. Update `stripePublicKey` in `src/environments/environment.ts`
5. No real card data is stored - all in test mode

## 🚀 Running the Application

### Development Server
```bash
ng serve
```
Navigate to `http://localhost:4200/`

### Production Build
```bash
ng build
```
Build artifacts will be in `dist/` directory

## 📂 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── shared/          # Shared components
│   │   └── ui/              # Reusable UI components
│   │       ├── button.component.ts
│   │       ├── card.component.ts
│   │       ├── input.component.ts
│   │       ├── modal.component.ts
│   │       └── toast.component.ts
│   ├── models/              # Data models
│   │   ├── product.model.ts
│   │   ├── cart.model.ts
│   │   └── order.model.ts
│   ├── pages/               # Page components
│   │   ├── home/
│   │   ├── product-details/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── success/
│   │   └── admin/
│   ├── services/            # Business logic
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   ├── payment.service.ts
│   │   └── toast.service.ts
│   ├── app.ts              # Root component
│   ├── app.routes.ts        # Routing configuration
│   └── app.config.ts       # App configuration
├── environments/            # Environment variables
│   ├── environment.ts
│   └── environment.prod.ts
└── styles.css              # Global styles
```

## 🔐 Security Notes

- **No Sensitive Data Storage**: Card information is never stored
- **Environment Variables**: API keys are in environment files (never commit real keys)
- **Test Mode Only**: All payments are in sandbox/test mode
- **localStorage**: Cart data stored locally (for demo purposes)

## 🧪 Testing

### Unit Tests
```bash
ng test
```

### E2E Tests
```bash
ng e2e
```

## 📝 Demo Products

The application comes pre-loaded with 8 demo products across Electronics and Accessories categories. These can be modified or deleted via the Admin Panel.

## 🎨 Customization

### Adding New Products
1. Navigate to `/admin`
2. Click "Add Product"
3. Fill in product details
4. Save

### Styling
- Global styles: `src/styles.css`
- Component styles: Individual component `.css` files
- Tailwind config: `tailwind.config.js`

## 🐛 Known Limitations

- No backend server (uses mock data)
- Cart data stored in localStorage (cleared on browser clear)
- Payment processing is simulated (no real transactions)
- No user authentication
- No order history persistence beyond localStorage

## 🔮 Future Enhancements

- Backend API integration
- User authentication system
- Real payment processing
- Order history database
- Product reviews
- Wishlist functionality
- Email notifications
- Advanced analytics

## 📄 License

This project is for demonstration purposes only.

## 👨‍💻 Developer Notes

Built as a Junior to Mid-level Angular developer portfolio project demonstrating:
- Clean architecture with separation of concerns
- Reusable component design
- Service-based state management
- Third-party payment integration
- Modern UI/UX practices
- Responsive design implementation

## 🤝 Support

For issues or questions, please refer to:
- [Angular Documentation](https://angular.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [Stripe Documentation](https://stripe.com/docs)
- [PayPal Documentation](https://developer.paypal.com/docs)

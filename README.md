# Restaurant Ordering App

A modern web application built with Next.js that allows restaurant customers to view menus, place orders, and make payments.

## Features

- Browse menu items by category
- Add items to cart
- Manage cart items (update quantity, remove items)
- Secure payment processing with Stripe
- Order history tracking

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Stripe account (for payment processing)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd restaurant-ordering-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add the following environment variables:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_BASE_URL`: The base URL of your application (e.g., http://localhost:3000)

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Stripe (Payment Processing)
- date-fns (Date Formatting)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── menu/              # Menu page
│   ├── orders/            # Orders page
│   ├── checkout/          # Checkout page
│   └── success/           # Success page
├── components/            # Reusable components
├── data/                  # Sample data
├── store/                 # State management
└── types/                 # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# taptodine-customer
# taptodine-customer

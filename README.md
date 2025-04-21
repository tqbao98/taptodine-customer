# Restaurant Ordering App

A modern web application built with Next.js that allows restaurant customers to view menus and place orders.

## Features

- Browse menu items by category
- Add items to cart
- Manage cart items (update quantity, remove items)
- Order history tracking

## Prerequisites

- Node.js 18.x or later
- npm or yarn

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

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Zustand (State Management)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── menu/              # Menu page
│   ├── orders/            # Orders page
│   └── checkout/          # Checkout page
├── components/            # Reusable components
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

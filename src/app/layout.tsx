import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Cart from "@/components/Cart";
import { CartProvider } from '@/store/CartContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tilaa - Restaurant Ordering",
  description: "Order food from your favorite restaurant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link href="/" className="text-xl font-bold text-gray-900">
                      Restaurant Name
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/orders"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Orders
                    </Link>
                    <Cart />
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto pt-20 pb-16">
              {children}
            </main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}

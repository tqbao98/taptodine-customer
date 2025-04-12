'use client';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Order Placed!
        </h1>
        <p className="text-gray-600 mb-8">
          Your order has been received and will be prepared shortly.
        </p>
        <a
          href="/orders"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          View Orders
        </a>
      </div>
    </div>
  );
} 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRequestHeaders } from '@/utils/customer';

export async function GET(request: NextRequest) {
  try {
    // Get customer ID from request headers (set by middleware)
    const customerId = request.headers.get('x-customer-id');

    // Get customer-specific headers
    const headers = getRequestHeaders(customerId);

    // Construct customer-specific orders endpoint
    const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/customers/${customerId}/orders`;

    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({ orders: data.orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
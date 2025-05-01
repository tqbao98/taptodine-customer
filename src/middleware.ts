import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add protected routes that shouldn't be treated as subdomains
const PROTECTED_ROUTES = ['api', '_next', 'favicon.ico', 'cart', 'orders', 'checkout', 'success'];

export function middleware(request: NextRequest) {
  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = request.headers.get('host') || '';

  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // Get the subdomain
  let subdomain: string | null = null;
  
  if (!isLocalhost) {
    // Remove port if it exists
    const host = hostname.split(':')[0];
    // Split the hostname into parts
    const parts = host.split('.');
    // Check if we have a subdomain
    if (parts.length > 2) {
      subdomain = parts[0];
    }
  } else {
    // For localhost testing, check if subdomain is in the pathname
    // e.g. localhost:3000/customer1
    const pathParts = request.nextUrl.pathname.split('/');
    if (pathParts[1] && !PROTECTED_ROUTES.includes(pathParts[1])) {
      subdomain = pathParts[1];
      // Rewrite the URL to remove the subdomain from the path
      const newPathname = '/' + pathParts.slice(2).join('/');
      return NextResponse.rewrite(new URL(newPathname, request.url));
    }
  }

  // Add customer context to headers
  const requestHeaders = new Headers(request.headers);
  if (subdomain) {
    requestHeaders.set('x-customer-id', subdomain);
  }

  // Return response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
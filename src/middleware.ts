import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = request.headers.get('host') || '';

  // Define your main domain
  // const mainDomain = 'taptodine-customer.vercel.com'; // Change this to your actual domain
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
    if (pathParts[1] && !['api', '_next', 'favicon.ico'].includes(pathParts[1])) {
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
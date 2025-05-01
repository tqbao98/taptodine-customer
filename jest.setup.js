require('@testing-library/jest-dom')
const { TextEncoder, TextDecoder } = require('util');
const { Headers, Request, Response } = require('node-fetch');

// Mock IntersectionObserver
class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    // Do nothing
    return null;
  }

  unobserve() {
    // Do nothing
    return null;
  }

  disconnect() {
    // Do nothing
    return null;
  }
}

global.IntersectionObserver = IntersectionObserver;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Set up fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
)
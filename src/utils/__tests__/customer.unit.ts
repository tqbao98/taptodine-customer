import { getCustomerConfig, getCustomerMenuEndpoint, getRequestHeaders } from '../customer';

// Mock customer module
jest.mock('../customer', () => {
  const mockCustomerConfigs = {
    customer1: {
      apiBaseUrl: 'https://api.test.juhaluoto.net',
      menuId: '1',
    },
    customer2: {
      apiBaseUrl: 'https://api2.test.juhaluoto.net',
      menuId: '2',
    },
    'customer-with-key': {
      apiBaseUrl: 'https://api.test.com',
      menuId: '1',
      apiKey: 'test-key',
    },
  };

  const mockDefaultConfig = {
    apiBaseUrl: 'https://api.test.juhaluoto.net',
    menuId: '1',
  };

  return {
    customerConfigs: mockCustomerConfigs,
    defaultConfig: mockDefaultConfig,
    getCustomerConfig: (customerId: string | null) => {
      if (!customerId) return mockDefaultConfig;
      return mockCustomerConfigs[customerId] || mockDefaultConfig;
    },
    getCustomerMenuEndpoint: (customerId: string | null) => {
      const config = !customerId ? mockDefaultConfig : (mockCustomerConfigs[customerId] || mockDefaultConfig);
      return `${config.apiBaseUrl}/api/menu/${config.menuId}`;
    },
    getRequestHeaders: (customerId: string | null) => {
      const config = !customerId ? mockDefaultConfig : (mockCustomerConfigs[customerId] || mockDefaultConfig);
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
      if (config.apiKey) {
        headers['Authorization'] = `Bearer ${config.apiKey}`;
      }
      return headers;
    },
  };
});

describe('Customer Utils (Unit)', () => {
  describe('getCustomerConfig', () => {
    // Tests if default config is returned when no customer ID is provided
    test('returns default config when customerId is null', () => {
      const config = getCustomerConfig(null);
      expect(config).toEqual({
        apiBaseUrl: 'https://api.test.juhaluoto.net',
        menuId: '1',
      });
    });

    // Tests if customer-specific config is returned for valid customer ID
    test('returns customer specific config when valid customerId is provided', () => {
      const config = getCustomerConfig('customer1');
      expect(config).toEqual({
        apiBaseUrl: 'https://api.test.juhaluoto.net',
        menuId: '1',
      });
    });

    // Tests if default config is returned for invalid customer ID
    test('returns default config when invalid customerId is provided', () => {
      const config = getCustomerConfig('nonexistent');
      expect(config).toEqual({
        apiBaseUrl: 'https://api.test.juhaluoto.net',
        menuId: '1',
      });
    });
  });

  describe('getCustomerMenuEndpoint', () => {
    // Tests if correct endpoint is returned for first customer
    test('returns correct endpoint for customer1', () => {
      const endpoint = getCustomerMenuEndpoint('customer1');
      expect(endpoint).toBe('https://api.test.juhaluoto.net/api/menu/1');
    });

    // Tests if correct endpoint is returned for second customer
    test('returns correct endpoint for customer2', () => {
      const endpoint = getCustomerMenuEndpoint('customer2');
      expect(endpoint).toBe('https://api2.test.juhaluoto.net/api/menu/2');
    });

    // Tests if default endpoint is returned when no customer ID is provided
    test('returns default endpoint when customerId is null', () => {
      const endpoint = getCustomerMenuEndpoint(null);
      expect(endpoint).toBe('https://api.test.juhaluoto.net/api/menu/1');
    });
  });

  describe('getRequestHeaders', () => {
    // Tests if basic headers are returned when no API key is present
    test('returns basic headers when no apiKey is present', () => {
      const headers = getRequestHeaders('customer1');
      expect(headers).toEqual({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      });
    });

    // Tests if authorization header is included when API key is present
    test('includes Authorization header when apiKey is present', () => {
      const headers = getRequestHeaders('customer-with-key');
      expect(headers).toEqual({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key',
      });
    });

    // Tests if default headers are returned when no customer ID is provided
    test('returns default headers when customerId is null', () => {
      const headers = getRequestHeaders(null);
      expect(headers).toEqual({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      });
    });
  });
});
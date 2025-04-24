interface CustomerConfig {
  apiBaseUrl: string;
  apiKey?: string;
  menuId: string;
}

const customerConfigs: Record<string, CustomerConfig> = {
  customer1: {
    apiBaseUrl: 'https://api.test.juhaluoto.net',
    menuId: '1',
  },
  customer2: {
    apiBaseUrl: 'https://api2.test.juhaluoto.net',
    menuId: '2',
  },
  // Add more customer configurations as needed
};

const defaultConfig: CustomerConfig = {
  apiBaseUrl: 'https://api.test.juhaluoto.net',
  menuId: '1',
};

export function getCustomerConfig(customerId: string | null): CustomerConfig {
  if (!customerId) return defaultConfig;
  return customerConfigs[customerId] || defaultConfig;
}

export function getCustomerMenuEndpoint(customerId: string | null): string {
  const config = getCustomerConfig(customerId);
  return `${config.apiBaseUrl}/api/menu/${config.menuId}`;
}

export function getRequestHeaders(customerId: string | null): HeadersInit {
  const config = getCustomerConfig(customerId);
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  
  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }
  
  return headers;
}
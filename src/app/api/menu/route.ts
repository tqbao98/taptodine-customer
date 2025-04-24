import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCustomerMenuEndpoint, getRequestHeaders } from '@/utils/customer';

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNjMGMwYzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

interface MenuSection {
  id: number;
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  photoUrl?: string;
  labels?: string;
  ingredients?: string;
}

interface MenuResponse {
  id: number;
  sections: MenuSection[];
  restaurant: {
    id: number;
    name: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Get customer ID from request headers (set by middleware)
    const customerId = request.headers.get('x-customer-id');
    
    // Get customer-specific endpoint and headers
    const endpoint = getCustomerMenuEndpoint(customerId);
    const headers = getRequestHeaders(customerId);

    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as MenuResponse;
    console.log('Raw backend API response:', data);
    
    // Extract all items from all sections and flatten them
    const menuItems = data.sections.flatMap((section: MenuSection) => 
      section.items.map((item: MenuItem) => {
        // Ensure we have a valid image URL
        const imageUrl = item.photoUrl?.trim() || placeholderImage;
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
          console.warn(`Invalid image URL for item ${item.id}: ${imageUrl}`);
        }
        
        return {
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: parseFloat(item.price),
          image: imageUrl,
          category: section.title,
          labels: item.labels,
          ingredients: item.ingredients
        };
      })
    );
    
    console.log('Transformed menu items:', menuItems);
    
    return NextResponse.json({ 
      menu: menuItems,
      restaurantName: data.restaurant.name 
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}
export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'main' | 'appetizer' | 'dessert' | 'vegan' | 'drink';
}

export const menu: Dish[] = [
  // Main Dishes
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    price: 12.99,
    image: '/images/margherita.jpg',
    category: 'main',
  },
  {
    id: '2',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon butter sauce',
    price: 18.99,
    image: '/images/carbonara.jpg',
    category: 'main',
  },
  {
    id: '3',
    name: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta with creamy sauce and pancetta',
    price: 14.99,
    image: '/images/carbonara.jpg',
    category: 'main',
  },
  {
    id: '4',
    name: 'Ribeye Steak',
    description: '12oz premium cut with garlic butter and roasted vegetables',
    price: 24.99,
    image: '/images/margherita.jpg',
    category: 'main',
  },
  {
    id: '5',
    name: 'Margherita Pizza',
    description: 'Traditional pizza with tomato, mozzarella, and basil',
    price: 13.99,
    image: '/images/margherita.jpg',
    category: 'main',
  },

  // Appetizers
  {
    id: '6',
    name: 'Bruschetta',
    description: 'Toasted bread with fresh tomatoes, garlic, and basil',
    price: 8.99,
    image: '/images/caesar.jpg',
    category: 'appetizer',
  },
  {
    id: '7',
    name: 'Calamari',
    description: 'Crispy fried squid with marinara sauce',
    price: 10.99,
    image: '/images/caesar.jpg',
    category: 'appetizer',
  },
  {
    id: '8',
    name: 'Spinach Dip',
    description: 'Creamy spinach and artichoke dip with tortilla chips',
    price: 9.99,
    image: '/images/caesar.jpg',
    category: 'appetizer',
  },
  {
    id: '9',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons, and Caesar dressing',
    price: 8.99,
    image: '/images/caesar.jpg',
    category: 'appetizer',
  },

  // Desserts
  {
    id: '10',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 7.99,
    image: '/images/lava-cake.jpg',
    category: 'dessert',
  },
  {
    id: '11',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 8.99,
    image: '/images/lava-cake.jpg',
    category: 'dessert',
  },
  {
    id: '12',
    name: 'Cheesecake',
    description: 'New York style cheesecake with berry compote',
    price: 7.99,
    image: '/images/lava-cake.jpg',
    category: 'dessert',
  },

  // Vegan
  {
    id: '13',
    name: 'Vegan Burger',
    description: 'Plant-based patty with vegan cheese and special sauce',
    price: 13.99,
    image: '/images/margherita.jpg',
    category: 'vegan',
  },
  {
    id: '14',
    name: 'Vegan Pizza',
    description: 'Plant-based cheese and vegetable toppings',
    price: 14.99,
    image: '/images/margherita.jpg',
    category: 'vegan',
  },

  // Drinks
  {
    id: '15',
    name: 'Iced Tea',
    description: 'Refreshing iced tea with lemon',
    price: 3.99,
    image: '/images/iced-tea.jpg',
    category: 'drink',
  },
  {
    id: '16',
    name: 'Lemonade',
    description: 'Freshly squeezed lemonade',
    price: 4.99,
    image: '/images/iced-tea.jpg',
    category: 'drink',
  },
]; 
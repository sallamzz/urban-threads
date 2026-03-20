import { Product } from './types'

export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Classic Oxford Shirt',
    price: 5999,
    category: 'shirts',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
    description:
      'A timeless Oxford shirt crafted from premium 100% cotton. Features a button-down collar, chest pocket, and relaxed fit perfect for both casual and smart-casual occasions.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'prod-002',
    name: 'Oversized Linen Tee',
    price: 3499,
    category: 'shirts',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    description:
      'Effortlessly cool and breathable, this oversized tee is woven from lightweight linen for all-day comfort. A wardrobe staple that pairs with everything.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'prod-003',
    name: 'Slim Chino Pants',
    price: 7999,
    category: 'pants',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    description:
      'Clean-cut slim chinos made from stretch-cotton blend for ease of movement. The versatile neutral tone makes them the perfect foundation for any outfit.',
    sizes: ['28', '30', '32', '34', '36'],
  },
  {
    id: 'prod-004',
    name: 'Wide-Leg Trousers',
    price: 8999,
    category: 'pants',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    description:
      'Elevated wide-leg trousers with a high-rise waist and fluid drape. Cut from a premium woven fabric that holds its shape beautifully throughout the day.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'prod-005',
    name: 'Midi Wrap Dress',
    price: 9499,
    category: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
    description:
      'A figure-flattering midi wrap dress with a deep V-neckline and adjustable tie waist. Made from a flowing crepe fabric that moves with you from day to evening.',
    sizes: ['XS', 'S', 'M', 'L'],
  },
  {
    id: 'prod-006',
    name: 'Floral Sundress',
    price: 7499,
    category: 'dresses',
    imageUrl: 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=400',
    description:
      'A breezy floral sundress with adjustable spaghetti straps and a smocked bodice. The lightweight cotton fabric and vibrant print make it perfect for warm days.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 'prod-007',
    name: 'Leather Belt',
    price: 3999,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400',
    description:
      'A sleek full-grain leather belt with a brushed-gold buckle. Resoleable and built to last, it elevates any outfit with understated elegance.',
    sizes: ['One Size'],
  },
  {
    id: 'prod-008',
    name: 'Canvas Tote Bag',
    price: 4499,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400',
    description:
      'A sturdy heavyweight canvas tote with reinforced handles and an interior zip pocket. Spacious enough for a day out, sustainable enough to feel good about.',
    sizes: ['One Size'],
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

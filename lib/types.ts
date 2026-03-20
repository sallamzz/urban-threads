// ── UI / App types ──────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  price: number // in cents (e.g. 5999 = $59.99)
  category: 'shirts' | 'pants' | 'dresses' | 'accessories'
  imageUrl: string
  description: string
  sizes: string[]
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
}

export interface User {
  playerId: string
  displayName: string
  email: string
  isRegistered: boolean
}

export interface PlayerInfo {
  points: number
  currentTier?: string
  nextTier?: string
  tierProgress?: number   // 0-100
  pointsToNextTier?: number
}

export interface Order {
  orderId: string
  items: CartItem[]
  subtotal: number        // in cents
  discount: number        // in cents (points-based)
  total: number           // in cents
  pointsRedeemed: number
  createdAt: string
  customerName: string
}

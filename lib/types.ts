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
  tierProgress?: number // 0-100 percentage
  pointsToNextTier?: number
}

export interface Badge {
  id: string
  name: string
  description: string
  imageUrl?: string
  isAchieved: boolean
  progress?: number // 0-100 percentage
  currentValue?: number
  targetValue?: number
}

export interface Order {
  orderId: string
  items: CartItem[]
  subtotal: number // in cents
  discount: number // in cents (points-based)
  total: number // in cents
  pointsEarned?: number
  pointsRedeemed: number
  createdAt: string
  customerName: string
}

// Gameball API payload types
export interface GameballRegisterPayload {
  customerId: string
  customerAttributes: {
    displayName: string
    email: string
    mobile?: string
  }
}

export interface GameballEventPayload {
  customerId: string
  events: Record<string, Record<string, string> | object>
}

export interface GameballHoldPayload {
  customerId: string
  pointsToHold: number
  transactionTime?: string
}

export interface GameballLineItem {
  productId: string
  quantity: number
  price: number // in dollars
  title?: string
  category?: string[]
  weight?: number
  sku?: string
}

export interface GameballOrderPayload {
  customerId: string
  orderId: string
  totalPaid: number // in dollars
  orderDate: string // ISO 8601
  channel?: string
  lineItems?: GameballLineItem[]
  redemption?: {
    pointsHoldReference: string
  }
}

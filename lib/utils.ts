import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('en-US').format(points)
}

// 100 points = $1 = 100 cents
export function pointsToCents(points: number): number {
  return points
}

export function centsToPoints(cents: number): number {
  return cents
}

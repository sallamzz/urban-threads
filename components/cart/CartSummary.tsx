'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'

interface CartSummaryProps {
  onCheckout?: () => void
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const { subtotal, itemCount, closeDrawer } = useCart()
  const router = useRouter()

  function handleCheckout() {
    closeDrawer()
    if (onCheckout) {
      onCheckout()
    } else {
      router.push('/checkout')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-white/70">
        <span>Items ({itemCount})</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="border-t border-navy-700 pt-3 flex justify-between font-bold text-white">
        <span>Subtotal</span>
        <span className="text-gold-400">{formatPrice(subtotal)}</span>
      </div>
      <Button onClick={handleCheckout} className="w-full" disabled={itemCount === 0}>
        Proceed to Checkout
      </Button>
      <Link
        href="/cart"
        onClick={closeDrawer}
        className="block text-center text-sm text-navy-500 hover:text-white transition-colors"
      >
        View Full Cart
      </Link>
    </div>
  )
}

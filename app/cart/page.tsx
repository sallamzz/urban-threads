'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { CartItemRow } from '@/components/cart/CartItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, subtotal, itemCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto mb-6 text-navy-600" />
        <h1 className="font-display text-3xl text-white mb-3">Your cart is empty</h1>
        <p className="text-navy-500 mb-8">Add some pieces to get started.</p>
        <Link
          href="/"
          className="inline-block bg-gold-500 text-navy-900 font-semibold px-8 py-3 rounded-md hover:bg-gold-400 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl text-white mb-2">Your Cart</h1>
      <p className="text-navy-500 text-sm mb-8">{itemCount} item{itemCount !== 1 ? 's' : ''} · {formatPrice(subtotal)}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            {items.map((item) => (
              <CartItemRow key={`${item.product.id}-${item.selectedSize}`} item={item} />
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-xl text-white mb-4">Order Summary</h2>
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  )
}

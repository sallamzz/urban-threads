'use client'

import { X, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { CartItemRow } from './CartItem'
import { CartSummary } from './CartSummary'

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-navy-900 border-l border-navy-700 flex flex-col transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy-700">
          <h2 className="font-display text-xl text-white">Your Cart</h2>
          <button
            onClick={closeDrawer}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={48} className="text-navy-600" />
              <p className="text-navy-500">Your cart is empty</p>
              <Link
                href="/"
                onClick={closeDrawer}
                className="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
              >
                Start Shopping →
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow key={`${item.product.id}-${item.selectedSize}`} item={item} />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-navy-700">
            <CartSummary />
          </div>
        )}
      </div>
    </>
  )
}

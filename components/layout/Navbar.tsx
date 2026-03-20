'use client'

import Link from 'next/link'
import { ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useUser } from '@/context/UserContext'
import { LoyaltyBadge } from '@/components/loyalty/LoyaltyBadge'

export function Navbar() {
  const { itemCount, openDrawer } = useCart()
  const { user } = useUser()

  return (
    <nav className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-sm border-b border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-display text-xl text-white tracking-widest hover:text-gold-400 transition-colors">
            UrbanThreads
          </Link>

          {/* Center Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="nav-link text-sm text-white/70 hover:text-white transition-colors pb-0.5">
              Home
            </Link>
            <Link href="/#products" className="nav-link text-sm text-white/70 hover:text-white transition-colors pb-0.5">
              Shop
            </Link>
            <Link href="/account" className="nav-link text-sm text-white/70 hover:text-white transition-colors pb-0.5">
              My Account
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {user && <LoyaltyBadge />}

            <Link
              href="/account"
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Account"
            >
              <User size={22} />
            </Link>

            <button
              onClick={openDrawer}
              className="relative text-white/70 hover:text-white transition-colors p-1"
              aria-label="Cart"
            >
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-navy-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

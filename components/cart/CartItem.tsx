'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'

interface CartItemProps {
  item: CartItemType
}

export function CartItemRow({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart()

  return (
    <div className="flex gap-4 py-4 border-b border-navy-700 last:border-0">
      {/* Image */}
      <div className="relative w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-navy-700">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white text-sm font-medium leading-snug truncate">
          {item.product.name}
        </h4>
        <p className="text-navy-500 text-xs mt-0.5">Size: {item.selectedSize}</p>
        <p className="text-gold-400 font-bold text-sm mt-1">
          {formatPrice(item.product.price)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
            className="w-7 h-7 rounded-md bg-navy-700 text-white hover:bg-navy-600 flex items-center justify-center transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span className="text-white text-sm w-5 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
            className="w-7 h-7 rounded-md bg-navy-700 text-white hover:bg-navy-600 flex items-center justify-center transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Remove + total */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <button
          onClick={() => removeItem(item.product.id, item.selectedSize)}
          className="text-navy-500 hover:text-red-400 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
        <p className="text-white font-semibold text-sm">
          {formatPrice(item.product.price * item.quantity)}
        </p>
      </div>
    </div>
  )
}

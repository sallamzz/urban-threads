'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { toast } from '@/components/ui/Toast'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    // Quick-add with the first available size
    const defaultSize = product.sizes[0]
    addItem(product, defaultSize)
    toast(`Added ${product.name} (${defaultSize}) to cart`)
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-navy-800 border border-navy-700 hover:border-gold-500/50 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 transition-all duration-300">
        {/* Product Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />

          {/* Quick add button */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 right-3 bg-gold-500 text-navy-900 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold-400"
            aria-label={`Quick add ${product.name}`}
          >
            <ShoppingBag size={16} />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-navy-500 uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-gold-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-gold-400 font-bold mt-1.5">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  )
}

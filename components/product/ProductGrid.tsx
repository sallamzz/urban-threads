'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'

const CATEGORIES = ['all', 'shirts', 'pants', 'dresses', 'accessories'] as const
type FilterCategory = (typeof CATEGORIES)[number]

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <section id="products" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl text-white">Our Collection</h2>
          <div className="h-0.5 w-16 bg-gold-500 mx-auto mt-3" />
        </div>

        {/* Category filter tabs */}
        <div className="flex justify-center gap-2 flex-wrap mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                activeCategory === cat
                  ? 'bg-gold-500 text-navy-900'
                  : 'bg-navy-800 text-white/70 hover:text-white border border-navy-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, index) => (
            <div
              key={product.id}
              className="card-stagger"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

export const runtime = 'edge'

import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, ShoppingBag } from 'lucide-react'
import { products, getProductById } from '@/lib/products'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { SizeSelector } from '@/components/product/SizeSelector'
import { WriteReview } from '@/components/product/WriteReview'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'
import { ProductCard } from '@/components/product/ProductCard'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const productData = getProductById(id)
  if (!productData) notFound()
  const product = productData!

  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])

  function handleAddToCart() {
    addItem(product, selectedSize)
    toast(`${product.name} (${selectedSize}) added to cart!`)
  }

  // Related products: same category, different id
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-navy-500 hover:text-white transition-colors text-sm mb-8"
      >
        <ChevronLeft size={16} />
        Back to Shop
      </Link>

      {/* Product detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image */}
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-navy-800">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <p className="text-gold-500 text-xs font-semibold tracking-widest uppercase mb-2">
            {product.category}
          </p>
          <h1 className="font-display text-4xl text-white mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-gold-400 mb-6">
            {formatPrice(product.price)}
          </p>
          <p className="text-white/60 leading-relaxed mb-8">{product.description}</p>

          {/* Size selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/80">Select Size</label>
              <span className="text-xs text-navy-500">Selected: {selectedSize}</span>
            </div>
            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onChange={setSelectedSize}
            />
          </div>

          {/* Add to cart */}
          <Button size="lg" onClick={handleAddToCart} className="flex items-center gap-2">
            <ShoppingBag size={18} />
            Add to Cart
          </Button>

          {/* Points callout */}
          <div className="mt-4 flex items-center gap-2 text-sm text-navy-500">
            <span className="text-gold-500">★</span>
            <span>
              Earn loyalty points when you purchase this item
            </span>
          </div>
        </div>
      </div>

      {/* Write Review */}
      <div className="mb-20">
        <WriteReview productId={product.id} productName={product.name} />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl text-white mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

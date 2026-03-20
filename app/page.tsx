import Link from 'next/link'
import { products } from '@/lib/products'
import { ProductGrid } from '@/components/product/ProductGrid'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #E8C43D 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E8C43D 0%, transparent 50%)`
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-up">
          <p className="text-gold-500 text-sm font-medium tracking-[0.3em] uppercase mb-4">
            New Season Collection
          </p>
          <h1 className="font-display text-5xl sm:text-7xl text-white leading-tight mb-6">
            Wear Your
            <span className="block text-gold-400">Story</span>
          </h1>
          <p className="text-white/60 text-lg mb-2 max-w-xl mx-auto">
            Premium clothing crafted for the modern wardrobe.
          </p>
          <p className="text-gold-400/80 text-sm mb-8">
            ✦ Earn loyalty points on every purchase ✦
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="#products"
              className="bg-gold-500 text-navy-900 font-semibold px-8 py-4 rounded-md hover:bg-gold-400 transition-colors text-sm"
            >
              Shop Now
            </Link>
            <Link
              href="/account"
              className="border border-gold-500/50 text-gold-400 font-semibold px-8 py-4 rounded-md hover:border-gold-500 transition-colors text-sm"
            >
              My Points
            </Link>
          </div>
        </div>

        {/* Decorative bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-navy-900 to-transparent" />
      </section>

      {/* Loyalty callout banner */}
      <section className="bg-navy-800 border-y border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <span className="text-gold-500">★</span>
              <span>Earn points on every order</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold-500">★</span>
              <span>Redeem for exclusive discounts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold-500">★</span>
              <span>Unlock tier rewards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold-500">★</span>
              <span>Earn for reviews & more</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <ProductGrid products={products} />
    </>
  )
}

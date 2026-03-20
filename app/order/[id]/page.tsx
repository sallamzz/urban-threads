'use client'

export const runtime = 'edge'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Star, Package } from 'lucide-react'
import { Order } from '@/lib/types'
import { formatPrice, formatPoints } from '@/lib/utils'
import { useUser } from '@/context/UserContext'

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { refreshPlayerInfo } = useUser()
  const [order, setOrder] = useState<Order | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    try {
      const orders: Order[] = JSON.parse(localStorage.getItem('urban_orders') ?? '[]')
      const found = orders.find((o) => o.orderId === id)
      if (found) {
        setOrder(found)
        // Refresh points so the navbar badge updates
        refreshPlayerInfo()
      } else {
        setNotFound(true)
      }
    } catch {
      setNotFound(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (notFound) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Package size={48} className="mx-auto mb-4 text-navy-600" />
        <p className="text-navy-500 mb-4">Order not found.</p>
        <Link href="/" className="text-gold-400 hover:text-gold-300">
          Go home →
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-navy-500">Loading order...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-green-900/50 border-2 border-green-500 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h1 className="font-display text-4xl text-white mb-2">Order Confirmed!</h1>
        <p className="text-navy-500">Thank you, {order.customerName}. Your order is on its way.</p>
      </div>

      {/* Points earned banner */}
      <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-5 mb-8 text-center">
        <Star size={20} className="text-gold-500 fill-gold-500 mx-auto mb-2" />
        <p className="text-white font-semibold">
          You earned loyalty points on this order!
        </p>
        <p className="text-navy-500 text-sm mt-1">
          Points will appear in your account shortly.
        </p>
        {order.pointsRedeemed > 0 && (
          <p className="text-green-400 text-sm mt-2">
            {formatPoints(order.pointsRedeemed)} pts were redeemed for a {formatPrice(order.discount)} discount.
          </p>
        )}
      </div>

      {/* Order summary */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-white">Order Summary</h2>
          <span className="text-navy-500 text-sm">{order.orderId}</span>
        </div>

        <div className="space-y-4 mb-4">
          {order.items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedSize}`}
              className="flex gap-4"
            >
              <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-navy-700">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{item.product.name}</p>
                <p className="text-navy-500 text-xs">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                <p className="text-gold-400 text-sm font-bold mt-1">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-navy-700 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-white/70">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-400">
              <span>Points discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-white text-lg border-t border-navy-700 pt-3">
            <span>Total Paid</span>
            <span className="text-gold-400">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="flex-1 text-center bg-gold-500 text-navy-900 font-semibold px-6 py-3 rounded-md hover:bg-gold-400 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account"
          className="flex-1 text-center border border-gold-500/50 text-gold-400 font-semibold px-6 py-3 rounded-md hover:border-gold-500 transition-colors"
        >
          View My Points
        </Link>
      </div>
    </div>
  )
}

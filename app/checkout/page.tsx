'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Lock } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useUser } from '@/context/UserContext'
import { OrderForm } from '@/components/checkout/OrderForm'
import { PointsRedemptionBox } from '@/components/checkout/PointsRedemptionBox'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { Order } from '@/lib/types'
import { toast } from '@/components/ui/Toast'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { user, playerInfo, refreshPlayerInfo } = useUser()

  const [formData, setFormData] = useState({
    name: user?.displayName ?? '',
    email: user?.email ?? '',
    address: '',
    city: '',
    zip: '',
  })
  const [discount, setDiscount] = useState(0) // in cents
  const [pointsToRedeem, setPointsToRedeem] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const total = Math.max(0, subtotal - discount)

  const handleRedemptionChange = useCallback(
    (discountCents: number, points: number) => {
      setDiscount(discountCents)
      setPointsToRedeem(points)
    },
    []
  )

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-navy-500 mb-4">Your cart is empty.</p>
        <Link href="/" className="text-gold-400 hover:text-gold-300">
          Go shopping →
        </Link>
      </div>
    )
  }

  async function handlePlaceOrder() {
    // Validate form
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zip) {
      setError('Please fill in all required fields.')
      return
    }
    if (!user) {
      setError('Please complete onboarding first.')
      return
    }

    setError('')
    setIsSubmitting(true)

    const orderId = `UT-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
    let holdRefId: string | null = null

    try {
      // Step 1: Create hold if redeeming points
      if (pointsToRedeem > 0) {
        const holdRes = await fetch('/api/gameball/hold', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: user.playerId, points: pointsToRedeem }),
        })
        const holdData = await holdRes.json()
        if (!holdRes.ok || holdData.error) {
          setError(holdData.error || 'Could not reserve points. Please try again.')
          setIsSubmitting(false)
          return
        }
        // Gameball returns holdReference in the response
        holdRefId = holdData?.holdReference ?? holdData?.holdRefId ?? holdData?.id ?? null
        if (!holdRefId) {
          holdRefId = holdData?.data?.holdReference ?? holdData?.data?.holdRefId ?? null
        }
      }

      // Step 2: Submit order to Gameball
      const orderPayload: Record<string, unknown> = {
        customerId: user.playerId,
        orderId,
        totalPaid: total / 100, // convert cents to dollars — post-discount; this is what Gameball uses for reward calculation
        orderDate: new Date().toISOString(),
        channel: 'web',
        lineItems: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price / 100, // convert cents to dollars
          title: item.product.name,
          category: [item.product.category],
        })),
      }
      if (holdRefId) {
        orderPayload.redemption = { pointsHoldReference: holdRefId }
      }

      const orderRes = await fetch('/api/gameball/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })
      const orderData = await orderRes.json()

      // Order submission failure is non-critical — log it but continue
      if (!orderRes.ok) {
        console.error('Gameball order submission failed:', orderData)
      }

      // Step 3: Save order to localStorage
      const order: Order = {
        orderId,
        items: [...items],
        subtotal,
        discount,
        total,
        pointsRedeemed: pointsToRedeem,
        createdAt: new Date().toISOString(),
        customerName: formData.name,
      }

      try {
        const existing: Order[] = JSON.parse(localStorage.getItem('urban_orders') ?? '[]')
        const updated = [order, ...existing].slice(0, 20) // keep max 20
        localStorage.setItem('urban_orders', JSON.stringify(updated))
      } catch {
        // ignore storage errors
      }

      // Step 4: Clear cart and navigate
      clearCart()
      refreshPlayerInfo()
      router.push(`/order/${orderId}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-navy-500 hover:text-white transition-colors text-sm mb-8"
      >
        <ChevronLeft size={16} />
        Back to Cart
      </Link>

      <h1 className="font-display text-3xl text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: Form + Points */}
        <div className="lg:col-span-3 space-y-8">
          {/* Shipping details */}
          <div className="card p-6">
            <h2 className="font-display text-xl text-white mb-5">Shipping Details</h2>
            <OrderForm data={formData} onChange={setFormData} />
          </div>

          {/* Points redemption */}
          <PointsRedemptionBox
            availablePoints={playerInfo.points}
            orderSubtotal={subtotal}
            onRedemptionChange={handleRedemptionChange}
          />
          {playerInfo.points === 0 && (
            <p className="text-xs text-navy-500 text-center -mt-4">
              Place an order to earn loyalty points — then return here to redeem them on your next purchase.
            </p>
          )}
        </div>

        {/* Right: Order summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display text-xl text-white mb-5">Order Summary</h2>

            {/* Items list */}
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-white/70 truncate max-w-[180px]">
                    {item.product.name} ({item.selectedSize}) × {item.quantity}
                  </span>
                  <span className="text-white shrink-0 ml-2">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-navy-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-white/70">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>Points discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-white text-lg pt-2 border-t border-navy-700">
                <span>Total</span>
                <span className="text-gold-400">{formatPrice(total)}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full mt-6 flex items-center gap-2"
              size="lg"
            >
              <Lock size={16} />
              {isSubmitting ? 'Processing Order...' : 'Place Order'}
            </Button>

            <p className="text-xs text-navy-500 text-center mt-3">
              This is a demo store. No real payment is processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

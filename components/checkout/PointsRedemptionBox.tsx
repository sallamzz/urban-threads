'use client'

import { useState, useEffect } from 'react'
import { Star, Info } from 'lucide-react'
import { formatPoints, formatPrice, pointsToCents } from '@/lib/utils'

// Conversion: 100 points = $1 = 100 cents
const POINTS_PER_DOLLAR = 100

interface PointsRedemptionBoxProps {
  availablePoints: number
  orderSubtotal: number // in cents
  onRedemptionChange: (discountCents: number, pointsToRedeem: number) => void
}

export function PointsRedemptionBox({
  availablePoints,
  orderSubtotal,
  onRedemptionChange,
}: PointsRedemptionBoxProps) {
  const [enabled, setEnabled] = useState(false)
  const [pointsInput, setPointsInput] = useState(0)

  // Max redeemable: min(available points, order subtotal in points)
  const maxRedeemablePoints = Math.min(availablePoints, orderSubtotal)
  const maxDiscountCents = pointsToCents(maxRedeemablePoints)

  useEffect(() => {
    if (!enabled) {
      onRedemptionChange(0, 0)
      setPointsInput(0)
    }
  }, [enabled, onRedemptionChange])

  function handleSliderChange(value: number) {
    const clipped = Math.min(Math.max(0, value), maxRedeemablePoints)
    setPointsInput(clipped)
    onRedemptionChange(pointsToCents(clipped), clipped)
  }

  if (availablePoints === 0) {
    return (
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
        <div className="flex items-center gap-2 text-navy-500">
          <Star size={18} />
          <p className="text-sm">You have no points to redeem yet. Earn points on this purchase!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-gold-500 fill-gold-500" />
          <span className="font-semibold text-white">Loyalty Points</span>
        </div>
        {/* Toggle */}
        <button
          type="button"
          onClick={() => setEnabled(!enabled)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
            enabled ? 'bg-gold-500' : 'bg-navy-600'
          }`}
          aria-label="Toggle points redemption"
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
              enabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <p className="text-sm text-white/70">
          Available:{' '}
          <span className="text-gold-400 font-bold">{formatPoints(availablePoints)} pts</span>
        </p>
        <div className="relative group cursor-help">
          <Info size={14} className="text-navy-500" />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-navy-700 text-white text-xs px-3 py-2 rounded-lg w-44 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
            100 points = $1.00 discount
          </div>
        </div>
      </div>

      {enabled && (
        <div className="space-y-3 mt-2">
          <div className="flex justify-between text-xs text-navy-500">
            <span>0 pts</span>
            <span>{formatPoints(maxRedeemablePoints)} pts</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxRedeemablePoints}
            step={POINTS_PER_DOLLAR}
            value={pointsInput}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full accent-gold-500"
          />
          <div className="flex justify-between items-center bg-navy-900 rounded-lg px-4 py-3">
            <div>
              <p className="text-xs text-navy-500">Redeeming</p>
              <p className="text-gold-400 font-bold">{formatPoints(pointsInput)} pts</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-navy-500">Discount</p>
              <p className="text-green-400 font-bold">
                -{formatPrice(pointsToCents(pointsInput))}
              </p>
            </div>
          </div>
          {pointsInput > 0 && (
            <p className="text-xs text-navy-500 text-center">
              Remaining after redemption:{' '}
              <span className="text-white">{formatPoints(availablePoints - pointsInput)} pts</span>
            </p>
          )}
        </div>
      )}

      {!enabled && (
        <p className="text-xs text-navy-500">
          Toggle to redeem up to {formatPrice(maxDiscountCents)} off your order.
        </p>
      )}
    </div>
  )
}

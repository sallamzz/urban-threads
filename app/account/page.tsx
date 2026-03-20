'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Package, ChevronRight, User } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { BadgeGrid } from '@/components/loyalty/BadgeGrid'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatPoints, formatPrice } from '@/lib/utils'
import { Order } from '@/lib/types'

export default function AccountPage() {
  const { user, playerInfo, isLoadingPlayerInfo, refreshPlayerInfo } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [tierData, setTierData] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    // Load order history from localStorage
    try {
      const stored = localStorage.getItem('urban_orders')
      if (stored) setOrders(JSON.parse(stored))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    refreshPlayerInfo()

    // Also fetch tier details
    if (user?.playerId) {
      fetch(`/api/gameball/tier?customerId=${encodeURIComponent(user.playerId)}`)
        .then((r) => r.json())
        .then((d) => {
          console.log('[Account] raw tier response:', d)
          setTierData(d)
        })
        .catch(() => {})
    }
  }, [user?.playerId])

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-navy-500">Loading your account...</p>
      </div>
    )
  }

  const initials = user.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Gameball returns { current: {name, minPorgress}, next: {name, minPorgress}, progress }
  const tierItem = Array.isArray(tierData) ? tierData[0] : tierData
  const currentTier =
    (tierItem?.current?.name as string) ??
    (tierItem?.tierName as string) ??
    (tierItem?.currentTierName as string) ??
    playerInfo.currentTier ??
    null
  const nextTier =
    (tierItem?.next?.name as string) ??
    (tierItem?.nextTierName as string) ??
    playerInfo.nextTier ??
    null
  const tierProgress =
    (tierItem?.progress as number) ??
    (tierItem?.completionPercentage as number) ??
    playerInfo.tierProgress ??
    null
  const pointsToNext =
    (tierItem?.next?.minPorgress as number) ??
    (tierItem?.nextTierProgress as number) ??
    (tierItem?.remainingPoints as number) ??
    playerInfo.pointsToNextTier ??
    null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl text-white mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="space-y-6">
          {/* Profile card */}
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gold-500 flex items-center justify-center text-navy-900 font-bold text-xl">
                {initials}
              </div>
              <div>
                <p className="text-white font-semibold">{user.displayName}</p>
                <p className="text-navy-500 text-sm">{user.email}</p>
              </div>
            </div>
            {user.isRegistered ? (
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Loyalty account active
              </p>
            ) : (
              <p className="text-xs text-yellow-500">Syncing loyalty account...</p>
            )}
          </div>

          {/* Points balance card */}
          <div className="card p-6 border-gold-500/30 bg-gradient-to-br from-navy-800 to-navy-900">
            <div className="flex items-center gap-2 mb-3">
              <Star size={18} className="text-gold-500 fill-gold-500" />
              <span className="text-white font-semibold">Points Balance</span>
            </div>
            {isLoadingPlayerInfo ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <p className="text-4xl font-bold text-gold-400">
                {formatPoints(playerInfo.points)}
              </p>
            )}
            <p className="text-navy-500 text-sm mt-1">loyalty points</p>
            <p className="text-xs text-navy-500 mt-3">
              ≈ {formatPrice(playerInfo.points)} in discounts (100 pts = $1)
            </p>
          </div>

          {/* Tier progress */}
          {(currentTier || tierProgress != null) && (
            <div className="card p-6">
              <h3 className="font-display text-lg text-white mb-4">Tier Progress</h3>
              {currentTier && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white/70">Current Tier</span>
                  <span className="text-gold-400 font-bold">{currentTier}</span>
                </div>
              )}
              {tierProgress != null && (
                <>
                  <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all"
                      style={{ width: `${Math.min(tierProgress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-navy-500 mt-2 text-right">{tierProgress}%</p>
                </>
              )}
              {nextTier && (
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-navy-500">Next: {nextTier}</span>
                  {pointsToNext != null && (
                    <span className="text-xs text-navy-500">
                      {formatPoints(pointsToNext)} pts to go
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Badges */}
          <div className="card p-6">
            <h2 className="font-display text-xl text-white mb-5">Achievements & Badges</h2>
            <BadgeGrid />
          </div>

          {/* Order history */}
          <div className="card p-6">
            <h2 className="font-display text-xl text-white mb-5">Order History</h2>
            {orders.length === 0 ? (
              <div className="text-center py-10 text-navy-500">
                <Package size={40} className="mx-auto mb-3 opacity-50" />
                <p>No orders yet.</p>
                <Link
                  href="/"
                  className="text-gold-400 hover:text-gold-300 text-sm mt-2 inline-block"
                >
                  Start shopping →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.orderId}
                    href={`/order/${order.orderId}`}
                    className="flex items-center justify-between p-4 bg-navy-900 rounded-xl border border-navy-700 hover:border-gold-500/50 transition-colors group"
                  >
                    <div>
                      <p className="text-white font-medium text-sm">{order.orderId}</p>
                      <p className="text-navy-500 text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                        {' · '}
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                      {order.pointsRedeemed > 0 && (
                        <p className="text-green-400 text-xs mt-0.5">
                          {formatPoints(order.pointsRedeemed)} pts redeemed
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gold-400 font-bold">{formatPrice(order.total)}</span>
                      <ChevronRight size={16} className="text-navy-600 group-hover:text-white transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

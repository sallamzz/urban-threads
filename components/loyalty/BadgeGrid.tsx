'use client'

import { useUser } from '@/context/UserContext'
import { CheckCircle, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Order } from '@/lib/types'

interface Milestone {
  id: string
  name: string
  description: string
  icon: string
  isAchieved: boolean
  progress: number // 0-100
  current: number
  target: number
  unit: string
}

function buildMilestones(points: number, tierName: string | undefined, orders: Order[]): Milestone[] {
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0) / 100 // cents → dollars
  const orderCount = orders.length
  const hasRedeemed = orders.some((o) => o.pointsRedeemed > 0)

  return [
    {
      id: 'first-purchase',
      name: 'First Purchase',
      description: 'Place your first order',
      icon: '🛍️',
      isAchieved: orderCount >= 1,
      progress: Math.min(orderCount, 1) * 100,
      current: Math.min(orderCount, 1),
      target: 1,
      unit: 'order',
    },
    {
      id: 'points-collector',
      name: 'Points Collector',
      description: 'Earn 100 loyalty points',
      icon: '⭐',
      isAchieved: points >= 100,
      progress: Math.min((points / 100) * 100, 100),
      current: Math.min(points, 100),
      target: 100,
      unit: 'pts',
    },
    {
      id: 'big-spender',
      name: 'Big Spender',
      description: 'Spend $200 total',
      icon: '💎',
      isAchieved: totalSpent >= 200,
      progress: Math.min((totalSpent / 200) * 100, 100),
      current: Math.round(totalSpent),
      target: 200,
      unit: '$',
    },
    {
      id: 'repeat-customer',
      name: 'Repeat Customer',
      description: 'Place 3 orders',
      icon: '🔄',
      isAchieved: orderCount >= 3,
      progress: Math.min((orderCount / 3) * 100, 100),
      current: Math.min(orderCount, 3),
      target: 3,
      unit: 'orders',
    },
    {
      id: 'smart-saver',
      name: 'Smart Saver',
      description: 'Redeem points on an order',
      icon: '🏷️',
      isAchieved: hasRedeemed,
      progress: hasRedeemed ? 100 : 0,
      current: hasRedeemed ? 1 : 0,
      target: 1,
      unit: 'redemption',
    },
    {
      id: 'tier-climber',
      name: 'Tier Climber',
      description: 'Reach Bronze tier',
      icon: '🥉',
      isAchieved: tierName != null && tierName.toLowerCase() !== 'basic',
      progress: tierName && tierName.toLowerCase() !== 'basic' ? 100 : 0,
      current: tierName && tierName.toLowerCase() !== 'basic' ? 1 : 0,
      target: 1,
      unit: 'tier',
    },
  ]
}

export function BadgeGrid() {
  const { user, playerInfo } = useUser()

  if (!user) return null

  // Read orders from localStorage (same source as account page)
  let orders: Order[] = []
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('urban_orders') : null
    if (stored) orders = JSON.parse(stored)
  } catch {
    // ignore
  }

  const milestones = buildMilestones(
    playerInfo.points,
    playerInfo.currentTier,
    orders,
  )

  const achieved = milestones.filter((m) => m.isAchieved).length

  return (
    <div>
      <p className="text-sm text-navy-500 mb-4">
        {achieved} / {milestones.length} achievements unlocked
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={cn(
              'relative rounded-xl border p-4 flex flex-col items-center text-center gap-2 transition-all',
              m.isAchieved
                ? 'border-gold-500 bg-navy-800'
                : 'border-navy-700 bg-navy-900 opacity-60'
            )}
          >
            {m.isAchieved && (
              <CheckCircle
                size={16}
                className="absolute top-2 right-2 text-gold-500 fill-gold-500/20"
              />
            )}

            <div
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center text-2xl',
                m.isAchieved ? 'bg-gold-500/20' : 'bg-navy-700'
              )}
            >
              {m.isAchieved ? m.icon : <Lock size={20} className="text-navy-500" />}
            </div>

            <p className={cn('text-sm font-semibold', m.isAchieved ? 'text-white' : 'text-navy-500')}>
              {m.name}
            </p>
            <p className="text-xs text-navy-500 line-clamp-2">{m.description}</p>

            {/* Progress bar for unachieved */}
            {!m.isAchieved && (
              <div className="w-full mt-1">
                <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-600 rounded-full transition-all"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <p className="text-xs text-navy-500 mt-1">
                  {m.current} / {m.target} {m.unit}
                </p>
              </div>
            )}

            {m.isAchieved && (
              <span className="text-xs font-bold text-gold-500">✓ Earned</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

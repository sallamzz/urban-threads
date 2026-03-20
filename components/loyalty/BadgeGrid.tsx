'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import { Badge } from '@/lib/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { CheckCircle, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BadgeGrid() {
  const { user } = useUser()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.playerId) return

    async function fetchBadges() {
      setLoading(true)
      try {
        const res = await fetch(`/api/gameball/campaigns?customerId=${encodeURIComponent(user!.playerId)}`)
        const data = await res.json()


        // Normalize Gameball campaign/badge response
        // Response may be an array or have a campaigns/badges/data property
        let raw: unknown[]
        if (Array.isArray(data)) {
          raw = data
        } else if (Array.isArray(data?.campaigns)) {
          raw = data.campaigns
        } else if (Array.isArray(data?.badges)) {
          raw = data.badges
        } else if (Array.isArray(data?.data)) {
          raw = data.data
        } else if (Array.isArray(data?.data?.campaigns)) {
          raw = data.data.campaigns
        } else {
          raw = []
        }


        const normalized: Badge[] = raw.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: any, idx: number) => ({
            id: item.id ?? item.campaignId ?? item.rewardsCampaignId ?? String(idx),
            name: item.name ?? item.rewardsCampaignName ?? item.campaignName ?? `Badge ${idx + 1}`,
            description: item.description ?? '',
            imageUrl: item.icon ?? item.imageUrl ?? item.badgeImageUrl ?? undefined,
            // Use || not ?? — false is falsy so ?? stops at false, giving wrong result
            isAchieved: !!(
              item.isAchieved === true ||
              (item.achievedCount != null && item.achievedCount > 0) ||
              (item.completionPercentage != null && item.completionPercentage >= 100)
            ),
            progress: item.completionPercentage ?? item.progress ?? 0,
            currentValue: item.achievedPoints ?? item.currentValue ?? undefined,
            targetValue: item.targetValue ?? item.nextLevelPoints ?? undefined,
          })
        )
        setBadges(normalized)
      } catch {
        setBadges([])
      } finally {
        setLoading(false)
      }
    }

    fetchBadges()
  }, [user?.playerId])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    )
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-12 text-navy-500">
        <Lock size={32} className="mx-auto mb-3 opacity-50" />
        <p>No badges yet. Start shopping to unlock achievements!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={cn(
            'relative rounded-xl border p-4 flex flex-col items-center text-center gap-2 transition-all',
            badge.isAchieved
              ? 'border-gold-500 bg-navy-800'
              : 'border-navy-700 bg-navy-900 opacity-60'
          )}
        >
          {badge.isAchieved && (
            <CheckCircle
              size={16}
              className="absolute top-2 right-2 text-gold-500 fill-gold-500/20"
            />
          )}

          {/* Badge icon / placeholder */}
          {badge.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={badge.imageUrl}
              alt={badge.name}
              className={cn('w-14 h-14 object-contain', !badge.isAchieved && 'grayscale')}
            />
          ) : (
            <div
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center text-2xl',
                badge.isAchieved ? 'bg-gold-500/20' : 'bg-navy-700'
              )}
            >
              {badge.isAchieved ? '🏆' : '🔒'}
            </div>
          )}

          <p className={cn('text-sm font-semibold', badge.isAchieved ? 'text-white' : 'text-navy-500')}>
            {badge.name}
          </p>

          {badge.description && (
            <p className="text-xs text-navy-500 line-clamp-2">{badge.description}</p>
          )}

          {/* Progress bar for unachieved badges */}
          {!badge.isAchieved && badge.progress != null && badge.progress > 0 && (
            <div className="w-full mt-1">
              <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-600 rounded-full transition-all"
                  style={{ width: `${Math.min(badge.progress, 100)}%` }}
                />
              </div>
              {badge.currentValue != null && badge.targetValue != null && (
                <p className="text-xs text-navy-500 mt-1">
                  {badge.currentValue} / {badge.targetValue}
                </p>
              )}
            </div>
          )}

          {badge.isAchieved && (
            <span className="text-xs font-bold text-gold-500">✓ Earned</span>
          )}
        </div>
      ))}
    </div>
  )
}

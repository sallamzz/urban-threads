'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import { CheckCircle, Lock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Shape returned by Gameball GET /customers/{id}/campaigns-progress */
interface CampaignProgress {
  rewardsCampaignName: string
  rewardsCampaignId: number
  isUnlocked: boolean
  completionPercentage: number
  achievedCount: number
  canAchieve: number | null
  highScoreAmount: number | null
  currentStreak: number | null
  highestStreak: number | null
  rewardCampaignConfiguration: {
    id: number
    name: string
    description: string
    isRepeatable: boolean
    icon?: string
  }
  activation: {
    startDate: string | null
    endDate: string | null
  } | null
  rewards: Array<{
    rankReward: string | null
    walletReward: number | null
    walletRewardFactor: number | null
    couponReward: string | null
  }> | null
}

/** Pick a fitting emoji based on the campaign name */
function pickIcon(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('purchase') || n.includes('order') || n.includes('buy')) return '🛍️'
  if (n.includes('point') || n.includes('earn') || n.includes('collect')) return '⭐'
  if (n.includes('spend') || n.includes('big')) return '💎'
  if (n.includes('repeat') || n.includes('loyal') || n.includes('return')) return '🔄'
  if (n.includes('redeem') || n.includes('saver') || n.includes('save')) return '🏷️'
  if (n.includes('tier') || n.includes('rank') || n.includes('level')) return '🥉'
  if (n.includes('streak')) return '🔥'
  if (n.includes('refer') || n.includes('friend')) return '🤝'
  if (n.includes('review') || n.includes('rate')) return '📝'
  if (n.includes('share') || n.includes('social')) return '📱'
  if (n.includes('welcome') || n.includes('signup') || n.includes('register')) return '👋'
  // Default icons cycle through
  const defaults = ['🏆', '🎯', '🌟', '🎖️', '💫', '🏅']
  return defaults[name.length % defaults.length]
}

export function BadgeGrid() {
  const { user } = useUser()
  const [campaigns, setCampaigns] = useState<CampaignProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.playerId) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchCampaigns() {
      try {
        const res = await fetch(
          `/api/gameball/campaigns?customerId=${encodeURIComponent(user!.playerId)}`
        )
        const data = await res.json()

        if (cancelled) return

        if (!res.ok) {
          console.error('[campaigns]', res.status, data)
          setError('Could not load achievements.')
          return
        }

        // The API returns an array directly
        const list: CampaignProgress[] = Array.isArray(data) ? data : data?.campaigns ?? data?.data ?? []
        setCampaigns(list)
      } catch (err) {
        if (!cancelled) {
          console.error('[campaigns fetch]', err)
          setError('Could not load achievements.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCampaigns()
    return () => { cancelled = true }
  }, [user?.playerId])

  if (!user) return null

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-navy-500" size={24} />
        <span className="ml-2 text-sm text-navy-500">Loading achievements…</span>
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-400 py-4">{error}</p>
  }

  if (campaigns.length === 0) {
    return (
      <p className="text-sm text-navy-500 py-4">
        No campaigns configured yet. Achievements will appear here once campaigns are set up in Gameball.
      </p>
    )
  }

  const achieved = campaigns.filter((c) => c.achievedCount > 0).length

  return (
    <div>
      <p className="text-sm text-navy-500 mb-4">
        {achieved} / {campaigns.length} achievements earned
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {campaigns.map((c) => {
          const name = c.rewardCampaignConfiguration?.name || c.rewardsCampaignName
          const description = c.rewardCampaignConfiguration?.description || ''
          const iconUrl = c.rewardCampaignConfiguration?.icon
          const fallbackIcon = pickIcon(name)
          const progress = c.completionPercentage ?? 0
          const isEarned = c.achievedCount > 0

          return (
            <div
              key={c.rewardsCampaignId}
              className={cn(
                'relative rounded-xl border p-4 flex flex-col items-center text-center gap-2 transition-all',
                isEarned
                  ? 'border-gold-500 bg-navy-800'
                  : 'border-navy-700 bg-navy-900 opacity-60'
              )}
            >
              {isEarned && (
                <CheckCircle
                  size={16}
                  className="absolute top-2 right-2 text-gold-500 fill-gold-500/20"
                />
              )}

              <div
                className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center text-2xl overflow-hidden',
                  isEarned ? 'bg-gold-500/20' : 'bg-navy-700'
                )}
              >
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={name}
                    className={cn('w-10 h-10 object-contain', !isEarned && 'opacity-40 grayscale')}
                  />
                ) : isEarned ? (
                  fallbackIcon
                ) : (
                  <Lock size={20} className="text-navy-500" />
                )}
              </div>

              <p className={cn('text-sm font-semibold', isEarned ? 'text-white' : 'text-navy-500')}>
                {name}
              </p>
              {description && (
                <p className="text-xs text-navy-500 line-clamp-2">{description}</p>
              )}

              {/* Progress bar for not-yet-earned */}
              {!isEarned && (
                <div className="w-full mt-1">
                  <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-600 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-navy-500 mt-1">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              )}

              {isEarned && (
                <span className="text-xs font-bold text-gold-500">
                  ✓ Earned{c.achievedCount > 1 ? ` ×${c.achievedCount}` : ''}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

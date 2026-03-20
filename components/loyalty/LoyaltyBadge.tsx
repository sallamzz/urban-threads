'use client'

import { Star } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { formatPoints } from '@/lib/utils'
import Link from 'next/link'

export function LoyaltyBadge() {
  const { playerInfo, isLoadingPlayerInfo } = useUser()

  return (
    <Link
      href="/account"
      className="hidden sm:flex items-center gap-1.5 bg-navy-800 border border-gold-500/30 rounded-full px-3 py-1 hover:border-gold-500 transition-colors animate-badge-pulse"
    >
      <Star size={12} className="text-gold-500 fill-gold-500" />
      {isLoadingPlayerInfo ? (
        <span className="text-xs text-navy-500 w-8">...</span>
      ) : (
        <span className="text-xs font-semibold text-gold-400">
          {formatPoints(playerInfo.points)} pts
        </span>
      )}
    </Link>
  )
}

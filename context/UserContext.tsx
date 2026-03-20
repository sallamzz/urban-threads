'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User, PlayerInfo } from '@/lib/types'

interface UserContextValue {
  user: User | null
  playerInfo: PlayerInfo
  isLoadingPlayerInfo: boolean
  showOnboarding: boolean
  completeOnboarding: (displayName: string, email: string) => Promise<void>
  refreshPlayerInfo: () => Promise<void>
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo>({ points: 0 })
  const [isLoadingPlayerInfo, setIsLoadingPlayerInfo] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [mounted, setMounted] = useState(false)

  const fetchPlayerInfo = useCallback(async (playerId: string) => {
    setIsLoadingPlayerInfo(true)
    try {
      const id = encodeURIComponent(playerId)

      // Fetch points + tier in parallel
      const [pointsRes, tierRes] = await Promise.all([
        fetch(`/api/gameball/points?customerId=${id}`),
        fetch(`/api/gameball/tier?customerId=${id}`),
      ])

      const pointsData = await pointsRes.json().catch(() => ({}))
      const tierData = await tierRes.json().catch(() => ({}))

      const pointsFromBalance =
        pointsData?.availablePointsBalance ??
        pointsData?.totalPointsBalance ??
        pointsData?.pointsBalance ??
        pointsData?.points ??
        0

      const tier = Array.isArray(tierData) ? tierData[0] : tierData
      // tier.progress = total accumulated points (same value Gameball awards per order).
      // Fall back to it when points-balance returns 404/empty (Gameball returns 404
      // instead of { balance: 0 } for customers with no separate coins balance).
      const rawProgress: number = tier?.progress ?? 0
      const points = pointsFromBalance > 0 ? pointsFromBalance : rawProgress

      // Compute tier progress as a 0-100 percentage.
      // Gameball returns raw accumulated spend in `progress` and the threshold in `next.minProgress`.
      const nextMin: number = tier?.next?.minProgress ?? tier?.next?.minPorgress ?? 0
      const tierPercentage = nextMin > 0
        ? Math.min(Math.round((rawProgress / nextMin) * 100), 100)
        : (rawProgress > 0 ? 100 : undefined) // already at max tier if no next
      const remaining = nextMin > 0 ? Math.max(0, Math.round(nextMin - rawProgress)) : undefined

      setPlayerInfo({
        points,
        currentTier: tier?.current?.name ?? tier?.tierName ?? undefined,
        nextTier: tier?.next?.name ?? undefined,
        tierProgress: tier?.completionPercentage ?? tierPercentage,
        pointsToNextTier: remaining,
      })
    } catch {
      // silently fail — show 0 points
    } finally {
      setIsLoadingPlayerInfo(false)
    }
  }, [])

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('urban_user')
      if (stored) {
        const parsed: User = JSON.parse(stored)
        setUser(parsed)
        setShowOnboarding(false)
        fetchPlayerInfo(parsed.playerId)
        if (!parsed.isRegistered) registerWithGameball(parsed)
      } else {
        setShowOnboarding(true)
      }
    } catch {
      setShowOnboarding(true)
    }
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function registerWithGameball(u: User): Promise<boolean> {
    try {
      const res = await fetch('/api/gameball/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: u.playerId,
          customerAttributes: { displayName: u.displayName, email: u.email },
        }),
      })
      if (res.ok) {
        const updated = { ...u, isRegistered: true }
        setUser(updated)
        localStorage.setItem('urban_user', JSON.stringify(updated))
        return true
      }
    } catch { /* ignore */ }
    return false
  }

  const completeOnboarding = useCallback(
    async (displayName: string, email: string) => {
      const playerId = crypto.randomUUID()
      const newUser: User = { playerId, displayName, email, isRegistered: false }

      // Persist immediately so user can shop even if API fails
      setUser(newUser)
      localStorage.setItem('urban_user', JSON.stringify(newUser))
      setShowOnboarding(false)

      const registered = await registerWithGameball(newUser)
      if (registered) {
        // Fire profile_completed only after the customer exists in Gameball
        await fetch('/api/gameball/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: playerId, events: { profile_completed: {} } }),
        })
        await fetchPlayerInfo(playerId)
      }
    },
    [fetchPlayerInfo]
  )

  const refreshPlayerInfo = useCallback(async () => {
    if (user?.playerId) await fetchPlayerInfo(user.playerId)
  }, [user?.playerId, fetchPlayerInfo])

  if (!mounted) {
    return (
      <UserContext.Provider
        value={{
          user: null, playerInfo: { points: 0 }, isLoadingPlayerInfo: false,
          showOnboarding: false, completeOnboarding, refreshPlayerInfo,
        }}
      >
        {children}
      </UserContext.Provider>
    )
  }

  return (
    <UserContext.Provider
      value={{
        user, playerInfo, isLoadingPlayerInfo,
        showOnboarding: showOnboarding || !user,
        completeOnboarding, refreshPlayerInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

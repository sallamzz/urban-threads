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
      const res = await fetch(`/api/gameball/points?customerId=${encodeURIComponent(playerId)}`)
      const data = await res.json()
      const points = data?.points ?? 0

      // Also try to fetch tier info (non-blocking)
      let tierData: Record<string, unknown> = {}
      try {
        const tierRes = await fetch(`/api/gameball/tier?customerId=${encodeURIComponent(playerId)}`)
        tierData = await tierRes.json()
      } catch {
        // ignore
      }

      // Gameball returns { current: {name, minPorgress}, next: {name, minPorgress}, progress }
      // Also handle legacy array format
      const tier = Array.isArray(tierData) ? tierData[0] : tierData
      setPlayerInfo({
        points,
        currentTier: (tier?.current?.name ?? tier?.tierName ?? tier?.currentTierName) as string | undefined,
        nextTier: (tier?.next?.name ?? tier?.nextTierName) as string | undefined,
        tierProgress: (tier?.progress ?? tier?.completionPercentage) as number | undefined,
        pointsToNextTier: (tier?.next?.minPorgress ?? tier?.nextTierProgress) as number | undefined,
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
        // Fetch live points
        fetchPlayerInfo(parsed.playerId)
        // Retry registration if it previously failed
        if (!parsed.isRegistered) {
          registerWithGameball(parsed)
        }
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
          displayName: u.displayName,
          email: u.email,
        }),
      })
      if (res.ok) {
        const updated = { ...u, isRegistered: true }
        setUser(updated)
        localStorage.setItem('urban_user', JSON.stringify(updated))
        return true
      }
    } catch {
      // ignore
    }
    return false
  }

  async function fireProfileCompletedEvent(playerId: string) {
    try {
      await fetch('/api/gameball/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: playerId,
          events: { profile_completed: {} },
        }),
      })
    } catch {
      // non-critical
    }
  }

  const completeOnboarding = useCallback(
    async (displayName: string, email: string) => {
      const playerId = crypto.randomUUID()
      const newUser: User = { playerId, displayName, email, isRegistered: false }

      // Persist immediately so user can shop even if API fails
      setUser(newUser)
      localStorage.setItem('urban_user', JSON.stringify(newUser))
      setShowOnboarding(false)

      // Register with Gameball (non-blocking to UX)
      const registered = await registerWithGameball(newUser)

      if (registered) {
        // Fire profile_completed event only after successful registration
        await fireProfileCompletedEvent(playerId)
        await fetchPlayerInfo(playerId)
      }
    },
    [fetchPlayerInfo]
  )

  const refreshPlayerInfo = useCallback(async () => {
    if (user?.playerId) {
      await fetchPlayerInfo(user.playerId)
    }
  }, [user?.playerId, fetchPlayerInfo])

  if (!mounted) {
    // Prevent hydration mismatch — render children with empty state
    // showOnboarding must be false here to match SSR output
    return (
      <UserContext.Provider
        value={{
          user: null,
          playerInfo: { points: 0 },
          isLoadingPlayerInfo: false,
          showOnboarding: false,
          completeOnboarding,
          refreshPlayerInfo,
        }}
      >
        {children}
      </UserContext.Provider>
    )
  }
  // After mount: if no user exists, showOnboarding must be true regardless
  // of any race condition — derive it directly from user state
  const resolvedShowOnboarding = showOnboarding || (!user)

  return (
    <UserContext.Provider
      value={{
        user,
        playerInfo,
        isLoadingPlayerInfo,
        showOnboarding: resolvedShowOnboarding,
        completeOnboarding,
        refreshPlayerInfo,
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

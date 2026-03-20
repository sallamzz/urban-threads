'use client'

import { useEffect } from 'react'
import { useUser } from '@/context/UserContext'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GbSdk: any
  }
}

/**
 * Gameball Widget — official JS SDK integration.
 *
 * Pattern (from Gameball docs):
 *   1. Define GbSdk queue stub before the script loads
 *   2. Call GbSdk.init() with config (queued)
 *   3. Load the SDK script (processes the queue)
 */
export function GameballWidget() {
  const { user } = useUser()

  useEffect(() => {
    if (!user?.playerId) return
    const apiKey = process.env.NEXT_PUBLIC_GAMEBALL_API_KEY
    if (!apiKey) return

    // 1 — queue stub
    if (!window.GbSdk) {
      window.GbSdk = { q: [] as unknown[][] }
      window.GbSdk.init = (...args: unknown[]) => window.GbSdk.q.push(args)
    }

    // 2 — init call (queued until script loads)
    window.GbSdk.init({
      APIKey: apiKey,
      lang: 'en',
      playerUniqueId: user.playerId,
    })

    // 3 — load the script once
    if (!document.getElementById('gb-sdk')) {
      const s = document.createElement('script')
      s.id = 'gb-sdk'
      s.src = 'https://assets.gameball.co/widget/js/gameball-init.min.js'
      s.defer = true
      document.head.appendChild(s)
    }
  }, [user?.playerId])

  return null
}

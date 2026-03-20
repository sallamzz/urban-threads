'use client'

import { useEffect } from 'react'
import { useUser } from '@/context/UserContext'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GbLoadInit: any
  }
}

/**
 * Gameball Widget — loads the Gameball loyalty widget for the logged-in user.
 *
 * The correct initialization pattern (per Gameball docs) is:
 *   1. Define window.GbLoadInit as a queue stub
 *   2. Call GbLoadInit({ ... }) with config (queued until script loads)
 *   3. Append the script tag (which processes the queue on load)
 */
export function GameballWidget() {
  const { user } = useUser()

  useEffect(() => {
    if (!user?.playerId) return

    const apiKey = process.env.NEXT_PUBLIC_GAMEBALL_API_KEY
    if (!apiKey) return

    // Step 1: Define the GbLoadInit queue stub if not already defined by the SDK
    if (typeof window.GbLoadInit !== 'function') {
      window.GbLoadInit = function (...args: unknown[]) {
        ;(window.GbLoadInit.q = window.GbLoadInit.q || []).push(args)
      }
    }

    // Step 2: Call GbLoadInit with our config
    window.GbLoadInit({
      APIKey: apiKey,
      lang: 'en',
      playerUniqueId: user.playerId,
    })

    // Step 3: Load the script if not already loaded
    if (!document.getElementById('gameball-widget-script')) {
      const script = document.createElement('script')
      script.id = 'gameball-widget-script'
      script.src = 'https://assets.gameball.co/widget/js/gameball-init.min.js'
      script.defer = true
      document.head.appendChild(script)
    }
  }, [user?.playerId])

  return null
}

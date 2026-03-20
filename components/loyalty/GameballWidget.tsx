'use client'

import { useEffect } from 'react'
import { useUser } from '@/context/UserContext'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gbLoadInit: (config: { APIKey: string; lang: string; playerUniqueId?: string; playerAttributes?: Record<string, unknown> }) => void
  }
}

export function GameballWidget() {
  const { user } = useUser()

  useEffect(() => {
    if (!user?.playerId) return

    const apiKey = process.env.NEXT_PUBLIC_GAMEBALL_API_KEY
    if (!apiKey) return

    function initWidget() {
      if (typeof window.gbLoadInit === 'function') {
        window.gbLoadInit({
          APIKey: apiKey!,
          lang: 'en',
          playerUniqueId: user!.playerId,
          playerAttributes: {},
        })
      }
    }

    // If script already loaded, re-init with current user
    if (document.getElementById('gameball-widget-script')) {
      initWidget()
      return
    }

    const script = document.createElement('script')
    script.id = 'gameball-widget-script'
    script.src = 'https://assets.gameball.co/widget/js/gameball-init.min.js'
    script.async = true
    script.onload = initWidget
    document.body.appendChild(script)
    // Do not remove script on unmount — widget persists across navigation
  }, [user?.playerId])

  return null
}

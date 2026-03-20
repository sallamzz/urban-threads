'use client'

import { useEffect } from 'react'
import { useUser } from '@/context/UserContext'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gameball?: { init: (config: Record<string, unknown>) => void }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gbLoadInit?: (config: Record<string, unknown>) => void
  }
}

export function GameballWidget() {
  const { user } = useUser()

  useEffect(() => {
    if (!user?.playerId) return

    const apiKey = process.env.NEXT_PUBLIC_GAMEBALL_API_KEY
    if (!apiKey) return

    function initWidget() {
      console.log('[GameballWidget] window.gameball:', window.gameball, '| window.gbLoadInit:', window.gbLoadInit)
      if (window.gameball) {
        window.gameball.init({
          APIKey: apiKey!,
          playerUniqueId: user!.playerId,
        })
      } else if (typeof window.gbLoadInit === 'function') {
        window.gbLoadInit({
          APIKey: apiKey!,
          lang: 'en',
          playerUniqueId: user!.playerId,
          playerAttributes: {},
        })
      } else {
        console.warn('[GameballWidget] Neither window.gameball nor window.gbLoadInit found after script load')
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
    script.onload = () => {
      console.log('[GameballWidget] script loaded — window keys with "gameball":', Object.keys(window).filter(k => k.toLowerCase().includes('gameball')))
      initWidget()
    }
    document.body.appendChild(script)
    // Do not remove script on unmount — widget persists across navigation
  }, [user?.playerId])

  return null
}

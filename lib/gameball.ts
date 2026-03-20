// Server-side only — never import this in Client Components
import {
  GameballRegisterPayload,
  GameballEventPayload,
  GameballHoldPayload,
  GameballOrderPayload,
} from './types'

const BASE = process.env.GAMEBALL_BASE_URL!
const API_KEY = process.env.GAMEBALL_API_KEY || process.env.NEXT_PUBLIC_GAMEBALL_API_KEY!
const SECRET_KEY = process.env.GAMEBALL_SECRET_KEY!

// Log on module init so key issues surface immediately in the server console
console.log(
  `[gameball] BASE=${BASE} | APIKey=${API_KEY ? API_KEY.slice(0, 8) + '...' : 'MISSING'} | SecretKey=${SECRET_KEY ? SECRET_KEY.slice(0, 8) + '...' : 'MISSING'}`
)

const baseHeaders = {
  'Content-Type': 'application/json',
  APIKey: API_KEY,
}

const secureHeaders = {
  ...baseHeaders,
  SecretKey: SECRET_KEY,
}

export async function registerCustomer(payload: GameballRegisterPayload) {
  const res = await fetch(`${BASE}/integrations/customers`, {
    method: 'POST',
    headers: secureHeaders,
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball register failed (${res.status}): ${text}`)
  }
  return res.json().catch(() => ({}))
}

export async function getCustomer(customerId: string) {
  const res = await fetch(`${BASE}/integrations/customers/${encodeURIComponent(customerId)}`, {
    headers: secureHeaders,
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Gameball getCustomer failed (${res.status})`)
  return res.json()
}

export async function getPointsBalance(customerId: string) {
  const res = await fetch(
    `${BASE}/integrations/customers/${encodeURIComponent(customerId)}/points-balance`,
    { headers: secureHeaders, cache: 'no-store' }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball getPointsBalance failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function getTierProgress(customerId: string) {
  const res = await fetch(
    `${BASE}/integrations/customers/${encodeURIComponent(customerId)}/tier-progress`,
    { headers: secureHeaders, cache: 'no-store' }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball getTierProgress failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function getCampaigns(customerId: string) {
  const res = await fetch(
    `${BASE}/integrations/customers/${encodeURIComponent(customerId)}/campaigns`,
    { headers: secureHeaders, cache: 'no-store' }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball getCampaigns failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function trackEvent(payload: GameballEventPayload) {
  const res = await fetch(`${BASE}/integrations/events`, {
    method: 'POST',
    headers: secureHeaders,
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball trackEvent failed (${res.status}): ${text}`)
  }
  return res.json().catch(() => ({}))
}

export async function createHold(payload: GameballHoldPayload) {
  const res = await fetch(`${BASE}/integrations/transactions/hold`, {
    method: 'POST',
    headers: secureHeaders,
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball createHold failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function deleteHold(holdRefId: string) {
  const res = await fetch(
    `${BASE}/integrations/transactions/hold/${encodeURIComponent(holdRefId)}`,
    { method: 'DELETE', headers: secureHeaders }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball deleteHold failed (${res.status}): ${text}`)
  }
  return res.json().catch(() => ({}))
}

export async function submitOrder(payload: GameballOrderPayload) {
  const res = await fetch(`${BASE}/integrations/orders`, {
    method: 'POST',
    headers: secureHeaders,
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball submitOrder failed (${res.status}): ${text}`)
  }
  return res.json().catch(() => ({}))
}

// Server-side only — never import this in Client Components
import {
  GameballRegisterPayload,
  GameballEventPayload,
  GameballHoldPayload,
  GameballOrderPayload,
} from './types'

const BASE = process.env.GAMEBALL_BASE_URL || ''
const API_KEY = process.env.GAMEBALL_API_KEY || process.env.NEXT_PUBLIC_GAMEBALL_API_KEY || ''
const SECRET_KEY = process.env.GAMEBALL_SECRET_KEY || ''

function assertConfigured() {
  if (!BASE) throw new Error('GAMEBALL_BASE_URL is not configured')
  if (!API_KEY) throw new Error('GAMEBALL_API_KEY is not configured')
  if (!SECRET_KEY) throw new Error('GAMEBALL_SECRET_KEY is not configured')
}

const baseHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  APIKey: API_KEY,
})

const secureHeaders = (): Record<string, string> => ({
  ...baseHeaders(),
  SecretKey: SECRET_KEY,
})

export async function registerCustomer(payload: GameballRegisterPayload) {
  assertConfigured()
  const res = await fetch(`${BASE}/integrations/customers`, {
    method: 'POST',
    headers: secureHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball register failed (${res.status}): ${text}`)
  }
  return res.json().catch(() => ({}))
}

export async function getCustomer(customerId: string) {
  assertConfigured()
  const res = await fetch(`${BASE}/integrations/customers/${encodeURIComponent(customerId)}`, {
    headers: secureHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Gameball getCustomer failed (${res.status})`)
  return res.json()
}

export async function getPointsBalance(customerId: string) {
  assertConfigured()
  const res = await fetch(
    `${BASE}/integrations/customers/${encodeURIComponent(customerId)}/points-balance`,
    { headers: secureHeaders(), cache: 'no-store' }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball getPointsBalance failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function getTierProgress(customerId: string) {
  assertConfigured()
  const res = await fetch(
    `${BASE}/integrations/customers/${encodeURIComponent(customerId)}/tier-progress`,
    { headers: secureHeaders(), cache: 'no-store' }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball getTierProgress failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function getCampaigns(customerId: string) {
  assertConfigured()
  const res = await fetch(
    `${BASE}/integrations/customers/${encodeURIComponent(customerId)}/campaigns`,
    { headers: secureHeaders(), cache: 'no-store' }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball getCampaigns failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function trackEvent(payload: GameballEventPayload) {
  assertConfigured()
  const res = await fetch(`${BASE}/integrations/events`, {
    method: 'POST',
    headers: secureHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball trackEvent failed (${res.status}): ${text}`)
  }
  return res.json().catch(() => ({}))
}

export async function createHold(payload: GameballHoldPayload) {
  assertConfigured()
  const res = await fetch(`${BASE}/integrations/transactions/hold`, {
    method: 'POST',
    headers: secureHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball createHold failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function deleteHold(holdRefId: string) {
  assertConfigured()
  const res = await fetch(
    `${BASE}/integrations/transactions/hold/${encodeURIComponent(holdRefId)}`,
    { method: 'DELETE', headers: secureHeaders() }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball deleteHold failed (${res.status}): ${text}`)
  }
  return res.json().catch(() => ({}))
}

export async function submitOrder(payload: GameballOrderPayload) {
  assertConfigured()
  const res = await fetch(`${BASE}/integrations/orders`, {
    method: 'POST',
    headers: secureHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gameball submitOrder failed (${res.status}): ${text}`)
  }
  return res.json().catch(() => ({}))
}

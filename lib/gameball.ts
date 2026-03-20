/**
 * Server-side Gameball API helpers.
 *
 * Two auth levels (per Gameball docs):
 *   gbGet  — APIKey only (read endpoints: points, tier, campaigns)
 *   gbPost — APIKey + SecretKey (write: register, events, orders, hold)
 *   gbDel  — APIKey + SecretKey (delete: release hold)
 */

const BASE = process.env.GAMEBALL_BASE_URL || ''
const API_KEY = process.env.GAMEBALL_API_KEY || process.env.NEXT_PUBLIC_GAMEBALL_API_KEY || ''
const SECRET = process.env.GAMEBALL_SECRET_KEY || ''

const readHeaders: Record<string, string> = {
  APIKey: API_KEY,
}

const writeHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  APIKey: API_KEY,
  SecretKey: SECRET,
}

export function gbGet(path: string) {
  return fetch(`${BASE}/integrations/${path}`, {
    headers: readHeaders,
    cache: 'no-store',
  })
}

export function gbPost(path: string, body: unknown) {
  return fetch(`${BASE}/integrations/${path}`, {
    method: 'POST',
    headers: writeHeaders,
    body: JSON.stringify(body),
  })
}

export function gbDel(path: string) {
  return fetch(`${BASE}/integrations/${path}`, {
    method: 'DELETE',
    headers: writeHeaders,
  })
}

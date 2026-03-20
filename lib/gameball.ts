/**
 * Server-side Gameball API helpers.
 *
 * Two auth levels (per Gameball docs):
 *   gbGet  — APIKey only (read endpoints: points, tier, campaigns)
 *   gbPost — APIKey + SecretKey (write: register, events, orders, hold)
 *   gbDel  — APIKey + SecretKey (delete: release hold)
 */

function getBase() {
  return process.env.GAMEBALL_BASE_URL || ''
}

function getHeaders(includeContentType = false): Record<string, string> {
  const apiKey = process.env.GAMEBALL_API_KEY || process.env.NEXT_PUBLIC_GAMEBALL_API_KEY || ''
  const secret = process.env.GAMEBALL_SECRET_KEY || ''
  return {
    ...(includeContentType ? { 'Content-Type': 'application/json' } : {}),
    APIKey: apiKey,
    SecretKey: secret,
  }
}

export function gbGet(path: string) {
  return fetch(`${getBase()}/integrations/${path}`, {
    headers: getHeaders(),
    cache: 'no-store',
  })
}

export function gbPost(path: string, body: unknown) {
  return fetch(`${getBase()}/integrations/${path}`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(body),
  })
}

export function gbDel(path: string) {
  return fetch(`${getBase()}/integrations/${path}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
}

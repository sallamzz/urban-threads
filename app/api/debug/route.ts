export const runtime = 'edge'

import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.GAMEBALL_API_KEY || ''
  const secret = process.env.GAMEBALL_SECRET_KEY || ''
  const base = process.env.GAMEBALL_BASE_URL || ''

  const customerId = 'f14dadf9-ab0f-4321-9ab4-8b269702e41b'

  try {
    const res = await fetch(`${base}/integrations/customers/${customerId}/tier-progress`, {
      headers: { APIKey: apiKey, SecretKey: secret },
      cache: 'no-store',
    })
    const text = await res.text()
    return NextResponse.json({ status: res.status, body: text, apiKeyPrefix: apiKey.slice(0, 6) })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}

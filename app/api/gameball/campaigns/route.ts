export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { gbGet } from '@/lib/gameball'

/**
 * GET /api/gameball/campaigns?customerId=...
 * → Gameball GET /integrations/customers/{customerId}/campaigns-progress
 *
 * Returns the customer's progress across all reward campaigns (badges / challenges).
 */
export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get('customerId')
  if (!customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
  }

  try {
    const res = await gbGet(`customers/${encodeURIComponent(customerId)}/reward-campaigns-progress`)

    // Gameball may return empty body (204, or error with no JSON)
    const text = await res.text()
    console.log('[campaigns] Gameball status:', res.status, 'body:', text.slice(0, 500))

    if (!text) {
      // Empty response — treat as empty campaigns list
      return NextResponse.json([], { status: 200 })
    }

    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error('[campaigns] Non-JSON response:', text.slice(0, 200))
      return NextResponse.json({ error: 'Invalid response from Gameball', detail: text.slice(0, 200) }, { status: 502 })
    }

    if (!res.ok) {
      console.error('[campaigns] Gameball error:', res.status, data)
      return NextResponse.json({ error: 'Gameball API error', detail: data }, { status: res.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[campaigns]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { gbGet } from '@/lib/gameball'

/** GET /api/gameball/points?customerId=... → Gameball GET /integrations/customers/{id}/points-balance */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('customerId')
  if (!id) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
  }
  try {
    const res = await gbGet(`customers/${encodeURIComponent(id)}/points-balance`)
    const text = await res.text()
    if (!text || !text.trim()) {
      // Gameball returns 404 + empty body when no coins balance exists yet
      return NextResponse.json({ availablePointsBalance: 0 })
    }
    const data = JSON.parse(text)
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[points]', msg)
    return NextResponse.json({ availablePointsBalance: 0 })
  }
}

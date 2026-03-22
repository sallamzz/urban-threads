export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { gbGet } from '@/lib/gameball'

/** GET /api/gameball/points?customerId=... → Gameball GET /integrations/customers/{id}/balance */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('customerId')
  if (!id) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
  }
  try {
    const res = await gbGet(`customers/${encodeURIComponent(id)}/balance`)
    const text = await res.text()
    console.log('[points] Gameball status:', res.status, 'body:', text.slice(0, 500))

    if (!text || !text.trim()) {
      return NextResponse.json({ availablePointsBalance: 0, totalPointsBalance: 0 })
    }

    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error('[points] Non-JSON response:', text.slice(0, 200))
      return NextResponse.json({ availablePointsBalance: 0, totalPointsBalance: 0 })
    }

    if (!res.ok) {
      console.error('[points] Gameball error:', res.status, data)
      return NextResponse.json({ availablePointsBalance: 0, totalPointsBalance: 0 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[points]', msg)
    return NextResponse.json({ availablePointsBalance: 0, totalPointsBalance: 0 })
  }
}

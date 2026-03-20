export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { gbGet } from '@/lib/gameball'

/** GET /api/gameball/tier?customerId=... → Gameball GET /integrations/customers/{id}/tier-progress */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('customerId')
  if (!id) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
  }
  try {
    const res = await gbGet(`customers/${encodeURIComponent(id)}/tier-progress`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[tier]', msg)
    return NextResponse.json({ current: null, next: null, progress: 0 })
  }
}

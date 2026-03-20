export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { gbGet } from '@/lib/gameball'

/** GET /api/gameball/campaigns?customerId=... → Gameball GET /integrations/customers/{id}/campaigns */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('customerId')
  if (!id) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
  }
  try {
    const res = await gbGet(`customers/${encodeURIComponent(id)}/campaigns`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[campaigns]', msg)
    return NextResponse.json({ campaigns: [], badges: [] })
  }
}

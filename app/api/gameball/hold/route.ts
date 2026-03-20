export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { gbPost, gbDel } from '@/lib/gameball'

/** POST /api/gameball/hold → Gameball POST /integrations/transactions/hold */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.customerId || !body.pointsToHold) {
      return NextResponse.json({ error: 'Missing customerId or pointsToHold' }, { status: 400 })
    }
    const res = await gbPost('transactions/hold', body)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[hold POST]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/** DELETE /api/gameball/hold?ref=... → Gameball DELETE /integrations/transactions/hold/{ref} */
export async function DELETE(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')
  if (!ref) {
    return NextResponse.json({ error: 'Missing ref' }, { status: 400 })
  }
  try {
    const res = await gbDel(`transactions/hold/${encodeURIComponent(ref)}`)
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[hold DELETE]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

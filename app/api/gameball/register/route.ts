export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { gbPost } from '@/lib/gameball'

/** POST /api/gameball/register → Gameball POST /integrations/customers */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
    }
    const res = await gbPost('customers', body)
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[register]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

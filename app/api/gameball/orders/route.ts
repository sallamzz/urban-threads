export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { gbPost } from '@/lib/gameball'

/** POST /api/gameball/orders → Gameball POST /integrations/orders */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.customerId || !body.orderId || body.totalPaid == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const res = await gbPost('orders', body)
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[orders]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { gbPost } from '@/lib/gameball'

/**
 * POST /api/gameball/redeem → Gameball POST /integrations/transactions/redeem
 *
 * Direct‑debit redemption (no prior hold required).
 * Accepts either `points` or `holdReference` to redeem.
 *
 * Body:
 *   customerId      (string, required)
 *   transactionId   (string, required) — your order / invoice ID
 *   transactionTime (string, optional) — ISO datetime; defaults to now
 *   points          (number)           — number of points to redeem directly
 *   holdReference   (string)           — if redeeming from a prior hold
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.customerId) {
      return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
    }
    if (!body.transactionId) {
      return NextResponse.json({ error: 'Missing transactionId' }, { status: 400 })
    }
    if (!body.points && !body.holdReference) {
      return NextResponse.json(
        { error: 'Provide either points or holdReference' },
        { status: 400 }
      )
    }

    const payload: Record<string, unknown> = {
      customerId: body.customerId,
      transactionId: body.transactionId,
      transactionTime: body.transactionTime || new Date().toISOString(),
      ignoreOTP: true,
    }

    // Only one of points / holdReference should be provided
    if (body.holdReference) {
      payload.holdReference = body.holdReference
    } else {
      payload.points = body.points
    }

    const res = await gbPost('transactions/redeem', payload)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[redeem POST]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

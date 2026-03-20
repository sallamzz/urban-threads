export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { createHold, deleteHold } from '@/lib/gameball'

export async function POST(req: NextRequest) {
  try {
    const { customerId, points } = await req.json()
    if (!customerId || !points) {
      return NextResponse.json({ error: 'Missing customerId or points' }, { status: 400 })
    }
    const result = await createHold({
      customerId,
      pointsToHold: points,
      transactionTime: new Date().toISOString(),
    })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/gameball/hold POST]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const holdRefId = req.nextUrl.searchParams.get('holdRefId')
  if (!holdRefId) {
    return NextResponse.json({ error: 'Missing holdRefId' }, { status: 400 })
  }
  try {
    const result = await deleteHold(holdRefId)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/gameball/hold DELETE]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

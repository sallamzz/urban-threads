export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/gameball'

export async function POST(req: NextRequest) {
  try {
    const { customerId, events } = await req.json()
    if (!customerId || !events) {
      return NextResponse.json({ error: 'Missing customerId or events' }, { status: 400 })
    }
    const result = await trackEvent({ customerId, events })
    return NextResponse.json({ ...result, tracked: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/gameball/events]', message)
    return NextResponse.json({ error: message, tracked: false }, { status: 502 })
  }
}

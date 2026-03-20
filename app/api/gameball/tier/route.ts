export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getTierProgress } from '@/lib/gameball'

export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get('customerId')
  if (!customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
  }
  try {
    const data = await getTierProgress(customerId)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/gameball/tier]', message)
    return NextResponse.json({ currentTier: null, nextTier: null, progress: 0 })
  }
}

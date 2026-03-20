import { NextRequest, NextResponse } from 'next/server'
import { getPointsBalance } from '@/lib/gameball'

export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get('customerId')
  if (!customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
  }
  try {
    const data = await getPointsBalance(customerId)
    // Normalize: Gameball v4 returns totalPointsBalance or availablePointsBalance
    const points =
      data?.availablePointsBalance ??
      data?.totalPointsBalance ??
      data?.pointsBalance ??
      data?.balance ??
      data?.points ??
      0
    return NextResponse.json({ points, raw: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/gameball/points]', message)
    // Return 0 points rather than crashing the UI — points display is non-critical
    return NextResponse.json({ points: 0 })
  }
}

export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getCampaigns } from '@/lib/gameball'

export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get('customerId')
  if (!customerId) {
    return NextResponse.json({ error: 'Missing customerId' }, { status: 400 })
  }
  try {
    const data = await getCampaigns(customerId)
    console.log('[/api/gameball/campaigns] raw response keys:', JSON.stringify(Object.keys(data ?? {})))
    console.log('[/api/gameball/campaigns] raw response:', JSON.stringify(data).slice(0, 500))
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/gameball/campaigns]', message)
    return NextResponse.json({ campaigns: [], badges: [] })
  }
}

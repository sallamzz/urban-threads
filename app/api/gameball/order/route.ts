import { NextRequest, NextResponse } from 'next/server'
import { submitOrder } from '@/lib/gameball'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerId, orderId, totalPaid, orderDate, channel, lineItems, redemption } = body
    if (!customerId || !orderId || totalPaid == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const payload = {
      customerId,
      orderId,
      totalPaid,
      orderDate: orderDate ?? new Date().toISOString(),
      channel: channel ?? 'web',
      ...(lineItems?.length ? { lineItems } : {}),
      ...(redemption ? { redemption } : {}),
    }
    console.log('[/api/gameball/order] submitting:', JSON.stringify(payload))
    const result = await submitOrder(payload)
    console.log('[/api/gameball/order] response:', JSON.stringify(result))
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/gameball/order]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

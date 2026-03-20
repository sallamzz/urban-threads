import { NextRequest, NextResponse } from 'next/server'
import { registerCustomer } from '@/lib/gameball'

export async function POST(req: NextRequest) {
  try {
    const { customerId, displayName, email } = await req.json()
    if (!customerId || !displayName || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const result = await registerCustomer({
      customerId,
      customerAttributes: { displayName, email },
    })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/gameball/register]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

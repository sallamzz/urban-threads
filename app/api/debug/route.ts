export const runtime = 'edge'

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasApiKey: !!process.env.GAMEBALL_API_KEY,
    hasSecret: !!process.env.GAMEBALL_SECRET_KEY,
    hasBase: !!process.env.GAMEBALL_BASE_URL,
    base: process.env.GAMEBALL_BASE_URL,
    apiKeyPrefix: process.env.GAMEBALL_API_KEY?.slice(0, 6) ?? 'empty',
  })
}

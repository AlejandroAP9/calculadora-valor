import { NextResponse } from 'next/server'
import { CALCULATOR_RATE_LIMIT, clientIp, rateLimit } from '@/lib/rateLimit'
import { CalculatorInputsSchema } from '@/features/calculator/schemas/inputs.schema'
import { MISSING_API_KEY_MESSAGE, extractApiKey } from '@/features/calculator/services/apiKey'
import { estimateValues } from '@/features/calculator/services/estimateValues'

export const runtime = 'nodejs'
export const maxDuration = 60

/** POST { inputs: CalculatorInputs, apiKey: string } → { estimates, usedFallback } */
export async function POST(req: Request) {
  const limit = rateLimit(
    `estimate:${clientIp(req)}`,
    CALCULATOR_RATE_LIMIT.limit,
    CALCULATOR_RATE_LIMIT.windowMs,
  )
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Espera un momento y reintenta.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const apiKey = extractApiKey(body)
  if (!apiKey) {
    return NextResponse.json({ error: MISSING_API_KEY_MESSAGE }, { status: 400 })
  }

  const parsed = CalculatorInputsSchema.safeParse((body as { inputs?: unknown })?.inputs)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Inputs inválidos', issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const result = await estimateValues(parsed.data, apiKey)
  return NextResponse.json(result)
}

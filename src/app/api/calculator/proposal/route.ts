import { NextResponse } from 'next/server'
import { FX } from '@/lib/config/currency'
import { CALCULATOR_RATE_LIMIT, clientIp, rateLimit } from '@/lib/rateLimit'
import { ValueEstimatesSchema } from '@/features/calculator/schemas/estimates.schema'
import { CalculatorInputsSchema } from '@/features/calculator/schemas/inputs.schema'
import { MISSING_API_KEY_MESSAGE, extractApiKey } from '@/features/calculator/services/apiKey'
import { generateProposal } from '@/features/calculator/services/generateProposal'
import { computePricing } from '@/features/calculator/services/pricing/pricingEngine'

export const runtime = 'nodejs'
export const maxDuration = 60

/**
 * POST { inputs, estimates } → { pricing, proposal, proposalError }
 * El motor calcula el precio SIEMPRE; si la prosa de la IA falla, devolvemos el
 * pricing igual y un flag de error para que la UI ofrezca reintentar.
 */
export async function POST(req: Request) {
  const limit = rateLimit(
    `proposal:${clientIp(req)}`,
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

  const { inputs, estimates } = (body ?? {}) as { inputs?: unknown; estimates?: unknown }
  const parsedInputs = CalculatorInputsSchema.safeParse(inputs)
  const parsedEstimates = ValueEstimatesSchema.safeParse(estimates)

  if (!parsedInputs.success || !parsedEstimates.success) {
    return NextResponse.json(
      {
        error: 'Datos inválidos',
        issues: [
          ...(parsedInputs.success ? [] : parsedInputs.error.issues),
          ...(parsedEstimates.success ? [] : parsedEstimates.error.issues),
        ],
      },
      { status: 400 },
    )
  }

  // El motor determinista nunca falla: precio reproducible y defendible.
  const pricing = computePricing(parsedInputs.data, parsedEstimates.data, FX)

  try {
    const proposal = await generateProposal(parsedInputs.data, pricing, apiKey)
    return NextResponse.json({ pricing, proposal, proposalError: false })
  } catch (error) {
    console.error('[proposal] generateProposal falló:', error)
    return NextResponse.json({ pricing, proposal: null, proposalError: true })
  }
}

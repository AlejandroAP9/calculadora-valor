'use client'

import type { PriceTier, PricingResult, Proposal } from '@/features/calculator/types'
import { formatEur, formatUsd } from '@/features/calculator/format'

const TIER_TITLE: Record<PriceTier['label'], string> = {
  minimo: 'Mínimo',
  recomendado: 'Recomendado',
  premium: 'Premium',
}

const TIER_SUB: Record<PriceTier['label'], string> = {
  minimo: 'Cubre tu tiempo y costos. No mueras en el intento.',
  recomendado: 'Basado en el valor real. Defendible y justo.',
  premium: 'Para clientes con ROI muy claro.',
}

function TierCard({
  tier,
  pitch,
  modality,
  featured,
}: {
  tier: PriceTier
  pitch?: string
  modality: PricingResult['saleModality']
  featured: boolean
}) {
  const isOneTime = modality === 'one_time'
  const headline = isOneTime ? tier.setup : tier.monthly
  const secondary = isOneTime ? tier.monthly : tier.setup
  const secondaryLabel = isOneTime ? 'mensual sugerido' : 'setup inicial'
  const suffix = isOneTime ? '' : '/mes'

  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 ${
        featured ? 'border-teal-600 bg-white shadow-lg ring-1 ring-teal-600' : 'border-zinc-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-900">
          {TIER_TITLE[tier.label]}
        </h3>
        {featured && (
          <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-xs font-semibold text-white">
            Sugerido
          </span>
        )}
      </div>
      <p className="mt-1 min-h-[2.5rem] text-xs text-zinc-500">{TIER_SUB[tier.label]}</p>

      <div className="mt-4">
        <div className="text-3xl font-bold text-zinc-900">
          {formatUsd(headline.usd)}
          <span className="text-base font-medium text-zinc-400">{suffix}</span>
        </div>
        <div className="text-sm text-zinc-500">
          {formatEur(headline.eur)}
          {suffix}
        </div>
      </div>

      <div className="mt-3 text-xs text-zinc-400">
        {secondaryLabel}: {formatUsd(secondary.usd)} · {formatEur(secondary.eur)}
      </div>

      {pitch && <p className="mt-4 border-t border-zinc-100 pt-4 text-sm text-zinc-600">{pitch}</p>}
    </div>
  )
}

export function PriceTiers({ result, proposal }: { result: PricingResult; proposal: Proposal | null }) {
  const pitchByLabel = new Map(proposal?.tiers.map((t) => [t.label, t.pitch]) ?? [])

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {result.tiers.map((tier) => (
          <TierCard
            key={tier.label}
            tier={tier}
            pitch={pitchByLabel.get(tier.label)}
            modality={result.saleModality}
            featured={tier.label === 'recomendado'}
          />
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600">
        <p className="font-semibold text-zinc-800">Por qué este precio</p>
        <p className="mt-1">{result.multiplierRationale}</p>
        <p className="mt-2 text-xs text-zinc-400">
          Valor generado al cliente: {formatUsd(result.monthlyValue.totalMonthlyValueUsd)}/mes ·
          Costo de operación: {formatUsd(result.monthlyCost.totalMonthlyCostUsd)}/mes · Tipo de
          cambio: 1 USD = {result.fxRate} EUR
        </p>
      </div>
    </div>
  )
}

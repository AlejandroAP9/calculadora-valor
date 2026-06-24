'use client'

import { usePricing } from '@/features/calculator/hooks/usePricing'
import { useCalculatorStore } from '@/features/calculator/store/useCalculatorStore'
import type { ValueEstimates } from '@/features/calculator/types'
import { formatUsd } from '@/features/calculator/format'
import { Button } from './ui'

type FieldKey = Extract<
  keyof ValueEstimates,
  | 'nicheHourlyRateUsd'
  | 'hoursSavedPerMonth'
  | 'revenueEnabledPerMonthUsd'
  | 'monthlyApiCostUsd'
  | 'monthlyInfraCostUsd'
  | 'estimatedMaintenanceHoursPerMonth'
  | 'builderHourlyRateUsd'
>

const VALUE_FIELDS: { key: FieldKey; label: string; suffix: string }[] = [
  { key: 'nicheHourlyRateUsd', label: 'Tarifa de mercado del nicho', suffix: 'USD/hora' },
  { key: 'hoursSavedPerMonth', label: 'Horas ahorradas al cliente', suffix: 'horas/mes' },
  { key: 'revenueEnabledPerMonthUsd', label: 'Ingresos habilitados o pérdidas evitadas', suffix: 'USD/mes' },
]

const COST_FIELDS: { key: FieldKey; label: string; suffix: string }[] = [
  { key: 'monthlyApiCostUsd', label: 'Costo de APIs (tokens)', suffix: 'USD/mes' },
  { key: 'monthlyInfraCostUsd', label: 'Costo de infraestructura (VPS, hosting)', suffix: 'USD/mes' },
  { key: 'estimatedMaintenanceHoursPerMonth', label: 'Horas de mantenimiento', suffix: 'horas/mes' },
  { key: 'builderHourlyRateUsd', label: 'Tu tarifa por hora', suffix: 'USD/hora' },
]

function NumberRow({ label, suffix, value, onChange }: {
  label: string
  suffix: string
  value: number
  onChange: (n: number) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-zinc-600">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 rounded-md border border-zinc-300 px-2.5 py-1.5 text-right text-sm font-medium text-zinc-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
        <span className="w-20 text-xs text-zinc-400">{suffix}</span>
      </span>
    </label>
  )
}

export function EstimatesReview() {
  const estimates = useCalculatorStore((s) => s.estimates)
  const usedFallback = useCalculatorStore((s) => s.usedFallback)
  const patchEstimate = useCalculatorStore((s) => s.patchEstimate)
  const setPhase = useCalculatorStore((s) => s.setPhase)
  const { runProposal, previewPricing } = usePricing()

  if (!estimates) return null

  const recommended = previewPricing?.tiers[1]

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-600">Revisa los números</p>
        <h2 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">
          Ajusta lo que conozcas mejor
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Estos son nuestros estimados de mercado. Corrige cualquier valor: el precio se recalcula
          al instante.
        </p>

        {usedFallback && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            La IA no estimó (falta tu OpenRouter API key o falló). Usamos tablas de referencia
            LATAM/España. Ajusta los valores antes de continuar.
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-zinc-900">Valor para el cliente</h3>
          <div className="mt-1 divide-y divide-zinc-100">
            {VALUE_FIELDS.map((f) => (
              <NumberRow
                key={f.key}
                label={f.label}
                suffix={f.suffix}
                value={estimates[f.key]}
                onChange={(n) => patchEstimate(f.key, n)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-zinc-900">Tus costos</h3>
          <div className="mt-1 divide-y divide-zinc-100">
            {COST_FIELDS.map((f) => (
              <NumberRow
                key={f.key}
                label={f.label}
                suffix={f.suffix}
                value={estimates[f.key]}
                onChange={(n) => patchEstimate(f.key, n)}
              />
            ))}
          </div>
        </div>

        {estimates.assumptions.length > 0 && (
          <details className="mt-6 rounded-lg bg-zinc-50 px-4 py-3 text-sm">
            <summary className="cursor-pointer font-medium text-zinc-700">
              Supuestos de la estimación
            </summary>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-500">
              {estimates.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </details>
        )}

        {recommended && (
          <div className="mt-6 flex items-center justify-between rounded-xl bg-teal-50 px-5 py-4">
            <span className="text-sm font-medium text-teal-900">Precio recomendado (preview)</span>
            <span className="text-right">
              <span className="block text-xl font-bold text-teal-700">
                {formatUsd(
                  previewPricing.saleModality === 'one_time'
                    ? recommended.setup.usd
                    : recommended.monthly.usd,
                )}
                {previewPricing.saleModality !== 'one_time' && (
                  <span className="text-sm font-medium text-teal-600">/mes</span>
                )}
              </span>
            </span>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setPhase('intake')}>
            ← Volver al wizard
          </Button>
          <Button onClick={() => runProposal()}>Generar propuesta →</Button>
        </div>
      </div>
    </div>
  )
}

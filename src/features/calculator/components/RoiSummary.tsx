'use client'

import type { PricingResult, Proposal } from '@/features/calculator/types'
import { formatEur, formatUsd } from '@/features/calculator/format'

/**
 * Resumen de ROI de una página. Es el objetivo de impresión / PDF: lleva la clase
 * `print-area` y todo lo demás de la app va marcado `no-print`.
 */
export function RoiSummary({
  roi,
  result,
}: {
  roi: Proposal['roiSummary']
  result: PricingResult
}) {
  const recommended = result.tiers[1]
  const isOneTime = result.saleModality === 'one_time'
  const headline = isOneTime ? recommended.setup : recommended.monthly
  const priceSuffix = isOneTime ? '' : '/mes'

  return (
    <div className="print-area rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10">
      <div className="border-b border-zinc-200 pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
          Resumen de retorno de inversión
        </p>
        <h2 className="mt-2 text-2xl font-bold text-zinc-900">{roi.headline}</h2>
      </div>

      <ul className="mt-6 space-y-3">
        {roi.bullets.map((b, i) => (
          <li key={i} className="flex gap-3 text-zinc-700">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-zinc-50 p-5 text-sm">
        <div>
          <p className="text-zinc-500">Valor generado al mes</p>
          <p className="text-lg font-bold text-zinc-900">
            {formatUsd(result.monthlyValue.totalMonthlyValueUsd)}
          </p>
        </div>
        <div>
          <p className="text-zinc-500">Inversión recomendada</p>
          <p className="text-lg font-bold text-teal-700">
            {formatUsd(headline.usd)}
            {priceSuffix} · {formatEur(headline.eur)}
            {priceSuffix}
          </p>
        </div>
      </div>

      <p className="mt-6 text-zinc-700">{roi.closingLine}</p>

      <p className="mt-8 border-t border-zinc-100 pt-4 text-xs text-zinc-400">
        Cifras en USD y EUR (1 USD = {result.fxRate} EUR). Estimación basada en el valor de mercado
        del nicho y los costos de operación reales.
      </p>
    </div>
  )
}

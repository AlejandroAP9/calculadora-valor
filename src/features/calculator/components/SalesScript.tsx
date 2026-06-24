'use client'

import type { Proposal } from '@/features/calculator/types'
import { CopyButton } from './ui'

function scriptToText(s: Proposal['salesScript']): string {
  const objections = s.objectionHandling
    .map((o) => `• ${o.objection}\n  → ${o.response}`)
    .join('\n')
  return [
    'APERTURA',
    s.opening,
    '',
    'ENMARCAR EL VALOR',
    s.valueFraming,
    '',
    'PRESENTAR EL PRECIO',
    s.priceReveal,
    '',
    'OBJECIONES',
    objections,
  ].join('\n')
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wide text-teal-600">{title}</h4>
      <div className="mt-1.5 text-zinc-700">{children}</div>
    </div>
  )
}

export function SalesScript({ script }: { script: Proposal['salesScript'] }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900">Script de venta</h3>
        <CopyButton text={scriptToText(script)} label="Copiar script" />
      </div>
      <div className="space-y-5">
        <Block title="Apertura">{script.opening}</Block>
        <Block title="Enmarcar el valor">{script.valueFraming}</Block>
        <Block title="Presentar el precio">{script.priceReveal}</Block>
        <Block title="Objeciones">
          <ul className="space-y-3">
            {script.objectionHandling.map((o, i) => (
              <li key={i} className="rounded-lg bg-zinc-50 p-3">
                <p className="font-medium text-zinc-800">“{o.objection}”</p>
                <p className="mt-1 text-sm text-zinc-600">{o.response}</p>
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </div>
  )
}

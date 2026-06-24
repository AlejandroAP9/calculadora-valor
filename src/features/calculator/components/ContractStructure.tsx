'use client'

import type { Proposal } from '@/features/calculator/types'
import { CopyButton } from './ui'

function contractToText(c: Proposal['contract']): string {
  const section = (title: string, items: string[]) =>
    `${title}\n${items.map((i) => `• ${i}`).join('\n')}`
  return [
    section('INCLUYE EL SETUP', c.setupIncludes),
    '',
    section('INCLUYE EL RETAINER', c.retainerIncludes),
    '',
    section('FUERA DE ALCANCE (EXTRA)', c.outOfScope),
  ].join('\n')
}

function List({ title, items, tone }: { title: string; items: string[]; tone: 'in' | 'out' }) {
  const mark = tone === 'in' ? 'text-teal-600' : 'text-zinc-400'
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wide text-zinc-900">{title}</h4>
      <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-700">
            <span className={`font-bold ${mark}`}>{tone === 'in' ? '✓' : '×'}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ContractStructure({ contract }: { contract: Proposal['contract'] }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-zinc-900">Estructura del contrato</h3>
        <CopyButton text={contractToText(contract)} label="Copiar estructura" />
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <List title="Incluye el setup" items={contract.setupIncludes} tone="in" />
        <List title="Incluye el retainer" items={contract.retainerIncludes} tone="in" />
        <List title="Fuera de alcance" items={contract.outOfScope} tone="out" />
      </div>
    </div>
  )
}

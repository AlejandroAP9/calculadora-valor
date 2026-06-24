'use client'

import { useState } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

/** Botón que copia texto al portapapeles y confirma con un cambio de etiqueta. */
export function CopyButton({ text, label = 'Copiar' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-50"
    >
      {copied ? '¡Copiado!' : label}
    </button>
  )
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline' }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40'
  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700',
    outline: 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50',
    ghost: 'text-zinc-600 hover:bg-zinc-100',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

/** Tarjeta seleccionable tipo radio. */
export function OptionCard({
  title,
  desc,
  selected,
  onClick,
}: {
  title: string
  desc: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition-all ${
        selected
          ? 'border-teal-600 bg-teal-50 ring-1 ring-teal-600'
          : 'border-zinc-200 bg-white hover:border-zinc-300'
      }`}
    >
      <div className="font-semibold text-zinc-900">{title}</div>
      <div className="mt-1 text-sm text-zinc-500">{desc}</div>
    </button>
  )
}

/** Chip toggle para multiselección / sugerencias. */
export function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'border-teal-600 bg-teal-600 text-white'
          : 'border-zinc-300 bg-white text-zinc-700 hover:border-teal-400'
      }`}
    >
      {label}
    </button>
  )
}

export function StepShell({
  kicker,
  title,
  children,
}: {
  kicker: string
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-teal-600">{kicker}</p>
      <h2 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  )
}

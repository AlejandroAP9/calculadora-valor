'use client'

import { useEffect, useState } from 'react'
import { useApiKeyStore } from '@/features/calculator/store/useApiKeyStore'

/**
 * Campo BYOK: cada usuario pega SU API key de OpenRouter. Se guarda sólo en su
 * navegador (localStorage), nunca en nuestra BD. Así cada quien paga su consumo.
 * El `mounted` evita un mismatch de hidratación al leer el valor persistido.
 */
export function ApiKeyField() {
  const apiKey = useApiKeyStore((s) => s.apiKey)
  const setApiKey = useApiKeyStore((s) => s.setApiKey)
  const [mounted, setMounted] = useState(false)
  const [reveal, setReveal] = useState(false)

  useEffect(() => setMounted(true), [])

  const value = mounted ? apiKey : ''

  return (
    <div className="mx-auto mt-4 w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="openrouter-key" className="text-sm font-semibold text-zinc-800">
          Tu API key de OpenRouter
        </label>
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-teal-600 hover:underline"
        >
          ¿Cómo la obtengo? →
        </a>
      </div>
      <div className="mt-2 flex gap-2">
        <input
          id="openrouter-key"
          type={reveal ? 'text' : 'password'}
          value={value}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-or-..."
          autoComplete="off"
          spellCheck={false}
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
        <button
          type="button"
          onClick={() => setReveal((v) => !v)}
          className="rounded-lg border border-zinc-300 bg-white px-3 text-xs font-semibold text-zinc-600 hover:bg-zinc-50"
        >
          {reveal ? 'Ocultar' : 'Ver'}
        </button>
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        Se guarda sólo en este navegador y cada cálculo se cobra a tu propia cuenta de
        OpenRouter. Nunca la enviamos a una base de datos nuestra.
      </p>
    </div>
  )
}

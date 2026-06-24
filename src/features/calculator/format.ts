/** Formateo de dinero para mostrar (no para calcular). */

const usdFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const eurFmt = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })

export function formatUsd(n: number): string {
  return `$${usdFmt.format(Math.round(n))}`
}

export function formatEur(n: number): string {
  return `${eurFmt.format(Math.round(n))} €`
}

import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
        Para quienes construyen con IA
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
        Deja de adivinar cuánto cobrar
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-500">
        La Calculadora de Valor convierte lo que construiste en un precio defendible, un script de
        venta y un resumen de ROI. En menos de 5 minutos, sin hablar de tecnología.
      </p>
      <Link
        href="/calculadora"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-teal-700"
      >
        Calcular mi precio →
      </Link>
    </main>
  )
}

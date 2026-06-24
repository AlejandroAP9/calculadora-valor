import Link from 'next/link'
import { CalculatorWizard } from '@/features/calculator/components/CalculatorWizard'

export default function CalculadoraPage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:py-16">
      <header className="mx-auto mb-10 w-full max-w-2xl text-center">
        <Link href="/" className="text-sm font-semibold text-teal-600 hover:underline">
          Calculadora de Valor
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Ponle precio a lo que construiste
        </h1>
        <p className="mt-3 text-zinc-500">
          Describe tu proyecto y sal con un precio defendible, un script de venta y un resumen de
          ROI listo para el cliente.
        </p>
      </header>
      <CalculatorWizard />
    </main>
  )
}

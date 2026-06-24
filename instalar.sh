#!/usr/bin/env bash
#
# Instalador de la Calculadora de Valor.
# Hace todo solo: verifica Node, instala dependencias, crea la configuración,
# guarda tu API key (sin imprimirla ni subirla a git) y arranca la app.
#
# Uso:
#   bash instalar.sh              # instala y arranca la app
#   bash instalar.sh --no-start   # instala pero no arranca (útil para agentes/CI)
#
set -euo pipefail
cd "$(dirname "$0")"

START=1
[ "${1:-}" = "--no-start" ] && START=0

echo ""
echo "  Calculadora de Valor — instalador"
echo "  ----------------------------------"
echo ""

# 1) Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "  ✗ No encuentro Node.js."
  echo "    Instálalo desde https://nodejs.org (versión 18 o superior) y vuelve a correr esto."
  exit 1
fi
echo "  ✓ Node $(node --version)"

# 2) Dependencias
echo "  → Instalando dependencias (puede tardar 1-2 minutos)..."
npm install --no-fund --no-audit
echo "  ✓ Dependencias instaladas"

# 3) Configuración (.env.local). Nunca pisa una existente.
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "  ✓ .env.local creado desde .env.example"
else
  echo "  ✓ .env.local ya existe (no lo toco)"
fi

# 4) API key de OpenRouter. Solo si hay terminal interactiva y aún no hay key.
if [ "$START" -eq 1 ] && [ -t 0 ] && ! grep -qE '^OPENROUTER_API_KEY=.+' .env.local; then
  echo ""
  echo "  Para que la IA redacte el script de venta y el ROI necesitas una API key"
  echo "  de OpenRouter (créala gratis en https://openrouter.ai/keys)."
  printf "  Pega tu OPENROUTER_API_KEY (o Enter para omitir): "
  read -r KEY || KEY=""
  if [ -n "$KEY" ]; then
    tmp=$(mktemp)
    awk -v k="$KEY" '/^OPENROUTER_API_KEY=/{print "OPENROUTER_API_KEY=" k; next} {print}' .env.local > "$tmp"
    mv "$tmp" .env.local
    echo "  ✓ Key guardada en .env.local (protegida por .gitignore, no se sube al repo)"
  else
    echo "  • Sin key: el precio igual se calcula; la redacción con IA queda desactivada"
    echo "    (puedes pegarla luego en .env.local y reiniciar)."
  fi
fi

echo ""
echo "  ✓ Instalación lista."

# 5) Arrancar
if [ "$START" -eq 1 ]; then
  echo "  → Arrancando en http://localhost:3000  (Ctrl+C para detener)"
  echo ""
  npm run dev
else
  echo "  Para arrancar cuando quieras:  npm run dev"
  echo ""
fi

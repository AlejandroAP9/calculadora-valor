#!/usr/bin/env bash
# Stop hook de Raíz — VERIFY real.
# Cuando el agente termina el turno, si tocaste TypeScript (.ts/.tsx) en un proyecto
# con tsconfig + tsc instalado, corre `tsc --noEmit` de verdad. Si hay errores de tipo,
# BLOQUEA el cierre y devuelve los errores para que el agente los arregle antes de
# declarar la tarea lista. Si está limpio, deja cerrar en silencio.
#
# No es un recordatorio: es el check real. Fail-open a propósito (si falta git, tsconfig,
# tsc o python3, no estorba) — sólo actúa cuando de verdad puede verificar.
set -u

input=$(cat 2>/dev/null || true)

# Anti-loop: si este Stop ya viene de un hook que bloqueó antes, no vuelvas a bloquear.
case "$input" in *'"stop_hook_active":true'*) exit 0 ;; esac

command -v git >/dev/null 2>&1 || exit 0
groot=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0

# Archivos .ts/.tsx tocados (modificados, staged o nuevos), fuera de node_modules.
changed=$( {
  git -C "$groot" diff --name-only --diff-filter=ACM
  git -C "$groot" diff --cached --name-only --diff-filter=ACM
  git -C "$groot" ls-files --others --exclude-standard
} 2>/dev/null )
ts=$(printf '%s\n' "$changed" | grep -Ei '\.tsx?$' | grep -v node_modules | head -1)
[ -n "$ts" ] || exit 0

# tsconfig.json más cercano al archivo cambiado (subiendo desde su carpeta).
d="$groot/$(dirname "$ts")"
root=""
while [ "$d" != "/" ] && [ -n "$d" ]; do
  [ -f "$d/tsconfig.json" ] && { root="$d"; break; }
  d=$(dirname "$d")
done
[ -n "$root" ] || exit 0
[ -x "$root/node_modules/.bin/tsc" ] || exit 0   # sin tsc instalado, no puedo verificar

out=$(cd "$root" && ./node_modules/.bin/tsc --noEmit 2>&1)
[ $? -eq 0 ] && exit 0   # typecheck limpio: deja cerrar sin ruido

errs=$(printf '%s\n' "$out" | grep -E 'error TS' | head -8)
reason="verify (Stop hook de Raíz): tsc --noEmit encontró errores de tipo en el proyecto.
NO declares la tarea lista hasta arreglarlos. Corre 'npm run typecheck' para verlos completos.

$errs"

# Emite el bloqueo como JSON seguro. Sin python3, fail-open (no estorba).
command -v python3 >/dev/null 2>&1 || exit 0
printf '%s' "$reason" | python3 -c 'import json,sys; print(json.dumps({"decision":"block","reason":sys.stdin.read()}))'
exit 0

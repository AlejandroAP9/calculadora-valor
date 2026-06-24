# Instalar la Calculadora de Valor

Tres formas, de la más fácil a la manual. Elige una.

## Opción 1 — Con tu agente de IA (lo más fácil)

Abre el proyecto en Claude Code (o tu agente favorito) y escríbele:

> **Lee `instalar.md` e instala el proyecto. Pídeme mi OPENROUTER_API_KEY cuando la necesites.**

El agente hace todo: instala dependencias, crea la configuración, guarda tu key y arranca la app.

## Opción 2 — Un solo comando (Mac / Linux)

En una terminal, dentro de la carpeta del proyecto:

```bash
bash instalar.sh
```

Te pide tu API key (opcional) y arranca la app sola en http://localhost:3000.

> En Windows, usa **Git Bash** para correr el mismo comando, o sigue la Opción 3.

## Opción 3 — Manual (cualquier sistema, 3 pasos)

```bash
# 1. Instala dependencias
npm install

# 2. Crea tu configuración y pega tu API key
cp .env.example .env.local
#    Abre .env.local y pon tu OPENROUTER_API_KEY

# 3. Arranca
npm run dev
```

Abre **http://localhost:3000**.

---

## Requisitos

- **Node.js 18 o superior** — descárgalo en https://nodejs.org. Para comprobar: `node --version`.
- **Una API key de OpenRouter** — créala gratis en https://openrouter.ai/keys. La cuenta es
  gratis; solo pagas por el uso de IA (centavos por propuesta).

## Notas

- Tu `.env.local` con la key **no se sube a git** (está protegido). Cada persona usa la suya.
- **¿Sin API key?** La app igual calcula el precio (el motor es determinista); solo la
  redacción con IA (script de venta, ROI, contrato) queda desactivada hasta que la pongas.

---

## Para agentes (instrucciones de ejecución)

Si eres un agente siguiendo este archivo, ejecuta en orden y reporta cada paso:

1. Verifica que exista Node 18+ con `node --version`. Si falta, detente e indícale al usuario
   que lo instale desde https://nodejs.org.
2. Corre `npm install`.
3. Si no existe `.env.local`, créalo copiando `.env.example`.
4. Pregunta al usuario su `OPENROUTER_API_KEY` y escríbela en `.env.local` reemplazando la
   línea `OPENROUTER_API_KEY=`. **No la imprimas en pantalla ni la subas a git.** Si el usuario
   no la tiene a mano, continúa: la app funciona sin ella (solo sin redacción de IA).
5. Corre `npm run dev` y comparte el enlace http://localhost:3000.

Atajo equivalente: `bash instalar.sh` hace exactamente esto (con `--no-start` para no arrancar).

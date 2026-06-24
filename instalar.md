# Instalar la Calculadora de Valor

Tres formas, de la más fácil a la manual. Elige una.

> **Sobre la API key (importante):** la Calculadora usa el patrón BYOK
> ("Bring Your Own Key"). No se configura ninguna key en archivos del servidor:
> cada persona pega **su propia** API key de OpenRouter **dentro de la app** y
> queda guardada sólo en su navegador. Así cada quien paga su propio consumo.

## Opción 1 — Con tu agente de IA (lo más fácil)

Abre el proyecto en Claude Code (o tu agente favorito) y escríbele:

> **Lee `instalar.md` e instala el proyecto.**

El agente hace todo: instala dependencias, crea la configuración y arranca la app.

## Opción 2 — Un solo comando (Mac / Linux)

En una terminal, dentro de la carpeta del proyecto:

```bash
bash instalar.sh
```

Instala todo y arranca la app sola en http://localhost:3000.

> En Windows, usa **Git Bash** para correr el mismo comando, o sigue la Opción 3.

## Opción 3 — Manual (cualquier sistema, 3 pasos)

```bash
# 1. Instala dependencias
npm install

# 2. Crea tu configuración (no necesitas tocar nada para empezar)
cp .env.example .env.local

# 3. Arranca
npm run dev
```

Abre **http://localhost:3000** y pega tu API key de OpenRouter cuando la app te la pida.

---

## Requisitos

- **Node.js 18 o superior** — descárgalo en https://nodejs.org. Para comprobar: `node --version`.
- **Una API key de OpenRouter** — créala gratis en https://openrouter.ai/keys. La cuenta es
  gratis; solo pagas por el uso de IA (centavos por propuesta). La pegas dentro de la app.

## Notas

- La API key **no se guarda en el servidor ni en git**: vive sólo en el navegador de cada
  persona (localStorage) y se manda únicamente al momento de calcular. Cada quien usa la suya.
- **Necesitas tu key para calcular**: la redacción con IA (script de venta, ROI, contrato) y la
  estimación de valor corren con tu cuenta de OpenRouter. El motor de precios en sí es
  determinista, pero el cálculo se dispara desde la app una vez que pegaste tu key.

---

## Para agentes (instrucciones de ejecución)

Si eres un agente siguiendo este archivo, ejecuta en orden y reporta cada paso:

1. Verifica que exista Node 18+ con `node --version`. Si falta, detente e indícale al usuario
   que lo instale desde https://nodejs.org.
2. Corre `npm install`.
3. Si no existe `.env.local`, créalo copiando `.env.example`. No necesitas escribir ninguna
   API key ahí: la app usa BYOK y la key se pega en la interfaz.
4. Corre `npm run dev` y comparte el enlace http://localhost:3000. Indícale al usuario que
   pegue su API key de OpenRouter (https://openrouter.ai/keys) dentro de la app.

Atajo equivalente: `bash instalar.sh` hace exactamente esto (con `--no-start` para no arrancar).

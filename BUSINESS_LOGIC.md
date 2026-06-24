# Calculadora de Valor — Lógica de Negocio

> Agente conversacional que pone precio defendible a servicios de IA.
> Sembrado desde Raíz el 2026-06-24. Para construir, usar el skill `new-app` / `prp`.

## Contexto

Existe una comunidad de más de 1.800 miembros llamada **Imperio Agéntico**
(skool.com/imperio), liderada por Benjamín Cordero, enfocada en agentes de IA,
automatizaciones, vibe coding y sistemas con IA. Tras analizar más de 200 posts de
las secciones de Preguntas y General, se identificó que el problema más recurrente
**sin solución existente** es: los miembros construyen proyectos reales con IA pero
no saben cómo ponerles precio, justificar el valor ante el cliente, ni estructurar
su propuesta comercial.

## Problema real

Los constructores de IA (freelancers, agencias, consultores) enfrentan tres
fricciones concretas:

1. **No saben cuánto cobrar** por lo que construyen (agentes de WhatsApp,
   automatizaciones, SaaS, dashboards, workflows en n8n, apps con Claude Code).
2. **No saben cómo justificar el precio** ante el cliente sin sonar a "vende humos".
3. **No calculan su margen real** porque no consideran los costos de operación
   (APIs, VPS, tokens, mantenimiento).

## Solución: agente "Calculadora de Valor"

Una herramienta conversacional que, a partir de una descripción del proyecto
construido, genera automáticamente una propuesta de valor con precio defendible,
estructura comercial y justificación lista para presentar al cliente.

## Flujo del agente

### Fase 1 — Intake del proyecto
El agente recibe o pregunta por:
- ¿Qué construiste? (descripción libre del proyecto)
- ¿Para qué nicho/industria es el cliente?
- ¿Cuántas horas invertiste en construirlo?
- ¿Qué stack usas? (Claude API, n8n, GHL, VPS, WhatsApp API, etc.)
- ¿Cuál es la facturación aproximada del cliente? (pequeño / mediano / grande)
- ¿Modalidad de venta? (setup único / retainer mensual / por resultado)

### Fase 2 — Cálculo del valor generado
El agente calcula:
- Tiempo ahorrado al cliente por mes (horas × tarifa de mercado del nicho)
- Ingresos habilitados o pérdidas evitadas gracias a la solución
- Costo real de operación mensual (APIs + VPS + mantenimiento estimado)
- Multiplicador de valor (el cliente paga entre 5x y 10x del costo de operación si
  el valor lo justifica)

### Fase 3 — Output estructurado
El agente entrega:

1. **Precio mínimo** → cubre tu tiempo + costos de operación, sin morir en el intento.
2. **Precio recomendado** → basado en el valor real generado al cliente, defendible y justo.
3. **Precio premium** → para clientes con alta facturación donde el ROI es muy claro.
4. **Script de venta** → cómo presentar el precio en lenguaje de negocio, no de
   tecnología ("esto te ahorra X horas al mes que hoy pagas a Y persona" en vez de
   "te hago un agente con n8n y Claude").
5. **Resumen de ROI** → documento de una página listo para mostrarle al cliente con
   números reales.
6. **Estructura del contrato** → qué incluir en el acuerdo (qué cubre el setup, qué
   cubre el retainer, qué es extra).

## Principios de diseño

- **Lenguaje de negocio, no de tecnología**: el agente siempre traduce lo técnico a
  impacto económico.
- **Conservador pero justo**: los precios sugeridos se basan en valor real, no en
  aspiraciones.
- **Adaptado al mercado LATAM/España**: considera el poder adquisitivo del mercado
  hispanohablante con rangos en USD y EUR.
- **Sin fricción**: el usuario describe su proyecto en lenguaje natural, el agente
  hace el trabajo pesado.
- **Reutilizable**: sirve tanto para el primer cliente como para el décimo,
  escalando la lógica de pricing.

## Casos de uso concretos (extraídos de la comunidad)

- Agente de WhatsApp para clínica dental que agenda citas y guarda leads.
- Dashboard de automatización para e-commerce con Tienda Nube.
- Flujo de captación de leads en n8n para inmobiliaria.
- Bot de respuesta automática para community manager con múltiples cuentas.
- SaaS de gestión de certificaciones de gas con Supabase + Netlify.
- Sistema de generación de carruseles para agencia de redes sociales.
- CRM personalizado para agencia de viajes con FastAPI + PostgreSQL.

## Diferenciadores clave

- **No es el Motor Agéntico**: el Motor mide productividad y uso de tokens. Esto
  resuelve el problema comercial — cómo monetizar lo que construyes.
- **No es una hoja de cálculo**: es una conversación guiada que termina en
  documentos listos para usar.
- **No es genérico**: los precios y la justificación se adaptan al nicho específico
  del cliente del usuario.

## Métricas de éxito

- El usuario entra sin saber cuánto cobrar y sale con un precio defendible en menos
  de 5 minutos.
- El script de venta generado reduce el miedo a presentar el precio.
- El resumen de ROI convierte más propuestas porque habla el idioma del cliente.

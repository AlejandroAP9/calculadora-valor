# /raiz-landing build-loop

Construye un sitio en un loop maker → auditor → fix que no para hasta que el auditor
da el visto bueno. Tu no eres el cuello de botella: defines la meta una vez y el loop
itera solo.

> La idea no es nueva (el que lidera Claude Code dijo "ya no escribo prompts, escribo
> loops"). Lo nuestro tiene una ventaja: el auditor no es otro agente que se puede
> convencer, es **Site Doctor**, un instrumento determinista que mide pixeles y no opina.

## Las cuatro piezas (no te saltes ninguna)

1. **Disparador.** Nativo de Claude Code, no hay que construirlo. `/goal` para meta
   cerrada ("no pares hasta que pase"), `/loop <intervalo>` para mejora abierta.
2. **Maker.** El agente que construye. Usa `bucle-agentico` para sitios con varias
   partes coordinadas, o el build directo de `raiz-landing` para algo simple.
3. **Meta verificable.** `site-doctor.mjs`. El loop termina cuando sale con **código 0**
   (cero fallas duras). No es opinion, es exit code.
4. **Estado.** Los archivos del proyecto + el último reporte de Site Doctor. La memoria
   vive fuera del chat: cuando el contexto se sature y compactes, el estado real son los
   archivos, no la conversacion.

## Regla de oro: el maker no se autoaprueba

El agente que escribe el sitio NO decide si quedo bien. Tiende a ser amigable consigo
mismo. El veredicto lo da Site Doctor, que corre como proceso aparte. Como es
determinista, no se le puede endulzar: o el contraste da 4.5:1 o no da.

## Como se lanza

Meta cerrada (lo normal para un sitio):

```
/goal Construye la landing segun el brief en out/index.html. No pares hasta que
      "node .claude/skills/raiz-landing/tools/site-doctor.mjs out/index.html"
      salga con 0 fallas duras. En cada vuelta: corre Site Doctor, lee el reporte,
      corrige SOLO lo que marco, y vuelve a auditar.
```

Mejora abierta (pulir un sitio ya bueno, sin meta final):

```
/loop 30m Audita out/index.html con site-doctor.mjs y mejora un hallazgo por vuelta
          (resolucion de imagenes, jerarquia, microcopy). Registra cada cambio.
```

## El ciclo, vuelta por vuelta

```
maker construye  ->  Site Doctor audita  ->  fallas duras?
                                               | si  -> corrige lo marcado -> vuelve a auditar
                                               | no  -> entrega. Loop termina.
```

Cada vuelta corrige SOLO lo que el reporte marco (contraste, placeholder, imagen rota,
overflow movil). Nada de rediseñar a gusto: la meta manda.

## Cuando cortar

- **Meta cerrada**: corta sola al llegar a 0 fallas duras.
- **Las advertencias no bloquean** (placeholders, imagen algo baja, a11y). Se revisan a
  mano: a veces son legitimas (una noticia marcada como ejemplo es un placeholder real
  que el dueño llenara despues).
- **Loop abierto**: lo paras tu ("para el loop"). Siempre hay una mejora mas; el deadline
  lo pones tu, no el loop.

## Costo

Un loop gasta tokens en cada vuelta. Hoy se descuenta de la suscripcion; manana, con
modelos por API, no. Acota el numero de vueltas o usa esfuerzo bajo en las correcciones
mecanicas. No mandes un loop infinito a una meta que ya cumpliste.

## Pre-requisito

`site-doctor.mjs` necesita `playwright-core` (parte del stack de Raiz). Sin auditor no
hay meta verificable, y sin meta verificable esto es solo un prompt caro.

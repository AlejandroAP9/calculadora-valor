---
name: update-raiz
description: "Actualizar Raíz a la ultima version SIN perder tus cambios. Activar cuando el usuario dice: actualiza el template, hay nueva version, update Raíz, quiero la ultima version, o cuando se detecta que el template esta desactualizado."
allowed-tools: Read, Bash
---

# Update Raíz (merge 3-way)

Actualiza el cerebro de el bosque (`.claude/`, `CLAUDE.md`, `GEMINI.md`) a la
ultima version **sin sobrescribir tus ediciones**. Usa `injertar.sh`, que
hace un merge 3-way contra el snapshot que se guardo la ultima vez. Tu codigo en
`src/` nunca se toca.

> El metodo viejo (`rm -rf .claude/ && cp -r`) quedo deprecado: borraba skills
> custom, memoria y settings locales. No usarlo.

## Proceso

### Paso 1: Ubicar el repo fuente

```bash
grep "alias raiz" ~/.zshrc ~/.bashrc 2>/dev/null
```

El alias apunta al script:
```bash
alias raiz='bash /ruta/al/repo/raiz/tools/injertar.sh'
```

Extrae `[RUTA_REPO_SF]` (lo que va antes de `/tools/injertar.sh`). Si no
encuentras el alias, pregunta al usuario por la ruta del repo Raíz.

### Paso 2: Actualizar el repo fuente

```bash
cd [RUTA_REPO_SF] && git pull origin main
```

Si hay conflictos de git en el repo fuente, informa y sugiere solucion antes de seguir.

### Paso 3: Previsualizar (dry-run)

Desde el directorio del proyecto a actualizar:

```bash
bash [RUTA_REPO_SF]/tools/injertar.sh update --dry-run
```

Muestra el plan: que se agrega, que se actualiza limpio, que entra a merge y que
queda en **conflicto**. Nada se escribe todavia. Revisa el plan con el usuario.

### Paso 4: Aplicar

```bash
bash [RUTA_REPO_SF]/tools/injertar.sh update
```

- Archivos que NO editaste → se actualizan a la nueva version.
- Archivos que editaste y el template tambien → **auto-merge** si no chocan.
- Si chocan → tu version queda **intacta** y la nueva se deja en
  `<archivo>.injerto-new` para que mergees a mano.
- Lo que borraste a proposito no se resucita. Tu memoria (`.claude/memory/`) y
  `settings.local.json` nunca se tocan.

### Paso 5: Resolver conflictos (si los hubo)

Por cada `*.injerto-new`: mergea a mano lo que quieras conservar en tu archivo y
luego marca el conflicto como saldado (fija la base para el proximo update):

```bash
bash [RUTA_REPO_SF]/tools/injertar.sh resolve <archivo>
```

### Paso 6: Confirmar

Reporta el resumen que imprime el script (nuevos / actualizados / sin cambio /
omitidos / conflictos) y lista los `.injerto-new` pendientes, si quedan.

## Notas

- Idempotente: correr `update` dos veces seguidas no cambia nada (salvo conflictos
  pendientes, que persisten hasta que uses `resolve`).
- El estado de instalacion vive en `<proyecto>/.raiz/` (manifest + base).
  No lo borres: es el ancestro comun del merge.
- Ante la duda, ten un commit de git antes. El script no toca `src/`, pero el
  commit es tu red de seguridad.

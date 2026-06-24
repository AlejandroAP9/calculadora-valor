# Blindajes — memoria de errores entre proyectos

Los blindajes son la memoria compartida de errores entre TODOS tus proyectos
Raíz. Igual que un bosque conecta sus árboles bajo tierra por una red
micorrízica que comparte nutrientes, aquí los proyectos comparten **blindajes**:
errores ya documentados que no deben repetirse.

## Cómo funciona

- Cada blindaje es un `.md` con frontmatter (`id`, `title`, `tags`, `source`,
  `date`) y cuerpo `**Guard:**` (qué hacer) + `**Why:**` (causa raíz).
- Viven en el **maestro** (`raiz/.claude/blindajes/`). Cada proyecto nuevo los
  hereda con `raiz init`; los existentes con `raiz update` (merge 3-way).
- `BLINDAJES.md` es el índice, regenerado automáticamente. No lo edites a mano.

## Comandos

```bash
# Capturar un blindaje (lo escribe al maestro y al proyecto actual)
raiz blindar "Síntoma del error" --guard "Qué hacer / no hacer" \
  --why "Causa raíz" --tags supabase,rls --from mi-proyecto

# Listar o buscar
raiz blindajes
raiz blindajes supabase

# Regenerar el índice
raiz blindajes --reindex
```

Tras `blindar`, commitea y pushea el maestro para propagarlo a tus otros proyectos.

## El loop

Bug en proyecto A → lo arreglas → `raiz blindar` → queda en los blindajes →
proyecto B nace (o se actualiza) ya sabiendo no cometerlo. El bosque se vuelve
más inteligente con cada proyecto.

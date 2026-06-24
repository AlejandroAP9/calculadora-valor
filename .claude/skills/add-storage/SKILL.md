---
name: add-storage
description: Agrega subida y entrega de archivos a un proyecto Raíz con Supabase Storage. Cubre buckets públicos y privados, RLS por owner, subida desde cliente con validación (tipo/tamaño/nombre) y el patrón no obvio del proxy autenticado para archivos privados (avatares, logos, documentos, adjuntos, fotos sensibles). Usar cuando el proyecto necesita que un usuario suba o vea archivos. Triggers "subir archivos", "avatar", "logo del usuario", "adjuntar documento", "galeria de fotos", "storage", "bucket".
---

# add-storage — archivos con dueño, no carpetas abiertas

Subir un archivo es fácil. Lo que se hace mal es la entrega: dejar todo en un bucket
público y mandar la URL. Eso significa que cualquiera con el link ve el archivo, para
siempre, sin pasar por tu auth. Para un logo da igual; para el documento de un usuario
o la foto de un menor, es una filtración.

La decisión que define todo: **¿este archivo es público o tiene dueño?**

| Tipo | Bucket | Entrega |
|------|--------|---------|
| Logos, imágenes de marketing, assets del sitio | **público** | URL pública directa |
| Avatares, documentos, adjuntos, fotos privadas | **privado** | proxy autenticado o signed URL |

## 1. Crear el bucket (en migración, versionado)

```sql
-- supabase/migrations/XXXX_storage_buckets.sql
insert into storage.buckets (id, name, public)
values
  ('public-assets', 'public-assets', true),
  ('user-files',    'user-files',    false)   -- privado
on conflict (id) do nothing;
```

## 2. RLS en los archivos (storage.objects)

Para el bucket privado: cada usuario sólo toca lo suyo. La convención es guardar el
archivo bajo un path que arranca con su `user_id`, y la policy lo verifica.

```sql
-- subir/leer/borrar sólo lo propio (path: user-files/<uid>/loquesea.pdf)
create policy "dueño gestiona sus archivos"
on storage.objects for all to authenticated
using ( bucket_id = 'user-files' and (storage.foldername(name))[1] = auth.uid()::text )
with check ( bucket_id = 'user-files' and (storage.foldername(name))[1] = auth.uid()::text );
```

El bucket público no necesita policy de lectura (es público); sí una de escritura si
quieres que sólo usuarios autenticados suban.

## 3. Subir, con validación

Valida SIEMPRE tipo y tamaño antes de subir, y normaliza el nombre. Un nombre de
archivo del usuario es input no confiable.

```ts
const MAX_MB = 5;
const TIPOS_OK = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function subirArchivo(file: File, userId: string) {
  if (!TIPOS_OK.includes(file.type)) throw new Error("Tipo no permitido");
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`Máximo ${MAX_MB}MB`);

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  const nombre = `${userId}/${crypto.randomUUID()}.${ext}`;   // path con dueño + nombre seguro

  const supabase = createClient();
  const { error } = await supabase.storage.from("user-files").upload(nombre, file);
  if (error) throw error;
  return nombre;   // guarda este path en tu tabla, NO una URL
}
```

Guarda el **path** (`user-files/<uid>/<uuid>.pdf`) en tu tabla, nunca la URL. La URL
se genera al momento de servir.

## 4. Servir un archivo privado — el patrón que importa

Dos formas. La simple para casos puntuales, el proxy para control fino.

### a) Signed URL (simple, expira)

```ts
const { data } = await supabase.storage
  .from("user-files")
  .createSignedUrl(path, 60 * 60);   // válida 1 hora
// data.signedUrl
```

### b) Proxy autenticado (cuando el acceso depende de tu lógica, no sólo del dueño)

Una ruta de tu app que verifica auth + permisos con TU criterio (ej. "este apoderado
puede ver la foto de ESTE alumno") y recién ahí streamea el archivo. El cliente nunca
ve la URL de storage.

```ts
// src/app/api/files/[...path]/route.ts
import { createAdminSupabase } from "@/shared/lib/supabase-admin";
import { getSession } from "@/shared/lib/auth";

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const session = await getSession();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const path = params.path.join("/");
  // verifica con TU lógica que esta sesión puede ver este path (no sólo el dueño)
  if (!(await puedeVer(session.user.id, path))) {
    return new Response("Forbidden", { status: 403 });
  }

  const db = createAdminSupabase();
  const { data, error } = await db.storage.from("user-files").download(path);
  if (error || !data) return new Response("Not found", { status: 404 });

  return new Response(data, {
    headers: { "Content-Type": data.type, "Cache-Control": "private, max-age=3600" },
  });
}
```

Esto es lo que protege fotos de menores, documentos médicos, archivos de pago: el
acceso pasa por tu código, no por una URL pública adivinable.

## Hardening

- **Valida tipo y tamaño server-side también**, no sólo en el cliente. El cliente se
  salta.
- **Nombre seguro**: nunca uses el nombre original del usuario como path. UUID + ext
  saneada.
- **Privado por defecto.** Si dudas si un archivo es público, es privado.
- **Guarda el path, no la URL.** Las URLs públicas de un bucket privado no funcionan, y
  las signed expiran. El path es estable.
- **Fetching server-side**: usa el cliente de storage (`.download()`), no le pegues a
  tu propia URL pública desde el server (ver blindaje del hairpin NAT si estás en una
  infra con NAT).

## Composicion

- `add-login` define el `user_id` que ancla los paths y las policies.
- Para fotos que se muestran mucho, considera un bucket público sólo para las versiones
  no sensibles (thumbnails de marketing), privado para el original.

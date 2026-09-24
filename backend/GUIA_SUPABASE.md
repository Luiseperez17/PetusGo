# Guía: Supabase + Backend local + Frontend (inscripciones reales)

Meta: llenar el formulario en el frontend → llega al backend → queda en Supabase → verlo y gestionarlo con datos reales.

```
Frontend :3000 ──► Backend :3001 ──► Supabase (Postgres + Storage + Auth)
```

> **Estado real del proyecto**
> - Hecho: esquema SQL, API (registro, carnet, catálogo, compras, canjes).
> - Hecho también: formulario conectado (Fase 6), login de cliente por código de correo (6.5) y panel admin en `/#/admin` (Fase 8). La Fase 7 (curl / Table Editor) sigue sirviendo como alternativa de depuración.

Requisitos: Node 20+, cuenta en https://supabase.com.

---

## Fase 1 — Crear el proyecto en Supabase

1. supabase.com → **New project**.
2. Nombre: `petus-go`. Región: la más cercana (ej. São Paulo / East US). Genera y **guarda la contraseña de la BD**.
3. Espera ~2 min a que termine de aprovisionar.

## Fase 2 — Crear la base de datos

1. Menú izquierdo → **SQL Editor** → **New query**.
2. Copia **todo** [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql), pégalo y pulsa **Run**. Debe decir `Success. No rows returned`.
   - Si falla a la mitad, no lo re-ejecutes tal cual (ya creó parte). Ve a **Database → Schemas** y borra lo creado, o usa **Project Settings → General → Pause/Delete** y recrea el proyecto vacío.
3. Nueva query → pega [supabase/seed.sql](supabase/seed.sql) → **Run**. Carga 5 marcas, 14 presentaciones, 6 productos de farmacia y los T&C.
4. **Reemplaza el texto de T&C**: en **Table Editor → terms_versions** edita `body_md` con el texto oficial (ver [TermsModal.tsx](../src/components/TermsModal.tsx)).

**Verifica** en **Table Editor** que existen: `tutors, pets, memberships, stamp_cycles, food_purchases, pharmacy_purchases, benefit_redemptions, staff_profiles, sites, food_brands, food_presentations, pharmacy_products, terms_versions`, y que `food_brands` tiene 5 filas.

**Verifica Storage:** menú **Storage** → debe existir el bucket `pet-photos` (privado). Si no, créalo: **New bucket** → nombre `pet-photos` → *Public bucket* **desactivado**.

## Fase 3 — Sede y usuario staff (admin)

1. **Crear una sede** — SQL Editor:
   ```sql
   insert into sites(name, address) values ('Sede Principal', 'Dirección de la sede') returning id;
   ```
   Copia el `id`.
2. **Crear usuario admin** — **Authentication → Users → Add user → Create new user**. Email + contraseña, marca **Auto Confirm User**. Copia su `UID`.
3. **Darle rol** — SQL Editor (reemplaza los dos UUID):
   ```sql
   insert into staff_profiles(user_id, role, site_id)
   values ('UID_DEL_USUARIO', 'admin', 'ID_DE_LA_SEDE');
   ```

## Fase 4 — Credenciales

En Supabase → **Project Settings → API** (o el botón **Connect**):

| Dato | Dónde | Para |
|---|---|---|
| Project URL (`https://xxxx.supabase.co`) | API → Project URL | `SUPABASE_URL` |
| `service_role` key | API Keys → **service_role** (click *Reveal*) | `SUPABASE_SERVICE_ROLE_KEY` |

⚠️ La `service_role` salta toda la seguridad (RLS). **Solo** en `backend/.env`. Nunca en el frontend, nunca en git, nunca en capturas.

```bash
cd backend
cp .env.example .env
# edita .env:
# SUPABASE_URL="https://xxxx.supabase.co"
# SUPABASE_SERVICE_ROLE_KEY="eyJ..."
# PORT=3001
# CORS_ORIGIN="http://localhost:3000"
```

## Fase 5 — Levantar el backend y probarlo

```bash
cd backend
npm install
npm run dev          # → "API en :3001"
```

Pruebas (otra terminal):

```bash
curl localhost:3001/api/health            # {"ok":true}
curl localhost:3001/api/catalog           # 5 marcas + 6 productos + sedes
curl localhost:3001/api/terms             # versión 1.0
```

Prueba de registro real (sin foto):

```bash
curl -X POST localhost:3001/api/members -H 'Content-Type: application/json' -d '{
  "tutor":{"nombreCompleto":"Laura Valencia","correo":"laura@ejemplo.com","telefono":"3148923410","direccion":"Calle 10 #24-50","cedula":"1037648291"},
  "mascota":{"nombre":"Kira","especie":"canino","sexo":"hembra","tamano":"mediano","peso":14.2,"edad":"2 años","fechaVacuna":"02/05/2025","esterilizado":"si"},
  "aceptaTerminos":true}'
```

Debe responder `201` con `code: "PG-2026-1000"`. Confirma en **Table Editor**: filas en `tutors`, `pets`, `memberships` (status `pendiente`). Repetirlo con la misma cédula/correo devuelve `409` (correcto).

| Error | Causa |
|---|---|
| `Missing env var` | `.env` no está en `backend/` o vacío |
| `Invalid API key` | copiaste la `anon` en vez de `service_role` |
| `Sin T&C publicados` | no corriste `seed.sql` |
| `relation ... does not exist` | no corriste la migración |

## Fase 6 — Conectar el frontend

Raíz del proyecto:

1. `.env.local` (crea el archivo):
   ```
   VITE_API_URL="http://localhost:3001/api"
   ```
2. Crea `src/lib/api.ts`:
   ```ts
   import { MemberProfile, RegistroForm } from '../types';

   const API = import.meta.env.VITE_API_URL as string;

   const toIso = (d: string) => d; // el backend ya acepta dd/mm/aaaa

   // Respuesta de member_card (snake_case) → MemberProfile del frontend
   function toProfile(c: any, form: RegistroForm): MemberProfile {
     const fmt = (s?: string | null) => (s ? new Date(s).toLocaleDateString('es-CO') : '');
     return {
       id: c.code,
       fechaRegistro: fmt(c.registered_at),
       vigenciaHasta: fmt(c.valid_until) || 'Se activa con tu 1ª compra',
       tutor: form.tutor,
       mascota: { ...form.mascota, fotoUrl: c.photo_url ?? form.mascota.fotoUrl },
       plan5mas1Compras: c.stamps,
       descuentoFarmaciaActivo: c.pharmacy_discount_active,
       banoGratisDisponible: c.bath_available,
       consultaMedicaDisponible: c.consult_available
     };
   }

   export async function registerMember(form: RegistroForm): Promise<MemberProfile> {
     const { fotoUrl, ...mascota } = form.mascota;
     const body = {
       tutor: form.tutor,
       mascota: {
         ...mascota,
         // solo se sube si es archivo local (data URL), no las fotos demo
         ...(fotoUrl?.startsWith('data:') ? { foto: fotoUrl } : {}),
         // el backend rechaza strings vacíos en enums opcionales
         sexo: mascota.sexo || undefined,
         tamano: mascota.tamano || undefined,
         esterilizado: mascota.esterilizado || undefined,
         peso: mascota.peso || undefined
       },
       aceptaTerminos: form.aceptaTerminos
     };
     const res = await fetch(`${API}/members`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(body)
     });
     const json = await res.json();
     if (!res.ok) throw new Error(json.error ?? 'No se pudo completar el registro');
     return toProfile(json, form);
   }
   ```
3. En [RegistrationSection.tsx](../src/components/RegistrationSection.tsx) reemplaza el `setTimeout` de `handleSubmit` (líneas ~151-172) por:
   ```ts
   import { registerMember } from '../lib/api';
   // ...
   setIsSubmitting(true);
   try {
     const member = await registerMember(formData);
     onSuccessRegister(member);
   } catch (err: any) {
     setErrorMsg(err.message);
   } finally {
     setIsSubmitting(false);
   }
   ```
   y marca `handleSubmit` como `async`.
4. Quita datos quemados de registro: elimina el botón "Rellenar con datos de prueba" y "O elige una demo" cuando pases a producción. `SAMPLE_MEMBER` en [App.tsx](../src/App.tsx) puede quedar solo para la vista previa del carnet.
5. Levanta ambos:
   ```bash
   # terminal 1
   cd backend && npm run dev
   # terminal 2 (raíz)
   npm run dev          # http://localhost:3000
   ```
6. Prueba: llena el formulario, sube una foto real (JPG/PNG ≤ 5 MB), envía. Debe aparecer el carnet con código `PG-2026-XXXX`.

**Verifica en Supabase:** nueva fila en `tutors`/`pets`/`memberships`, y el archivo en **Storage → pet-photos** (`<pet_id>.jpg`).

### 6.5 Login del cliente (código por correo)

El cliente **no registra compras**: las registra el staff en caja (Fase 7.3). El cliente entra a **ver** su carnet (sellos 5+1, beneficios, vigencia) con un código enviado a su correo, sin contraseña.

Flujo: "Mi Carnet Digital" → correo → `POST /api/auth/request-code` (solo envía si el correo es de un tutor registrado) → código → `POST /api/auth/verify` → token en `sessionStorage` → `GET /api/me`.

Configura Supabase (una vez):
1. **Authentication → Email Templates → Magic Link**: reemplaza el cuerpo para mostrar el código, p. ej.:
   ```html
   <h2>Tu código de acceso Petus Go</h2>
   <p>Ingresa este código: <b>{{ .Token }}</b></p>
   ```
2. **Authentication → Sign In / Providers → Email**: activo. Longitud del OTP configurable (6–8 dígitos, el backend acepta 6–8).
3. ⚠️ El correo integrado de Supabase tiene límite muy bajo (~2-4 correos/hora) y es solo para pruebas. Para producción configura SMTP propio en **Authentication → SMTP Settings** (Resend, SendGrid, etc.).
4. Ejecuta [0003_lowercase_emails.sql](supabase/migrations/0003_lowercase_emails.sql) en el SQL Editor (normaliza correos a minúsculas).

Prueba: registra un cliente con un correo tuyo real → cierra el carnet → "Mi Carnet Digital" → recibe el código → entra y debe ver **sus** datos reales. Si el cliente tiene varias mascotas, hoy se muestra la primera.

Nota: la vigencia y descuento aparecen al **activar** (1ª compra de alimento, Fase 7.3), según los T&C.

## Fase 7 — Gestionar inscripciones (dashboard de Supabase, datos reales)

### 7.1 Ver inscripciones
**SQL Editor**, guarda como *Snippet* "Inscripciones":
```sql
select m.code, m.status, m.registered_at,
       t.full_name, t.email, t.phone, t.national_id,
       p.name as mascota, p.species, p.photo_path
from memberships m
join tutors t on t.id = m.tutor_id
join pets p on p.id = m.pet_id
order by m.registered_at desc;
```

### 7.2 Métricas
```sql
select status, count(*) from memberships group by status;
select date(registered_at) dia, count(*) from memberships group by 1 order by 1 desc;
```

### 7.3 Activar membresía (simula 1ª compra en caja)
Necesitas un JWT de staff. Login con el admin creado en Fase 3:
```bash
# usa la anon key (API Keys → anon) SOLO para este login
curl -X POST 'https://xxxx.supabase.co/auth/v1/token?grant_type=password' \
  -H 'apikey: ANON_KEY' -H 'Content-Type: application/json' \
  -d '{"email":"admin@tudominio.com","password":"TU_PASSWORD"}'
# → copia "access_token"
```
Obtén un `presentationId` (Table Editor → `food_presentations`) y registra la compra:
```bash
curl -X POST localhost:3001/api/staff/purchases/food \
  -H "Authorization: Bearer ACCESS_TOKEN" -H 'Content-Type: application/json' \
  -d '{"membershipCode":"PG-2026-1000","presentationId":"UUID_PRESENTACION"}'
```
Respuesta: `{"stamps":1,"free_bag_available":false}`. Ahora la membresía pasa a `activa` con `valid_until` = hoy + 365. Repite 5 veces con la misma presentación → `free_bag_available: true`; canjea:
```bash
curl -X POST localhost:3001/api/staff/redemptions -H "Authorization: Bearer ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"membershipCode":"PG-2026-1000","benefit":"bolsa_gratis"}'
```
(`bano` y `consulta` igual, una vez cada uno.)

### 7.4 Ver el carnet actualizado
```bash
curl localhost:3001/api/staff/members/PG-2026-1000 -H "Authorization: Bearer ACCESS_TOKEN"
```
(El cliente ve su carnet con su propio login, ver Fase 6.5.)

### 7.5 Gestión manual desde Table Editor
- Cancelar/vencer: editar `memberships.status`.
- Corregir datos: editar `tutors` / `pets`.
- Ver fotos: **Storage → pet-photos**.
- Historial: `food_purchases`, `pharmacy_purchases`, `benefit_redemptions`.

## Fase 8 — Panel admin (construido)

URL: **http://localhost:3000/#/admin** (frontend y backend corriendo).

**Entrar:** con el usuario staff de la Fase 3 (correo + contraseña de Authentication → Users). Debe tener fila en `staff_profiles`, si no responde 403.

**Roles**
| Rol | Ve | Puede |
|---|---|---|
| `cajero` | Inscripciones | buscar, registrar compras, canjear beneficios |
| `admin` | Inscripciones + Métricas | todo lo anterior + cambiar estado de membresía |

Crear un cajero: Authentication → Add user, luego
```sql
insert into staff_profiles(user_id, role, site_id) values ('UID', 'cajero', 'ID_SEDE');
```

**Qué hace cada pantalla**
- **Inscripciones:** lista real desde Supabase, búsqueda (nombre, mascota, código, cédula, correo), filtro por estado. Click en una fila abre el detalle.
- **Detalle:** datos del tutor y mascota, sellos 5+1, registrar compra de alimento (marca → presentación), compra de farmacia (calcula 15%), canjear bolsa gratis / baño / consulta, historial completo, cambio de estado (solo admin).
- **Métricas (admin):** inscritos por estado, compras, bolsas por canjear, canjes, ventas de farmacia y descuento otorgado, inscripciones de los últimos 30 días.

**Prueba completa de punta a punta**
1. Registra un cliente desde la landing.
2. Entra a `#/admin` → aparece en la lista como `pendiente`.
3. Ábrelo → elige marca y presentación → **Registrar compra**: pasa a `activa` con vigencia +365 días, sellos 1/5.
4. Repite 4 veces con la misma presentación → sellos 5/5 → se habilita **Bolsa gratis** → canjéala.
5. Canjea **Baño** y **Consulta** (cada uno una sola vez; el segundo intento se rechaza).
6. Registra una compra de farmacia → verifica subtotal, 15% y total en el historial.
7. Métricas (admin) refleja todo. Luego, el cliente entra con su correo (Fase 6.5) y ve sus sellos y beneficios reales.

**Notas**
- La sesión del panel vive en `sessionStorage` y dura ~1 h (vence el token de Supabase); al vencer vuelve al login.
- Cambiar de presentación a mitad de un ciclo 5+1 descarta el ciclo abierto y empieza otro (regla de los T&C).
- El acceso a `/#/admin` no está oculto, pero sin credenciales staff no se ve ni se opera nada: la seguridad está en el backend.

## Antes de producción

- [x] Carnet protegido: cliente por código de correo (`/api/me`), staff por `/api/staff/members/:code`.
- [ ] SMTP propio para los códigos de correo.
- [ ] CORS con el dominio real (`CORS_ORIGIN`).
- [ ] Deploy backend (Railway/Render/Fly) con las env vars; frontend con `VITE_API_URL` apuntando a él.
- [ ] Rotar la `service_role` si alguna vez se filtró.
- [ ] Activar backups (Supabase → Database → Backups) y confirmar consentimiento de datos (Ley 1581 / habeas data).
- [ ] Reemplazar T&C de `seed.sql` por los oficiales.

# Petus Go — Análisis y Backend

## Análisis del proyecto
Landing React 19 + Vite + Tailwind (Silveragro). **Sin backend**: todo es estado local y datos mock.

| Feature UI | Hoy | Backend requerido |
|---|---|---|
| Registro (tutor + mascota + foto + T&C) | `setTimeout`, ID aleatorio, foto en base64 en memoria | `POST /api/members`, Storage |
| Carnet digital | `SAMPLE_MEMBER` | `GET /api/members/:code` (+QR/escaneo en sede) |
| Plan 5+1 (simulador) | contador local | ciclos de sellos, canje bolsa gratis |
| Farmacia 15% | calculadora local | compra farmacia, descuento server-side |
| Baño + consulta gratis | flags | canje único por membresía |
| Catálogo marcas / productos | `constants/data.ts` | tablas + `GET /api/catalog` |
| T&C | texto fijo | tabla versionada, aceptación registrada |

Reglas de negocio (de TermsModal):
- Vigencia 365 días desde **1ª compra de alimento** (hoy el UI la fija al registrar → `pendiente` → `activa`).
- 5+1: 5 compras misma marca/línea/tamaño → 6ª gratis.
- 15% farmacia activo desde 1ª compra.
- Baño y consulta: 1 por membresía.

Hallazgos: `vigenciaHasta` hardcodeado `23/09/2026`; fechas como texto `dd/mm/aaaa`; edad texto libre; `GEMINI_API_KEY`/`@google/genai` sin uso.

## Arquitectura
```
React (Vite :3000) ──► Express API (:3001) ──► Supabase
                         zod · helmet · rate-limit    Postgres (RLS) · Storage · Auth (staff)
```
Frontend nunca toca Supabase directo; API usa `service_role`. RLS bloquea todo salvo catálogo público.

## Estructura
```
supabase/migrations/0001_init.sql   esquema, funciones 5+1, vista member_card, RLS, bucket
supabase/seed.sql                   marcas, presentaciones, farmacia, T&C
src/
  index.ts                          app, cors, helmet, rate-limit
  config/env.ts                     env validadas
  lib/{supabase,errors}.ts          cliente + mapeo errores SQL→HTTP
  middleware/auth.ts                JWT Supabase + rol staff
  schemas/member.ts                 zod
  routes/{catalog,members,operations}.ts
```

## Endpoints
| Método | Ruta | Auth |
|---|---|---|
| GET | /api/catalog, /api/terms | público |
| POST | /api/members | público (rate-limit 10/min) |
| GET | /api/members/:code | público* |
| POST | /api/staff/purchases/food | cajero/admin |
| POST | /api/staff/purchases/pharmacy | cajero/admin |
| POST | /api/staff/redemptions | cajero/admin |

*Código `PG-AAAA-NNNN` es secuencial y adivinable → expone PII. Antes de producción: código aleatorio/QR firmado o login OTP por correo.

## Modelo de datos
tutors 1─N pets 1─1 memberships 1─N {food_purchases, pharmacy_purchases, benefit_redemptions}; memberships 1─N stamp_cycles; catálogo: food_brands 1─N food_presentations, pharmacy_products; sites, staff_profiles (auth.users), terms_versions.

## Setup
1. Crear proyecto Supabase. `supabase db push` (o pegar `0001_init.sql` y `seed.sql` en SQL editor).
2. Copiar `.env.example` → `.env.local`, llenar `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Crear usuario staff en Auth y fila en `staff_profiles`.
4. `npm run server` + `npm run dev`.

## Pendiente
- Conectar frontend (`fetch` a `VITE_API_URL`; proxy Vite `/api`).
- Proteger `GET /members/:code`.
- Decisión: ¿cambio de presentación descarta ciclo (actual) o rechaza compra?
- Correo de bienvenida, generación QR, panel admin, borrar demo helpers.
- Quitar `@google/genai` si no se usa.

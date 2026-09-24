# Deploy en cPanel

cPanel no corre Docker. Se despliegan dos piezas por separado:

| Pieza | Dónde | Qué subes |
|---|---|---|
| Frontend | `public_html` del dominio (ej. `petusgo.com`) | carpeta `dist/` (estático) |
| Backend | subdominio (ej. `api.petusgo.com`) con **Setup Node.js App** | un solo archivo `app.cjs` |

Requisito: tu hosting debe tener **"Setup Node.js App"** en cPanel (CloudLinux). Si no aparece, pídele al proveedor que lo active, o aloja solo el backend en Render/Railway y deja en cPanel el frontend.

## 1. Compilar en tu máquina

```bash
# Backend → backend/dist/app.cjs (todo incluido, no hace falta npm install en el servidor)
cd backend && npm install && npm run build

# Frontend → dist/ (la URL de la API se incrusta aquí)
cd .. && VITE_API_URL="https://api.petusgo.com/api" npm run build
```

## 2. Backend (subdominio api.)

1. cPanel → **Domains/Subdominios** → crea `api.petusgo.com` (y activa SSL: **SSL/TLS Status → Run AutoSSL**).
2. cPanel → **Setup Node.js App → Create Application**:
   - Node.js version: **18 o superior**
   - Application mode: **Production**
   - Application root: `petusgo-api` (carpeta nueva en tu home)
   - Application URL: `api.petusgo.com`
   - Application startup file: `app.cjs`
3. **File Manager** → sube `backend/dist/app.cjs` dentro de `~/petusgo-api/`.
4. En la misma pantalla de Node.js App → **Environment variables** → añade:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CORS_ORIGIN` = `https://petusgo.com` (origen exacto, sin `/` final; si usas `www.`, ese)
   - (`PORT` no: lo asigna Passenger)
5. Pulsa **Restart**. Prueba: `https://api.petusgo.com/api/health` → `{"ok":true}`.

Actualizar el backend después: sube el nuevo `app.cjs` y **Restart**.

> No subas `.env` ni la `service_role` al File Manager dentro de `public_html`. Solo en variables de entorno de la app.

## 3. Frontend

1. Sube el **contenido** de `dist/` (no la carpeta) a `~/public_html/` (o a la carpeta del dominio).
2. Abre `https://petusgo.com` y `https://petusgo.com/#/admin`.

## 4. Supabase

- Authentication → **URL Configuration**: Site URL = `https://petusgo.com`.
- Authentication → **SMTP Settings**: SMTP propio (puedes usar el correo de tu cPanel o Resend). El integrado de Supabase limita a pocos correos por hora.
- Migraciones 0001, 0002, 0003 ejecutadas y usuario staff creado.

## 5. Checklist de prueba

1. `api.../api/health` responde ok.
2. Landing carga; registrar un cliente → sin error CORS en consola (F12).
3. Login del cliente por código de correo llega y funciona.
4. `#/admin` entra con usuario staff y ve la inscripción.

## Problemas comunes

| Síntoma | Causa |
|---|---|
| "Failed to fetch" en la landing | `CORS_ORIGIN` no coincide exactamente, o `VITE_API_URL` mal (debe terminar en `/api`) → reconstruir el frontend |
| 503 / "Incomplete response" en la API | falta variable de entorno (`Missing env var` en el log) o no diste **Restart** |
| API no responde tras subir cambios | Restart en Node.js App |
| Mixed content bloqueado | frontend en https pero API en http → activa SSL en el subdominio |
| Correo con código no llega | SMTP de Supabase sin configurar / carpeta spam |

# UANDES Esports

Plataforma institucional de UANDES Esports con frontend en `Vite + React`, API liviana en `Fastify` y persistencia real en `PostgreSQL`.

## Arquitectura actual

La UI pública sigue siendo `config-driven`: navbar, páginas, bloques normales y páginas de torneo se siguen renderizando desde un `siteConfig`.

La diferencia es que ahora ese `siteConfig` ya no se guarda en `localStorage`, sino en una base de datos real a través de una API.

```text
frontend (Vite + React)
|-- UI publica
|-- panel admin
|-- auth UI
`-- consumo de /api

backend (Fastify)
|-- auth por cookie + JWT
|-- permisos por rol
|-- lectura/escritura de siteConfig
`-- bootstrap automatico de tablas y admin inicial

database (PostgreSQL)
|-- app_users
`-- site_configs
```

## Qué se mantiene

Se conserva la funcionalidad que ya tenía el sitio:

- páginas y navegación dinámicas
- bloques editables por tipo
- páginas de torneo
- fase de grupos con standings
- playoffs por rondas
- límites por ronda en cruces
- imágenes por URL en bloques y torneos
- panel admin visual

## Estructura

```text
.
|-- src/                # frontend Vite + React
|-- server/             # API Fastify + Postgres
|   |-- src/
|   `-- .env.example
|-- .env.example        # variables del frontend
|-- package.json
`-- vite.config.js
```

## Modelo de datos

### `app_users`

- `id`
- `username`
- `email`
- `display_name`
- `password_hash`
- `role` (`admin` | `user`)
- `created_at`
- `updated_at`

### `site_configs`

- `id`
- `data` (`jsonb`)
- `updated_by`
- `updated_at`

El `data` guarda el mismo árbol dinámico del sitio:

- `brand`
- `navbar.items`
- `pages`
- `blocks`
- `tournament.groups`
- `tournament.playoffs.rounds`

## Autenticación real

La sesión ahora se maneja con:

- login real contra backend
- registro de usuarios comunes
- cookie `httpOnly`
- JWT firmado en backend
- control de permisos por rol

Solo los usuarios con `role = admin` pueden editar contenido.

## Admin inicial

La API crea o actualiza automáticamente un admin inicial al arrancar usando estas variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`
- `ADMIN_EMAIL`

Si no cambias nada, la semilla por defecto es:

- usuario: `admin`
- password: `uandes2026`

## Variables de entorno

### Frontend `.env`

Usa [.env.example](./.env.example) como base:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_DEV_API_PROXY=http://localhost:4000
```

### Backend `server/.env`

Usa [server/.env.example](./server/.env.example) como base:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/uandesesports
DATABASE_SSL=false
JWT_SECRET=change-this-secret
SESSION_COOKIE_NAME=uandes_esports_session
SESSION_TTL_DAYS=7
CORS_ORIGINS=http://localhost:5173
COOKIE_SAME_SITE=lax
COOKIE_SECURE=false
ADMIN_USERNAME=admin
ADMIN_PASSWORD=uandes2026
ADMIN_NAME=Admin UANDES
ADMIN_EMAIL=admin@uandes.cl
```

## Cómo levantarlo localmente

### 1. Base de datos

Levanta un PostgreSQL local y crea una base, por ejemplo:

- base: `uandesesports`

### 2. Backend

```bash
cd server
npm install
npm run dev
```

La API arranca por defecto en `http://localhost:4000`.

### 3. Frontend

En otra terminal:

```bash
npm install
npm run dev
```

El frontend arranca por defecto en `http://localhost:5173`.

En desarrollo, Vite proxea `/api` hacia el backend.

## Scripts principales

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run dev:server`

### Backend

- `cd server && npm run dev`
- `cd server && npm start`

## Endpoints principales

### Auth

- `GET /api/auth/session`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

### Site config

- `GET /api/site-config`
- `PUT /api/site-config` (`admin` only)

### Health

- `GET /api/health`

## Flujo de despliegue en Render

### Frontend

Crear `Static Site`:

- `Root Directory`: vacío
- `Build Command`: `npm run build`
- `Publish Directory`: `dist`
- `Environment Variable`: `VITE_API_BASE_URL=https://TU-API.onrender.com/api`

### Backend

Crear `Web Service` apuntando a `server/`:

- `Root Directory`: `server`
- `Build Command`: `npm install`
- `Start Command`: `npm start`

Variables mínimas:

- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `COOKIE_SAME_SITE=none`
- `COOKIE_SECURE=true`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`
- `ADMIN_EMAIL`

### Base de datos

Crear `Render Postgres` y usar su `DATABASE_URL` en el backend.

## Notas de implementación

- El backend crea tablas automáticamente al iniciar.
- El backend también siembra el `site_config` inicial y el admin inicial.
- Si la API no responde, el frontend cae temporalmente al `defaultSiteConfig` para no dejar la web vacía.
- La arquitectura sigue lista para crecer a media library real, revisiones de contenido, múltiples admins o auditoría.

## Archivos clave

- [src/context/AuthContext.jsx](./src/context/AuthContext.jsx)
- [src/context/SiteConfigContext.jsx](./src/context/SiteConfigContext.jsx)
- [src/services/authService.js](./src/services/authService.js)
- [src/services/siteConfigService.js](./src/services/siteConfigService.js)
- [server/src/index.js](./server/src/index.js)
- [server/src/bootstrap/initializeDatabase.js](./server/src/bootstrap/initializeDatabase.js)
- [server/src/routes/authRoutes.js](./server/src/routes/authRoutes.js)
- [server/src/routes/siteConfigRoutes.js](./server/src/routes/siteConfigRoutes.js)

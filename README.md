# UANDES Esports

Plataforma institucional de UANDES Esports con frontend en `Vite + React`, API en `Fastify` y persistencia real en `PostgreSQL`.

## Arquitectura

La UI publica sigue siendo `config-driven`: navbar, paginas, bloques normales y paginas de torneo se renderizan desde un `siteConfig`.

Ahora ese `siteConfig` ya no se guarda en `localStorage`. Se lee y escribe en una API conectada a PostgreSQL.

```text
frontend (Vite + React)
|-- UI publica
|-- panel admin
|-- login / registro
`-- consumo de /api

backend (Fastify)
|-- auth por cookie + JWT
|-- permisos por rol
|-- lectura/escritura de siteConfig
`-- bootstrap automatico de tablas

database (PostgreSQL)
|-- app_users
`-- site_configs
```

## Lo que se mantiene

- paginas y navegacion dinamicas
- bloques editables por tipo
- paginas de torneo
- fase de grupos con standings
- playoffs por rondas
- limites por ronda en cruces
- imagenes por URL en bloques y torneos
- panel admin visual

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

Aunque la tabla mantiene `display_name`, en la UI el dato visible para la cuenta es el `nick gamer`.

### `site_configs`

- `id`
- `data` (`jsonb`)
- `updated_by`
- `updated_at`

El `data` guarda el arbol dinamico del sitio:

- `brand`
- `navbar.items`
- `pages`
- `blocks`
- `tournament.groups`
- `tournament.playoffs.rounds`

## Roles

Las cuentas nuevas se registran como `user`.

Si quieres convertir una cuenta en admin, hazlo directamente en la base de datos:

```sql
update app_users
set role = 'admin'
where username = 'tu_nick_gamer';
```

No existe un admin inicial sembrado por defecto.

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
```

## Como levantarlo localmente

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

- `Root Directory`: vacio
- `Build Command`: `npm run build`
- `Publish Directory`: `dist`
- `Environment Variable`: `VITE_API_BASE_URL=https://TU-API.onrender.com/api`

### Backend

Crear `Web Service` apuntando a `server/`:

- `Root Directory`: `server`
- `Build Command`: `npm install`
- `Start Command`: `npm start`

Variables minimas:

- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `COOKIE_SAME_SITE=none`
- `COOKIE_SECURE=true`

### Base de datos

Crear `Render Postgres` y usar su `DATABASE_URL` en el backend.

## Notas

- El backend crea tablas automaticamente al iniciar.
- El backend siembra el `site_config` inicial.
- Si vienes de una version anterior, el backend elimina la cuenta default `admin@uandes.cl` con username `admin`.
- Las cuentas nuevas nacen como `user`; el rol `admin` se asigna desde base de datos.
- Si la API no responde, el frontend cae temporalmente al `defaultSiteConfig` para no dejar la web vacia.

## Archivos clave

- [src/context/AuthContext.jsx](./src/context/AuthContext.jsx)
- [src/context/SiteConfigContext.jsx](./src/context/SiteConfigContext.jsx)
- [src/services/authService.js](./src/services/authService.js)
- [src/services/siteConfigService.js](./src/services/siteConfigService.js)
- [server/src/index.js](./server/src/index.js)
- [server/src/bootstrap/initializeDatabase.js](./server/src/bootstrap/initializeDatabase.js)
- [server/src/routes/authRoutes.js](./server/src/routes/authRoutes.js)
- [server/src/routes/siteConfigRoutes.js](./server/src/routes/siteConfigRoutes.js)

# UANDES Esports

UANDES Esports is a full-stack web platform for managing and publishing the institutional esports presence of Universidad de los Andes.

The project combines a public-facing landing site with a configurable admin experience for navigation, content blocks, tournament pages, team information, news, events, and staff data.

## Overview

This repository contains:

- a `Vite + React` frontend for the public site and admin UI
- a lightweight `Fastify` API for authentication and content persistence
- a `PostgreSQL` data layer for users and site configuration

The public website is config-driven. Navigation, pages, blocks, and tournament views are rendered from a single persisted `siteConfig` instead of being hardcoded into the UI.

## Tech Stack

- Frontend: `React`, `Vite`, `CSS Modules`
- Backend: `Fastify`, `JWT`, `@fastify/cookie`, `@fastify/cors`
- Database: `PostgreSQL`
- Deployment target: `Render` (`Static Site` + `Web Service` + `Postgres`)

## Core Capabilities

- Dynamic navigation managed from the admin panel
- Configurable standard pages with editable blocks
- Tournament pages with:
  - group stage tables
  - editable playoff rounds and matches
  - round-based match limits
  - team logos and match visuals by image URL
- Real user accounts with `user` and `admin` roles
- Persistent site configuration stored in PostgreSQL
- Responsive dark UI for both public site and admin workspace

## Architecture

```text
frontend (Vite + React)
|-- public website
|-- admin panel
|-- login / register flow
`-- API client layer

backend (Fastify)
|-- auth routes
|-- siteConfig routes
|-- session / role validation
`-- database bootstrap

database (PostgreSQL)
|-- app_users
`-- site_configs
```

### Config-Driven Rendering

The frontend renders the site from a dynamic `siteConfig` object that includes:

- brand metadata
- navbar items
- pages
- page blocks
- tournament groups
- tournament playoffs and matches
- footer content

This makes the site extensible without rewriting JSX for every new section or tournament.

## Repository Structure

```text
.
|-- server/
|   |-- src/
|   |   |-- bootstrap/
|   |   |-- config/
|   |   |-- lib/
|   |   |-- plugins/
|   |   |-- repositories/
|   |   `-- routes/
|   |-- .env.example
|   `-- package.json
|-- src/
|   |-- admin/
|   |-- components/
|   |-- config/
|   |-- context/
|   |-- data/
|   |-- services/
|   |-- styles/
|   `-- utils/
|-- .env.example
|-- package.json
`-- vite.config.js
```

## Data Model

### `app_users`

Stores user accounts and roles.

- `id`
- `username`
- `email`
- `display_name`
- `password_hash`
- `role` (`admin` | `user`)
- `created_at`
- `updated_at`

Although the table includes `display_name`, the visible account identity in the UI is the user's gamer nick.

### `site_configs`

Stores the full website configuration as `jsonb`.

- `id`
- `data`
- `updated_by`
- `updated_at`

## Authentication and Roles

- New registrations are created as `user`
- Admin editing permissions are enforced in the backend
- Public content can be read without admin access

There is no seeded default admin account.

To promote an existing user to admin, update the database manually:

```sql
update app_users
set role = 'admin'
where username = 'your_gamer_nick';
```

## Environment Variables

### Frontend

Use [.env.example](./.env.example) as a base:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_DEV_API_PROXY=http://localhost:4000
```

### Backend

Use [server/.env.example](./server/.env.example) as a base:

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

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL

### 1. Create a local database

Create a PostgreSQL database, for example:

- database name: `uandesesports`

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

The API runs by default at:

```txt
http://localhost:4000
```

### 3. Start the frontend

In a separate terminal:

```bash
npm install
npm run dev
```

The frontend runs by default at:

```txt
http://localhost:5173
```

During local development, Vite proxies `/api` requests to the backend.

## Available Scripts

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run dev:server`

### Backend

- `cd server && npm run dev`
- `cd server && npm start`

## API Endpoints

### Auth

- `GET /api/auth/session`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

### Site Configuration

- `GET /api/site-config`
- `PUT /api/site-config` (`admin` only)

### Health

- `GET /api/health`

## Deployment

The intended production setup uses Render:

### Frontend

Deploy as `Static Site`:

- `Root Directory`: empty
- `Build Command`: `npm run build`
- `Publish Directory`: `dist`
- environment variable:

```env
VITE_API_BASE_URL=https://YOUR_API.onrender.com/api
```

### Backend

Deploy as `Web Service`:

- `Root Directory`: `server`
- `Build Command`: `npm install`
- `Start Command`: `npm start`

Recommended backend environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `COOKIE_SAME_SITE=none`
- `COOKIE_SECURE=true`

### Database

Deploy `Render Postgres` and use:

- `Internal Database URL` for the Render web service
- `External Database URL` for external clients such as DBeaver

## Operational Notes

- The backend bootstraps required tables automatically on startup
- The backend seeds the initial `site_config` only if it does not already exist
- The frontend can fall back to the bundled default config if the API is temporarily unavailable
- Role-based editing is enforced server-side

## Key Files

- [src/App.jsx](./src/App.jsx)
- [src/context/AuthContext.jsx](./src/context/AuthContext.jsx)
- [src/context/SiteConfigContext.jsx](./src/context/SiteConfigContext.jsx)
- [src/services/authService.js](./src/services/authService.js)
- [src/services/siteConfigService.js](./src/services/siteConfigService.js)
- [server/src/index.js](./server/src/index.js)
- [server/src/bootstrap/initializeDatabase.js](./server/src/bootstrap/initializeDatabase.js)
- [server/src/plugins/sessionAuth.js](./server/src/plugins/sessionAuth.js)
- [server/src/routes/authRoutes.js](./server/src/routes/authRoutes.js)
- [server/src/routes/siteConfigRoutes.js](./server/src/routes/siteConfigRoutes.js)

## Status

This repository is under active development and continues to evolve as the UANDES Esports platform grows.

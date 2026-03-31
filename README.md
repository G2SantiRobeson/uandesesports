# UANDES Esports

Sitio institucional refactorizado a una arquitectura `config-driven` con `Vite + React + CSS Modules`.

## Resumen de arquitectura

La UI publica ya no depende de paginas ni bloques hardcodeados en JSX. Todo sale desde un `siteConfig` editable que se persiste en `localStorage`.

```text
siteConfig
|-- brand
|-- navbar
|   `-- items[]
|-- pages[]
|   |-- id
|   |-- pageType
|   |-- slug
|   |-- title
|   |-- visible
|   |-- blocks[]
|   |   |-- id
|   |   |-- type
|   |   |-- visible
|   |   |-- order
|   |   `-- content
|   `-- tournament
|       |-- seasonLabel
|       |-- bannerUrl
|       |-- groupsEnabled
|       |-- groups[]
|       `-- playoffs.rounds[]
`-- footer
```

## Capas principales

- `src/context/`
  Gestiona sesion demo y estado global del sitio.
- `src/data/defaultSiteConfig.js`
  Configuracion base inicial.
- `src/services/siteConfigService.js`
  Persistencia en `localStorage`, lista para reemplazar por API/BD.
- `src/components/renderers/`
  `NavigationRenderer`, `PageRenderer`, `BlockRenderer` y `TournamentPageRenderer`.
- `src/components/blocks/`
  Bloques extensibles como `hero`, `text`, `image`, `cards`, `news-list`, `events-list`, `team-list`, `cta` y `gallery`.
- `src/admin/`
  Panel visual para editar paginas, navbar, bloques, torneos y footer.

## Estructura

```text
src/
|-- admin/
|   |-- forms/
|   `-- panels/
|-- components/
|   |-- blocks/
|   |-- layout/
|   |-- renderers/
|   `-- shared/
|-- config/
|-- context/
|-- data/
|-- services/
|-- styles/
`-- utils/
```

## Funcionalidad admin

Con el panel admin puedes:

- crear nuevas paginas/pestanas
- crear paginas de torneo administrables
- editar nombre, slug y visibilidad
- mostrar u ocultar paginas en navbar
- mover paginas arriba o abajo
- eliminar paginas
- agregar bloques por tipo
- editar contenido de cada bloque
- mover bloques arriba o abajo
- ocultar o eliminar bloques
- crear grupos de torneo y editar sus tablas
- crear rondas de playoffs y editar sus cruces
- editar footer y enlaces sociales

## Paginas de torneo

Las paginas de torneo se modelan como `pageType: "tournament-page"` dentro del mismo `siteConfig`, para reutilizar la arquitectura dinamica ya existente.

Cada torneo puede definir:

- nombre, slug, descripcion y visibilidad
- banner opcional y temporada
- fase de grupos activable o desactivable
- multiples grupos con tabla editable
- playoffs activables o desactivables
- multiples rondas con cruces editables

La persistencia sigue pasando por `src/services/siteConfigService.js`, por lo que cuando exista backend solo hay que reemplazar esa capa por llamadas a Supabase, Firebase o una API REST.

## Persistencia actual

Se usa `localStorage` para:

- configuracion del sitio
- sesion admin demo

Los puntos para reemplazar luego por backend real estan comentados en:

- `src/services/siteConfigService.js`
- `src/services/authService.js`

## Credenciales demo

- usuario: `admin`
- password: `uandes2026`

## Como ejecutar

1. Instala Node.js 18 o superior.
2. Ejecuta `npm install`.
3. Ejecuta `npm run dev`.
4. Para build de produccion, ejecuta `npm run build`.

## Hosting recomendado

- Cloudflare Pages
- Netlify
- Vercel

export const defaultSiteConfig = {
  brand: {
    shortName: 'UE',
    name: 'UANDES Esports',
    tagline: 'Competencia, comunidad y representacion universitaria.',
  },
  navbar: {
    adminLabel: 'Admin',
    items: [
      { id: 'nav-home', pageId: 'page-home', visible: true, order: 0 },
      { id: 'nav-about', pageId: 'page-about', visible: true, order: 1 },
      { id: 'nav-teams', pageId: 'page-teams', visible: true, order: 2 },
      { id: 'nav-news', pageId: 'page-news', visible: true, order: 3 },
      { id: 'nav-staff', pageId: 'page-staff', visible: true, order: 4 },
      { id: 'nav-events', pageId: 'page-events', visible: true, order: 5 },
    ],
  },
  pages: [
    {
      id: 'page-home',
      pageType: 'standard',
      slug: 'inicio',
      navLabel: 'Inicio',
      title: 'Inicio',
      description: 'Portada principal de la iniciativa UANDES Esports.',
      visible: true,
      showHeader: false,
      order: 0,
      blocks: [
        {
          id: 'block-home-hero',
          type: 'hero',
          visible: true,
          order: 0,
          content: {
            eyebrow: 'Escena universitaria competitiva',
            title: 'Una presencia sobria y competitiva para UANDES Esports.',
            description:
              'Plataforma institucional para comunicar divisiones, noticias, actividades y cultura competitiva con una identidad moderna, minimalista y preparada para crecer.',
            actions: [
              {
                id: 'action-home-1',
                label: 'Ver divisiones',
                href: '#/divisiones',
                style: 'primary',
                visible: true,
              },
              {
                id: 'action-home-2',
                label: 'Contacto y redes',
                href: '#contacto',
                style: 'secondary',
                visible: true,
              },
            ],
            panelLabel: 'Snapshot 2026',
            panelStatus: 'Activo',
            panelText:
              'UANDES Esports busca consolidar una escena universitaria ordenada, competitiva y sostenible, con foco en comunidad, proyeccion y representacion institucional.',
            stats: [
              { id: 'stat-home-1', value: '4+', label: 'divisiones activas' },
              { id: 'stat-home-2', value: '4', label: 'miembros en staff' },
              { id: 'stat-home-3', value: '12 abr 2026', label: 'proximo evento' },
            ],
          },
        },
        {
          id: 'block-home-cta',
          type: 'cta',
          visible: true,
          order: 1,
          content: {
            eyebrow: 'Base administrable',
            title: 'Todo el sitio puede editarse desde el panel Admin.',
            description:
              'Navegacion, paginas, bloques y contenido quedan desacoplados del JSX para que el sitio pueda evolucionar sin tocar codigo fuente.',
            actions: [
              {
                id: 'cta-home-1',
                label: 'Ir a noticias',
                href: '#/noticias',
                style: 'primary',
                visible: true,
              },
              {
                id: 'cta-home-2',
                label: 'Ver eventos',
                href: '#/eventos',
                style: 'secondary',
                visible: true,
              },
            ],
          },
        },
      ],
    },
    {
      id: 'page-about',
      pageType: 'standard',
      slug: 'sobre',
      navLabel: 'Sobre',
      title: 'Sobre UANDES Esports',
      description:
        'Una presencia digital que equilibra tono institucional y cultura esports con orden visual y buena legibilidad.',
      visible: true,
      showHeader: true,
      order: 1,
      blocks: [
        {
          id: 'block-about-text',
          type: 'text',
          visible: true,
          order: 0,
          content: {
            eyebrow: 'Sobre UANDES Esports',
            title: 'Una estructura digital pensada para comunicar con claridad.',
            body:
              'UANDES Esports necesita una presencia digital que se vea profesional en contexto universitario, pero que siga hablando el lenguaje del ecosistema competitivo. Esta base prioriza orden visual, rapidez, mantenibilidad y una integracion real con API y base de datos.',
            highlightLabel: 'Base lista para evolucionar',
            highlightText:
              'La arquitectura ahora es config-driven: paginas, navbar y bloques se administran desde la interfaz y persisten en una API real con base de datos.',
          },
        },
        {
          id: 'block-about-cards',
          type: 'cards',
          visible: true,
          order: 1,
          content: {
            eyebrow: 'Pilares',
            title: 'Tres focos para comunicar y escalar.',
            description:
              'Estos bloques pueden editarse, reordenarse o reemplazarse desde el panel admin.',
            items: [
              {
                id: 'about-item-1',
                eyebrow: 'Competencia',
                title: 'Competencia organizada',
                description:
                  'Procesos claros para divisiones, tryouts, calendario y seguimiento deportivo sin perder orden institucional.',
                meta: ['Operativo', 'Escalable'],
                footer: 'Modelo editable',
                accent: 'steel',
              },
              {
                id: 'about-item-2',
                eyebrow: 'Comunidad',
                title: 'Comunidad universitaria',
                description:
                  'Un espacio donde jugadores, staff y creadores pueden crecer con identidad comun y representacion consistente.',
                meta: ['Universitario', 'Colaborativo'],
                footer: 'Cultura compartida',
                accent: 'warm',
              },
              {
                id: 'about-item-3',
                eyebrow: 'Proyeccion',
                title: 'Proyeccion sostenible',
                description:
                  'Una base modular para sumar resultados, rankings, formularios y nuevas integraciones sin rehacer el frontend.',
                meta: ['Config-driven', 'Future-proof'],
                footer: 'Lista para backend',
                accent: 'steel',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'page-teams',
      pageType: 'standard',
      slug: 'divisiones',
      navLabel: 'Divisiones',
      title: 'Juegos y divisiones',
      description: 'Lineas competitivas configurables y listas para crecer.',
      visible: true,
      showHeader: true,
      order: 2,
      blocks: [
        {
          id: 'block-teams-list',
          type: 'team-list',
          visible: true,
          order: 0,
          content: {
            eyebrow: 'Juegos y divisiones',
            title: 'Divisiones competitivas con identidad propia.',
            description:
              'Cada linea puede escalar con resultados, estadisticas, formularios o perfiles individuales cuando la fuente de datos sea externa.',
            items: [
              {
                id: 'team-item-1',
                eyebrow: 'Division principal',
                title: 'VALORANT',
                description:
                  'Roster enfocado en juego coordinado, revision tactica y participacion constante en entornos universitarios y amateur.',
                meta: ['Scrims semanales y clasificatorios', '5 titulares + banca'],
                footer: 'Enfoque: disciplina competitiva',
                accent: 'steel',
              },
              {
                id: 'team-item-2',
                eyebrow: 'Division estrategica',
                title: 'League of Legends',
                description:
                  'Espacio competitivo para macrojuego, trabajo de draft y consolidacion de una identidad de equipo estable.',
                meta: ['Entrenamiento por bloques', '5 titulares + academia'],
                footer: 'Enfoque: consistencia de macro',
                accent: 'warm',
              },
              {
                id: 'team-item-3',
                eyebrow: 'Division velocidad',
                title: 'Rocket League',
                description:
                  'Plantel orientado a precision mecanica, rotaciones limpias y participacion en formatos cortos de alto ritmo.',
                meta: ['Series cortas y ladders', '3 titulares + suplentes'],
                footer: 'Enfoque: ritmo y coordinacion',
                accent: 'steel',
              },
              {
                id: 'team-item-4',
                eyebrow: 'Division individual',
                title: 'EA FC',
                description:
                  'Linea competitiva para jugadores con foco en consistencia, analisis de rivales y representacion institucional.',
                meta: ['Torneos internos y abiertos', 'Jugadores por ranking'],
                footer: 'Enfoque: regularidad competitiva',
                accent: 'warm',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'page-news',
      pageType: 'standard',
      slug: 'noticias',
      navLabel: 'Noticias',
      title: 'Noticias y anuncios',
      description: 'Comunicacion institucional clara, editable y ordenada.',
      visible: true,
      showHeader: true,
      order: 3,
      blocks: [
        {
          id: 'block-news-list',
          type: 'news-list',
          visible: true,
          order: 0,
          content: {
            eyebrow: 'Noticias y anuncios',
            title: 'Actualizaciones institucionales faciles de mantener.',
            description:
              'Estas tarjetas pueden reemplazarse luego por datos remotos desde una API o CMS sin tocar el renderer.',
            items: [
              {
                id: 'news-item-1',
                eyebrow: 'Anuncio',
                title: 'Se abre el ciclo competitivo 2026',
                description:
                  'UANDES Esports inicia su calendario con procesos de integracion, scrims y clasificatorios internos para nuevas divisiones.',
                meta: ['29 mar 2026', 'Convocatoria abierta'],
                footer: 'Edicion desde panel admin',
                accent: 'steel',
              },
              {
                id: 'news-item-2',
                eyebrow: 'Comunidad',
                title: 'Bootcamp de preparacion para capitanes',
                description:
                  'Una jornada enfocada en liderazgo, coordinacion de equipo y preparacion tactica para capitanes y subcapitanes.',
                meta: ['04 abr 2026', 'Presencial en campus'],
                footer: 'Actualizable sin tocar JSX',
                accent: 'neutral',
              },
              {
                id: 'news-item-3',
                eyebrow: 'Institucional',
                title: 'Nueva linea editorial para redes y coberturas',
                description:
                  'El area de comunicaciones estrena una pauta visual mas consistente para resultados, historias y anuncios competitivos.',
                meta: ['11 abr 2026', 'Brand refresh'],
                footer: 'Preparado para API',
                accent: 'warm',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'page-staff',
      pageType: 'standard',
      slug: 'staff',
      navLabel: 'Staff',
      title: 'Staff y equipo',
      description: 'Roles de apoyo visibles, editables y listos para escalar.',
      visible: true,
      showHeader: true,
      order: 4,
      blocks: [
        {
          id: 'block-staff-cards',
          type: 'cards',
          visible: true,
          order: 0,
          content: {
            eyebrow: 'Staff y equipo',
            title: 'Un equipo de apoyo que sostiene la operacion.',
            description:
              'El staff queda modelado como coleccion editable y sincronizable para que el equipo pueda administrarlo desde una fuente de datos real.',
            items: [
              {
                id: 'staff-item-1',
                eyebrow: 'Gestion institucional',
                title: 'Valentina Rojas',
                description:
                  'Coordina lineamientos, alianzas internas y crecimiento sostenible del proyecto dentro de la universidad.',
                meta: ['Directora general'],
                footer: 'Gestion y coordinacion',
                accent: 'warm',
              },
              {
                id: 'staff-item-2',
                eyebrow: 'Performance y scouting',
                title: 'Tomas Vergara',
                description:
                  'Supervisa tryouts, calendario competitivo, criterios de seleccion y seguimiento deportivo de las divisiones.',
                meta: ['Coordinador competitivo'],
                footer: 'Competencia y procesos',
                accent: 'steel',
              },
              {
                id: 'staff-item-3',
                eyebrow: 'Contenido y marca',
                title: 'Catalina Mena',
                description:
                  'Gestiona anuncios, coberturas, piezas visuales y consistencia de la identidad publica de UANDES Esports.',
                meta: ['Comunicaciones'],
                footer: 'Editorial y branding',
                accent: 'warm',
              },
              {
                id: 'staff-item-4',
                eyebrow: 'Eventos y soporte',
                title: 'Martin Ibacache',
                description:
                  'Organiza la operacion de torneos, activaciones presenciales y coordinacion tecnica para jornadas competitivas.',
                meta: ['Operaciones'],
                footer: 'Logistica competitiva',
                accent: 'steel',
              },
            ],
          },
        },
      ],
    },
    {
      id: 'page-events',
      pageType: 'standard',
      slug: 'eventos',
      navLabel: 'Eventos',
      title: 'Proximos eventos',
      description: 'Calendario editable para torneos, comunidad y activaciones.',
      visible: true,
      showHeader: true,
      order: 5,
      blocks: [
        {
          id: 'block-events-list',
          type: 'events-list',
          visible: true,
          order: 0,
          content: {
            eyebrow: 'Proximos eventos',
            title: 'Calendario visible para competencia, comunidad y torneos.',
            description:
              'La agenda queda modelada como bloque editable y se sincroniza con la API para mantener una experiencia administrable real.',
            items: [
              {
                id: 'event-item-1',
                eyebrow: 'Torneo interno',
                title: 'Open Qualifier VALORANT',
                description:
                  'Clasificatorio interno para definir roster ampliado y jugadores de apoyo para la temporada de apertura.',
                meta: ['12 abr 2026', 'Campus UANDES / Sala Multimedia'],
                footer: 'Inscripciones activas',
                accent: 'steel',
              },
              {
                id: 'event-item-2',
                eyebrow: 'Actividad de comunidad',
                title: 'Tryouts interdivision',
                description:
                  'Sesion abierta para evaluar nivel mecanico, comunicacion y disciplina competitiva en nuevas incorporaciones.',
                meta: ['26 abr 2026', 'Online'],
                footer: 'Cupos limitados',
                accent: 'warm',
              },
              {
                id: 'event-item-3',
                eyebrow: 'Esports universitario',
                title: 'Encuentro UANDES x universidades invitadas',
                description:
                  'Fecha amistosa con foco en fogueo competitivo, transmision y fortalecimiento de la escena universitaria.',
                meta: ['09 may 2026', 'Streaming + presencial'],
                footer: 'Proximamente',
                accent: 'steel',
              },
            ],
          },
        },
        {
          id: 'block-events-gallery',
          type: 'gallery',
          visible: true,
          order: 1,
          content: {
            eyebrow: 'Escena y comunidad',
            title: 'Momentos para destacar en la web.',
            description:
              'La galeria permite sumar imagenes por URL sin depender de cambios manuales en el codigo.',
            images: [
              {
                id: 'gallery-1',
                url:
                  'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=900&q=80',
                alt: 'Estacion de gaming en evento presencial',
                caption: 'Activaciones y comunidad',
              },
              {
                id: 'gallery-2',
                url:
                  'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80',
                alt: 'Competencia de esports en escenario',
                caption: 'Escena competitiva',
              },
            ],
          },
        },
      ],
    },
  ],
  footer: {
    eyebrow: 'UANDES Esports',
    title: 'Competencia, comunidad y representacion universitaria.',
    description:
      'Proyecto preparado para crecer con nuevas divisiones, calendario competitivo y una capa real de autenticacion, API y base de datos.',
    contactEmail: 'esports@uandes.cl',
    location: 'Universidad de los Andes, Santiago de Chile',
    copyright: '(c) 2026 UANDES Esports. Plataforma dinamica con backend y persistencia real.',
    socialLinks: [
      { id: 'social-1', label: 'Instagram', href: 'https://instagram.com', visible: true },
      { id: 'social-2', label: 'X / Twitter', href: 'https://x.com', visible: true },
      { id: 'social-3', label: 'Twitch', href: 'https://twitch.tv', visible: true },
      { id: 'social-4', label: 'Discord', href: 'https://discord.com', visible: true },
    ],
  },
};

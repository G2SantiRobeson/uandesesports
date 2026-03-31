const blockTypeOptions = [
  { value: 'hero', label: 'Hero' },
  { value: 'text', label: 'Texto' },
  { value: 'image', label: 'Imagen' },
  { value: 'cards', label: 'Cards' },
  { value: 'news-list', label: 'Noticias' },
  { value: 'events-list', label: 'Eventos' },
  { value: 'team-list', label: 'Equipos' },
  { value: 'cta', label: 'CTA' },
  { value: 'gallery', label: 'Galeria' },
];

const blockAdminTones = {
  hero: {
    accent: '#8fb7ca',
    surface: 'rgba(143, 183, 202, 0.08)',
    line: 'rgba(143, 183, 202, 0.18)',
  },
  text: {
    accent: '#b8c4d2',
    surface: 'rgba(184, 196, 210, 0.06)',
    line: 'rgba(184, 196, 210, 0.16)',
  },
  image: {
    accent: '#a7c7b9',
    surface: 'rgba(167, 199, 185, 0.08)',
    line: 'rgba(167, 199, 185, 0.18)',
  },
  cards: {
    accent: '#c8b08b',
    surface: 'rgba(200, 176, 139, 0.08)',
    line: 'rgba(200, 176, 139, 0.18)',
  },
  'news-list': {
    accent: '#8cb5bf',
    surface: 'rgba(140, 181, 191, 0.08)',
    line: 'rgba(140, 181, 191, 0.18)',
  },
  'events-list': {
    accent: '#b8a8cf',
    surface: 'rgba(184, 168, 207, 0.08)',
    line: 'rgba(184, 168, 207, 0.18)',
  },
  'team-list': {
    accent: '#9db8e1',
    surface: 'rgba(157, 184, 225, 0.08)',
    line: 'rgba(157, 184, 225, 0.18)',
  },
  cta: {
    accent: '#d0bea1',
    surface: 'rgba(208, 190, 161, 0.08)',
    line: 'rgba(208, 190, 161, 0.18)',
  },
  gallery: {
    accent: '#8fc5be',
    surface: 'rgba(143, 197, 190, 0.08)',
    line: 'rgba(143, 197, 190, 0.18)',
  },
};

const tournamentRoundPresets = [
  'Octavos de final',
  'Cuartos de final',
  'Semifinales',
  'Final',
];

export function createId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'pagina';
}

export function ensureUniqueSlug(candidate, pages, currentPageId) {
  const baseSlug = slugify(candidate);
  const usedSlugs = new Set(
    pages
      .filter((page) => page.id !== currentPageId)
      .map((page) => slugify(page.slug)),
  );

  if (!usedSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let index = 2;
  let nextSlug = `${baseSlug}-${index}`;

  while (usedSlugs.has(nextSlug)) {
    index += 1;
    nextSlug = `${baseSlug}-${index}`;
  }

  return nextSlug;
}

export function sortByOrder(items = []) {
  return [...items].sort((firstItem, secondItem) => {
    const firstOrder = firstItem.order ?? 0;
    const secondOrder = secondItem.order ?? 0;
    return firstOrder - secondOrder;
  });
}

export function normalizeOrderedItems(items = []) {
  return sortByOrder(items).map((item, index) => ({
    ...item,
    order: index,
  }));
}

export function moveOrderedItem(items, itemId, direction) {
  const orderedItems = normalizeOrderedItems(items);
  const currentIndex = orderedItems.findIndex((item) => item.id === itemId);

  if (currentIndex === -1) {
    return orderedItems;
  }

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= orderedItems.length) {
    return orderedItems;
  }

  const nextItems = [...orderedItems];
  const [movedItem] = nextItems.splice(currentIndex, 1);
  nextItems.splice(targetIndex, 0, movedItem);

  return normalizeOrderedItems(nextItems);
}

export function getOrderedItemPosition(items = [], itemId) {
  return sortByOrder(items).findIndex((item) => item.id === itemId);
}

export function canMoveOrderedItem(items = [], itemId, direction) {
  const currentIndex = getOrderedItemPosition(items, itemId);

  if (currentIndex === -1) {
    return false;
  }

  if (direction === 'up') {
    return currentIndex > 0;
  }

  return currentIndex < items.length - 1;
}

export function getBlockTypeOptions() {
  return blockTypeOptions;
}

export function getBlockAdminTone(type) {
  return blockAdminTones[type] || blockAdminTones.text;
}

export function getTournamentRoundMatchLimit(roundName = '') {
  const normalizedRoundName = slugify(roundName);

  if (!normalizedRoundName) {
    return null;
  }

  if (normalizedRoundName.includes('octavos')) {
    return 8;
  }

  if (normalizedRoundName.includes('cuartos')) {
    return 4;
  }

  if (normalizedRoundName.includes('semifinal')) {
    return 2;
  }

  if (normalizedRoundName.includes('final')) {
    return 1;
  }

  return null;
}

function createAction(label, href, style = 'primary') {
  return {
    id: createId('action'),
    label,
    href,
    style,
    visible: true,
  };
}

function getDefaultGroupName(index) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[index]
    ? `Grupo ${alphabet[index]}`
    : `Grupo ${index + 1}`;
}

function parseNumericValue(value) {
  const parsedValue = Number.parseFloat(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function normalizeStandings(standings = []) {
  return normalizeOrderedItems(
    standings.map((standing) => ({
      ...standing,
      teamName: standing.teamName || '',
      teamLogoUrl: standing.teamLogoUrl || '',
      teamLogoAlt: standing.teamLogoAlt || '',
      winrate: standing.winrate || '',
      points: standing.points ?? '',
    })),
  );
}

function normalizeTournamentData(tournament = {}) {
  return {
    seasonLabel: tournament.seasonLabel || '',
    bannerUrl: tournament.bannerUrl || '',
    bannerAlt: tournament.bannerAlt || 'Banner del torneo',
    groupsEnabled: tournament.groupsEnabled ?? true,
    playoffsEnabled: tournament.playoffsEnabled ?? true,
    groups: normalizeOrderedItems(
      (tournament.groups || []).map((group, index) => ({
        ...group,
        name: group.name || getDefaultGroupName(index),
        visible: group.visible ?? true,
        standings: normalizeStandings(group.standings),
      })),
    ),
    playoffs: {
      rounds: normalizeOrderedItems(
        (tournament.playoffs?.rounds || []).map((round, index) => ({
          ...round,
          name: round.name || tournamentRoundPresets[index] || `Ronda ${index + 1}`,
          visible: round.visible ?? true,
          matches: normalizeOrderedItems(
            (round.matches || []).map((match) => ({
              ...match,
              teamA: match.teamA || '',
              teamALogoUrl: match.teamALogoUrl || '',
              teamALogoAlt: match.teamALogoAlt || '',
              teamB: match.teamB || '',
              teamBLogoUrl: match.teamBLogoUrl || '',
              teamBLogoAlt: match.teamBLogoAlt || '',
              scoreA: match.scoreA ?? '',
              scoreB: match.scoreB ?? '',
              winner: match.winner || '',
              note: match.note || '',
            })),
          ),
        })),
      ),
    },
  };
}

export function createDefaultTournamentStandingRow(label = 'Nuevo equipo') {
  return {
    id: createId('standing'),
    teamName: label,
    teamLogoUrl: '',
    teamLogoAlt: '',
    winrate: '0%',
    points: '0',
    order: 0,
  };
}

export function createDefaultTournamentGroup(label, groups = []) {
  return {
    id: createId('group'),
    name: label?.trim() || getDefaultGroupName(groups.length),
    visible: true,
    order: groups.length,
    standings: [],
  };
}

export function createDefaultTournamentMatch() {
  return {
    id: createId('match'),
    teamA: 'Equipo A',
    teamALogoUrl: '',
    teamALogoAlt: '',
    teamB: 'Equipo B',
    teamBLogoUrl: '',
    teamBLogoAlt: '',
    scoreA: '',
    scoreB: '',
    winner: '',
    note: '',
    order: 0,
  };
}

export function createDefaultTournamentRound(rounds = []) {
  return {
    id: createId('round'),
    name:
      tournamentRoundPresets[rounds.length] || `Ronda ${rounds.length + 1}`,
    visible: true,
    order: rounds.length,
    matches: [],
  };
}

export function createEmptyTournamentData() {
  return {
    seasonLabel: '',
    bannerUrl: '',
    bannerAlt: 'Banner del torneo',
    groupsEnabled: true,
    playoffsEnabled: true,
    groups: [],
    playoffs: {
      rounds: [],
    },
  };
}

export function sortTournamentStandingsByPoints(standings = []) {
  return normalizeOrderedItems(
    [...standings].sort((firstRow, secondRow) => {
      const pointsDelta =
        parseNumericValue(secondRow.points) - parseNumericValue(firstRow.points);

      if (pointsDelta !== 0) {
        return pointsDelta;
      }

      const winrateDelta =
        parseNumericValue(secondRow.winrate) - parseNumericValue(firstRow.winrate);

      if (winrateDelta !== 0) {
        return winrateDelta;
      }

      return String(firstRow.teamName || '').localeCompare(
        String(secondRow.teamName || ''),
      );
    }),
  );
}

export function createDefaultBlock(type) {
  const baseBlock = {
    id: createId('block'),
    type,
    visible: true,
    order: 0,
    content: {},
  };

  switch (type) {
    case 'hero':
      return {
        ...baseBlock,
        content: {
          eyebrow: 'Escena universitaria competitiva',
          title: 'Un nuevo bloque hero listo para editar.',
          description:
            'Edita titulos, textos, acciones y metricas desde el panel admin sin tocar el codigo fuente.',
          actions: [
            createAction('Explorar pagina', '#/inicio', 'primary'),
            createAction('Contacto', '#contacto', 'secondary'),
          ],
          panelLabel: 'Snapshot',
          panelStatus: 'Activo',
          panelText:
            'Este panel lateral se edita desde configuracion. Puedes cambiar texto, acciones y datos destacados.',
          imageUrl: '',
          imageAlt: '',
          caption: '',
          stats: [
            { id: createId('stat'), value: '4+', label: 'divisiones activas' },
            { id: createId('stat'), value: 'Admin', label: 'panel habilitado' },
            { id: createId('stat'), value: 'Local', label: 'persistencia' },
          ],
        },
      };
    case 'image':
      return {
        ...baseBlock,
        content: {
          eyebrow: 'Bloque visual',
          title: 'Imagen editable por URL',
          description:
            'Usa este bloque para destacar una escena, una actividad o una pieza institucional.',
          imageUrl:
            'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
          imageAlt: 'Escena de esports universitaria',
          caption: 'Puedes reemplazar esta URL desde el panel admin.',
          imageAlign: 'right',
        },
      };
    case 'cards':
    case 'news-list':
    case 'events-list':
    case 'team-list':
      return {
        ...baseBlock,
        content: {
          eyebrow: 'Coleccion',
          title: 'Nuevo bloque de cards',
          description:
            'Agrega, elimina y reordena items desde el panel para mantener el contenido siempre editable.',
          items: [
            {
              id: createId('item'),
              eyebrow: 'Etiqueta',
              title: 'Elemento destacado',
              description:
                'Este item es completamente editable desde el panel admin.',
              imageUrl: '',
              imageAlt: '',
              meta: ['Meta 1', 'Meta 2'],
              footer: 'Pie opcional',
              accent: 'steel',
            },
          ],
        },
      };
    case 'cta':
      return {
        ...baseBlock,
        content: {
          eyebrow: 'CTA',
          title: 'Invita a una accion concreta',
          description:
            'Este bloque sirve para postulaciones, formularios, redes o llamados institucionales.',
          actions: [
            createAction('Primera accion', '#/inicio', 'primary'),
            createAction('Segunda accion', '#contacto', 'secondary'),
          ],
          imageUrl: '',
          imageAlt: '',
          caption: '',
        },
      };
    case 'gallery':
      return {
        ...baseBlock,
        content: {
          eyebrow: 'Galeria',
          title: 'Imagenes y momentos destacados',
          description:
            'La galeria acepta imagenes por URL y textos breves para cada item.',
          images: [
            {
              id: createId('image'),
              url:
                'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
              alt: 'Jugadores en jornada competitiva',
              caption: 'Competencia y comunidad',
            },
          ],
        },
      };
    case 'text':
    default:
      return {
        ...baseBlock,
        type: 'text',
        content: {
          eyebrow: 'Texto',
          title: 'Nuevo bloque de texto',
          body:
            'Este bloque funciona bien para contexto institucional, explicaciones, resumenes o lineamientos de una pagina.',
          imageUrl: '',
          imageAlt: '',
          caption: '',
          highlightLabel: 'Nota',
          highlightText:
            'Puedes dejar este destacado, editarlo o vaciarlo segun la necesidad de la pagina.',
        },
      };
  }
}

export function createDefaultPage(label, pages = []) {
  const title = label?.trim() || 'Nueva pagina';
  const slug = ensureUniqueSlug(title, pages);

  const page = {
    id: createId('page'),
    pageType: 'standard',
    slug,
    navLabel: title,
    title,
    description:
      'Nueva pagina configurable. Puedes editar el contenido, el slug y sus bloques desde el panel admin.',
    visible: true,
    showHeader: true,
    order: pages.length,
    blocks: [
      {
        ...createDefaultBlock('text'),
        order: 0,
      },
    ],
  };

  const navItem = {
    id: createId('nav'),
    pageId: page.id,
    visible: true,
    order: pages.length,
  };

  return { page, navItem };
}

export function createDefaultTournamentPage(label, pages = []) {
  const title = label?.trim() || 'Nuevo torneo';
  const slug = ensureUniqueSlug(title, pages);

  const page = {
    id: createId('page'),
    pageType: 'tournament-page',
    slug,
    navLabel: title,
    title,
    description:
      'Pagina de torneo administrable con fase de grupos y playoffs editables desde el panel Admin.',
    visible: true,
    showHeader: false,
    order: pages.length,
    blocks: [],
    tournament: {
      ...createEmptyTournamentData(),
      seasonLabel: 'Temporada 2026',
    },
  };

  const navItem = {
    id: createId('nav'),
    pageId: page.id,
    visible: true,
    order: pages.length,
  };

  return { page, navItem };
}

function normalizePage(page) {
  const pageType = page.pageType === 'tournament-page' ? 'tournament-page' : 'standard';

  return {
    ...page,
    pageType,
    slug: slugify(page.slug || page.title || page.navLabel || 'pagina'),
    visible: page.visible ?? true,
    showHeader: pageType === 'standard' ? page.showHeader ?? true : false,
    blocks:
      pageType === 'standard'
        ? normalizeOrderedItems(
            (page.blocks || []).map((block) => ({
              ...block,
              visible: block.visible ?? true,
              content: block.content || {},
            })),
          )
        : [],
    tournament:
      pageType === 'tournament-page'
        ? normalizeTournamentData(page.tournament)
        : undefined,
  };
}

export function normalizeSiteConfig(siteConfig) {
  const nextPages = normalizeOrderedItems(
    (siteConfig.pages || []).map((page) => normalizePage(page)),
  );

  const validPageIds = new Set(nextPages.map((page) => page.id));

  const nextNavbarItems = normalizeOrderedItems(
    (siteConfig.navbar?.items || []).filter((item) => validPageIds.has(item.pageId)),
  );

  return {
    ...siteConfig,
    navbar: {
      ...siteConfig.navbar,
      items: nextNavbarItems,
    },
    pages: nextPages,
  };
}

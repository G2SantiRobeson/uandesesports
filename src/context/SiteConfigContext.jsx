import { createContext, useContext, useEffect, useState } from 'react';
import {
  loadSiteConfig,
  resetSiteConfig,
  saveSiteConfig,
} from '../services/siteConfigService';
import {
  canMoveOrderedItem,
  createDefaultBlock,
  createDefaultPage,
  createDefaultTournamentGroup,
  createDefaultTournamentMatch,
  createDefaultTournamentPage,
  createDefaultTournamentRound,
  createDefaultTournamentStandingRow,
  ensureUniqueSlug,
  getTournamentRoundMatchLimit,
  moveOrderedItem,
  normalizeOrderedItems,
  normalizeSiteConfig,
  sortByOrder,
  sortTournamentStandingsByPoints,
} from '../utils/siteConfigUtils';

const SiteConfigContext = createContext(null);

function updatePageCollection(pages, pageId, callback) {
  return pages.map((page) => {
    if (page.id !== pageId) {
      return page;
    }

    return callback(page);
  });
}

function updateTournamentPageCollection(pages, pageId, callback) {
  return updatePageCollection(pages, pageId, (page) => {
    if (page.pageType !== 'tournament-page') {
      return page;
    }

    return {
      ...page,
      tournament: callback(page.tournament),
    };
  });
}

export function SiteConfigProvider({ children }) {
  const [siteConfig, setSiteConfig] = useState(() => loadSiteConfig());

  useEffect(() => {
    saveSiteConfig(siteConfig);
  }, [siteConfig]);

  function applyConfigUpdate(updater) {
    setSiteConfig((currentConfig) => normalizeSiteConfig(updater(currentConfig)));
  }

  function createPage(label) {
    const creationResult = createDefaultPage(label, siteConfig.pages);

    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: [...currentConfig.pages, creationResult.page],
      navbar: {
        ...currentConfig.navbar,
        items: [...currentConfig.navbar.items, creationResult.navItem],
      },
    }));

    return creationResult.page.id;
  }

  function createTournamentPage(label) {
    const creationResult = createDefaultTournamentPage(label, siteConfig.pages);

    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: [...currentConfig.pages, creationResult.page],
      navbar: {
        ...currentConfig.navbar,
        items: [...currentConfig.navbar.items, creationResult.navItem],
      },
    }));

    return creationResult.page.id;
  }

  function updatePage(pageId, updates) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: currentConfig.pages.map((page) => {
        if (page.id !== pageId) {
          return page;
        }

        return {
          ...page,
          ...updates,
          slug: updates.slug
            ? ensureUniqueSlug(updates.slug, currentConfig.pages, pageId)
            : page.slug,
        };
      }),
    }));
  }

  function updateTournament(pageId, updates) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        ...updates,
        playoffs: updates.playoffs
          ? {
              ...tournament.playoffs,
              ...updates.playoffs,
            }
          : tournament.playoffs,
      })),
    }));
  }

  function updateNavigationItem(pageId, updates) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      navbar: {
        ...currentConfig.navbar,
        items: currentConfig.navbar.items.map((item) =>
          item.pageId === pageId ? { ...item, ...updates } : item,
        ),
      },
    }));
  }

  function movePage(pageId, direction) {
    applyConfigUpdate((currentConfig) => {
      const orderedPages = sortByOrder(currentConfig.pages);
      const orderedNavItems = sortByOrder(currentConfig.navbar.items);
      const relatedNavItem = orderedNavItems.find(
        (item) => item.pageId === pageId,
      );

      if (!canMoveOrderedItem(orderedPages, pageId, direction)) {
        return currentConfig;
      }

      return {
        ...currentConfig,
        pages: moveOrderedItem(orderedPages, pageId, direction),
        navbar: {
          ...currentConfig.navbar,
          items: relatedNavItem
            ? moveOrderedItem(orderedNavItems, relatedNavItem.id, direction)
            : orderedNavItems,
        },
      };
    });
  }

  function removePage(pageId) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: currentConfig.pages.filter((page) => page.id !== pageId),
      navbar: {
        ...currentConfig.navbar,
        items: currentConfig.navbar.items.filter((item) => item.pageId !== pageId),
      },
    }));
  }

  function addBlock(pageId, type) {
    const nextBlock = createDefaultBlock(type);

    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updatePageCollection(currentConfig.pages, pageId, (page) => ({
        ...page,
        blocks: normalizeOrderedItems([
          ...(page.blocks || []),
          {
            ...nextBlock,
            order: page.blocks.length,
          },
        ]),
      })),
    }));

    return nextBlock.id;
  }

  function updateBlock(pageId, blockId, updates) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updatePageCollection(currentConfig.pages, pageId, (page) => ({
        ...page,
        blocks: (page.blocks || []).map((block) => {
          if (block.id !== blockId) {
            return block;
          }

          return {
            ...block,
            ...updates,
            content: updates.content
              ? {
                  ...block.content,
                  ...updates.content,
                }
              : block.content,
          };
        }),
      })),
    }));
  }

  function moveBlock(pageId, blockId, direction) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updatePageCollection(currentConfig.pages, pageId, (page) => ({
        ...page,
        blocks: canMoveOrderedItem(page.blocks, blockId, direction)
          ? moveOrderedItem(sortByOrder(page.blocks), blockId, direction)
          : sortByOrder(page.blocks),
      })),
    }));
  }

  function removeBlock(pageId, blockId) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updatePageCollection(currentConfig.pages, pageId, (page) => ({
        ...page,
        blocks: normalizeOrderedItems(
          (page.blocks || []).filter((block) => block.id !== blockId),
        ),
      })),
    }));
  }

  function addTournamentGroup(pageId, label) {
    const currentPage = siteConfig.pages.find((page) => page.id === pageId);
    const nextGroup = createDefaultTournamentGroup(
      label,
      currentPage?.tournament?.groups || [],
    );

    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        groups: normalizeOrderedItems([
          ...tournament.groups,
          {
            ...nextGroup,
            order: tournament.groups.length,
          },
        ]),
      })),
    }));

    return nextGroup.id;
  }

  function updateTournamentGroup(pageId, groupId, updates) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        groups: tournament.groups.map((group) =>
          group.id === groupId ? { ...group, ...updates } : group,
        ),
      })),
    }));
  }

  function moveTournamentGroup(pageId, groupId, direction) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        groups: canMoveOrderedItem(tournament.groups, groupId, direction)
          ? moveOrderedItem(sortByOrder(tournament.groups), groupId, direction)
          : sortByOrder(tournament.groups),
      })),
    }));
  }

  function removeTournamentGroup(pageId, groupId) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        groups: normalizeOrderedItems(
          tournament.groups.filter((group) => group.id !== groupId),
        ),
      })),
    }));
  }

  function addTournamentStanding(pageId, groupId, label) {
    const nextStanding = createDefaultTournamentStandingRow(label);

    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        groups: tournament.groups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }

          return {
            ...group,
            standings: normalizeOrderedItems([
              ...group.standings,
              {
                ...nextStanding,
                order: group.standings.length,
              },
            ]),
          };
        }),
      })),
    }));

    return nextStanding.id;
  }

  function updateTournamentStanding(pageId, groupId, standingId, updates) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        groups: tournament.groups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }

          return {
            ...group,
            standings: group.standings.map((standing) =>
              standing.id === standingId ? { ...standing, ...updates } : standing,
            ),
          };
        }),
      })),
    }));
  }

  function moveTournamentStanding(pageId, groupId, standingId, direction) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        groups: tournament.groups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }

          return {
            ...group,
            standings: canMoveOrderedItem(group.standings, standingId, direction)
              ? moveOrderedItem(sortByOrder(group.standings), standingId, direction)
              : sortByOrder(group.standings),
          };
        }),
      })),
    }));
  }

  function removeTournamentStanding(pageId, groupId, standingId) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        groups: tournament.groups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }

          return {
            ...group,
            standings: normalizeOrderedItems(
              group.standings.filter((standing) => standing.id !== standingId),
            ),
          };
        }),
      })),
    }));
  }

  function sortTournamentGroupStandings(pageId, groupId) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        groups: tournament.groups.map((group) => {
          if (group.id !== groupId) {
            return group;
          }

          return {
            ...group,
            standings: sortTournamentStandingsByPoints(group.standings),
          };
        }),
      })),
    }));
  }

  function addTournamentRound(pageId) {
    const currentPage = siteConfig.pages.find((page) => page.id === pageId);
    const nextRound = createDefaultTournamentRound(
      currentPage?.tournament?.playoffs?.rounds || [],
    );

    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        playoffs: {
          ...tournament.playoffs,
          rounds: normalizeOrderedItems([
            ...tournament.playoffs.rounds,
            {
              ...nextRound,
              order: tournament.playoffs.rounds.length,
            },
          ]),
        },
      })),
    }));

    return nextRound.id;
  }

  function updateTournamentRound(pageId, roundId, updates) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        playoffs: {
          ...tournament.playoffs,
          rounds: tournament.playoffs.rounds.map((round) =>
            round.id === roundId ? { ...round, ...updates } : round,
          ),
        },
      })),
    }));
  }

  function moveTournamentRound(pageId, roundId, direction) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        playoffs: {
          ...tournament.playoffs,
          rounds: canMoveOrderedItem(
            tournament.playoffs.rounds,
            roundId,
            direction,
          )
            ? moveOrderedItem(
                sortByOrder(tournament.playoffs.rounds),
                roundId,
                direction,
              )
            : sortByOrder(tournament.playoffs.rounds),
        },
      })),
    }));
  }

  function removeTournamentRound(pageId, roundId) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        playoffs: {
          ...tournament.playoffs,
          rounds: normalizeOrderedItems(
            tournament.playoffs.rounds.filter((round) => round.id !== roundId),
          ),
        },
      })),
    }));
  }

  function addTournamentMatch(pageId, roundId) {
    const currentPage = siteConfig.pages.find((page) => page.id === pageId);
    const currentRound = currentPage?.tournament?.playoffs?.rounds?.find(
      (round) => round.id === roundId,
    );
    const roundLimit = getTournamentRoundMatchLimit(currentRound?.name);

    if (
      currentRound &&
      roundLimit !== null &&
      currentRound.matches.length >= roundLimit
    ) {
      return null;
    }

    const nextMatch = createDefaultTournamentMatch();

    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        playoffs: {
          ...tournament.playoffs,
          rounds: tournament.playoffs.rounds.map((round) => {
            if (round.id !== roundId) {
              return round;
            }

            const nextRoundLimit = getTournamentRoundMatchLimit(round.name);

            if (
              nextRoundLimit !== null &&
              round.matches.length >= nextRoundLimit
            ) {
              return round;
            }

            return {
              ...round,
              matches: normalizeOrderedItems([
                ...round.matches,
                {
                  ...nextMatch,
                  order: round.matches.length,
                },
              ]),
            };
          }),
        },
      })),
    }));

    return nextMatch.id;
  }

  function updateTournamentMatch(pageId, roundId, matchId, updates) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        playoffs: {
          ...tournament.playoffs,
          rounds: tournament.playoffs.rounds.map((round) => {
            if (round.id !== roundId) {
              return round;
            }

            return {
              ...round,
              matches: round.matches.map((match) =>
                match.id === matchId ? { ...match, ...updates } : match,
              ),
            };
          }),
        },
      })),
    }));
  }

  function moveTournamentMatch(pageId, roundId, matchId, direction) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        playoffs: {
          ...tournament.playoffs,
          rounds: tournament.playoffs.rounds.map((round) => {
            if (round.id !== roundId) {
              return round;
            }

            return {
              ...round,
              matches: canMoveOrderedItem(round.matches, matchId, direction)
                ? moveOrderedItem(sortByOrder(round.matches), matchId, direction)
                : sortByOrder(round.matches),
            };
          }),
        },
      })),
    }));
  }

  function removeTournamentMatch(pageId, roundId, matchId) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      pages: updateTournamentPageCollection(currentConfig.pages, pageId, (tournament) => ({
        ...tournament,
        playoffs: {
          ...tournament.playoffs,
          rounds: tournament.playoffs.rounds.map((round) => {
            if (round.id !== roundId) {
              return round;
            }

            return {
              ...round,
              matches: normalizeOrderedItems(
                round.matches.filter((match) => match.id !== matchId),
              ),
            };
          }),
        },
      })),
    }));
  }

  function updateFooter(updates) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      footer: {
        ...currentConfig.footer,
        ...updates,
      },
    }));
  }

  function updateBrand(updates) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      brand: {
        ...currentConfig.brand,
        ...updates,
      },
    }));
  }

  function replaceFooterLinks(nextLinks) {
    applyConfigUpdate((currentConfig) => ({
      ...currentConfig,
      footer: {
        ...currentConfig.footer,
        socialLinks: normalizeOrderedItems(nextLinks),
      },
    }));
  }

  function restoreDefaults() {
    setSiteConfig(resetSiteConfig());
  }

  return (
    <SiteConfigContext.Provider
      value={{
        siteConfig,
        createPage,
        createTournamentPage,
        updatePage,
        updateTournament,
        updateNavigationItem,
        movePage,
        removePage,
        addBlock,
        updateBlock,
        moveBlock,
        removeBlock,
        addTournamentGroup,
        updateTournamentGroup,
        moveTournamentGroup,
        removeTournamentGroup,
        addTournamentStanding,
        updateTournamentStanding,
        moveTournamentStanding,
        removeTournamentStanding,
        sortTournamentGroupStandings,
        addTournamentRound,
        updateTournamentRound,
        moveTournamentRound,
        removeTournamentRound,
        addTournamentMatch,
        updateTournamentMatch,
        moveTournamentMatch,
        removeTournamentMatch,
        updateBrand,
        updateFooter,
        replaceFooterLinks,
        restoreDefaults,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const contextValue = useContext(SiteConfigContext);

  if (!contextValue) {
    throw new Error('useSiteConfig debe usarse dentro de SiteConfigProvider.');
  }

  return contextValue;
}

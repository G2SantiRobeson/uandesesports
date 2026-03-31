import { useEffect, useState } from 'react';
import BlockEditorForm from '../forms/BlockEditorForm';
import FooterSettingsForm from '../forms/FooterSettingsForm';
import LoginForm from '../forms/LoginForm';
import PageSettingsForm from '../forms/PageSettingsForm';
import TournamentPageForm from '../forms/TournamentPageForm';
import formStyles from '../forms/AdminForms.module.css';
import { useAuth } from '../../context/AuthContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import styles from './AdminPanel.module.css';
import {
  canMoveOrderedItem,
  getBlockTypeOptions,
  getOrderedItemPosition,
  sortByOrder,
} from '../../utils/siteConfigUtils';

function AdminPanel({ isOpen, onClose, activePageId }) {
  const {
    session,
    isAdmin,
    isAuthenticated,
    isLoading: isAuthLoading,
    logout,
  } = useAuth();
  const {
    siteConfig,
    isLoading: isSiteConfigLoading,
    loadError,
    saveStatus,
    saveError,
    lastSavedAt,
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
  } = useSiteConfig();

  const [selectedPageId, setSelectedPageId] = useState(activePageId || '');
  const [newPageName, setNewPageName] = useState('');
  const [newTournamentName, setNewTournamentName] = useState('');
  const [newBlockType, setNewBlockType] = useState('text');

  const pages = sortByOrder(siteConfig.pages);
  const selectedPage = pages.find((page) => page.id === selectedPageId) || null;
  const selectedNavItem = siteConfig.navbar.items.find(
    (item) => item.pageId === selectedPageId,
  );
  const selectedPageBlocks = sortByOrder(selectedPage?.blocks || []);
  const selectedPagePosition = getOrderedItemPosition(pages, selectedPageId);

  function formatDateTime(value) {
    if (!value) {
      return '';
    }

    return new Date(value).toLocaleString('es-CL', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  function getSyncLabel() {
    if (isSiteConfigLoading) {
      return 'Cargando contenido';
    }

    if (saveStatus === 'saving') {
      return 'Guardando cambios';
    }

    if (saveStatus === 'pending') {
      return 'Cambios pendientes';
    }

    if (saveStatus === 'saved') {
      return 'Sincronizado';
    }

    if (saveStatus === 'error') {
      return 'Error de guardado';
    }

    if (loadError) {
      return 'Modo respaldo';
    }

    return 'Sin cambios';
  }

  useEffect(() => {
    if (activePageId && pages.some((page) => page.id === activePageId)) {
      setSelectedPageId(activePageId);
    }
  }, [activePageId, pages]);

  useEffect(() => {
    if (!selectedPageId && pages[0]) {
      setSelectedPageId(pages[0].id);
      return;
    }

    if (selectedPageId && !pages.some((page) => page.id === selectedPageId)) {
      setSelectedPageId(pages[0]?.id || '');
    }
  }, [pages, selectedPageId]);

  function handleCreatePage() {
    const nextPageId = createPage(newPageName || 'Nueva pagina');
    setSelectedPageId(nextPageId);
    setNewPageName('');
  }

  function handleCreateTournamentPage() {
    const nextPageId = createTournamentPage(
      newTournamentName || 'Nuevo torneo',
    );
    setSelectedPageId(nextPageId);
    setNewTournamentName('');
  }

  function handleAddBlock() {
    if (!selectedPageId || selectedPage?.pageType !== 'standard') {
      return;
    }

    addBlock(selectedPageId, newBlockType);
  }

  function getPageSummary(page, navItem) {
    const menuStatus = navItem?.visible === false ? 'oculto' : 'visible';

    if (page.pageType === 'tournament-page') {
      const groupsCount = page.tournament?.groups?.length || 0;
      const roundsCount = page.tournament?.playoffs?.rounds?.length || 0;
      return `${groupsCount} grupos - ${roundsCount} rondas - menu: ${menuStatus}`;
    }

    return `${page.blocks.length} bloques - menu: ${menuStatus}`;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Panel de administracion"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.panelHeader}>
          <div className={styles.panelHeaderCopy}>
            <p className={styles.eyebrow}>Panel Admin</p>
            <h2>Gestion visual del sitio</h2>
            <p className={styles.panelDescription}>
              Administra navegacion, paginas, bloques, torneos y contenido
              editable sin tocar el codigo fuente.
            </p>
          </div>

          <div className={styles.headerActions}>
            {isAuthenticated ? (
              <span className={styles.userBadge}>
                {session?.name} - {session?.role}
              </span>
            ) : null}
            {isAdmin ? (
              <span className={styles.statusBadge}>{getSyncLabel()}</span>
            ) : null}
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>

        {!isAdmin ? (
          <div className={styles.panelBody}>
            <div className={styles.loginShell}>
              {isAuthLoading ? (
                <section className={`${styles.sectionCard} ${styles.accountShell}`}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>Sesion</p>
                      <h3>Cargando acceso</h3>
                      <p>Estamos verificando si ya existe una sesion activa.</p>
                    </div>
                  </div>
                </section>
              ) : session ? (
                <section className={`${styles.sectionCard} ${styles.accountShell}`}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>Cuenta</p>
                      <h3>Sesion iniciada</h3>
                      <p>
                        Tu cuenta puede navegar el sitio normalmente. Solo las
                        cuentas con rol admin pueden editar paginas, bloques y
                        torneos.
                      </p>
                    </div>
                  </div>

                  <div className={styles.accountMeta}>
                    <div>
                      <span className={styles.accountLabel}>Nombre</span>
                      <strong>{session.name}</strong>
                    </div>
                    <div>
                      <span className={styles.accountLabel}>Usuario</span>
                      <strong>{session.username}</strong>
                    </div>
                    <div>
                      <span className={styles.accountLabel}>Rol</span>
                      <strong>{session.role}</strong>
                    </div>
                  </div>

                  <div className={styles.controlStack}>
                    <button
                      type="button"
                      className={formStyles.secondaryButton}
                      onClick={logout}
                    >
                      Cerrar sesion
                    </button>
                  </div>
                </section>
              ) : (
                <LoginForm />
              )}
            </div>
          </div>
        ) : (
          <div className={styles.panelBody}>
            <div className={styles.workspace}>
              <aside className={styles.sidebar}>
                <section className={`${styles.sectionCard} ${styles.sidebarCard}`}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>Navegacion</p>
                      <h3>Paginas y pestanas</h3>
                      <p>
                        Crea paginas estandar o de torneo, cambia su orden y
                        selecciona cual editar en el workspace principal.
                      </p>
                    </div>
                  </div>

                  <div className={styles.createStack}>
                    <div className={styles.createComposer}>
                      <label
                        className={styles.createLabel}
                        htmlFor="new-page-name"
                      >
                        Nombre de la nueva pagina
                      </label>
                      <div className={styles.createRow}>
                        <input
                          id="new-page-name"
                          className={formStyles.input}
                          placeholder="Ej: Resultados, Sponsors, FAQ"
                          value={newPageName}
                          onChange={(event) => setNewPageName(event.target.value)}
                        />
                        <button
                          type="button"
                          className={`${formStyles.button} ${styles.createAction}`}
                          onClick={handleCreatePage}
                        >
                          Crear pagina
                        </button>
                      </div>
                    </div>

                    <div className={styles.createComposer}>
                      <label
                        className={styles.createLabel}
                        htmlFor="new-tournament-name"
                      >
                        Nombre de la nueva pagina de torneo
                      </label>
                      <div className={styles.createRow}>
                        <input
                          id="new-tournament-name"
                          className={formStyles.input}
                          placeholder="Ej: Copa UANDES Apertura 2026"
                          value={newTournamentName}
                          onChange={(event) =>
                            setNewTournamentName(event.target.value)
                          }
                        />
                        <button
                          type="button"
                          className={`${formStyles.button} ${styles.createAction}`}
                          onClick={handleCreateTournamentPage}
                        >
                          Crear pagina torneo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.pageList}>
                    {pages.map((page) => {
                      const navItem = siteConfig.navbar.items.find(
                        (item) => item.pageId === page.id,
                      );

                      return (
                        <button
                          key={page.id}
                          type="button"
                          className={`${styles.pageButton} ${
                            page.id === selectedPageId ? styles.pageButtonActive : ''
                          }`}
                          onClick={() => setSelectedPageId(page.id)}
                        >
                          <strong>{page.navLabel}</strong>
                          <span>/{page.slug}</span>
                          <small>
                            {page.pageType === 'tournament-page'
                              ? 'Torneo administrable'
                              : 'Pagina por bloques'}
                          </small>
                          <small>{getPageSummary(page, navItem)}</small>
                          {page.pageType === 'tournament-page' ? (
                            <small>
                              {page.tournament?.groupsEnabled
                                ? 'grupos activos'
                                : 'grupos desactivados'}{' '}
                              -{' '}
                              {page.tournament?.playoffsEnabled
                                ? 'playoffs activos'
                                : 'playoffs desactivados'}
                            </small>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className={`${styles.sectionCard} ${styles.sidebarCard}`}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>Controles</p>
                      <h3>Acciones del entorno</h3>
                    </div>
                  </div>

                  <div className={styles.controlStack}>
                    <button
                      type="button"
                      className={formStyles.secondaryButton}
                      onClick={restoreDefaults}
                    >
                      Restaurar configuracion base
                    </button>
                    <button
                      type="button"
                      className={formStyles.dangerButton}
                      onClick={logout}
                    >
                      Cerrar sesion admin
                    </button>
                  </div>
                </section>
              </aside>

              <div className={styles.editor}>
                <section className={`${styles.sectionCard} ${styles.primarySection}`}>
                  <div className={styles.selectedPageHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>Pagina activa</p>
                      <h3>{selectedPage?.title || 'Selecciona una pagina'}</h3>
                      <p>
                        {selectedPage
                          ? `/${selectedPage.slug} - ${
                              selectedPage.pageType === 'tournament-page'
                                ? `torneo con ${
                                    selectedPage.tournament?.groups?.length || 0
                                  } grupos y ${
                                    selectedPage.tournament?.playoffs?.rounds
                                      ?.length || 0
                                  } rondas`
                                : `${selectedPage.blocks.length} bloques`
                            } - navbar ${
                              selectedNavItem?.visible === false ? 'oculto' : 'visible'
                            }`
                          : 'Selecciona una pagina desde la columna lateral.'}
                      </p>
                    </div>
                    <div className={styles.syncMeta}>
                      <span className={styles.statusBadge}>{getSyncLabel()}</span>
                      {lastSavedAt ? (
                        <small>Ultima sincronizacion: {formatDateTime(lastSavedAt)}</small>
                      ) : null}
                      {saveError ? <small>{saveError}</small> : null}
                      {!saveError && loadError ? <small>{loadError}</small> : null}
                    </div>
                  </div>

                  <PageSettingsForm
                    page={selectedPage}
                    navItem={selectedNavItem}
                    onUpdatePage={(updates) => updatePage(selectedPageId, updates)}
                    onUpdateNavItem={(updates) =>
                      updateNavigationItem(selectedPageId, updates)
                    }
                    onMovePage={(direction) => movePage(selectedPageId, direction)}
                    onRemovePage={() => removePage(selectedPageId)}
                    canMovePageUp={canMoveOrderedItem(pages, selectedPageId, 'up')}
                    canMovePageDown={canMoveOrderedItem(pages, selectedPageId, 'down')}
                    pagePositionLabel={
                      selectedPage
                        ? `Posicion ${selectedPagePosition + 1} de ${pages.length}`
                        : ''
                    }
                    isTournamentPage={selectedPage?.pageType === 'tournament-page'}
                  />
                </section>

                {selectedPage?.pageType === 'tournament-page' ? (
                  <section className={`${styles.sectionCard} ${styles.primarySection}`}>
                    <div className={styles.sectionHeader}>
                      <div>
                        <p className={styles.sectionEyebrow}>Torneo</p>
                        <h3>Grupos y playoffs</h3>
                        <p>
                          Editor especializado para configurar una pagina de torneo
                          con grupos, standings y llaves eliminatorias.
                        </p>
                      </div>
                    </div>

                    <TournamentPageForm
                      page={selectedPage}
                      onUpdateTournament={(updates) =>
                        updateTournament(selectedPageId, updates)
                      }
                      onAddGroup={() => addTournamentGroup(selectedPageId)}
                      onUpdateGroup={(groupId, updates) =>
                        updateTournamentGroup(selectedPageId, groupId, updates)
                      }
                      onMoveGroup={(groupId, direction) =>
                        moveTournamentGroup(selectedPageId, groupId, direction)
                      }
                      onRemoveGroup={(groupId) =>
                        removeTournamentGroup(selectedPageId, groupId)
                      }
                      onAddStanding={(groupId) =>
                        addTournamentStanding(selectedPageId, groupId)
                      }
                      onUpdateStanding={(groupId, standingId, updates) =>
                        updateTournamentStanding(
                          selectedPageId,
                          groupId,
                          standingId,
                          updates,
                        )
                      }
                      onMoveStanding={(groupId, standingId, direction) =>
                        moveTournamentStanding(
                          selectedPageId,
                          groupId,
                          standingId,
                          direction,
                        )
                      }
                      onRemoveStanding={(groupId, standingId) =>
                        removeTournamentStanding(
                          selectedPageId,
                          groupId,
                          standingId,
                        )
                      }
                      onSortGroupStandings={(groupId) =>
                        sortTournamentGroupStandings(selectedPageId, groupId)
                      }
                      onAddRound={() => addTournamentRound(selectedPageId)}
                      onUpdateRound={(roundId, updates) =>
                        updateTournamentRound(selectedPageId, roundId, updates)
                      }
                      onMoveRound={(roundId, direction) =>
                        moveTournamentRound(selectedPageId, roundId, direction)
                      }
                      onRemoveRound={(roundId) =>
                        removeTournamentRound(selectedPageId, roundId)
                      }
                      onAddMatch={(roundId) =>
                        addTournamentMatch(selectedPageId, roundId)
                      }
                      onUpdateMatch={(roundId, matchId, updates) =>
                        updateTournamentMatch(
                          selectedPageId,
                          roundId,
                          matchId,
                          updates,
                        )
                      }
                      onMoveMatch={(roundId, matchId, direction) =>
                        moveTournamentMatch(
                          selectedPageId,
                          roundId,
                          matchId,
                          direction,
                        )
                      }
                      onRemoveMatch={(roundId, matchId) =>
                        removeTournamentMatch(selectedPageId, roundId, matchId)
                      }
                    />
                  </section>
                ) : (
                  <section className={`${styles.sectionCard} ${styles.primarySection}`}>
                    <div className={styles.sectionHeader}>
                      <div>
                        <p className={styles.sectionEyebrow}>Bloques</p>
                        <h3>Contenido estructural</h3>
                        <p>
                          Agrega nuevos tipos de bloque y edita su contenido en paneles
                          modulares claramente separados.
                        </p>
                      </div>

                      <div className={styles.primaryActions}>
                        <select
                          className={formStyles.select}
                          value={newBlockType}
                          onChange={(event) => setNewBlockType(event.target.value)}
                        >
                          {getBlockTypeOptions().map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className={formStyles.button}
                          onClick={handleAddBlock}
                          disabled={
                            !selectedPageId || selectedPage?.pageType !== 'standard'
                          }
                        >
                          Agregar bloque
                        </button>
                      </div>
                    </div>

                    <div className={styles.blocksStack}>
                      {selectedPageBlocks.length ? (
                        selectedPageBlocks.map((block, index) => (
                          <div key={block.id} className={styles.blockCard}>
                            <BlockEditorForm
                              block={block}
                              onUpdate={(updates) =>
                                updateBlock(selectedPageId, block.id, updates)
                              }
                              onMove={(direction) =>
                                moveBlock(selectedPageId, block.id, direction)
                              }
                              onRemove={() => removeBlock(selectedPageId, block.id)}
                              canMoveUp={canMoveOrderedItem(
                                selectedPageBlocks,
                                block.id,
                                'up',
                              )}
                              canMoveDown={canMoveOrderedItem(
                                selectedPageBlocks,
                                block.id,
                                'down',
                              )}
                              positionLabel={`Bloque ${index + 1} de ${selectedPageBlocks.length}`}
                            />
                          </div>
                        ))
                      ) : (
                        <p className={styles.emptyCopy}>
                          Esta pagina todavia no tiene bloques. Agrega uno desde el
                          selector superior.
                        </p>
                      )}
                    </div>
                  </section>
                )}

                <div className={styles.settingsGrid}>
                  <section className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                      <div>
                        <p className={styles.sectionEyebrow}>Branding</p>
                        <h3>Marca base del sitio</h3>
                        <p>
                          Ajusta el nombre corto y el nombre principal visibles en
                          el navbar.
                        </p>
                      </div>
                    </div>

                    <div className={formStyles.row}>
                      <div className={formStyles.fieldGroup}>
                        <label>Nombre corto</label>
                        <input
                          className={formStyles.input}
                          value={siteConfig.brand.shortName || ''}
                          onChange={(event) =>
                            updateBrand({
                              shortName: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className={formStyles.fieldGroup}>
                        <label>Nombre principal</label>
                        <input
                          className={formStyles.input}
                          value={siteConfig.brand.name || ''}
                          onChange={(event) =>
                            updateBrand({
                              name: event.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </section>

                  <section className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                      <div>
                        <p className={styles.sectionEyebrow}>Footer</p>
                        <h3>Contacto y enlaces</h3>
                        <p>
                          Mantiene el pie del sitio editable y coherente con el resto
                          de la experiencia.
                        </p>
                      </div>
                    </div>

                    <FooterSettingsForm
                      footer={siteConfig.footer}
                      onUpdateFooter={updateFooter}
                      onReplaceFooterLinks={replaceFooterLinks}
                    />
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default AdminPanel;

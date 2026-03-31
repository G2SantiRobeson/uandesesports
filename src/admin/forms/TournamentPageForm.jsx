import { useEffect, useState } from 'react';
import styles from './AdminForms.module.css';
import {
  canMoveOrderedItem,
  getTournamentRoundMatchLimit,
  getOrderedItemPosition,
  sortByOrder,
} from '../../utils/siteConfigUtils';

function TournamentPageForm({
  page,
  onUpdateTournament,
  onAddGroup,
  onUpdateGroup,
  onMoveGroup,
  onRemoveGroup,
  onAddStanding,
  onUpdateStanding,
  onMoveStanding,
  onRemoveStanding,
  onSortGroupStandings,
  onAddRound,
  onUpdateRound,
  onMoveRound,
  onRemoveRound,
  onAddMatch,
  onUpdateMatch,
  onMoveMatch,
  onRemoveMatch,
}) {
  const tournament = page?.tournament;
  const groups = sortByOrder(tournament?.groups || []);
  const rounds = sortByOrder(tournament?.playoffs?.rounds || []);
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [selectedRoundId, setSelectedRoundId] = useState(rounds[0]?.id || '');

  useEffect(() => {
    if (!selectedGroupId && groups[0]) {
      setSelectedGroupId(groups[0].id);
      return;
    }

    if (selectedGroupId && !groups.some((group) => group.id === selectedGroupId)) {
      setSelectedGroupId(groups[0]?.id || '');
    }
  }, [groups, selectedGroupId]);

  useEffect(() => {
    if (!selectedRoundId && rounds[0]) {
      setSelectedRoundId(rounds[0].id);
      return;
    }

    if (selectedRoundId && !rounds.some((round) => round.id === selectedRoundId)) {
      setSelectedRoundId(rounds[0]?.id || '');
    }
  }, [rounds, selectedRoundId]);

  if (!page || page.pageType !== 'tournament-page') {
    return (
      <div className={styles.section}>
        <p className={styles.hint}>
          Selecciona una pagina de torneo para editar su estructura competitiva.
        </p>
      </div>
    );
  }

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) || null;
  const selectedRound = rounds.find((round) => round.id === selectedRoundId) || null;
  const selectedStandings = sortByOrder(selectedGroup?.standings || []);
  const selectedMatches = sortByOrder(selectedRound?.matches || []);
  const selectedGroupPosition = getOrderedItemPosition(groups, selectedGroupId);
  const selectedRoundPosition = getOrderedItemPosition(rounds, selectedRoundId);
  const selectedRoundMatchLimit = getTournamentRoundMatchLimit(selectedRound?.name);
  const isSelectedRoundAtLimit =
    selectedRoundMatchLimit !== null &&
    selectedMatches.length >= selectedRoundMatchLimit;

  function updateTournamentField(field, value) {
    onUpdateTournament({
      [field]: value,
    });
  }

  function getRoundLimitLabel(limit) {
    if (limit === null) {
      return 'Sin limite automatico para esta ronda personalizada.';
    }

    return `Limite de ${limit} ${
      limit === 1 ? 'cruce' : 'cruces'
    } para esta ronda.`;
  }

  function handleCreateGroup() {
    const nextGroupId = onAddGroup();
    setSelectedGroupId(nextGroupId);
  }

  function handleCreateRound() {
    const nextRoundId = onAddRound();
    setSelectedRoundId(nextRoundId);
  }

  return (
    <div className={styles.stack}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTag}>Nivel 1</p>
            <h3>Configuracion del torneo</h3>
            <p className={styles.inlineMeta}>
              La identidad base de la pagina se edita arriba. Aqui configuras
              banner, temporada y modulos competitivos del torneo.
            </p>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label>Temporada o fecha</label>
            <input
              className={styles.input}
              value={tournament.seasonLabel || ''}
              onChange={(event) =>
                updateTournamentField('seasonLabel', event.target.value)
              }
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Banner o imagen</label>
            <input
              className={styles.input}
              placeholder="https://..."
              value={tournament.bannerUrl || ''}
              onChange={(event) =>
                updateTournamentField('bannerUrl', event.target.value)
              }
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label>Alt del banner</label>
            <input
              className={styles.input}
              value={tournament.bannerAlt || ''}
              onChange={(event) =>
                updateTournamentField('bannerAlt', event.target.value)
              }
            />
          </div>

          <div className={styles.helperCard}>
            <p className={styles.helperLabel}>Render publico</p>
            <p className={styles.helperText}>
              La pagina publica usa el titulo y descripcion base de la pagina como
              cabecera del torneo, y complementa eso con temporada, grupos y
              playoffs desde esta configuracion.
            </p>
          </div>
        </div>

        <div className={styles.checkboxRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={tournament.groupsEnabled}
              onChange={(event) =>
                updateTournamentField('groupsEnabled', event.target.checked)
              }
            />
            Habilitar fase de grupos
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={tournament.playoffsEnabled}
              onChange={(event) =>
                updateTournamentField('playoffsEnabled', event.target.checked)
              }
            />
            Habilitar playoffs
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTag}>Nivel 2</p>
            <h3>Fase de grupos</h3>
            <p className={styles.inlineMeta}>
              Crea grupos independientes y administra la tabla de cada uno desde
              un panel propio.
            </p>
          </div>
          <button type="button" className={styles.button} onClick={handleCreateGroup}>
            Crear grupo
          </button>
        </div>

        <div className={styles.moduleGrid}>
          <div className={styles.moduleSidebar}>
            <div className={styles.moduleSidebarHeader}>
              <p className={styles.sectionTag}>Grupos</p>
              <span className={styles.inlineMeta}>{groups.length} creados</span>
            </div>

            <div className={styles.selectorList}>
              {groups.length ? (
                groups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    className={`${styles.selectorButton} ${
                      group.id === selectedGroupId ? styles.selectorButtonActive : ''
                    }`}
                    onClick={() => setSelectedGroupId(group.id)}
                  >
                    <strong>{group.name}</strong>
                    <span>
                      {group.standings.length} equipos -{' '}
                      {group.visible ? 'visible' : 'oculto'}
                    </span>
                  </button>
                ))
              ) : (
                <p className={styles.hint}>
                  Aun no hay grupos. Crea el primero para empezar a cargar la
                  tabla.
                </p>
              )}
            </div>
          </div>

          <div className={styles.moduleContent}>
            {selectedGroup ? (
              <div className={styles.stack}>
                <div className={styles.itemCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionTag}>Grupo activo</p>
                      <h3>{selectedGroup.name}</h3>
                      <p className={styles.inlineMeta}>
                        Posicion {selectedGroupPosition + 1} de {groups.length}
                      </p>
                    </div>

                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        disabled={!canMoveOrderedItem(groups, selectedGroup.id, 'up')}
                        onClick={() => onMoveGroup(selectedGroup.id, 'up')}
                      >
                        Subir
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        disabled={!canMoveOrderedItem(groups, selectedGroup.id, 'down')}
                        onClick={() => onMoveGroup(selectedGroup.id, 'down')}
                      >
                        Bajar
                      </button>
                      <button
                        type="button"
                        className={styles.dangerButton}
                        onClick={() => onRemoveGroup(selectedGroup.id)}
                      >
                        Eliminar grupo
                      </button>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.fieldGroup}>
                      <label>Nombre del grupo</label>
                      <input
                        className={styles.input}
                        value={selectedGroup.name}
                        onChange={(event) =>
                          onUpdateGroup(selectedGroup.id, {
                            name: event.target.value,
                          })
                        }
                      />
                    </div>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedGroup.visible}
                        onChange={(event) =>
                          onUpdateGroup(selectedGroup.id, {
                            visible: event.target.checked,
                          })
                        }
                      />
                      Grupo visible
                    </label>
                  </div>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.button}
                      onClick={() => onAddStanding(selectedGroup.id)}
                    >
                      Agregar equipo
                    </button>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => onSortGroupStandings(selectedGroup.id)}
                    >
                      Ordenar por puntos
                    </button>
                  </div>
                </div>

                <div className={styles.listStack}>
                  {selectedStandings.length ? (
                    selectedStandings.map((standing, index) => (
                      <div key={standing.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                          <div>
                            <p className={styles.sectionTag}>Fila {index + 1}</p>
                            <p className={styles.inlineMeta}>
                              Equipo dentro de {selectedGroup.name}
                            </p>
                          </div>
                          <div className={styles.actions}>
                            <button
                              type="button"
                              className={styles.secondaryButton}
                              disabled={
                                !canMoveOrderedItem(
                                  selectedStandings,
                                  standing.id,
                                  'up',
                                )
                              }
                              onClick={() =>
                                onMoveStanding(selectedGroup.id, standing.id, 'up')
                              }
                            >
                              Subir
                            </button>
                            <button
                              type="button"
                              className={styles.secondaryButton}
                              disabled={
                                !canMoveOrderedItem(
                                  selectedStandings,
                                  standing.id,
                                  'down',
                                )
                              }
                              onClick={() =>
                                onMoveStanding(selectedGroup.id, standing.id, 'down')
                              }
                            >
                              Bajar
                            </button>
                            <button
                              type="button"
                              className={styles.dangerButton}
                              onClick={() =>
                                onRemoveStanding(selectedGroup.id, standing.id)
                              }
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>

                        <div className={styles.tripleRow}>
                          <div className={styles.fieldGroup}>
                            <label>Nombre del equipo</label>
                            <input
                              className={styles.input}
                              value={standing.teamName || ''}
                              onChange={(event) =>
                                onUpdateStanding(selectedGroup.id, standing.id, {
                                  teamName: event.target.value,
                                })
                              }
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label>Logo del equipo</label>
                            <input
                              className={styles.input}
                              placeholder="https://..."
                              value={standing.teamLogoUrl || ''}
                              onChange={(event) =>
                                onUpdateStanding(selectedGroup.id, standing.id, {
                                  teamLogoUrl: event.target.value,
                                })
                              }
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label>Alt del logo</label>
                            <input
                              className={styles.input}
                              value={standing.teamLogoAlt || ''}
                              onChange={(event) =>
                                onUpdateStanding(selectedGroup.id, standing.id, {
                                  teamLogoAlt: event.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.tripleRow}>
                          <div className={styles.fieldGroup}>
                            <label>Winrate</label>
                            <input
                              className={styles.input}
                              value={standing.winrate || ''}
                              onChange={(event) =>
                                onUpdateStanding(selectedGroup.id, standing.id, {
                                  winrate: event.target.value,
                                })
                              }
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label>Puntos</label>
                            <input
                              className={styles.input}
                              type="number"
                              value={standing.points ?? ''}
                              onChange={(event) =>
                                onUpdateStanding(selectedGroup.id, standing.id, {
                                  points: event.target.value,
                                })
                              }
                            />
                          </div>
                          <div className={styles.helperCard}>
                            <p className={styles.helperLabel}>Logo opcional</p>
                            <p className={styles.helperText}>
                              Usa una URL de imagen para mostrar el icono del equipo
                              en la tabla publica del grupo.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.hint}>
                      Este grupo aun no tiene equipos en su tabla.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.emptyPanel}>
                <p className={styles.hint}>
                  Selecciona un grupo para editar su nombre, visibilidad y tabla.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTag}>Nivel 2</p>
            <h3>Playoffs y llaves</h3>
            <p className={styles.inlineMeta}>
              Crea rondas como cuartos, semifinales o final, y luego agrega
              cruces dentro de cada una.
            </p>
          </div>
          <button type="button" className={styles.button} onClick={handleCreateRound}>
            Crear ronda
          </button>
        </div>

        <div className={styles.moduleGrid}>
          <div className={styles.moduleSidebar}>
            <div className={styles.moduleSidebarHeader}>
              <p className={styles.sectionTag}>Rondas</p>
              <span className={styles.inlineMeta}>{rounds.length} creadas</span>
            </div>

            <div className={styles.selectorList}>
              {rounds.length ? (
                rounds.map((round) => (
                  <button
                    key={round.id}
                    type="button"
                    className={`${styles.selectorButton} ${
                      round.id === selectedRoundId ? styles.selectorButtonActive : ''
                    }`}
                    onClick={() => setSelectedRoundId(round.id)}
                  >
                    <strong>{round.name}</strong>
                    <span>
                      {round.matches.length} cruces -{' '}
                      {round.visible ? 'visible' : 'oculto'}
                    </span>
                  </button>
                ))
              ) : (
                <p className={styles.hint}>
                  Aun no hay rondas creadas. Agrega una para cargar tus llaves.
                </p>
              )}
            </div>
          </div>

          <div className={styles.moduleContent}>
            {selectedRound ? (
              <div className={styles.stack}>
                <div className={styles.itemCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <p className={styles.sectionTag}>Ronda activa</p>
                      <h3>{selectedRound.name}</h3>
                      <p className={styles.inlineMeta}>
                        Posicion {selectedRoundPosition + 1} de {rounds.length}
                      </p>
                    </div>

                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        disabled={!canMoveOrderedItem(rounds, selectedRound.id, 'up')}
                        onClick={() => onMoveRound(selectedRound.id, 'up')}
                      >
                        Subir
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        disabled={!canMoveOrderedItem(rounds, selectedRound.id, 'down')}
                        onClick={() => onMoveRound(selectedRound.id, 'down')}
                      >
                        Bajar
                      </button>
                      <button
                        type="button"
                        className={styles.dangerButton}
                        onClick={() => onRemoveRound(selectedRound.id)}
                      >
                        Eliminar ronda
                      </button>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.fieldGroup}>
                      <label>Nombre de la ronda</label>
                      <input
                        className={styles.input}
                        value={selectedRound.name}
                        onChange={(event) =>
                          onUpdateRound(selectedRound.id, {
                            name: event.target.value,
                          })
                        }
                      />
                    </div>

                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={selectedRound.visible}
                        onChange={(event) =>
                          onUpdateRound(selectedRound.id, {
                            visible: event.target.checked,
                          })
                        }
                      />
                      Ronda visible
                    </label>
                  </div>

                  <button
                    type="button"
                    className={styles.button}
                    disabled={isSelectedRoundAtLimit}
                    onClick={() => onAddMatch(selectedRound.id)}
                  >
                    Agregar cruce
                  </button>
                  <p className={styles.inlineMeta}>
                    {selectedRound
                      ? `${selectedMatches.length}${
                          selectedRoundMatchLimit !== null
                            ? ` / ${selectedRoundMatchLimit}`
                            : ''
                        } cruces cargados. ${getRoundLimitLabel(
                          selectedRoundMatchLimit,
                        )}`
                      : ''}
                  </p>
                </div>

                <div className={styles.listStack}>
                  {selectedMatches.length ? (
                    selectedMatches.map((match, index) => (
                      <div key={match.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                          <div>
                            <p className={styles.sectionTag}>Cruce {index + 1}</p>
                            <p className={styles.inlineMeta}>
                              Enfrentamiento editable en {selectedRound.name}
                            </p>
                          </div>
                          <div className={styles.actions}>
                            <button
                              type="button"
                              className={styles.secondaryButton}
                              disabled={
                                !canMoveOrderedItem(
                                  selectedMatches,
                                  match.id,
                                  'up',
                                )
                              }
                              onClick={() =>
                                onMoveMatch(selectedRound.id, match.id, 'up')
                              }
                            >
                              Subir
                            </button>
                            <button
                              type="button"
                              className={styles.secondaryButton}
                              disabled={
                                !canMoveOrderedItem(
                                  selectedMatches,
                                  match.id,
                                  'down',
                                )
                              }
                              onClick={() =>
                                onMoveMatch(selectedRound.id, match.id, 'down')
                              }
                            >
                              Bajar
                            </button>
                            <button
                              type="button"
                              className={styles.dangerButton}
                              onClick={() =>
                                onRemoveMatch(selectedRound.id, match.id)
                              }
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div className={styles.fieldGroup}>
                            <label>Team A</label>
                            <input
                              className={styles.input}
                              value={match.teamA || ''}
                              onChange={(event) =>
                                onUpdateMatch(selectedRound.id, match.id, {
                                  teamA: event.target.value,
                                })
                              }
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label>Team B</label>
                            <input
                              className={styles.input}
                              value={match.teamB || ''}
                              onChange={(event) =>
                                onUpdateMatch(selectedRound.id, match.id, {
                                  teamB: event.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div className={styles.fieldGroup}>
                            <label>Logo Team A</label>
                            <input
                              className={styles.input}
                              placeholder="https://..."
                              value={match.teamALogoUrl || ''}
                              onChange={(event) =>
                                onUpdateMatch(selectedRound.id, match.id, {
                                  teamALogoUrl: event.target.value,
                                })
                              }
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label>Logo Team B</label>
                            <input
                              className={styles.input}
                              placeholder="https://..."
                              value={match.teamBLogoUrl || ''}
                              onChange={(event) =>
                                onUpdateMatch(selectedRound.id, match.id, {
                                  teamBLogoUrl: event.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.row}>
                          <div className={styles.fieldGroup}>
                            <label>Alt logo Team A</label>
                            <input
                              className={styles.input}
                              value={match.teamALogoAlt || ''}
                              onChange={(event) =>
                                onUpdateMatch(selectedRound.id, match.id, {
                                  teamALogoAlt: event.target.value,
                                })
                              }
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label>Alt logo Team B</label>
                            <input
                              className={styles.input}
                              value={match.teamBLogoAlt || ''}
                              onChange={(event) =>
                                onUpdateMatch(selectedRound.id, match.id, {
                                  teamBLogoAlt: event.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.tripleRow}>
                          <div className={styles.fieldGroup}>
                            <label>Score A</label>
                            <input
                              className={styles.input}
                              value={match.scoreA ?? ''}
                              onChange={(event) =>
                                onUpdateMatch(selectedRound.id, match.id, {
                                  scoreA: event.target.value,
                                })
                              }
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label>Score B</label>
                            <input
                              className={styles.input}
                              value={match.scoreB ?? ''}
                              onChange={(event) =>
                                onUpdateMatch(selectedRound.id, match.id, {
                                  scoreB: event.target.value,
                                })
                              }
                            />
                          </div>
                          <div className={styles.fieldGroup}>
                            <label>Ganador</label>
                            <input
                              className={styles.input}
                              value={match.winner || ''}
                              onChange={(event) =>
                                onUpdateMatch(selectedRound.id, match.id, {
                                  winner: event.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className={styles.fieldGroup}>
                          <label>Nota o fecha</label>
                          <input
                            className={styles.input}
                            value={match.note || ''}
                            onChange={(event) =>
                              onUpdateMatch(selectedRound.id, match.id, {
                                note: event.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.hint}>
                      Esta ronda aun no tiene cruces cargados.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.emptyPanel}>
                <p className={styles.hint}>
                  Selecciona una ronda para editar su nombre, orden y cruces.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TournamentPageForm;

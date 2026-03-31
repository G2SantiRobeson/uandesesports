import styles from './TournamentPageRenderer.module.css';
import { sortByOrder } from '../../utils/siteConfigUtils';

function TournamentPageRenderer({ page }) {
  const tournament = page?.tournament;
  const visibleGroups = sortByOrder(tournament?.groups || []).filter(
    (group) => group.visible,
  );
  const visibleRounds = sortByOrder(tournament?.playoffs?.rounds || []).filter(
    (round) => round.visible,
  );
  const hasGroups = tournament?.groupsEnabled && visibleGroups.length > 0;
  const hasPlayoffs = tournament?.playoffsEnabled && visibleRounds.length > 0;

  function renderTeamIdentity(name, logoUrl, logoAlt, isWinner = false) {
    return (
      <span className={`${styles.teamIdentity} ${isWinner ? styles.teamWinner : ''}`}>
        {logoUrl ? (
          <img
            className={styles.teamLogo}
            src={logoUrl}
            alt={logoAlt || `Logo de ${name || 'equipo'}`}
          />
        ) : (
          <span className={styles.teamLogoFallback} aria-hidden="true">
            {String(name || '?').slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className={styles.teamName}>{name || 'Por definir'}</span>
      </span>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroShell}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{page.navLabel || 'Torneo'}</p>
            <h1>{page.title}</h1>
            {page.description ? (
              <p className={styles.description}>{page.description}</p>
            ) : null}

            <div className={styles.metaRow}>
              {tournament?.seasonLabel ? (
                <span className={styles.metaPill}>{tournament.seasonLabel}</span>
              ) : null}
              <span className={styles.metaPill}>
                {tournament?.groupsEnabled ? 'Fase de grupos' : 'Sin grupos'}
              </span>
              <span className={styles.metaPill}>
                {tournament?.playoffsEnabled ? 'Playoffs activos' : 'Sin playoffs'}
              </span>
            </div>
          </div>

          {tournament?.bannerUrl ? (
            <div className={styles.heroMedia}>
              <img
                src={tournament.bannerUrl}
                alt={tournament.bannerAlt || `Banner de ${page.title}`}
              />
            </div>
          ) : null}
        </div>
      </header>

      {tournament?.groupsEnabled ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Fase de grupos</p>
              <h2>Tabla por grupo</h2>
              <p>
                Cada grupo se renderiza de forma independiente y puede editarse
                desde el panel Admin.
              </p>
            </div>
          </div>

          {hasGroups ? (
            <div className={styles.groupsGrid}>
              {visibleGroups.map((group) => (
                <article key={group.id} className={styles.groupCard}>
                  <div className={styles.groupHeader}>
                    <h3>{group.name}</h3>
                    <span>{group.standings.length} equipos</span>
                  </div>

                  <div className={styles.tableShell}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Equipo</th>
                          <th>Winrate</th>
                          <th>Puntos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortByOrder(group.standings).map((standing) => (
                          <tr key={standing.id}>
                            <td>
                              {renderTeamIdentity(
                                standing.teamName,
                                standing.teamLogoUrl,
                                standing.teamLogoAlt,
                              )}
                            </td>
                            <td>{standing.winrate || '--'}</td>
                            <td>{standing.points || '0'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No hay grupos visibles configurados para este torneo todavia.</p>
            </div>
          )}
        </section>
      ) : null}

      {tournament?.playoffsEnabled ? (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>Playoffs</p>
              <h2>Llaves eliminatorias</h2>
              <p>
                Las rondas se muestran como columnas para mantener una lectura
                clara y ordenada en desktop y mobile.
              </p>
            </div>
          </div>

          {hasPlayoffs ? (
            <div className={styles.bracketScroller}>
              <div className={styles.bracketGrid}>
                {visibleRounds.map((round) => (
                  <article key={round.id} className={styles.roundColumn}>
                    <div className={styles.roundHeader}>
                      <h3>{round.name}</h3>
                      <span>{round.matches.length} cruces</span>
                    </div>

                    <div className={styles.matchesStack}>
                      {sortByOrder(round.matches).map((match) => {
                        const teamAIsWinner =
                          match.winner &&
                          match.teamA &&
                          match.winner === match.teamA;
                        const teamBIsWinner =
                          match.winner &&
                          match.teamB &&
                          match.winner === match.teamB;

                        return (
                          <div key={match.id} className={styles.matchCard}>
                            <div className={styles.teamRow}>
                              {renderTeamIdentity(
                                match.teamA,
                                match.teamALogoUrl,
                                match.teamALogoAlt,
                                teamAIsWinner,
                              )}
                              <strong>{match.scoreA || '-'}</strong>
                            </div>

                            <div className={styles.teamRow}>
                              {renderTeamIdentity(
                                match.teamB,
                                match.teamBLogoUrl,
                                match.teamBLogoAlt,
                                teamBIsWinner,
                              )}
                              <strong>{match.scoreB || '-'}</strong>
                            </div>

                            {match.note ? (
                              <p className={styles.matchNote}>{match.note}</p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No hay rondas visibles configuradas para este torneo todavia.</p>
            </div>
          )}
        </section>
      ) : null}

      {!tournament?.groupsEnabled && !tournament?.playoffsEnabled ? (
        <section className={styles.section}>
          <div className={styles.emptyState}>
            <p>
              Este torneo todavia no tiene modulos activos. Activa fase de
              grupos o playoffs desde el panel Admin para publicar contenido.
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default TournamentPageRenderer;

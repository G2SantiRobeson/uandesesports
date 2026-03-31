import styles from './AdminForms.module.css';

function PageSettingsForm({
  page,
  navItem,
  onUpdatePage,
  onUpdateNavItem,
  onMovePage,
  onRemovePage,
  canMovePageUp,
  canMovePageDown,
  pagePositionLabel,
  isTournamentPage,
}) {
  if (!page) {
    return (
      <div className={styles.section}>
        <p className={styles.hint}>Selecciona una pagina para editarla.</p>
      </div>
    );
  }

  return (
    <div className={styles.stack}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTag}>Nivel 1</p>
            <h3>Identidad y ruta</h3>
            <p className={styles.inlineMeta}>
              {isTournamentPage
                ? 'Esta pagina usa un renderer especial de torneo y su estructura competitiva se edita en el modulo inferior.'
                : 'Configuracion principal de la pagina y su presencia en navegacion.'}
            </p>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label htmlFor={`page-nav-${page.id}`}>Label en navbar</label>
            <input
              id={`page-nav-${page.id}`}
              className={styles.input}
              value={page.navLabel}
              onChange={(event) =>
                onUpdatePage({
                  navLabel: event.target.value,
                })
              }
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor={`page-title-${page.id}`}>Titulo de pagina</label>
            <input
              id={`page-title-${page.id}`}
              className={styles.input}
              value={page.title}
              onChange={(event) =>
                onUpdatePage({
                  title: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label htmlFor={`page-slug-${page.id}`}>Slug / ruta</label>
            <input
              id={`page-slug-${page.id}`}
              className={styles.input}
              value={page.slug}
              onChange={(event) =>
                onUpdatePage({
                  slug: event.target.value,
                })
              }
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor={`page-description-${page.id}`}>Descripcion</label>
            <textarea
              id={`page-description-${page.id}`}
              className={styles.textarea}
              value={page.description || ''}
              onChange={(event) =>
                onUpdatePage({
                  description: event.target.value,
                })
              }
            />
          </div>
        </div>

        <div className={styles.checkboxRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={page.visible}
              onChange={(event) =>
                onUpdatePage({
                  visible: event.target.checked,
                })
              }
            />
            Pagina visible
          </label>

          {!isTournamentPage ? (
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={page.showHeader}
                onChange={(event) =>
                  onUpdatePage({
                    showHeader: event.target.checked,
                  })
                }
              />
              Mostrar cabecera de pagina
            </label>
          ) : null}

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={navItem?.visible ?? true}
              onChange={(event) =>
                onUpdateNavItem({
                  visible: event.target.checked,
                })
              }
            />
            Mostrar en navbar
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTag}>Nivel 2</p>
            <h3>Orden de navegacion</h3>
            {pagePositionLabel ? (
              <p className={styles.inlineMeta}>{pagePositionLabel}</p>
            ) : null}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            disabled={!canMovePageUp}
            onClick={() => onMovePage('up')}
          >
            Mover arriba
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            disabled={!canMovePageDown}
            onClick={() => onMovePage('down')}
          >
            Mover abajo
          </button>
        </div>
      </div>

      <div className={`${styles.section} ${styles.dangerZone}`}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTag}>Peligro</p>
            <h3>Accion destructiva</h3>
          </div>
        </div>

        <button
          type="button"
          className={styles.dangerButton}
          onClick={onRemovePage}
        >
          Eliminar pagina
        </button>
      </div>
    </div>
  );
}

export default PageSettingsForm;

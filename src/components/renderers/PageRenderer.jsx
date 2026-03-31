import BlockRenderer from './BlockRenderer';
import TournamentPageRenderer from './TournamentPageRenderer';
import styles from './PageRenderer.module.css';
import { sortByOrder } from '../../utils/siteConfigUtils';

function PageRenderer({ page }) {
  if (!page) {
    return (
      <section className={styles.emptyState}>
        <div className={styles.emptyStateInner}>
          <p className={styles.emptyEyebrow}>Sin paginas visibles</p>
          <h1>No hay contenido publicado en este momento.</h1>
          <p>
            Ingresa como Admin para crear una pagina nueva, activar paginas
            ocultas o restaurar la configuracion base.
          </p>
        </div>
      </section>
    );
  }

  if (page.pageType === 'tournament-page') {
    return <TournamentPageRenderer page={page} />;
  }

  const visibleBlocks = sortByOrder(page.blocks).filter((block) => block.visible);

  return (
    <div className={styles.page}>
      {page.showHeader ? (
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <p className={styles.eyebrow}>{page.navLabel || page.title}</p>
            <h1>{page.title}</h1>
            {page.description ? <p>{page.description}</p> : null}
          </div>
        </header>
      ) : null}

      {visibleBlocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}

export default PageRenderer;

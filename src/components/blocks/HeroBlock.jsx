import styles from './HeroBlock.module.css';

function HeroBlock({ block }) {
  const { content } = block;

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          {content.eyebrow ? <p className={styles.eyebrow}>{content.eyebrow}</p> : null}
          <h1>{content.title}</h1>
          {content.description ? (
            <p className={styles.description}>{content.description}</p>
          ) : null}

          {content.actions?.length ? (
            <div className={styles.actions}>
              {content.actions
                .filter((action) => action.visible !== false)
                .map((action) => (
                  <a
                    key={action.id}
                    className={
                      action.style === 'secondary'
                        ? styles.secondaryAction
                        : styles.primaryAction
                    }
                    href={action.href}
                  >
                    {action.label}
                  </a>
                ))}
            </div>
          ) : null}
        </div>

        <aside className={styles.panel} aria-label="Panel hero">
          {content.imageUrl ? (
            <div className={styles.panelMedia}>
              <img src={content.imageUrl} alt={content.imageAlt || content.title} />
              {content.caption ? <p className={styles.panelCaption}>{content.caption}</p> : null}
            </div>
          ) : null}

          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>{content.panelLabel}</span>
            <span className={styles.panelStatus}>{content.panelStatus}</span>
          </div>

          <div className={styles.panelBody}>
            {content.panelText ? <p>{content.panelText}</p> : null}

            {content.stats?.length ? (
              <div className={styles.stats}>
                {content.stats.map((stat) => (
                  <div key={stat.id} className={styles.statItem}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default HeroBlock;

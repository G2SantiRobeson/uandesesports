import styles from './Card.module.css';

const accentMap = {
  steel: 'var(--accent)',
  warm: 'var(--accent-warm)',
  neutral: 'rgba(255, 255, 255, 0.3)',
};

function Card({
  eyebrow,
  title,
  description,
  meta = [],
  footer,
  accent = 'steel',
  imageUrl,
  imageAlt,
}) {
  return (
    <article
      className={styles.card}
      style={{ '--card-accent': accentMap[accent] || accentMap.steel }}
    >
      {imageUrl ? (
        <div className={styles.media}>
          <img src={imageUrl} alt={imageAlt || title} />
        </div>
      ) : null}
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
      {meta.length ? (
        <div className={styles.meta}>
          {meta.map((item) => (
            <span key={item} className={styles.metaItem}>
              {item}
            </span>
          ))}
        </div>
      ) : null}
      {footer ? <p className={styles.footer}>{footer}</p> : null}
    </article>
  );
}

export default Card;

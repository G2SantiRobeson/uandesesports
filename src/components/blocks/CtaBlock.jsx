import Section from '../shared/Section';
import styles from './CtaBlock.module.css';

function CtaBlock({ block }) {
  const { content } = block;

  return (
    <Section
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      align="center"
    >
      {content.imageUrl ? (
        <figure className={styles.media}>
          <img src={content.imageUrl} alt={content.imageAlt || content.title} />
          {content.caption ? <figcaption>{content.caption}</figcaption> : null}
        </figure>
      ) : null}

      <div className={styles.actions}>
        {content.actions?.filter((action) => action.visible !== false).map((action) => (
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
    </Section>
  );
}

export default CtaBlock;

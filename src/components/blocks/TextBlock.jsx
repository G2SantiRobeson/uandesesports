import Section from '../shared/Section';
import styles from './TextBlock.module.css';

function TextBlock({ block }) {
  const { content } = block;

  return (
    <Section
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.body}
    >
      {content.imageUrl ? (
        <figure className={styles.media}>
          <img src={content.imageUrl} alt={content.imageAlt || content.title} />
          {content.caption ? <figcaption>{content.caption}</figcaption> : null}
        </figure>
      ) : null}

      {content.highlightLabel || content.highlightText ? (
        <div className={styles.highlightBox}>
          {content.highlightLabel ? <span>{content.highlightLabel}</span> : null}
          {content.highlightText ? <strong>{content.highlightText}</strong> : null}
        </div>
      ) : null}
    </Section>
  );
}

export default TextBlock;

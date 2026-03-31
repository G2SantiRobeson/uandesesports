import Section from '../shared/Section';
import styles from './GalleryBlock.module.css';

function GalleryBlock({ block }) {
  const { content } = block;

  return (
    <Section
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      muted
    >
      <div className={styles.grid}>
        {content.images?.map((image) => (
          <figure key={image.id} className={styles.card}>
            <img src={image.url} alt={image.alt || content.title} />
            {image.caption ? <figcaption>{image.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </Section>
  );
}

export default GalleryBlock;

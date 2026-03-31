import Section from '../shared/Section';
import styles from './ImageBlock.module.css';

function ImageBlock({ block }) {
  const { content } = block;
  const isImageLeft = content.imageAlign === 'left';

  return (
    <Section
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      muted
    >
      <div className={`${styles.layout} ${isImageLeft ? styles.reverse : ''}`}>
        <div className={styles.imageFrame}>
          <img src={content.imageUrl} alt={content.imageAlt || content.title} />
          {content.caption ? <p>{content.caption}</p> : null}
        </div>
      </div>
    </Section>
  );
}

export default ImageBlock;

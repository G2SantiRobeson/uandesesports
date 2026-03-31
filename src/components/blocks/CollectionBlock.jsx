import Card from '../shared/Card';
import CardGrid from '../shared/CardGrid';
import Section from '../shared/Section';
import styles from './CollectionBlock.module.css';

function CollectionBlock({ block }) {
  const { content } = block;

  return (
    <Section
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      muted={block.type === 'team-list' || block.type === 'cards'}
    >
      {content.imageUrl ? (
        <figure className={styles.media}>
          <img src={content.imageUrl} alt={content.imageAlt || content.title} />
          {content.caption ? <figcaption>{content.caption}</figcaption> : null}
        </figure>
      ) : null}

      <CardGrid>
        {content.items?.map((item) => (
          <Card
            key={item.id}
            eyebrow={item.eyebrow}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            imageAlt={item.imageAlt}
            meta={item.meta || []}
            footer={item.footer}
            accent={item.accent || 'steel'}
          />
        ))}
      </CardGrid>
    </Section>
  );
}

export default CollectionBlock;

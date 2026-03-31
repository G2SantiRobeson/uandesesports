import CollectionBlock from '../blocks/CollectionBlock';
import CtaBlock from '../blocks/CtaBlock';
import GalleryBlock from '../blocks/GalleryBlock';
import HeroBlock from '../blocks/HeroBlock';
import ImageBlock from '../blocks/ImageBlock';
import TextBlock from '../blocks/TextBlock';

function BlockRenderer({ block }) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} />;
    case 'image':
      return <ImageBlock block={block} />;
    case 'cards':
    case 'news-list':
    case 'events-list':
    case 'team-list':
      return <CollectionBlock block={block} />;
    case 'cta':
      return <CtaBlock block={block} />;
    case 'gallery':
      return <GalleryBlock block={block} />;
    case 'text':
    default:
      return <TextBlock block={block} />;
  }
}

export default BlockRenderer;

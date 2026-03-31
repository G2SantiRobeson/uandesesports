import { sortByOrder } from '../../utils/siteConfigUtils';

function NavigationRenderer({
  navbarItems,
  pages,
  activeSlug,
  linkClassName,
  activeClassName,
  onNavigate,
}) {
  const pagesById = new Map(pages.map((page) => [page.id, page]));

  return sortByOrder(navbarItems).map((item) => {
    const page = pagesById.get(item.pageId);

    if (!page || !page.visible || item.visible === false) {
      return null;
    }

    const isActive = activeSlug === page.slug;
    const linkClasses = [linkClassName, isActive ? activeClassName : '']
      .filter(Boolean)
      .join(' ');

    return (
      <a
        key={item.id}
        href={`#/${page.slug}`}
        className={linkClasses}
        aria-current={isActive ? 'page' : undefined}
        onClick={onNavigate}
      >
        {page.navLabel || page.title}
      </a>
    );
  });
}

export default NavigationRenderer;

import { useState } from 'react';
import NavigationRenderer from '../renderers/NavigationRenderer';
import styles from './Navbar.module.css';

function Navbar({
  brand,
  navbar,
  pages,
  activeSlug,
  isAdmin,
  onAdminToggle,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const homePage = pages.find((page) => page.visible) || pages[0];

  function handleToggle() {
    setIsOpen((currentState) => !currentState);
  }

  function handleNavigate() {
    setIsOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.brand}
          href={`#/${homePage?.slug || 'inicio'}`}
          onClick={handleNavigate}
        >
          <span className={styles.brandMark}>{brand.shortName}</span>
          <span>
            <strong>{brand.name}</strong>
          </span>
        </a>

        <nav className={styles.desktopNav} aria-label="Navegacion principal">
          <NavigationRenderer
            navbarItems={navbar.items}
            pages={pages}
            activeSlug={activeSlug}
            linkClassName={styles.navLink}
            activeClassName={styles.activeLink}
            onNavigate={handleNavigate}
          />
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.adminButton}
            onClick={onAdminToggle}
          >
            {isAdmin ? 'Panel Admin' : navbar.adminLabel || 'Admin'}
          </button>

          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={handleToggle}
          >
            <span className="visuallyHidden">Abrir menu</span>
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        className={`${styles.mobileNav} ${isOpen ? styles.mobileNavOpen : ''}`}
        aria-label="Navegacion movil"
      >
        <NavigationRenderer
          navbarItems={navbar.items}
          pages={pages}
          activeSlug={activeSlug}
          linkClassName={styles.mobileLink}
          activeClassName={styles.mobileActiveLink}
          onNavigate={handleNavigate}
        />
      </nav>
    </header>
  );
}

export default Navbar;

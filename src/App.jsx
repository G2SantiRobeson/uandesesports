import { useEffect, useState } from 'react';
import styles from './App.module.css';
import AdminPanel from './admin/panels/AdminPanel';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import PageRenderer from './components/renderers/PageRenderer';
import { useAuth } from './context/AuthContext';
import { useSiteConfig } from './context/SiteConfigContext';
import { getSlugFromHash, setHashSlug } from './utils/routeUtils';
import { sortByOrder } from './utils/siteConfigUtils';

function App() {
  const { siteConfig } = useSiteConfig();
  const { isAdmin, isAuthenticated, session } = useAuth();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState(() => getSlugFromHash() || '');

  const visiblePages = sortByOrder(siteConfig.pages).filter((page) => page.visible);
  const activePage =
    visiblePages.find((page) => page.slug === activeSlug) || visiblePages[0] || null;

  useEffect(() => {
    function handleHashChange() {
      const nextSlug = getSlugFromHash();

      if (nextSlug !== null) {
        setActiveSlug(nextSlug);
      }
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!visiblePages.length) {
      return;
    }

    const currentHash = window.location.hash;
    const isRouteHash = currentHash.startsWith('#/');

    if (!currentHash) {
      setHashSlug(visiblePages[0].slug);
      return;
    }

    if (isRouteHash && !visiblePages.some((page) => page.slug === activeSlug)) {
      setHashSlug(visiblePages[0].slug);
    }
  }, [activeSlug, visiblePages]);

  return (
    <>
      <Navbar
        brand={siteConfig.brand}
        navbar={siteConfig.navbar}
        pages={siteConfig.pages}
        activeSlug={activePage?.slug}
        isAdmin={isAdmin}
        isAuthenticated={isAuthenticated}
        session={session}
        onAdminToggle={() => setIsAdminPanelOpen(true)}
      />

      <main className={styles.main}>
        <PageRenderer page={activePage} />
      </main>

      <Footer footer={siteConfig.footer} />

      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        activePageId={activePage?.id}
      />
    </>
  );
}

export default App;

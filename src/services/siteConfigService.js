import { defaultSiteConfig } from '../data/defaultSiteConfig';
import { cloneData, normalizeSiteConfig } from '../utils/siteConfigUtils';

const SITE_CONFIG_STORAGE_KEY = 'uandes-esports:site-config:v2';

export function loadSiteConfig() {
  try {
    const storedValue = window.localStorage.getItem(SITE_CONFIG_STORAGE_KEY);

    if (!storedValue) {
      return normalizeSiteConfig(cloneData(defaultSiteConfig));
    }

    const parsedConfig = JSON.parse(storedValue);
    return normalizeSiteConfig(parsedConfig);
  } catch (error) {
    console.error('No fue posible leer siteConfig desde localStorage.', error);
    return normalizeSiteConfig(cloneData(defaultSiteConfig));
  }
}

export function saveSiteConfig(siteConfig) {
  // Reemplazar localStorage por una API real aqui cuando exista backend.
  window.localStorage.setItem(
    SITE_CONFIG_STORAGE_KEY,
    JSON.stringify(siteConfig),
  );
}

export function resetSiteConfig() {
  window.localStorage.removeItem(SITE_CONFIG_STORAGE_KEY);
  return normalizeSiteConfig(cloneData(defaultSiteConfig));
}

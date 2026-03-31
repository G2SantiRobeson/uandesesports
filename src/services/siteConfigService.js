import { API_CONFIG } from '../config/api';
import { defaultSiteConfig } from '../data/defaultSiteConfig';
import { cloneData, normalizeSiteConfig } from '../utils/siteConfigUtils';
import { apiRequest } from './httpClient';

export function getDefaultSiteConfig() {
  return normalizeSiteConfig(cloneData(defaultSiteConfig));
}

export async function loadSiteConfig() {
  const response = await apiRequest(API_CONFIG.endpoints.siteConfig);
  return normalizeSiteConfig(response.siteConfig || response);
}

export async function saveSiteConfig(siteConfig) {
  const response = await apiRequest(API_CONFIG.endpoints.siteConfig, {
    method: 'PUT',
    body: {
      siteConfig,
    },
  });

  return normalizeSiteConfig(response.siteConfig || response);
}

export function resetSiteConfig() {
  return getDefaultSiteConfig();
}

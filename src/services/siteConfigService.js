import { API_CONFIG } from '../config/api';
import { defaultSiteConfig } from '../data/defaultSiteConfig';
import { cloneData, normalizeSiteConfig } from '../utils/siteConfigUtils';
import { apiRequest } from './httpClient';
import { loadSessionToken } from './sessionTokenService';

export function getDefaultSiteConfig() {
  return normalizeSiteConfig(cloneData(defaultSiteConfig));
}

export async function loadSiteConfig() {
  const response = await apiRequest(API_CONFIG.endpoints.siteConfig);
  return normalizeSiteConfig(response.siteConfig || response);
}

export async function saveSiteConfig(siteConfig) {
  const sessionToken = loadSessionToken();
  const response = await apiRequest(API_CONFIG.endpoints.siteConfig, {
    method: 'PUT',
    body: {
      siteConfig,
      sessionToken,
    },
  });

  return normalizeSiteConfig(response.siteConfig || response);
}

export function resetSiteConfig() {
  return getDefaultSiteConfig();
}

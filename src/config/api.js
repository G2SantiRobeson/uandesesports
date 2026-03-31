const fallbackBaseUrl = 'https://api.example.com';

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl,
  timeoutMs: 8000,
  endpoints: {
    siteConfig: '/site-config',
    auth: '/auth/login',
    media: '/media',
  },
};

export function buildApiUrl(pathname) {
  return new URL(pathname, API_CONFIG.baseUrl).toString();
}

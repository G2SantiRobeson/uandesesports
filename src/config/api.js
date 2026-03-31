const fallbackBaseUrl = '/api';

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl,
  timeoutMs: 8000,
  endpoints: {
    siteConfig: '/site-config',
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      session: '/auth/session',
      logout: '/auth/logout',
    },
    media: '/media',
  },
};

export function buildApiUrl(pathname) {
  if (/^https?:\/\//i.test(API_CONFIG.baseUrl)) {
    const normalizedBaseUrl = API_CONFIG.baseUrl.endsWith('/')
      ? API_CONFIG.baseUrl
      : `${API_CONFIG.baseUrl}/`;

    return new URL(pathname.replace(/^\//, ''), normalizedBaseUrl).toString();
  }

  const normalizedBaseUrl = API_CONFIG.baseUrl.replace(/\/+$/, '');
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${normalizedBaseUrl}${normalizedPathname}`;
}

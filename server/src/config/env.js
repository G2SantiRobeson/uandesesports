import dotenv from 'dotenv';

dotenv.config();

function parseBoolean(value, fallback = false) {
  if (value === undefined) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function parseNumber(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function parseOrigins(value) {
  return String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseNumber(process.env.PORT, 4000),
  databaseUrl: process.env.DATABASE_URL || '',
  databaseSsl: parseBoolean(process.env.DATABASE_SSL, false),
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  sessionCookieName:
    process.env.SESSION_COOKIE_NAME || 'uandes_esports_session',
  sessionTtlDays: parseNumber(process.env.SESSION_TTL_DAYS, 7),
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS || 'http://localhost:5173'),
  cookieSameSite:
    process.env.COOKIE_SAME_SITE ||
    (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
  cookieSecure: parseBoolean(
    process.env.COOKIE_SECURE,
    process.env.NODE_ENV === 'production',
  ),
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'uandes2026',
  adminName: process.env.ADMIN_NAME || 'Admin UANDES',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@uandes.cl',
};

if (!env.databaseUrl) {
  throw new Error(
    'DATABASE_URL es obligatoria para iniciar la API de UANDES Esports.',
  );
}

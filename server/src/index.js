import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { env } from './config/env.js';
import { closeDatabase } from './lib/database.js';
import { initializeDatabase } from './bootstrap/initializeDatabase.js';
import sessionAuth from './plugins/sessionAuth.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import siteConfigRoutes from './routes/siteConfigRoutes.js';

function isOriginAllowed(origin) {
  if (!origin) {
    return true;
  }

  if (!env.corsOrigins.length) {
    return true;
  }

  return env.corsOrigins.includes(origin);
}

const app = Fastify({
  logger: env.nodeEnv !== 'test',
});

app.register(cookie);
app.register(cors, {
  credentials: true,
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin no permitido: ${origin}`), false);
  },
});
app.register(sessionAuth);

app.setErrorHandler((error, _request, reply) => {
  app.log.error(error);

  if (reply.sent) {
    return;
  }

  reply.code(error.statusCode || 500).send({
    error:
      error.message || 'Ocurrio un error inesperado en la API de UANDES Esports.',
  });
});

app.register(healthRoutes, { prefix: '/api' });
app.register(authRoutes, { prefix: '/api' });
app.register(siteConfigRoutes, { prefix: '/api' });

async function start() {
  await initializeDatabase();

  await app.listen({
    host: '0.0.0.0',
    port: env.port,
  });

  app.log.info(`API UANDES Esports escuchando en puerto ${env.port}`);
}

async function shutdown() {
  await app.close();
  await closeDatabase();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start().catch(async (error) => {
  app.log.error(error);
  await closeDatabase();
  process.exit(1);
});

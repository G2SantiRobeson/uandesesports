import fp from 'fastify-plugin';
import { env } from '../config/env.js';
import { verifySessionToken } from '../lib/security.js';
import { findUserById } from '../repositories/userRepository.js';

function getBearerToken(authorizationHeader) {
  if (typeof authorizationHeader !== 'string') {
    return '';
  }

  const normalizedHeader = authorizationHeader.trim();
  const tokenMatch = normalizedHeader.match(/^Bearer\s+(.+)$/i);

  if (!tokenMatch?.[1]) {
    return '';
  }

  return tokenMatch[1].trim();
}

function getBodyToken(requestBody) {
  if (!requestBody || typeof requestBody !== 'object') {
    return '';
  }

  const bodyToken =
    requestBody.sessionToken ||
    requestBody.authToken ||
    requestBody.token;

  return typeof bodyToken === 'string' ? bodyToken.trim() : '';
}

async function sessionAuthPlugin(app) {
  app.decorateRequest('sessionUser', null);
  app.decorateRequest('authFailureReason', '');

  app.addHook('preHandler', async (request) => {
    const token =
      request.cookies?.[env.sessionCookieName] ||
      getBearerToken(request.headers.authorization) ||
      getBodyToken(request.body);

    if (!token) {
      request.sessionUser = null;
      request.authFailureReason = 'missing_token';
      return;
    }

    try {
      const payload = verifySessionToken(token);
      try {
        const user = await findUserById(payload.sub);
        request.sessionUser = user || null;
        request.authFailureReason = user ? '' : 'user_not_found';

        if (!user) {
          app.log.warn(
            { userId: payload.sub, url: request.url },
            'Sesion invalida: no se encontro el usuario asociado al token.',
          );
        }
      } catch (error) {
        request.sessionUser = null;
        request.authFailureReason = 'session_lookup_failed';
        app.log.error(
          { error, url: request.url },
          'Error buscando el usuario asociado a la sesion.',
        );
      }
    } catch (error) {
      request.sessionUser = null;
      request.authFailureReason = 'invalid_token';
      app.log.warn(
        { error: error.message, url: request.url },
        'Sesion invalida: no fue posible verificar el token.',
      );
    }
  });
}

export default fp(sessionAuthPlugin, {
  name: 'session-auth',
});

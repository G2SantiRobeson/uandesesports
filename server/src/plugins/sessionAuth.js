import { env } from '../config/env.js';
import { verifySessionToken } from '../lib/security.js';
import { findUserById } from '../repositories/userRepository.js';

function getBearerToken(authorizationHeader) {
  if (typeof authorizationHeader !== 'string') {
    return '';
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (!/^bearer$/i.test(String(scheme || '')) || !token) {
    return '';
  }

  return token.trim();
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

export default async function sessionAuthPlugin(app) {
  app.decorateRequest('sessionUser', null);

  app.addHook('preHandler', async (request) => {
    const token =
      request.cookies?.[env.sessionCookieName] ||
      getBearerToken(request.headers.authorization) ||
      getBodyToken(request.body);

    if (!token) {
      request.sessionUser = null;
      return;
    }

    try {
      const payload = verifySessionToken(token);
      const user = await findUserById(payload.sub);
      request.sessionUser = user || null;
    } catch (error) {
      request.sessionUser = null;
    }
  });
}

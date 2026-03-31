import { env } from '../config/env.js';
import { verifySessionToken } from '../lib/security.js';
import { findUserById } from '../repositories/userRepository.js';

export default async function sessionAuthPlugin(app) {
  app.decorateRequest('sessionUser', null);

  app.addHook('preHandler', async (request) => {
    const token = request.cookies?.[env.sessionCookieName];

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

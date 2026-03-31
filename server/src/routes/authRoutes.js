import {
  clearSessionCookie,
  createSessionToken,
  sanitizeUser,
  setSessionCookie,
  verifyPassword,
} from '../lib/security.js';
import {
  createUser,
  findUserByIdentifier,
} from '../repositories/userRepository.js';
import { hashPassword } from '../lib/security.js';

function validateRegistrationPayload(body = {}) {
  const displayName = String(body.displayName || '').trim();
  const username = String(body.username || '').trim();
  const email = String(body.email || '').trim();
  const password = String(body.password || '');

  if (!displayName || !username || !email || !password) {
    return 'Completa nombre, usuario, email y password.';
  }

  if (password.length < 8) {
    return 'La password debe tener al menos 8 caracteres.';
  }

  return null;
}

export default async function authRoutes(app) {
  app.get('/auth/session', async (request) => ({
    session: sanitizeUser(request.sessionUser),
  }));

  app.post('/auth/login', async (request, reply) => {
    const identifier = String(request.body?.identifier || '').trim();
    const password = String(request.body?.password || '');

    if (!identifier || !password) {
      return reply.code(400).send({
        error: 'Debes ingresar usuario o email y password.',
      });
    }

    const user = await findUserByIdentifier(identifier);

    if (!user) {
      return reply.code(401).send({
        error: 'Credenciales invalidas.',
      });
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return reply.code(401).send({
        error: 'Credenciales invalidas.',
      });
    }

    const token = createSessionToken(user);
    setSessionCookie(reply, token);

    return {
      session: sanitizeUser(user),
    };
  });

  app.post('/auth/register', async (request, reply) => {
    const validationError = validateRegistrationPayload(request.body);

    if (validationError) {
      return reply.code(400).send({ error: validationError });
    }

    const displayName = String(request.body.displayName).trim();
    const username = String(request.body.username).trim();
    const email = String(request.body.email).trim();
    const password = String(request.body.password);

    const existingUser =
      (await findUserByIdentifier(username)) ||
      (await findUserByIdentifier(email));

    if (existingUser) {
      return reply.code(409).send({
        error: 'Ya existe una cuenta con ese usuario o email.',
      });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({
      displayName,
      username,
      email,
      passwordHash,
      role: 'user',
    });

    const token = createSessionToken(user);
    setSessionCookie(reply, token);

    return reply.code(201).send({
      session: sanitizeUser(user),
    });
  });

  app.post('/auth/logout', async (_request, reply) => {
    clearSessionCookie(reply);
    return {
      success: true,
    };
  });
}

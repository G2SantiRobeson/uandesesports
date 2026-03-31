import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const SESSION_TTL_SECONDS = env.sessionTtlDays * 24 * 60 * 60;

export function normalizeIdentity(value) {
  return String(value || '').trim().toLowerCase();
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function createSessionToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: `${env.sessionTtlDays}d`,
    },
  );
}

export function verifySessionToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function getCookieOptions() {
  return {
    path: '/',
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function setSessionCookie(reply, token) {
  reply.setCookie(env.sessionCookieName, token, getCookieOptions());
}

export function clearSessionCookie(reply) {
  reply.clearCookie(env.sessionCookieName, {
    path: '/',
    httpOnly: true,
    sameSite: env.cookieSameSite,
    secure: env.cookieSecure,
  });
}

export function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.display_name,
    role: user.role,
    createdAt: user.created_at,
  };
}

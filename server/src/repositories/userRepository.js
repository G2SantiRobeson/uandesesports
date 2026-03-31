import { randomUUID } from 'node:crypto';
import { query } from '../lib/database.js';
import { normalizeIdentity } from '../lib/security.js';

export async function findUserById(userId) {
  const result = await query(
    `select id, username, email, display_name, password_hash, role, created_at
     from app_users
     where id = $1`,
    [userId],
  );

  return result.rows[0] || null;
}

export async function findUserByIdentifier(identifier) {
  const normalizedIdentifier = normalizeIdentity(identifier);
  const result = await query(
    `select id, username, email, display_name, password_hash, role, created_at
     from app_users
     where username = $1 or email = $1
     limit 1`,
    [normalizedIdentifier],
  );

  return result.rows[0] || null;
}

export async function createUser({
  username,
  email,
  passwordHash,
  role = 'user',
}) {
  const rawUsername = String(username || '').trim();
  const normalizedUsername = normalizeIdentity(rawUsername);
  const normalizedEmail = normalizeIdentity(email);

  const result = await query(
    `insert into app_users (
      id,
      username,
      email,
      display_name,
      password_hash,
      role
    ) values ($1, $2, $3, $4, $5, $6)
    returning id, username, email, display_name, password_hash, role, created_at`,
    [
      randomUUID(),
      normalizedUsername,
      normalizedEmail,
      rawUsername,
      passwordHash,
      role,
    ],
  );

  return result.rows[0];
}

import { randomUUID } from 'node:crypto';
import {
  cloneData,
  normalizeSiteConfig,
} from '../../../src/utils/siteConfigUtils.js';
import { defaultSiteConfig } from '../../../src/data/defaultSiteConfig.js';
import { env } from '../config/env.js';
import { getClient } from '../lib/database.js';
import { hashPassword } from '../lib/security.js';

export async function initializeDatabase() {
  const client = await getClient();

  try {
    await client.query('begin');

    await client.query(`
      create table if not exists app_users (
        id uuid primary key,
        username text not null unique,
        email text not null unique,
        display_name text not null,
        password_hash text not null,
        role text not null check (role in ('admin', 'user')),
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    `);

    await client.query(`
      create table if not exists site_configs (
        id text primary key,
        data jsonb not null,
        updated_by uuid references app_users(id) on delete set null,
        updated_at timestamptz not null default now()
      );
    `);

    const passwordHash = await hashPassword(env.adminPassword);

    await client.query(
      `insert into app_users (
        id,
        username,
        email,
        display_name,
        password_hash,
        role
      )
      values ($1, $2, $3, $4, $5, 'admin')
      on conflict (username)
      do update set
        email = excluded.email,
        display_name = excluded.display_name,
        password_hash = excluded.password_hash,
        role = 'admin',
        updated_at = now()`,
      [
        randomUUID(),
        env.adminUsername.toLowerCase(),
        env.adminEmail.toLowerCase(),
        env.adminName,
        passwordHash,
      ],
    );

    const seededConfig = normalizeSiteConfig(cloneData(defaultSiteConfig));

    await client.query(
      `insert into site_configs (id, data, updated_at)
       values ('main', $1::jsonb, now())
       on conflict (id) do nothing`,
      [JSON.stringify(seededConfig)],
    );

    await client.query('commit');
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}

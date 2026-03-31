import {
  cloneData,
  normalizeSiteConfig,
} from '../../../src/utils/siteConfigUtils.js';
import { defaultSiteConfig } from '../../../src/data/defaultSiteConfig.js';
import { getClient } from '../lib/database.js';

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

    await client.query(
      `delete from app_users
       where username = 'admin'
         and email = 'admin@uandes.cl'
         and role = 'admin'`,
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

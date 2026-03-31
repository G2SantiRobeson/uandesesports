import {
  cloneData,
  normalizeSiteConfig,
} from '../../../src/utils/siteConfigUtils.js';
import { defaultSiteConfig } from '../../../src/data/defaultSiteConfig.js';
import { query } from '../lib/database.js';

const DEFAULT_CONFIG_ID = 'main';

export async function getMainSiteConfig() {
  const result = await query(
    `select data, updated_at
     from site_configs
     where id = $1
     limit 1`,
    [DEFAULT_CONFIG_ID],
  );

  if (!result.rows[0]) {
    return normalizeSiteConfig(cloneData(defaultSiteConfig));
  }

  return normalizeSiteConfig(result.rows[0].data);
}

export async function saveMainSiteConfig(siteConfig, updatedBy) {
  const normalizedConfig = normalizeSiteConfig(siteConfig);

  const result = await query(
    `insert into site_configs (id, data, updated_by, updated_at)
     values ($1, $2::jsonb, $3, now())
     on conflict (id)
     do update set
       data = excluded.data,
       updated_by = excluded.updated_by,
       updated_at = now()
     returning data`,
    [DEFAULT_CONFIG_ID, JSON.stringify(normalizedConfig), updatedBy || null],
  );

  return normalizeSiteConfig(result.rows[0].data);
}

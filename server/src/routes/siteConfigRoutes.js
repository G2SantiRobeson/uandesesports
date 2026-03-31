import { normalizeSiteConfig } from '../../../src/utils/siteConfigUtils.js';
import {
  getMainSiteConfig,
  saveMainSiteConfig,
} from '../repositories/siteConfigRepository.js';

function requireAdmin(request, reply) {
  if (request.sessionUser?.role !== 'admin') {
    reply.code(403).send({
      error: 'No tienes permisos para editar la configuracion del sitio.',
    });
    return false;
  }

  return true;
}

export default async function siteConfigRoutes(app) {
  app.get('/site-config', async () => {
    const siteConfig = await getMainSiteConfig();
    return { siteConfig };
  });

  app.put('/site-config', async (request, reply) => {
    if (!requireAdmin(request, reply)) {
      return;
    }

    const incomingSiteConfig = request.body?.siteConfig || request.body;

    if (!incomingSiteConfig || typeof incomingSiteConfig !== 'object') {
      return reply.code(400).send({
        error: 'Debes enviar un objeto siteConfig valido.',
      });
    }

    const siteConfig = await saveMainSiteConfig(
      normalizeSiteConfig(incomingSiteConfig),
      request.sessionUser.id,
    );

    return { siteConfig };
  });
}

import { normalizeSiteConfig } from '../../../src/utils/siteConfigUtils.js';
import {
  getMainSiteConfig,
  saveMainSiteConfig,
} from '../repositories/siteConfigRepository.js';

function requireAdmin(request, reply) {
  if (!request.sessionUser) {
    const authFailureReason = request.authFailureReason || 'unknown';
    const authFailureMessages = {
      missing_token:
        'Tu sesion no fue enviada a la API. Inicia sesion nuevamente y vuelve a intentar.',
      invalid_token:
        'La API recibio un token invalido o vencido. Cierra sesion, vuelve a entrar y prueba otra vez.',
      user_not_found:
        'La API recibio tu token, pero no encontro ese usuario en la base de datos.',
      session_lookup_failed:
        'La API no pudo validar tu sesion por un problema consultando la base de datos.',
      unknown:
        'Tu sesion no fue reconocida por la API. Inicia sesion nuevamente y vuelve a intentar.',
    };

    reply.code(401).send({
      error: authFailureMessages[authFailureReason] || authFailureMessages.unknown,
      code: authFailureReason,
    });
    return false;
  }

  if (String(request.sessionUser.role || '').toLowerCase() !== 'admin') {
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

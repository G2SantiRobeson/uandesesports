export default async function healthRoutes(app) {
  app.get('/health', async () => ({
    ok: true,
    service: 'uandes-esports-api',
    timestamp: new Date().toISOString(),
  }));
}

import { API_CONFIG, buildApiUrl } from '../config/api';
import { loadSessionToken } from './sessionTokenService';

function parseResponseBody(text) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function runRequest(pathname, options = {}) {
  const controller = new AbortController();
  const sessionToken = loadSessionToken();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    options.timeoutMs || API_CONFIG.timeoutMs,
  );

  try {
    const response = await fetch(buildApiUrl(pathname), {
      method: options.method || 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const text = await response.text();
    const payload = parseResponseBody(text);

    if (!response.ok) {
      throw new Error(payload?.error || 'No fue posible completar la solicitud.');
    }

    return payload;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardo demasiado y fue cancelada.');
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function apiRequest(pathname, options = {}) {
  try {
    return await runRequest(pathname, options);
  } catch (error) {
    const method = String(options.method || 'GET').toUpperCase();
    const shouldRetry =
      error.message === 'La solicitud tardo demasiado y fue cancelada.' &&
      method === 'GET' &&
      !options.disableRetry;

    if (!shouldRetry) {
      throw error;
    }

    await delay(1500);
    return runRequest(pathname, {
      ...options,
      disableRetry: true,
    });
  }
}

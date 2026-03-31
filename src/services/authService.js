import { API_CONFIG } from '../config/api';
import { apiRequest } from './httpClient';
import {
  clearSessionToken,
  saveSessionToken,
} from './sessionTokenService';

export async function loadSession() {
  const response = await apiRequest(API_CONFIG.endpoints.auth.session);
  const session = response.session || null;

  if (response.token) {
    saveSessionToken(response.token);
  }

  if (!session) {
    clearSessionToken();
  }
  return session;
}

export async function loginWithCredentials(identifier, password) {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.auth.login, {
      method: 'POST',
      body: {
        identifier,
        password,
      },
    });

    if (response.token) {
      saveSessionToken(response.token);
    }

    return {
      success: true,
      session: response.session,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function registerWithCredentials(payload) {
  try {
    const response = await apiRequest(API_CONFIG.endpoints.auth.register, {
      method: 'POST',
      body: payload,
    });

    if (response.token) {
      saveSessionToken(response.token);
    }

    return {
      success: true,
      session: response.session,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function clearSession() {
  try {
    await apiRequest(API_CONFIG.endpoints.auth.logout, {
      method: 'POST',
    });
  } finally {
    clearSessionToken();
  }
}

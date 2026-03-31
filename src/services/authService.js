import { API_CONFIG } from '../config/api';
import { apiRequest } from './httpClient';

export async function loadSession() {
  const response = await apiRequest(API_CONFIG.endpoints.auth.session);
  return response.session || null;
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
  await apiRequest(API_CONFIG.endpoints.auth.logout, {
    method: 'POST',
  });
}

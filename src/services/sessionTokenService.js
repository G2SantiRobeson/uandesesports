const SESSION_TOKEN_KEY = 'uandes_esports_session_token';

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function loadSessionToken() {
  if (!canUseStorage()) {
    return '';
  }

  return window.localStorage.getItem(SESSION_TOKEN_KEY) || '';
}

export function saveSessionToken(token) {
  if (!canUseStorage()) {
    return;
  }

  if (!token) {
    window.localStorage.removeItem(SESSION_TOKEN_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function clearSessionToken() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_TOKEN_KEY);
}

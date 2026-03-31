const SESSION_STORAGE_KEY = 'uandes-esports:session:v1';

const adminAccount = {
  username: 'admin',
  password: 'uandes2026',
  role: 'Admin',
  name: 'Admin UANDES',
};

export function loadSession() {
  try {
    const storedValue = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error('No fue posible leer la sesion.', error);
    return null;
  }
}

export function loginWithCredentials(username, password) {
  if (
    username.trim() === adminAccount.username &&
    password.trim() === adminAccount.password
  ) {
    const session = {
      role: adminAccount.role,
      name: adminAccount.name,
      username: adminAccount.username,
    };

    // Reemplazar este guardado por autenticacion real cuando exista backend.
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return { success: true, session };
  }

  return {
    success: false,
    error: 'Credenciales invalidas. Usa admin / uandes2026.',
  };
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

import { createContext, useContext, useEffect, useState } from 'react';
import {
  clearSession,
  loadSession,
  loginWithCredentials,
  registerWithCredentials,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const nextSession = await loadSession();

        if (isMounted) {
          setSession(nextSession);
        }
      } catch (error) {
        console.error('No fue posible cargar la sesion actual.', error);

        if (isMounted) {
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function login(identifier, password) {
    const result = await loginWithCredentials(identifier, password);

    if (result.success) {
      setSession(result.session);
    }

    return result;
  }

  async function register(payload) {
    const result = await registerWithCredentials(payload);

    if (result.success) {
      setSession(result.session);
    }

    return result;
  }

  async function logout() {
    try {
      await clearSession();
    } catch (error) {
      console.error('No fue posible cerrar la sesion.', error);
    } finally {
      setSession(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isAuthenticated: Boolean(session),
        isAdmin: session?.role === 'admin' || session?.role === 'Admin',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contextValue = useContext(AuthContext);

  if (!contextValue) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.');
  }

  return contextValue;
}

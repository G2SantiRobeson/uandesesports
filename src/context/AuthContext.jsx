import { createContext, useContext, useState } from 'react';
import {
  clearSession,
  loadSession,
  loginWithCredentials,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSession());

  function login(username, password) {
    const result = loginWithCredentials(username, password);

    if (result.success) {
      setSession(result.session);
    }

    return result;
  }

  function logout() {
    clearSession();
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAdmin: session?.role === 'Admin',
        login,
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

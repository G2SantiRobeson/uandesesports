import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminForms.module.css';

const initialFormState = {
  identifier: '',
  password: '',
  displayName: '',
  username: '',
  email: '',
};

function LoginForm() {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState('login');
  const [formValues, setFormValues] = useState(initialFormState);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(fieldName, nextValue) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: nextValue,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result =
        mode === 'login'
          ? await login(formValues.identifier, formValues.password)
          : await register({
              displayName: formValues.displayName,
              username: formValues.username,
              email: formValues.email,
              password: formValues.password,
            });

      if (!result.success) {
        setError(result.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isBusy = isSubmitting || isLoading;

  return (
    <form className={styles.stack} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <div className={styles.authHeader}>
          <div>
            <h3>{mode === 'login' ? 'Ingresar a tu cuenta' : 'Crear cuenta'}</h3>
            <p className={styles.hint}>
              La web ya usa autenticacion real. Los usuarios comunes pueden iniciar
              sesion y solo las cuentas con rol admin pueden editar el sitio.
            </p>
          </div>

          <div className={styles.tabRow} role="tablist" aria-label="Tipo de acceso">
            <button
              type="button"
              className={`${styles.tabButton} ${
                mode === 'login' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`${styles.tabButton} ${
                mode === 'register' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setMode('register')}
            >
              Registro
            </button>
          </div>
        </div>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.section}>
        {mode === 'register' ? (
          <>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label htmlFor="register-display-name">Nombre visible</label>
                <input
                  id="register-display-name"
                  className={styles.input}
                  value={formValues.displayName}
                  onChange={(event) =>
                    updateField('displayName', event.target.value)
                  }
                  placeholder="Ej: Catalina Mena"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="register-username">Usuario</label>
                <input
                  id="register-username"
                  className={styles.input}
                  value={formValues.username}
                  onChange={(event) => updateField('username', event.target.value)}
                  placeholder="Ej: catalina.mena"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  type="email"
                  className={styles.input}
                  value={formValues.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="tu@correo.cl"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  type="password"
                  className={styles.input}
                  value={formValues.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  placeholder="Minimo 8 caracteres"
                />
              </div>
            </div>
          </>
        ) : (
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label htmlFor="login-identifier">Usuario o email</label>
              <input
                id="login-identifier"
                className={styles.input}
                value={formValues.identifier}
                onChange={(event) => updateField('identifier', event.target.value)}
                placeholder="admin o tu@correo.cl"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className={styles.input}
                value={formValues.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="Tu password"
              />
            </div>
          </div>
        )}

        <button type="submit" className={styles.button} disabled={isBusy}>
          {isBusy
            ? 'Procesando...'
            : mode === 'login'
              ? 'Ingresar'
              : 'Crear cuenta'}
        </button>
      </div>

      <div className={styles.helperCard}>
        <span className={styles.helperLabel}>Admin inicial</span>
        <p className={styles.helperText}>
          Si mantienes la semilla por defecto del backend, la cuenta admin inicial
          es `admin / uandes2026`.
        </p>
      </div>
    </form>
  );
}

export default LoginForm;

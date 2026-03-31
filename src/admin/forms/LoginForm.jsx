import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminForms.module.css';

const initialFormState = {
  identifier: '',
  password: '',
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
            <div className={styles.tripleRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="register-username">Nick gamer</label>
                <input
                  id="register-username"
                  className={styles.input}
                  value={formValues.username}
                  onChange={(event) => updateField('username', event.target.value)}
                  placeholder="Ej: Capywara, Kuro, Nexo"
                />
              </div>

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
              <label htmlFor="login-identifier">Nick gamer o email</label>
              <input
                id="login-identifier"
                className={styles.input}
                value={formValues.identifier}
                onChange={(event) => updateField('identifier', event.target.value)}
                placeholder="Tu nick gamer o tu correo"
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
        <span className={styles.helperLabel}>Roles</span>
        <p className={styles.helperText}>
          Las cuentas nuevas se crean como usuario comun. El rol admin se asigna
          aparte desde la base de datos.
        </p>
      </div>
    </form>
  );
}

export default LoginForm;

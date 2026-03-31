import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminForms.module.css';

const initialFormState = {
  identifier: '',
  password: '',
  username: '',
  email: '',
  confirmPassword: '',
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function validateLoginField(fieldName, value) {
  const normalizedValue = String(value || '').trim();

  if (fieldName === 'identifier' && !normalizedValue) {
    return 'Ingresa tu nick gamer o tu email.';
  }

  if (fieldName === 'password' && !String(value || '')) {
    return 'Ingresa tu password.';
  }

  return '';
}

function validateRegisterField(fieldName, formValues) {
  const username = String(formValues.username || '').trim();
  const email = String(formValues.email || '').trim();
  const password = String(formValues.password || '');
  const confirmPassword = String(formValues.confirmPassword || '');

  if (fieldName === 'username') {
    if (!username) {
      return 'Ingresa tu nick gamer.';
    }

    if (username.length < 3) {
      return 'Tu nick gamer debe tener al menos 3 caracteres.';
    }
  }

  if (fieldName === 'email') {
    if (!email) {
      return 'Ingresa tu email.';
    }

    if (!isValidEmail(email)) {
      return 'Ingresa un email valido.';
    }
  }

  if (fieldName === 'password') {
    if (!password) {
      return 'Ingresa una password.';
    }

    if (password.length < 8) {
      return 'La password debe tener al menos 8 caracteres.';
    }
  }

  if (fieldName === 'confirmPassword') {
    if (!confirmPassword) {
      return 'Confirma tu password.';
    }

    if (confirmPassword !== password) {
      return 'Las passwords no coinciden.';
    }
  }

  return '';
}

function getLoginErrors(formValues) {
  return {
    identifier: validateLoginField('identifier', formValues.identifier),
    password: validateLoginField('password', formValues.password),
  };
}

function getRegisterErrors(formValues) {
  return {
    username: validateRegisterField('username', formValues),
    email: validateRegisterField('email', formValues),
    password: validateRegisterField('password', formValues),
    confirmPassword: validateRegisterField('confirmPassword', formValues),
  };
}

function LoginForm({ onSuccess }) {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState('login');
  const [formValues, setFormValues] = useState(initialFormState);
  const [touchedFields, setTouchedFields] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const closeTimerRef = useRef(null);

  const loginErrors = useMemo(
    () => getLoginErrors(formValues),
    [formValues],
  );
  const registerErrors = useMemo(
    () => getRegisterErrors(formValues),
    [formValues],
  );
  const activeErrors = mode === 'login' ? loginErrors : registerErrors;
  const isBusy = isSubmitting || isLoading;
  const isLoginValid = Object.values(loginErrors).every((message) => !message);
  const isRegisterValid = Object.values(registerErrors).every((message) => !message);

  useEffect(
    () => () => {
      window.clearTimeout(closeTimerRef.current);
    },
    [],
  );

  function updateField(fieldName, nextValue) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: nextValue,
    }));
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [fieldName]: true,
    }));
    setError('');
    setSuccessMessage('');
  }

  function touchFields(fieldNames) {
    setTouchedFields((currentFields) =>
      fieldNames.reduce(
        (nextFields, fieldName) => ({
          ...nextFields,
          [fieldName]: true,
        }),
        { ...currentFields },
      ),
    );
  }

  function switchMode(nextMode) {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    setFormValues(initialFormState);
    setTouchedFields({});
    setError('');
    setSuccessMessage('');
    setIsConfirmModalOpen(false);
  }

  async function completeSuccessfulAccess(message) {
    setSuccessMessage(message);
    setError('');
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      onSuccess?.();
    }, 750);
  }

  async function submitLogin() {
    touchFields(['identifier', 'password']);

    if (!isLoginValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(formValues.identifier, formValues.password);

      if (!result.success) {
        setError(result.error);
        return;
      }

      await completeSuccessfulAccess('Sesion iniciada correctamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function requestRegisterConfirmation() {
    touchFields(['username', 'email', 'password', 'confirmPassword']);

    if (!isRegisterValid) {
      return;
    }

    setError('');
    setIsConfirmModalOpen(true);
  }

  async function confirmRegister() {
    setIsSubmitting(true);

    try {
      const result = await register({
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
      });

      if (!result.success) {
        setError(result.error);
        setIsConfirmModalOpen(false);
        return;
      }

      setIsConfirmModalOpen(false);
      await completeSuccessfulAccess('Cuenta creada correctamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (mode === 'login') {
      submitLogin();
      return;
    }

    requestRegisterConfirmation();
  }

  function getFieldError(fieldName) {
    if (!touchedFields[fieldName]) {
      return '';
    }

    return activeErrors[fieldName] || '';
  }

  return (
    <>
      <form className={styles.authShell} onSubmit={handleSubmit} noValidate>
        <section className={styles.authIntroCard}>
          <div className={styles.authTopbar}>
            <div className={styles.authIntroCopy}>
              <p className={styles.sectionTag}>Cuenta UANDES Esports</p>
              <h3 className={styles.authTitle}>
                {mode === 'login'
                  ? 'Ingresa con tu cuenta'
                  : 'Crea tu cuenta en minutos'}
              </h3>
              <p className={styles.authSubtitle}>
                {mode === 'login'
                  ? 'Accede con tu nick gamer o email para entrar a tu cuenta. Si tu rol es admin, podras gestionar el sitio.'
                  : 'Registra tu nick gamer, valida tu password y confirma tus datos antes de crear la cuenta.'}
              </p>
            </div>

            <div
              className={styles.tabRow}
              role="tablist"
              aria-label="Seleccion de acceso"
            >
              <button
                type="button"
                className={`${styles.tabButton} ${
                  mode === 'login' ? styles.tabButtonActive : ''
                }`}
                onClick={() => switchMode('login')}
                role="tab"
                aria-selected={mode === 'login'}
                tabIndex={mode === 'login' ? 0 : -1}
              >
                Login
              </button>
              <button
                type="button"
                className={`${styles.tabButton} ${
                  mode === 'register' ? styles.tabButtonActive : ''
                }`}
                onClick={() => switchMode('register')}
                role="tab"
                aria-selected={mode === 'register'}
                tabIndex={mode === 'register' ? 0 : -1}
              >
                Registro
              </button>
            </div>
          </div>
        </section>

        {error ? (
          <div className={styles.errorBanner} role="alert">
            <strong>Error</strong>
            <span>{error}</span>
          </div>
        ) : null}

        {successMessage ? (
          <div className={styles.successBanner} role="status" aria-live="polite">
            <strong>Listo</strong>
            <span>{successMessage} Cerrando panel...</span>
          </div>
        ) : null}

        <section className={styles.authFormCard}>
          <div className={styles.authFieldStack}>
            {mode === 'login' ? (
              <>
                <div className={styles.fieldGroup}>
                  <label htmlFor="login-identifier">Nick gamer o email</label>
                  <input
                    id="login-identifier"
                    className={`${styles.input} ${
                      getFieldError('identifier') ? styles.inputError : ''
                    }`}
                    value={formValues.identifier}
                    onChange={(event) =>
                      updateField('identifier', event.target.value)
                    }
                    onBlur={() => touchFields(['identifier'])}
                    placeholder="Ej: Capywara o tu@correo.cl"
                    autoComplete="username"
                    aria-invalid={Boolean(getFieldError('identifier'))}
                    aria-describedby="login-identifier-error"
                  />
                  <span className={styles.fieldHint}>
                    Puedes usar tu nick gamer o tu email.
                  </span>
                  {getFieldError('identifier') ? (
                    <span
                      id="login-identifier-error"
                      className={styles.fieldError}
                      role="alert"
                    >
                      {getFieldError('identifier')}
                    </span>
                  ) : null}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    className={`${styles.input} ${
                      getFieldError('password') ? styles.inputError : ''
                    }`}
                    value={formValues.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    onBlur={() => touchFields(['password'])}
                    placeholder="Ingresa tu password"
                    autoComplete="current-password"
                    aria-invalid={Boolean(getFieldError('password'))}
                    aria-describedby="login-password-error"
                  />
                  {getFieldError('password') ? (
                    <span
                      id="login-password-error"
                      className={styles.fieldError}
                      role="alert"
                    >
                      {getFieldError('password')}
                    </span>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <div className={styles.fieldGroup}>
                  <label htmlFor="register-username">Nick gamer</label>
                  <input
                    id="register-username"
                    className={`${styles.input} ${
                      getFieldError('username') ? styles.inputError : ''
                    }`}
                    value={formValues.username}
                    onChange={(event) => updateField('username', event.target.value)}
                    onBlur={() => touchFields(['username'])}
                    placeholder="Ej: Capywara"
                    autoComplete="nickname"
                    aria-invalid={Boolean(getFieldError('username'))}
                    aria-describedby="register-username-error"
                  />
                  <span className={styles.fieldHint}>
                    Este nick sera el nombre visible de tu cuenta.
                  </span>
                  {getFieldError('username') ? (
                    <span
                      id="register-username-error"
                      className={styles.fieldError}
                      role="alert"
                    >
                      {getFieldError('username')}
                    </span>
                  ) : null}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="register-email">Email</label>
                  <input
                    id="register-email"
                    type="email"
                    className={`${styles.input} ${
                      getFieldError('email') ? styles.inputError : ''
                    }`}
                    value={formValues.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    onBlur={() => touchFields(['email'])}
                    placeholder="tu@correo.cl"
                    autoComplete="email"
                    aria-invalid={Boolean(getFieldError('email'))}
                    aria-describedby="register-email-error"
                  />
                  {getFieldError('email') ? (
                    <span
                      id="register-email-error"
                      className={styles.fieldError}
                      role="alert"
                    >
                      {getFieldError('email')}
                    </span>
                  ) : null}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="register-password">Password</label>
                  <input
                    id="register-password"
                    type="password"
                    className={`${styles.input} ${
                      getFieldError('password') ? styles.inputError : ''
                    }`}
                    value={formValues.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    onBlur={() => touchFields(['password'])}
                    placeholder="Minimo 8 caracteres"
                    autoComplete="new-password"
                    aria-invalid={Boolean(getFieldError('password'))}
                    aria-describedby="register-password-error"
                  />
                  <span className={styles.fieldHint}>
                    Usa una password de al menos 8 caracteres.
                  </span>
                  {getFieldError('password') ? (
                    <span
                      id="register-password-error"
                      className={styles.fieldError}
                      role="alert"
                    >
                      {getFieldError('password')}
                    </span>
                  ) : null}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="register-confirm-password">
                    Confirmar password
                  </label>
                  <input
                    id="register-confirm-password"
                    type="password"
                    className={`${styles.input} ${
                      getFieldError('confirmPassword') ? styles.inputError : ''
                    }`}
                    value={formValues.confirmPassword}
                    onChange={(event) =>
                      updateField('confirmPassword', event.target.value)
                    }
                    onBlur={() => touchFields(['confirmPassword'])}
                    placeholder="Repite tu password"
                    autoComplete="new-password"
                    aria-invalid={Boolean(getFieldError('confirmPassword'))}
                    aria-describedby="register-confirm-password-error"
                  />
                  {getFieldError('confirmPassword') ? (
                    <span
                      id="register-confirm-password-error"
                      className={styles.fieldError}
                      role="alert"
                    >
                      {getFieldError('confirmPassword')}
                    </span>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <div className={styles.authActions}>
            <button type="submit" className={styles.button} disabled={isBusy}>
              {isBusy
                ? 'Procesando...'
                : mode === 'login'
                  ? 'Ingresar'
                  : 'Crear cuenta'}
            </button>
          </div>
        </section>

        <section className={styles.helperCard}>
          <span className={styles.helperLabel}>Roles y acceso</span>
          <p className={styles.helperText}>
            Las cuentas nuevas se crean como usuario comun. El rol admin se asigna
            aparte desde la base de datos.
          </p>
        </section>
      </form>

      {isConfirmModalOpen ? (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onClick={() => setIsConfirmModalOpen(false)}
        >
          <div
            className={styles.confirmModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-register-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <p className={styles.sectionTag}>Confirmacion</p>
              <h4 id="confirm-register-title">Estas seguro de los datos ingresados?</h4>
              <p className={styles.hint}>
                Revisa el nick gamer y el email antes de crear la cuenta.
              </p>
            </div>

            <div className={styles.modalReview}>
              <div>
                <span className={styles.accountLabel}>Nick gamer</span>
                <strong>{formValues.username}</strong>
              </div>
              <div>
                <span className={styles.accountLabel}>Email</span>
                <strong>{formValues.email}</strong>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isBusy}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.button}
                onClick={confirmRegister}
                disabled={isBusy}
              >
                {isBusy ? 'Creando cuenta...' : 'Confirmar y crear cuenta'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default LoginForm;

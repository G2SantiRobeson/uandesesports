import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminForms.module.css';

function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('uandes2026');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const result = login(username, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setError('');
  }

  return (
    <form className={styles.stack} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <h3>Acceso Admin</h3>
        <p className={styles.hint}>
          Este login es solo para demo/MVP. La sesion se guarda en localStorage y
          luego puede reemplazarse por autenticacion real.
        </p>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.section}>
        <div className={styles.fieldGroup}>
          <label htmlFor="admin-username">Usuario</label>
          <input
            id="admin-username"
            className={styles.input}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" className={styles.button}>
          Ingresar como Admin
        </button>
      </div>

      <p className={styles.credentials}>Credenciales demo: admin / uandes2026</p>
    </form>
  );
}

export default LoginForm;

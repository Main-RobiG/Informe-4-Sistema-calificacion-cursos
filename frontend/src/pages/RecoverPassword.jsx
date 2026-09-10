import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/api';
import '../styles/auth.css';

function RecoverPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    academicRegistry: '',
    email: '',
    newPassword: '',
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await apiRequest(
        '/auth/recover-password',
        {
          method: 'POST',
          body: JSON.stringify(form),
        }
      );

      setMessage(data.message);

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Recuperar contraseña</h1>

        <p>
          Ingresa tu Registro Académico y
          correo electrónico.
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="academicRegistry">
              Registro Académico
            </label>

            <input
              id="academicRegistry"
              name="academicRegistry"
              type="text"
              value={form.academicRegistry}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Correo Electrónico
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">
              Nueva contraseña
            </label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Actualizando...'
              : 'Cambiar contraseña'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecoverPassword;
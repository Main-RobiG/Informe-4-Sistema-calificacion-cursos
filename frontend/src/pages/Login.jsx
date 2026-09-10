import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/api';
import '../styles/auth.css';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    academicRegistry: '',
    password: '',
  });

  const [error, setError] = useState('');
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
    setLoading(true);

    try {
      const data = await apiRequest(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify(form),
        }
      );

      localStorage.setItem(
        'token',
        data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      navigate('/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sistema de Calificación de Cursos</h1>
          <p>Facultad de Ingeniería</p>
        </div>

        <h2>Iniciar sesión</h2>

        {error && (
          <div className="error-message">
            {error}
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
              placeholder="Ej. 202012345"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
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
              ? 'Ingresando...'
              : 'Ingresar'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/recover-password">
            ¿Olvidaste tu contraseña?
          </Link>

          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/register">
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
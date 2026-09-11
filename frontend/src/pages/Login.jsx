import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/api';
import '../styles/auth.css';

function Login() {
  const navigate = useNavigate();

  const [academicRegistry, setAcademicRegistry] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          academicRegistry,
          password,
        }),
      });

      localStorage.setItem('token', data.token);

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Iniciar Sesión</h1>
          <p>Sistema de Calificación de Cursos</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="academicRegistry">Registro Académico</label>
            <input
              id="academicRegistry"
              type="text"
              value={academicRegistry}
              onChange={(e) => setAcademicRegistry(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="primary-button" type="submit">
            Ingresar
          </button>
        </form>

        <div className="auth-links">
          <p>
            <Link to="/recover-password">Olvidé mi contraseña</Link>
          </p>
          <p>
            ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/api';
import '../styles/auth.css';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    academicRegistry: '',
    fullName: '',
    email: '',
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
      await apiRequest(
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify(form),
        }
      );

      alert('Usuario registrado correctamente');

      // El enunciado exige redirigir al Login.
      navigate('/login');
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
          <h1>Crear cuenta</h1>
          <p>Sistema de Calificación de Cursos</p>
        </div>

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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">
              Nombres y Apellidos
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
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
              ? 'Registrando...'
              : 'Registrarse'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/api';

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
        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        );
      }

      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <h1>Iniciar Sesión</h1>

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Registro Académico</label>

          <input
            type="text"
            value={academicRegistry}
            onChange={(e) =>
              setAcademicRegistry(e.target.value)
            }
            required
            style={{
              width: '100%',
              padding: '8px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            style={{
              width: '100%',
              padding: '8px',
            }}
          />
        </div>

        <button type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Login;
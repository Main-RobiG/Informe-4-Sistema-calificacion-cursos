import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>Sistema de Calificación de Cursos</h1>

      <p>
        Inicio de sesión correcto.
      </p>

      <button onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Home;
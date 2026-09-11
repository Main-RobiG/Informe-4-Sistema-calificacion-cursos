import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/api';
import '../styles/home.css';

function Home() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);

  const [filters, setFilters] = useState({
    courseId: '',
    professorId: '',
    courseName: '',
    professorName: '',
  });

  const [searchRegistry, setSearchRegistry] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError('');

      try {
        const [coursesData, professorsData, postsData] = await Promise.all([
          apiRequest('/courses'),
          apiRequest('/professors'),
          apiRequest('/posts'),
        ]);

        setCourses(coursesData);
        setProfessors(professorsData);
        setPosts(postsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const loadPosts = async (customFilters = filters) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();

      if (customFilters.courseId) params.append('courseId', customFilters.courseId);
      if (customFilters.professorId) params.append('professorId', customFilters.professorId);
      if (customFilters.courseName.trim()) params.append('courseName', customFilters.courseName.trim());
      if (customFilters.professorName.trim()) params.append('professorName', customFilters.professorName.trim());

      const query = params.toString();
      const data = await apiRequest(`/posts${query ? `?${query}` : ''}`);
      setPosts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((previous) => ({ ...previous, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadPosts();
  };

  const handleClearFilters = () => {
    const emptyFilters = { courseId: '', professorId: '', courseName: '', professorName: '' };
    setFilters(emptyFilters);
    loadPosts(emptyFilters);
  };

  const handleProfileSearch = (event) => {
    event.preventDefault();
    const value = searchRegistry.trim();
    if (!value) return;
    navigate(`/profile/${value}`);
    setSearchRegistry('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="home-page">
      <header className="topbar">
        <div>
          <h1>Sistema de Calificación de Cursos</h1>
          <p>Escuela de Ciencias y Sistemas</p>
        </div>

        <div className="topbar-actions">
          <form onSubmit={handleProfileSearch} style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              placeholder="Buscar por registro académico"
              value={searchRegistry}
              onChange={(e) => setSearchRegistry(e.target.value)}
              style={{ padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
            />
            <button type="submit" className="secondary-button">Buscar</button>
          </form>

          <button type="button" className="secondary-button" onClick={() => navigate('/profile')}>
            Mi Perfil
          </button>

          <button type="button" className="danger-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="home-container">
        <section className="actions-row">
          <div>
            <h2>Muro de Publicaciones</h2>
            <p>Consulta opiniones sobre cursos y catedráticos.</p>
          </div>

          <button type="button" className="primary-button" onClick={() => navigate('/posts/new')}>
            Nueva publicación
          </button>
        </section>

        <section className="filters-card">
          <h3>Filtros</h3>

          <form className="filters-grid" onSubmit={handleSearch}>
            <div className="form-group">
              <label htmlFor="courseId">Curso</label>
              <select id="courseId" name="courseId" value={filters.courseId} onChange={handleFilterChange}>
                <option value="">Todos los cursos</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code ? `${course.code} - ${course.name}` : course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="professorId">Catedrático</label>
              <select id="professorId" name="professorId" value={filters.professorId} onChange={handleFilterChange}>
                <option value="">Todos los catedráticos</option>
                {professors.map((professor) => (
                  <option key={professor.id} value={professor.id}>
                    {professor.fullName || professor.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="courseName">Nombre del curso</label>
              <input
                id="courseName"
                name="courseName"
                type="text"
                value={filters.courseName}
                onChange={handleFilterChange}
                placeholder="Ej. Bases de Datos"
              />
            </div>

            <div className="form-group">
              <label htmlFor="professorName">Nombre del catedrático</label>
              <input
                id="professorName"
                name="professorName"
                type="text"
                value={filters.professorName}
                onChange={handleFilterChange}
                placeholder="Ej. Méndez"
              />
            </div>

            <div className="filter-buttons">
              <button type="submit" className="primary-button">Buscar</button>
              <button type="button" className="secondary-button" onClick={handleClearFilters}>Limpiar</button>
            </div>
          </form>
        </section>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p>Cargando publicaciones...</p>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h3>No hay publicaciones</h3>
            <p>No se encontraron resultados con los filtros actuales.</p>
          </div>
        ) : (
          <section className="posts-list">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-header">
                  <div>
                    <strong>{post.author?.fullName || 'Usuario'}</strong>
                    <p className="post-date">{new Date(post.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="post-entity">
                  {post.entity?.type === 'course' && (
                    <span className="tag">Curso: {post.entity.name}</span>
                  )}
                  {post.entity?.type === 'professor' && (
                    <span className="tag">Catedrático: {post.entity.name}</span>
                  )}
                </div>

                <p className="post-content">{post.content}</p>

                <button
                  type="button"
                  className="link-button"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  Ver comentarios
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default Home;
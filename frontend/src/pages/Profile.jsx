import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../api/api';
import '../styles/home.css';
import '../styles/profile.css';

function Profile() {
  const { academicRegistry } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isOwn = !academicRegistry || academicRegistry === currentUser?.academicRegistry;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [approved, setApproved] = useState({ courses: [], totalCredits: 0 });

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', email: '' });
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  const [allCourses, setAllCourses] = useState([]);
  const [courseToAdd, setCourseToAdd] = useState('');
  const [courseError, setCourseError] = useState('');

  // Toda la lógica de carga vive DENTRO del efecto; la primera instrucción
  // ejecutable es un await, así que ningún setState corre de forma síncrona.
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const profileData = isOwn
          ? await apiRequest('/profiles/me')
          : await apiRequest(`/profiles/${academicRegistry}`);

        if (cancelled) return;
        setProfile(profileData);
        setEditForm({ fullName: profileData.fullName, email: profileData.email });

        const approvedData = isOwn
          ? await apiRequest('/profiles/me/approved-courses')
          : await apiRequest(`/profiles/${academicRegistry}/approved-courses`);

        if (cancelled) return;
        setApproved(approvedData);

        if (isOwn) {
          const coursesData = await apiRequest('/courses');
          if (!cancelled) setAllCourses(coursesData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [isOwn, academicRegistry]);

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setEditError('');
    setSaving(true);
    try {
      const result = await apiRequest('/profiles/me', {
        method: 'PUT',
        body: JSON.stringify(editForm),
      });
      setProfile(result.profile);
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...result.profile }));
      setEditing(false);
    } catch (error) {
      setEditError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCourse = async (event) => {
    event.preventDefault();
    setCourseError('');
    if (!courseToAdd) return;
    try {
      const result = await apiRequest('/profiles/me/approved-courses', {
        method: 'POST',
        body: JSON.stringify({ courseId: Number(courseToAdd) }),
      });
      setApproved(result);
      setCourseToAdd('');
    } catch (error) {
      setCourseError(error.message);
    }
  };

  const handleRemoveCourse = async (courseId) => {
    try {
      const result = await apiRequest(`/profiles/me/approved-courses/${courseId}`, {
        method: 'DELETE',
      });
      setApproved(result);
    } catch (error) {
      setCourseError(error.message);
    }
  };

  if (loading) return <div className="home-container"><p>Cargando perfil...</p></div>;
  if (error) return <div className="home-container"><div className="error-message">{error}</div></div>;
  if (!profile) return null;

  const approvedIds = new Set(approved.courses.map((c) => c.id));
  const availableCourses = allCourses.filter((c) => !approvedIds.has(c.id));

  return (
    <div className="home-page">
      <header className="topbar">
        <div>
          <h1>{profile.fullName}</h1>
          <p>Registro académico: {profile.academicRegistry}</p>
        </div>
        <div className="topbar-actions">
          <button type="button" className="secondary-button" onClick={() => navigate('/home')}>
            Volver al muro
          </button>
        </div>
      </header>

      <main className="home-container">
        {isOwn && !editing && (
          <section className="filters-card">
            <p><strong>Correo:</strong> {profile.email}</p>
            <button type="button" className="secondary-button" onClick={() => setEditing(true)}>
              Editar perfil
            </button>
          </section>
        )}

        {isOwn && editing && (
          <form onSubmit={handleSaveProfile} className="filters-card">
            {editError && <div className="error-message">{editError}</div>}

            <div className="form-group">
              <label htmlFor="fullName">Nombres y apellidos</label>
              <input
                id="fullName"
                value={editForm.fullName}
                onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <p className="post-date">El registro académico no se puede modificar.</p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button type="button" className="secondary-button" onClick={() => setEditing(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        <h3 className="comments-title">Cursos aprobados</h3>
        <p>Total de créditos acumulados: <strong>{approved.totalCredits || 0}</strong></p>

        {courseError && <div className="error-message">{courseError}</div>}

        {approved.courses.length === 0 ? (
          <div className="empty-state"><p>Sin cursos aprobados registrados.</p></div>
        ) : (
          <table className="approved-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Curso</th>
                <th>Créditos</th>
                {isOwn && <th></th>}
              </tr>
            </thead>
            <tbody>
              {approved.courses.map((c) => (
                <tr key={c.id}>
                  <td>{c.code}</td>
                  <td>{c.name}</td>
                  <td>{c.credits}</td>
                  {isOwn && (
                    <td>
                      <button type="button" className="link-button" onClick={() => handleRemoveCourse(c.id)}>
                        Quitar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isOwn && (
          <form onSubmit={handleAddCourse} className="filters-card" style={{ marginTop: 16 }}>
            <div className="form-group">
              <label htmlFor="courseToAdd">Agregar curso aprobado</label>
              <select id="courseToAdd" value={courseToAdd} onChange={(e) => setCourseToAdd(e.target.value)}>
                <option value="">Selecciona un curso del pensum...</option>
                {availableCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name} ({c.credits} créditos)
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="primary-button">Agregar</button>
          </form>
        )}
      </main>
    </div>
  );
}

export default Profile;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/api';
import '../styles/createPost.css';

function CreatePost() {
  const navigate = useNavigate();

  const [entityType, setEntityType] = useState('course');

  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);

  const [courseId, setCourseId] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [content, setContent] = useState('');

  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setLoadingCatalogs(true);

        const [coursesData, professorsData] =
          await Promise.all([
            apiRequest('/courses'),
            apiRequest('/professors'),
          ]);

        setCourses(coursesData);
        setProfessors(professorsData);
      } catch (error) {
        setError(
          `No se pudieron cargar los catálogos: ${error.message}`
        );
      } finally {
        setLoadingCatalogs(false);
      }
    };

    loadCatalogs();
  }, []);

  const handleEntityChange = (type) => {
    setEntityType(type);
    setError('');

    if (type === 'course') {
      setProfessorId('');
    } else {
      setCourseId('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!content.trim()) {
      setError('Debes escribir el contenido de la publicación.');
      return;
    }

    if (entityType === 'course' && !courseId) {
      setError('Debes seleccionar un curso.');
      return;
    }

    if (entityType === 'professor' && !professorId) {
      setError('Debes seleccionar un catedrático.');
      return;
    }

    const postData = {
      courseId:
        entityType === 'course'
          ? Number(courseId)
          : null,

      professorId:
        entityType === 'professor'
          ? Number(professorId)
          : null,

      content: content.trim(),
    };

    try {
      setSubmitting(true);

      await apiRequest('/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      setSuccess('Publicación creada correctamente.');

      setTimeout(() => {
        navigate('/home');
      }, 800);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCatalogs) {
    return (
      <div className="create-post-page">
        <p>Cargando cursos y catedráticos...</p>
      </div>
    );
  }

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        <div className="create-post-header">
          <div>
            <h1>Nueva Publicación</h1>
            <p>
              Comparte tu opinión sobre un curso o
              catedrático.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/home')}
          >
            Volver
          </button>
        </div>

        <div className="create-post-card">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                ¿Qué deseas evaluar?
              </label>

              <div className="entity-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="entityType"
                    value="course"
                    checked={entityType === 'course'}
                    onChange={() =>
                      handleEntityChange('course')
                    }
                  />

                  Curso
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="entityType"
                    value="professor"
                    checked={entityType === 'professor'}
                    onChange={() =>
                      handleEntityChange('professor')
                    }
                  />

                  Catedrático
                </label>
              </div>
            </div>

            {entityType === 'course' && (
              <div className="form-group">
                <label htmlFor="course">
                  Curso
                </label>

                <select
                  id="course"
                  value={courseId}
                  onChange={(event) =>
                    setCourseId(event.target.value)
                  }
                  required
                >
                  <option value="">
                    Selecciona un curso
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.code
                        ? `${course.code} - ${course.name}`
                        : course.name}
                    </option>
                  ))}
                </select>

                {courses.length === 0 && (
                  <p className="catalog-warning">
                    Actualmente no hay cursos cargados
                    en el sistema.
                  </p>
                )}
              </div>
            )}

            {entityType === 'professor' && (
              <div className="form-group">
                <label htmlFor="professor">
                  Catedrático
                </label>

                <select
                  id="professor"
                  value={professorId}
                  onChange={(event) =>
                    setProfessorId(event.target.value)
                  }
                  required
                >
                  <option value="">
                    Selecciona un catedrático
                  </option>

                  {professors.map((professor) => (
                    <option
                      key={professor.id}
                      value={professor.id}
                    >
                      {professor.fullName ||
                        professor.full_name ||
                        professor.name}
                    </option>
                  ))}
                </select>

                {professors.length === 0 && (
                  <p className="catalog-warning">
                    Actualmente no hay catedráticos
                    cargados en el sistema.
                  </p>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="content">
                Opinión
              </label>

              <textarea
                id="content"
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Escribe tu opinión..."
                rows="7"
                maxLength="2000"
                required
              />

              <div className="character-counter">
                {content.length} / 2000
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate('/home')}
                disabled={submitting}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting
                  ? 'Publicando...'
                  : 'Publicar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../api/api';
import '../styles/home.css';
import '../styles/postDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Carga inicial: todo el estado se actualiza DESPUÉS del await,
  // nunca de forma síncrona dentro del efecto.
  useEffect(() => {
    let cancelled = false;

    apiRequest(`/posts/${id}`)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Recarga manual (después de comentar). No se llama desde ningún efecto,
  // así que puede actualizar estado libremente.
  const reload = async () => {
    try {
      const data = await apiRequest(`/posts/${id}`);
      setPost(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await apiRequest(`/posts/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: content.trim() }),
      });
      setContent('');
      await reload();
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="home-container"><p>Cargando publicación...</p></div>;
  if (error) return <div className="home-container"><div className="error-message">{error}</div></div>;
  if (!post) return null;

  return (
    <div className="home-page">
      <header className="topbar">
        <div>
          <h1>Detalle de publicación</h1>
        </div>
        <div className="topbar-actions">
          <button type="button" className="secondary-button" onClick={() => navigate('/home')}>
            Volver al muro
          </button>
        </div>
      </header>

      <main className="home-container">
        <article className="post-card">
          <div className="post-entity">
            {post.entity?.type === 'course' && <span className="tag">Curso: {post.entity.name}</span>}
            {post.entity?.type === 'professor' && <span className="tag">Catedrático: {post.entity.name}</span>}
          </div>
          <p className="post-content">{post.content}</p>
          <p className="post-date">
            por {post.author?.fullName} · {new Date(post.createdAt).toLocaleString()}
          </p>
        </article>

        <h3 className="comments-title">Comentarios ({post.comments?.length || 0})</h3>

        <form onSubmit={handleSubmit} className="filters-card">
          {formError && <div className="error-message">{formError}</div>}
          <div className="form-group">
            <textarea
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Agrega información que complemente esta publicación..."
              required
            />
          </div>
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Comentar'}
          </button>
        </form>

        {(!post.comments || post.comments.length === 0) ? (
          <div className="empty-state"><p>Todavía no hay comentarios.</p></div>
        ) : (
          <section className="posts-list">
            {post.comments.map((comment) => (
              <div key={comment.id} className="post-card">
                <p className="post-content">{comment.content}</p>
                <p className="post-date">
                  {comment.author?.fullName} · {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default PostDetail;
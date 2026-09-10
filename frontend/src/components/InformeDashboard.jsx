import { useState, useEffect } from 'react';
import { getInformes, createInforme } from '../services/informeService';
import styles from './InformeDashboard.module.css';

export const InformeDashboard = () => {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({ titulo: '', estudiante: '', estatus: 'Pendiente' });

  // Función explícita para cargar/sincronizar datos
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInformes();
      setInformes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial: la función se declara internamente para cumplir con las reglas del linter
  useEffect(() => {
    const inicializar = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getInformes();
        setInformes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    inicializar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titulo || !formData.estudiante) return;

    try {
      const nuevo = await createInforme(formData);
      setInformes((prev) => [...prev, nuevo]);
      setFormData({ titulo: '', estudiante: '', estatus: 'Pendiente' });
    } catch (err) {
      alert(err.message);
    }
  };

  const renderBadge = (estatus) => {
  let styleClass = styles.badge;
  if (estatus === 'Aprobado' || estatus === 'Completado') {
    styleClass += ` ${styles.badgeAprobado}`;
  } else if (estatus === 'Pendiente') {
    styleClass += ` ${styles.badgePendiente}`;
  } else if (estatus === 'Revisión' || estatus === 'En Desarrollo') {
    styleClass += ` ${styles.badgeRevision}`;
  }

  return <span className={styleClass}>{estatus}</span>;
};

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        {/* Encabezado */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Gestión de Informes</h1>
            <p className={styles.subtitle}>Plataforma de seguimiento de calificaciones e entregas.</p>
          </div>
          <button onClick={cargarDatos} className={styles.btnSecondary}>
            Sincronizar
          </button>
        </header>

        {/* Panel Principal */}
        <div className={styles.grid}>
          
          {/* Formulario */}
          <aside className={styles.card}>
            <h2 className={styles.cardTitle}>Nuevo Informe</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Título</label>
                <input 
                  type="text" 
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  placeholder="Ej: Reporte de Laboratorio"
                  className={styles.input}
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Estudiante</label>
                <input 
                  type="text" 
                  value={formData.estudiante}
                  onChange={(e) => setFormData({...formData, estudiante: e.target.value})}
                  placeholder="Ej: Ana Martínez"
                  className={styles.input}
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Estado</label>
                <select 
                  value={formData.estatus}
                  onChange={(e) => setFormData({...formData, estatus: e.target.value})}
                  className={styles.select}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Revisión">En Revisión</option>
                  <option value="Aprobado">Aprobado</option>
                </select>
              </div>

              <button type="submit" className={styles.btnPrimary}>
                Guardar Informe
              </button>
            </form>
          </aside>

          {/* Tabla de Datos */}
          <main className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h2 className={styles.cardTitle} style={{ margin: 0 }}>Listado General</h2>
              <span className={styles.badgeTotal}>Total: {informes.length}</span>
            </div>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Cargando datos...</div>
            ) : error ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>{error}</div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Estudiante</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {informes.map((item) => (
                      <tr key={item.id}>
                        <td className={styles.idCell}>#{item.id}</td>
                        <td className={styles.titleCell}>{item.titulo}</td>
                        <td>{item.estudiante}</td>
                        <td>{renderBadge(item.estatus)}</td>
                        <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{item.fecha || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};
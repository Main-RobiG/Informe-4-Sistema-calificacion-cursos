import { useState, useEffect } from 'react';
import { getInformes, addComentario } from '../services/api';

export const TablaInformes = () => {
  const [informes, setInformes] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState({});
  const [cargando, setCargando] = useState(true);

  // Cargar informes al montar el componente
  useEffect(() => {
    const cargarInformes = async () => {
      try {
        const data = await getInformes();
        setInformes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener informes:', error);
      }
    };

    cargarInformes();
  }, []);

  if (cargando) return <p>Cargando informes...</p>;

  // Función para recargar datos manualmente tras enviar un comentario
  const recargarInformes = async () => {
    try {
      const data = await getInformes();
      setInformes(data);
    } catch (error) {
      console.error('Error al recargar informes:', error);
    }
  };

  const handleComentarioSubmit = async (id) => {
    if (!nuevoComentario[id]) return;
    await addComentario(id, nuevoComentario[id]);
    setNuevoComentario({ ...nuevoComentario, [id]: '' });
    await recargarInformes();
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Estudiante</th>
          <th>Estatus</th>
          <th>Fecha</th>
          <th>Comentarios / Dictamen</th>
        </tr>
      </thead>
      <tbody>
        {informes.map((inf) => (
          <tr key={inf.id}>
            <td>{inf.id}</td>
            <td>{inf.titulo}</td>
            <td>{inf.estudiante}</td>
            <td>{inf.estatus}</td>
            <td>{inf.fecha}</td>
            <td>
              <ul>
                {inf.comentarios?.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
              <input
                type="text"
                value={nuevoComentario[inf.id] || ''}
                onChange={(e) =>
                  setNuevoComentario({ ...nuevoComentario, [inf.id]: e.target.value })
                }
                placeholder="Agregar dictamen..."
              />
              <button onClick={() => handleComentarioSubmit(inf.id)}>Enviar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
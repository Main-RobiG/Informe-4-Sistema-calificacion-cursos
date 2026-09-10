// src/components/TablaInformes.jsx

export const TablaInformes = ({ informes, cargando }) => {
  if (cargando) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>⏳ Cargando datos del sistema...</p>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Título</th>
            <th>Estudiante / Responsable</th>
            <th>Estatus</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {informes.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.titulo}</td>
              <td>{item.estudiante}</td>
              <td>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: item.estatus === 'Completado' ? '#d4edda' : '#fff3cd',
                  color: item.estatus === 'Completado' ? '#155724' : '#856404'
                }}>
                  {item.estatus}
                </span>
              </td>
              <td>{item.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
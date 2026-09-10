// src/App.jsx
import { useState, useEffect } from 'react';
import { getInformes, createInforme } from './services/informeService';
import { TablaInformes } from './components/TablaInformes';

export function App() {
  const [informes, setInformes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [estudiante, setEstudiante] = useState('');

  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchDatos = async () => {
      setCargando(true);
      try {
        const data = await getInformes();
        setInformes(data);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchDatos();
  }, []);

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !estudiante.trim()) return;

    const nuevoItem = {
      titulo: nuevoTitulo,
      estudiante: estudiante,
      estatus: "En Desarrollo"
    };

    const informeCreado = await createInforme(nuevoItem);
    setInformes((prevInformes) => [...prevInformes, informeCreado]);
    setNuevoTitulo('');
    setEstudiante('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1>Gestión de Informes y Sistema de Calificación</h1>
      <p><em>Modo Frontend Desacoplado (Mock Activo)</em></p>

      {/* Formulario para agregar nuevos registros */}
      <form onSubmit={handleGuardar} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Título del informe/curso..."
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          style={{ flex: 2, padding: '8px' }}
          required
        />
        <input
          type="text"
          placeholder="Nombre del estudiante..."
          value={estudiante}
          onChange={(e) => setEstudiante(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
          required
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          + Agregar
        </button>
      </form>

      {/* Tabla de Resultados */}
      <TablaInformes informes={informes} cargando={cargando} />
    </div>
  );
}

export default App;
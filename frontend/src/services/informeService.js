// src/services/informeService.js
import { API_BASE_URL, USE_MOCK_DATA } from './api';
import { mockInformes } from '../mocks/informesMock';

// Función para obtener todos los informes
export const getInformes = async () => {
  if (USE_MOCK_DATA) {
    // Simula una pequeña demora de red (300ms)
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockInformes]), 300);
    });
  }

  // Petición real al backend cuando esté listo
  const response = await fetch(`${API_BASE_URL}/informes`);
  if (!response.ok) {
    throw new Error('Error al conectar con la API real');
  }
  return await response.json();
};

// Función para crear un nuevo informe
export const createInforme = async (nuevoInforme) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      const informeCreado = {
        id: Date.now(),
        ...nuevoInforme,
        fecha: new Date().toISOString().split('T')[0]
      };
      mockInformes.push(informeCreado);
      setTimeout(() => resolve(informeCreado), 300);
    });
  }

  // Petición POST real al backend
  const response = await fetch(`${API_BASE_URL}/informes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoInforme)
  });
  return await response.json();
};
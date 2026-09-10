import { API_BASE_URL, USE_MOCK_DATA } from './api';
import { mockInformes } from '../mocks/informesMock';

export const getInformes = async () => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => setTimeout(() => resolve([...mockInformes]), 300));
  }

  const response = await fetch(`${API_BASE_URL}/informes`);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudieron obtener los informes`);
  }
  return await response.json();
};

export const createInforme = async (nuevoInforme) => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      const informeCreado = {
        id: Date.now(),
        ...nuevoInforme,
        fecha: new Date().toISOString().split('T')[0] // Corregido el índice del split
      };
      mockInformes.push(informeCreado);
      setTimeout(() => resolve(informeCreado), 300);
    });
  }

  const response = await fetch(`${API_BASE_URL}/informes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoInforme)
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: No se pudo guardar el informe`);
  }

  return await response.json();
};
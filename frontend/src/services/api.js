// Variable que solicita informeService.js
export const USE_MOCK_DATA = false; // Cambia a true si prefieres probar sin backend

// URL base del backend en Node.js
export const API_BASE_URL = 'http://localhost:3000/api'; 

export const getInformes = async () => {
  const res = await fetch(`${API_BASE_URL}/informes`);
  return res.json();
};

export const createInforme = async (data) => {
  const res = await fetch(`${API_BASE_URL}/informes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const addComentario = async (informeId, comentario) => {
  const res = await fetch(`${API_BASE_URL}/informes/${informeId}/comentarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comentario }),
  });
  return res.json();
};
import { Router } from 'express';

const router = Router();

// GET /api/publicaciones  -> muro de publicaciones (con filtros por query params)
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Pendiente: listar publicaciones con filtros' });
});

// POST /api/publicaciones -> crear publicacion
router.post('/', (req, res) => {
  res.status(501).json({ message: 'Pendiente: crear publicacion' });
});

// POST /api/publicaciones/:id/comentarios -> agregar comentario
router.post('/:id/comentarios', (req, res) => {
  res.status(501).json({ message: 'Pendiente: agregar comentario' });
});

export default router;

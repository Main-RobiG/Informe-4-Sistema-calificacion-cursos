import { Router } from 'express';

const router = Router();

// GET /api/perfiles/:carne -> buscar/ver perfil
router.get('/:carne', (req, res) => {
  res.status(501).json({ message: 'Pendiente: ver perfil por carne' });
});

// PUT /api/perfiles/:carne -> editar perfil (solo si es el propio)
router.put('/:carne', (req, res) => {
  res.status(501).json({ message: 'Pendiente: editar perfil propio' });
});

// GET /api/perfiles/:carne/cursos-aprobados
router.get('/:carne/cursos-aprobados', (req, res) => {
  res.status(501).json({ message: 'Pendiente: listar cursos aprobados' });
});

// POST /api/perfiles/:carne/cursos-aprobados
router.post('/:carne/cursos-aprobados', (req, res) => {
  res.status(501).json({ message: 'Pendiente: agregar curso aprobado' });
});

export default router;

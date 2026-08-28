import { Router } from 'express';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  res.status(501).json({ message: 'Pendiente: implementar login' });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Pendiente: implementar registro' });
});

// POST /api/auth/recuperar-password
router.post('/recuperar-password', (req, res) => {
  res.status(501).json({ message: 'Pendiente: implementar recuperacion de password' });
});

export default router;

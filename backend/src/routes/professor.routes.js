const express = require('express');

const ProfessorController =
  require('../controllers/professor.controller');

const authMiddleware =
  require('../middleware/auth.middleware');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  ProfessorController.getAll
);

router.get(
  '/:id',
  authMiddleware,
  ProfessorController.getById
);

module.exports = router;
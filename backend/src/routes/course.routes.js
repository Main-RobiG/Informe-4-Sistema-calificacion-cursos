const express = require('express');

const CourseController =
  require('../controllers/course.controller');

const authMiddleware =
  require('../middleware/auth.middleware');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  CourseController.getAll
);

router.get(
  '/:id',
  authMiddleware,
  CourseController.getById
);

module.exports = router;
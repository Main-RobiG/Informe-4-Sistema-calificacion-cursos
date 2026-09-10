const express = require('express');

const PostController =
  require('../controllers/post.controller');

const authMiddleware =
  require('../middleware/auth.middleware');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  PostController.getAll
);

router.get(
  '/:id',
  authMiddleware,
  PostController.getById
);

router.post(
  '/',
  authMiddleware,
  PostController.create
);

module.exports = router;
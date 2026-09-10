const express = require('express');

const CommentController =
  require('../controllers/comment.controller');

const authMiddleware =
  require('../middleware/auth.middleware');

const router = express.Router();

router.get(
  '/posts/:postId/comments',
  authMiddleware,
  CommentController.getByPostId
);

router.post(
  '/posts/:postId/comments',
  authMiddleware,
  CommentController.create
);

module.exports = router;
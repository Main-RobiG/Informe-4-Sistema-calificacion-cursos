const CommentService =
  require('../services/comment.service');

class CommentController {
  static async getByPostId(req, res) {
    try {
      const comments =
        await CommentService.getByPostId(
          req.params.postId
        );

      return res
        .status(200)
        .json(comments);
    } catch (error) {
      return res
        .status(
          error.statusCode || 500
        )
        .json({
          message:
            error.message ||
            'Error interno del servidor'
        });
    }
  }

  static async create(req, res) {
    try {
      const comment =
        await CommentService.create({
          postId:
            req.params.postId,

          userId:
            req.user.id,

          content:
            req.body.content
        });

      return res
        .status(201)
        .json({
          message:
            'Comentario agregado correctamente',
          comment
        });
    } catch (error) {
      return res
        .status(
          error.statusCode || 500
        )
        .json({
          message:
            error.message ||
            'Error interno del servidor'
        });
    }
  }
}

module.exports = CommentController;
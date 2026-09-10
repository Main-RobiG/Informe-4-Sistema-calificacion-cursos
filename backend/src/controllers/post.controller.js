const PostService =
  require('../services/post.service');

class PostController {
  static async getAll(req, res) {
    try {
      const filters = {
        courseId:
          req.query.courseId || null,

        professorId:
          req.query.professorId || null,

        courseName:
          req.query.courseName || '',

        professorName:
          req.query.professorName || ''
      };

      const posts =
        await PostService.getAll(filters);

      return res
        .status(200)
        .json(posts);
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

  static async getById(req, res) {
    try {
      const post =
        await PostService.getById(
          req.params.id
        );

      return res
        .status(200)
        .json(post);
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
      const post =
        await PostService.create({
          userId: req.user.id,

          courseId:
            req.body.courseId,

          professorId:
            req.body.professorId,

          content:
            req.body.content
        });

      return res
        .status(201)
        .json({
          message:
            'Publicación creada correctamente',
          post
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

module.exports = PostController;
const CommentModel =
  require('../models/comment.model');

const PostModel =
  require('../models/post.model');

class CommentService {
  static formatComment(comment) {
    return {
      id: comment.id,
      postId: comment.post_id,
      content: comment.content,
      createdAt: comment.created_at,

      author: {
        id: comment.user_id,
        academicRegistry:
          comment.academic_registry,
        fullName:
          comment.user_name
      }
    };
  }

  static async getByPostId(postId) {
    const post =
      await PostModel.findById(postId);

    if (!post) {
      const error =
        new Error('Publicación no encontrada');

      error.statusCode = 404;

      throw error;
    }

    const comments =
      await CommentModel.findByPostId(postId);

    return comments.map(
      CommentService.formatComment
    );
  }

  static async create({
    postId,
    userId,
    content
  }) {
    if (
      !content ||
      content.trim() === ''
    ) {
      const error =
        new Error(
          'El contenido del comentario es obligatorio'
        );

      error.statusCode = 400;

      throw error;
    }

    const post =
      await PostModel.findById(postId);

    if (!post) {
      const error =
        new Error('Publicación no encontrada');

      error.statusCode = 404;

      throw error;
    }

    const comment =
      await CommentModel.create({
        postId,
        userId,
        content: content.trim()
      });

    return CommentService.formatComment(
      comment
    );
  }
}

module.exports = CommentService;
const PostModel =
  require('../models/post.model');

const CourseModel =
  require('../models/course.model');

const ProfessorModel =
  require('../models/professor.model');

class PostService {
  static formatPost(post) {
    if (!post) {
      return null;
    }

    let entity = null;

    if (post.course_id) {
      entity = {
        type: 'course',
        id: post.course_id,
        code: post.course_code,
        name: post.course_name
      };
    }

    if (post.professor_id) {
      entity = {
        type: 'professor',
        id: post.professor_id,
        name: post.professor_name
      };
    }

    return {
      id: post.id,
      content: post.content,
      createdAt: post.created_at,

      author: {
        id: post.user_id,
        academicRegistry:
          post.academic_registry,
        fullName: post.user_name
      },

      entity
    };
  }

  static async getAll(filters) {
    const posts =
      await PostModel.findAll(filters);

    return posts.map(
      PostService.formatPost
    );
  }

  static async getById(id) {
    const post =
      await PostModel.findById(id);

    if (!post) {
      const error =
        new Error('Publicación no encontrada');

      error.statusCode = 404;

      throw error;
    }

    return PostService.formatPost(post);
  }

  static async create({
    userId,
    courseId,
    professorId,
    content
  }) {
    if (!content || content.trim() === '') {
      const error =
        new Error(
          'El contenido de la publicación es obligatorio'
        );

      error.statusCode = 400;

      throw error;
    }

    const hasCourse =
      courseId !== undefined &&
      courseId !== null &&
      courseId !== '';

    const hasProfessor =
      professorId !== undefined &&
      professorId !== null &&
      professorId !== '';

    if (
      (hasCourse && hasProfessor) ||
      (!hasCourse && !hasProfessor)
    ) {
      const error =
        new Error(
          'Debe seleccionar un curso o un catedrático, pero no ambos'
        );

      error.statusCode = 400;

      throw error;
    }

    if (hasCourse) {
      const course =
        await CourseModel.findById(courseId);

      if (!course) {
        const error =
          new Error('Curso no encontrado');

        error.statusCode = 404;

        throw error;
      }
    }

    if (hasProfessor) {
      const professor =
        await ProfessorModel.findById(
          professorId
        );

      if (!professor) {
        const error =
          new Error(
            'Catedrático no encontrado'
          );

        error.statusCode = 404;

        throw error;
      }
    }

    const post =
      await PostModel.create({
        userId,
        courseId: hasCourse
          ? courseId
          : null,
        professorId: hasProfessor
          ? professorId
          : null,
        content: content.trim()
      });

    return PostService.formatPost(post);
  }
}

module.exports = PostService;
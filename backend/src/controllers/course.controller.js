const CourseService = require('../services/course.service');

class CourseController {
  static async getAll(req, res) {
    try {
      const search = req.query.search || '';

      const courses = await CourseService.getAll(search);

      return res.status(200).json(courses);
    } catch (error) {
      return res.status(
        error.statusCode || 500
      ).json({
        message:
          error.message ||
          'Error interno del servidor'
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const course = await CourseService.getById(id);

      return res.status(200).json(course);
    } catch (error) {
      return res.status(
        error.statusCode || 500
      ).json({
        message:
          error.message ||
          'Error interno del servidor'
      });
    }
  }
}

module.exports = CourseController;
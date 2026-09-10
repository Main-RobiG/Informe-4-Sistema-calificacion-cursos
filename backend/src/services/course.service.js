const CourseModel = require('../models/course.model');

class CourseService {
  static async getAll(search = '') {
    if (search && search.trim() !== '') {
      return CourseModel.searchByName(search.trim());
    }

    return CourseModel.findAll();
  }

  static async getById(id) {
    const course = await CourseModel.findById(id);

    if (!course) {
      const error = new Error('Curso no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return course;
  }
}

module.exports = CourseService;
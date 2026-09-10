const ProfessorModel =
  require('../models/professor.model');

class ProfessorService {
  static async getAll(search = '') {
    if (search && search.trim() !== '') {
      return ProfessorModel.searchByName(
        search.trim()
      );
    }

    return ProfessorModel.findAll();
  }

  static async getById(id) {
    const professor =
      await ProfessorModel.findById(id);

    if (!professor) {
      const error =
        new Error('Catedrático no encontrado');

      error.statusCode = 404;

      throw error;
    }

    return professor;
  }
}

module.exports = ProfessorService;
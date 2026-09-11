const ProfessorService =
  require('../services/professor.service');

class ProfessorController {
  static async getAll(req, res) {
    try {
      const search =
        req.query.search || '';

      const professors =
        await ProfessorService.getAll(search);

      return res.status(200).json(professors);
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

      const professor =
        await ProfessorService.getById(id);

      return res.status(200).json(professor);
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

module.exports = ProfessorController;
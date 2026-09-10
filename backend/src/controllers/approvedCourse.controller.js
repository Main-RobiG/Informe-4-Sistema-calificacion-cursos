const ApprovedCourseService =
  require('../services/approvedCourse.service');

class ApprovedCourseController {
  static async getMine(req, res) {
    try {
      const result =
        await ApprovedCourseService.getByUserId(
          req.user.id
        );

      return res
        .status(200)
        .json(result);
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

  static async getByAcademicRegistry(
    req,
    res
  ) {
    try {
      const result =
        await ApprovedCourseService
          .getByAcademicRegistry(
            req.params.academicRegistry
          );

      return res
        .status(200)
        .json(result);
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

  static async add(req, res) {
    try {
      const result =
        await ApprovedCourseService.addCourse(
          req.user.id,
          req.body.courseId
        );

      return res
        .status(201)
        .json({
          message:
            'Curso aprobado agregado correctamente',
          ...result
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

  static async remove(req, res) {
    try {
      const result =
        await ApprovedCourseService.removeCourse(
          req.user.id,
          req.params.courseId
        );

      return res
        .status(200)
        .json({
          message:
            'Curso aprobado eliminado correctamente',
          ...result
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

module.exports =
  ApprovedCourseController;
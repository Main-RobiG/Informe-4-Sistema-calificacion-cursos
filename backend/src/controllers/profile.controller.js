const ProfileService =
  require('../services/profile.service');

class ProfileController {
  static async getMe(req, res) {
    try {
      const profile =
        await ProfileService.getMyProfile(
          req.user.id
        );

      return res
        .status(200)
        .json(profile);
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

  static async updateMe(req, res) {
    try {
      const profile =
        await ProfileService.updateMyProfile(
          req.user.id,
          {
            fullName:
              req.body.fullName,

            email:
              req.body.email
          }
        );

      return res
        .status(200)
        .json({
          message:
            'Perfil actualizado correctamente',
          profile
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

  static async search(req, res) {
    try {
      const academicRegistry =
        req.query.academicRegistry || '';

      const profiles =
        await ProfileService.search(
          academicRegistry
        );

      return res
        .status(200)
        .json(profiles);
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
      const profile =
        await ProfileService
          .getByAcademicRegistry(
            req.params.academicRegistry
          );

      return res
        .status(200)
        .json(profile);
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

module.exports = ProfileController;
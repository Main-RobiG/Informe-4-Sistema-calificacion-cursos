const UserModel =
  require('../models/user.model');

class ProfileService {
  static formatProfile(user) {
    if (!user) {
      return null;
    }

    return {
      id: user.id,

      academicRegistry:
        user.academic_registry,

      fullName:
        user.full_name,

      email:
        user.email,

      createdAt:
        user.created_at,

      updatedAt:
        user.updated_at || null
    };
  }

  static async getMyProfile(userId) {
    const user =
      await UserModel.findById(userId);

    if (!user) {
      const error =
        new Error('Usuario no encontrado');

      error.statusCode = 404;

      throw error;
    }

    return ProfileService.formatProfile(
      user
    );
  }

  static async getByAcademicRegistry(
    academicRegistry
  ) {
    if (
      !academicRegistry ||
      academicRegistry.trim() === ''
    ) {
      const error =
        new Error(
          'El Registro Académico es obligatorio'
        );

      error.statusCode = 400;

      throw error;
    }

    const user =
      await UserModel.findByAcademicRegistry(
        academicRegistry.trim()
      );

    if (!user) {
      const error =
        new Error('Usuario no encontrado');

      error.statusCode = 404;

      throw error;
    }

    return ProfileService.formatProfile(
      user
    );
  }

  static async search(academicRegistry) {
    if (
      !academicRegistry ||
      academicRegistry.trim() === ''
    ) {
      return [];
    }

    const users =
      await UserModel.searchByAcademicRegistry(
        academicRegistry.trim()
      );

    return users.map(
      ProfileService.formatProfile
    );
  }

  static async updateMyProfile(
    userId,
    {
      fullName,
      email
    }
  ) {
    if (
      !fullName ||
      fullName.trim() === ''
    ) {
      const error =
        new Error(
          'El nombre es obligatorio'
        );

      error.statusCode = 400;

      throw error;
    }

    if (
      !email ||
      email.trim() === ''
    ) {
      const error =
        new Error(
          'El correo electrónico es obligatorio'
        );

      error.statusCode = 400;

      throw error;
    }

    const currentUser =
      await UserModel.findById(userId);

    if (!currentUser) {
      const error =
        new Error('Usuario no encontrado');

      error.statusCode = 404;

      throw error;
    }

    const existingEmail =
      await UserModel.findByEmail(
        email.trim()
      );

    if (
      existingEmail &&
      existingEmail.id !== userId
    ) {
      const error =
        new Error(
          'El correo electrónico ya se encuentra registrado'
        );

      error.statusCode = 409;

      throw error;
    }

    const updatedUser =
      await UserModel.updateProfile(
        userId,
        {
          fullName:
            fullName.trim(),

          email:
            email.trim()
        }
      );

    return ProfileService.formatProfile(
      updatedUser
    );
  }
}

module.exports = ProfileService;
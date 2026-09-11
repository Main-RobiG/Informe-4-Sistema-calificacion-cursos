const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model');

class AuthService {
  static async register({
    academicRegistry,
    fullName,
    email,
    password
  }) {
    if (!academicRegistry || !fullName || !email || !password) {
      const error = new Error('Todos los campos son obligatorios');
      error.statusCode = 400;
      throw error;
    }

    const existingRegistry =
      await UserModel.findByAcademicRegistry(academicRegistry);

    if (existingRegistry) {
      const error = new Error(
        'El Registro Académico ya se encuentra registrado'
      );
      error.statusCode = 409;
      throw error;
    }

    const existingEmail =
      await UserModel.findByEmail(email);

    if (existingEmail) {
      const error = new Error(
        'El correo electrónico ya se encuentra registrado'
      );
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return UserModel.create({
      academicRegistry,
      fullName,
      email,
      passwordHash
    });
  }

  static async login({
    academicRegistry,
    password
  }) {
    if (!academicRegistry || !password) {
      const error = new Error(
        'Registro Académico y contraseña son obligatorios'
      );
      error.statusCode = 400;
      throw error;
    }

    const user =
      await UserModel.findByAcademicRegistry(academicRegistry);

    if (!user) {
      const error = new Error(
        'Credenciales incorrectas'
      );
      error.statusCode = 401;
      throw error;
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!validPassword) {
      const error = new Error(
        'Credenciales incorrectas'
      );
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        id: user.id,
        academicRegistry: user.academic_registry
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h'
      }
    );

    return {
      token,
      user: {
        id: user.id,
        academicRegistry: user.academic_registry,
        fullName: user.full_name,
        email: user.email
      }
    };
  }

  static async recoverPassword({
    academicRegistry,
    email,
    newPassword
  }) {
    if (!academicRegistry || !email || !newPassword) {
      const error = new Error(
        'Registro Académico, correo y nueva contraseña son obligatorios'
      );
      error.statusCode = 400;
      throw error;
    }

    const user =
      await UserModel.findByAcademicRegistry(academicRegistry);

    if (!user || user.email !== email) {
      const error = new Error(
        'El Registro Académico y el correo no coinciden'
      );
      error.statusCode = 400;
      throw error;
    }

    const passwordHash =
      await bcrypt.hash(newPassword, 10);

    await UserModel.updatePassword(
      user.id,
      passwordHash
    );

    return {
      message: 'Contraseña actualizada correctamente'
    };
  }
}

module.exports = AuthService;
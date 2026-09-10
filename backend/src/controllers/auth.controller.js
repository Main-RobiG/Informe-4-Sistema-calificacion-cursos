const AuthService = require('../services/auth.service');
const UserModel = require('../models/user.model');

class AuthController {
  static async register(req, res) {
    try {
      const user = await AuthService.register(
        req.body
      );

      return res.status(201).json({
        message: 'Usuario registrado correctamente',
        user
      });
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

  static async login(req, res) {
    try {
      const result =
        await AuthService.login(req.body);

      return res.status(200).json(result);
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

  static async recoverPassword(req, res) {
    try {
      const result =
        await AuthService.recoverPassword(
          req.body
        );

      return res.status(200).json(result);
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

  static async me(req, res) {
    try {
      const user =
        await UserModel.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: 'Usuario no encontrado'
        });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = AuthController;
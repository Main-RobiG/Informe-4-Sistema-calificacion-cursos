const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authorization =
    req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: 'Token de autenticación requerido'
    });
  }

  const parts = authorization.split(' ');

  if (
    parts.length !== 2 ||
    parts[0] !== 'Bearer'
  ) {
    return res.status(401).json({
      message: 'Formato de token inválido'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido o expirado'
    });
  }
}

module.exports = authMiddleware;
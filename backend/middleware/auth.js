const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pmv-secret-key';

/**
 * Middleware para verificar JWT token
 */
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

/**
 * Middleware para verificar rol específico
 */
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para acceder a este recurso',
        rol_actual: req.usuario.rol,
        roles_permitidos: rolesPermitidos
      });
    }

    next();
  };
};

/**
 * Middleware para verificar que el cliente accede solo sus propias solicitudes
 */
const verificarAccesoCliente = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  const { id_cliente } = req.params;
  
  // Si es cliente, solo puede acceder a sus propias solicitudes
  if (req.usuario.rol === 'cliente' && parseInt(id_cliente) !== req.usuario.id_cliente) {
    return res.status(403).json({ error: 'No tienes permisos para acceder a estos datos' });
  }

  next();
};

module.exports = {
  verificarToken,
  verificarRol,
  verificarAccesoCliente,
  JWT_SECRET
};

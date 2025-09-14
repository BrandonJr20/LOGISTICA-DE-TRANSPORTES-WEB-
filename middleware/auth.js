const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      mensaje: 'Acceso denegado. Token requerido.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.usuario = decoded; // Esto es lo que usa cerrarSesion
    next();
  } catch (error) {
    console.error('Token inválido:', error);
    res.status(400).json({
      success: false,
      mensaje: 'Token inválido'
    });
  }
};

module.exports = { verificarToken };
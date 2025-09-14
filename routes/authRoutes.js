const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const { loginUsuario, cerrarSesion } = require('../controllers/authController');

// Ruta para login
router.post('/', loginUsuario);

// Ruta para cerrar sesión (requiere autenticación)
router.post('/logout', verificarToken, cerrarSesion);

// Ruta protegida de ejemplo
router.get('/protected', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Ruta protegida accedida correctamente',
    usuario: req.usuario
  });
});

module.exports = router
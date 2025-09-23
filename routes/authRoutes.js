const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const { loginUsuario, cerrarSesion } = require('../controllers/authController');

router.post('/', loginUsuario);
router.post('/logout', verificarToken, cerrarSesion);
router.get('/protected', verificarToken, (req, res) => {
  res.json({
    success: true,
    mensaje: 'Ruta protegida funciona',
    usuario: req.usuario
  });
});

module.exports = router;
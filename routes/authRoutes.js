const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/auth');
const { loginUsuario } = require('../controllers/authController');

router.post('/', loginUsuario);

// Ruta protegida
router.get('/', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Ruta protegida accedida correctamente',
    usuario: req.usuario
  });
});

module.exports = router;
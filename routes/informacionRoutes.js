const express = require('express');
const router = express.Router();
const informacionController = require('../controllers/informacionController');

router.get('/:id_usuario', informacionController.obtenerInformacionConductor);
router.put('/:id_usuario', informacionController.actualizarInformacionConductor)

module.exports = router;
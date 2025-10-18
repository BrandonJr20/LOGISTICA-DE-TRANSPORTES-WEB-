const express = require('express');
const router = express.Router();
const consumosController = require('../controllers/consumosController');

router.get('/', consumosController.obtenerConsumos);
router.get('/usuario/:id_usuario', consumosController.obtenerConsumosPorUsuario);
router.get('/tipos-combustible', consumosController.obtenerTiposCombustible);
router.get('/ultimo-kilometraje/:id_unidad', consumosController.obtenerUltimoKilometraje);
router.get('/asignacion/:id_usuario', consumosController.obtenerAsignacionUsuario);
router.post('/registrar', consumosController.registrarConsumo);

module.exports = router;

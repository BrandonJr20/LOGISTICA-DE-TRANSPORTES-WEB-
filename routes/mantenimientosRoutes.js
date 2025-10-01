const express = require('express');
const router = express.Router();
const mantenimientoController = require('../controllers/mantenimientosController');

router.post('/asignar', mantenimientoController.asignarMantenimiento);
router.post('/finalizar', mantenimientoController.finalizarMantenimiento);
router.get('/historial', mantenimientoController.getHistorial);
router.get('/activos', mantenimientoController.getMantenimientosActivos);
router.get('/tipos', mantenimientoController.getTiposMantenimiento);


module.exports = router;

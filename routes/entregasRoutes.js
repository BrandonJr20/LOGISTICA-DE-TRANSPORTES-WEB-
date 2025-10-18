const express = require('express');
const router = express.Router();
const entregasController = require('../controllers/entregasController');

router.get('/', entregasController.obtenerEntregas);
router.get('/conductor/:id_usuario', entregasController.obtenerEntregasPorConductor);
router.get('/tipos', entregasController.obtenerTiposEntrega);
router.get('/asignacion/:id_usuario', entregasController.obtenerAsignacionConductor);
router.post('/registrar', entregasController.registrarEntrega);
router.put('/finalizar', entregasController.finalizarEntrega);

module.exports = router;

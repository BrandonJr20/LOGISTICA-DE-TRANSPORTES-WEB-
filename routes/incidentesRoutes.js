const express = require('express');
const router = express.Router();
const incidentesController = require('../controllers/incidenetesController');

router.get('/', incidentesController.obtenerIncidentes);
router.get('/usuario/:id_usuario', incidentesController.obtenerIncidentesPorUsuario);
router.get('/tipos', incidentesController.obtenerTiposIncidente);
router.get('/asignacion/:id_usuario', incidentesController.obtenerAsignacionUsuario);
router.post('/registrar', incidentesController.registrarIncidente);

module.exports = router;
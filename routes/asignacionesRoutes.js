const express = require('express')
const router = express.Router()
const asignacionController = require('../controllers/asignacionesController')

router.get('/consultaractivas', asignacionController.obtenerActivas)
router.get('/consultartodos', asignacionController.obtenerTodas)
router.post('/asignar', asignacionController.asignarUnidad)
router.post('/finalizar', asignacionController.finalizarAsignacion)

module.exports = router

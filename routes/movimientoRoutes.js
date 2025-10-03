const express = require('express')
const router = express.Router()
const movimientoController = require('../controllers/movimientoController')

router.get('/historial', movimientoController.obtenerMovimientos)
router.get('/productos', movimientoController.obtenerProductos)
router.post('/entradas', movimientoController.registrarMovimiento)
router.post('/salidas', movimientoController.registrarSalida)

module.exports = router

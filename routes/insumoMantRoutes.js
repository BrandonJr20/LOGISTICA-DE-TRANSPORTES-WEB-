const express = require('express')
const router = express.Router()
const insumoMantenimiento = require('../controllers/insumoMantController')

router.get('/mantenimientos', insumoMantenimiento.obtenerMantenimientosActivos)
router.get('/productos', insumoMantenimiento.obtenerProductos)
router.get('/insumosHistorial', insumoMantenimiento.obtenerInsumosPorMantenimiento)
router.post('/asignarInsumos', insumoMantenimiento.asignarMultiplesInsumos)

module.exports = router
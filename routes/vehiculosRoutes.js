const express = require('express')
const router = express.Router()
const vehiculosController = require('../controllers/vehiculosController')

router.get('/', vehiculosController.consultar)
router.post('/', vehiculosController.ingresar)

router.route('/:id')
    .get(vehiculosController.consultarUno)
    .put(vehiculosController.actualizar)
    .delete(vehiculosController.eliminar)

module.exports = router
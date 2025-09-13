const express = require('express')
const router = express.Router()
const conductorController = require('../controllers/conductoresController')

router.get('/', conductorController.consultar)
router.post('/', conductorController.ingresar)

router.route('/:id')
    .get(conductorController.consultarUno)
    .put(conductorController.actualizar)
    .delete(conductorController.eliminar)

module.exports = router
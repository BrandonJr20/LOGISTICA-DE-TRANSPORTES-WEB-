const express = require('express')
const router = express.Router()
const ejemploController = require('../controllers/ejemploController')

router.get('/', ejemploController.consultar)
router.post('/', ejemploController.ingresar)

router.route('/:id')
    .get(ejemploController.consultarUno)
    .put(ejemploController.actualizar)
    .delete(ejemploController.eliminar)

module.exports = router
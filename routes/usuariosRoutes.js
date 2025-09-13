const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosController')


router.get('/', usuariosController.consultar)
router.post('/', usuariosController.ingresar)

router.get('/estado/:estado', usuariosController.consultarActivos);

router.route('/:id')
    .get(usuariosController.consultarUno)
    .put(usuariosController.actualizar)
    .delete(usuariosController.eliminar)

module.exports = router
const express = require('express')
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

router.get('/consultar', inventarioController.obtenerInventario)
router.get('/tipos-producto', inventarioController.obtenerTiposProducto)
router.get('/alertas-stock-bajo', inventarioController.alertasStockBajo)
router.get('/producto/:id_insumo', inventarioController.obtenerProductoId)
router.post('/producto', inventarioController.agregarProducto)
router.put('/producto', inventarioController.actualizarProducto)
router.patch('/producto/estado', inventarioController.cambiarEstadoProducto)

module.exports = router
const InventarioModel = require('../models/inventarioModel')

class InventarioController {

    async obtenerInventario(req, res) {
        try {
            const data = await InventarioModel.obtenerInventario()
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al obtener inventario')
        }
    }

    async obtenerTiposProducto(req, res) {
        try {
            const data = await InventarioModel.obtenerTiposProducto()
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al obtener tipos de producto')
        }
    }

    async alertasStockBajo(req, res) {
        try {
            const data = await InventarioModel.alertasStockBajo()
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al obtener los productos con stock bajo')
        }
    }

    async obtenerProductoId(req, res) {
        try {
            const { id_insumo } = req.params
            const data = await InventarioModel.obtenerProductoId(id_insumo)
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al obtener el producto con id ' + id_insumo)
        }
    }

    async agregarProducto(req, res){
        try {
            const {nombre_insumo, tipo, descripcion, stock_actual, stock_minimo, proveedor, costo} = req.body
            const resultado = await InventarioModel.agregarProducto({nombre_insumo, tipo, descripcion, stock_actual, stock_minimo, proveedor, costo})
            res.status(201).json({
                success:true,
                msg: 'Producto agregado correctamente',
                data:resultado
            })
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al agregar el producto')
        }
    }

    async actualizarProducto(req, res){
        try{
            const {id_insumo, nombre, tipo, descripcion, stock_actual, stock_minimo, proveedor, estado, costo} = req.body
            const resultado = await InventarioModel.actualizarProducto({id_insumo, nombre, tipo, descripcion, stock_actual, stock_minimo, proveedor, estado, costo})
            if(resultado > 0){
                res.status(201).json({
                    success: true,
                    msg: 'Producto actualizado correctamente'
                })
            } else {
                res.status(400).json({
                    success: false,
                    msg: 'No se pudo actualizar el producto'
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al actualizar el producto')
        }
    }

    async cambiarEstadoProducto(req, res){
        try{
            const {id_insumo, estado} = req.body
            const resultado = await InventarioModel.cambiarEstadoProducto({id_insumo, estado})
            if(resultado > 0){
                res.status(201).json({
                    success: true,
                    msg: 'Producto actualizado correctamente'
                })
            } else {
                res.status(400).json({
                    success: false,
                    msg: 'No se pudo actualizar el producto'
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al cambiar el estado del producto')
        }
    }
}

module.exports = new InventarioController()
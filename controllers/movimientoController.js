const MovimientosModel = require('../models/movimientoModel')

class MovimientosController{
    async obtenerMovimientos(req, res){
        try {
            const data = await MovimientosModel.obtenerMovimientos()
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al obtener movimientos')
        }
    }
    async obtenerProductos(req, res){
        try {
            const data = await MovimientosModel.obtenerProductos()
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al obtener productos')
        }
    }
    async registrarMovimiento(req, res){
        try {
            const {id_insumo, cantidad, descripcion, responsable} = req.body
            const resultado = await MovimientosModel.registrarMovimiento({id_insumo, cantidad, descripcion, responsable})
            if(resultado > 0){
                res.status(201).json({msg: 'Producto agregado correctamente'})
            } else {
                res.status(400).json({msg: 'No se pudo agregar el producto'})
            }
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al registrar movimiento')
        }   
    }
    async registrarSalida(req, res){
        try {
            const {id_insumo, cantidad, descripcion, responsable} = req.body
            const resultado = await MovimientosModel.registrarSalida({id_insumo, cantidad, descripcion, responsable})
            if(resultado > 0){
                res.status(201).json({msg: 'Producto agregado correctamente'})
            } else {
                res.status(400).json({msg: 'No se pudo agregar el producto'})
            }
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al registrar salida')
        }   
    }
}

module.exports = new MovimientosController()
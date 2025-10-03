const MovimientosModel = require('../models/movimientoModel')
class MovimientosController {
    async obtenerMovimientos(req, res) {
        try {
            const data = await MovimientosModel.obtenerMovimientos()
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al obtener movimientos')
        }
    }
    async obtenerProductos(req, res) {
        try {
            const data = await MovimientosModel.obtenerProductos()
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(500).send('Error al obtener productos')
        }
    }
    async registrarMovimiento(req, res) {
        try {
            const { id_insumo, cantidad, descripcion, responsable } = req.body
            const resultado = await MovimientosModel.registrarMovimiento({ id_insumo, cantidad, descripcion, responsable })

            res.status(201).json({
                success: true,
                msg: 'Insumo agregado correctamente',
                data: resultado
            })
            res.status(400).json({
                success: false,
                msg: 'No se pudo agregar el producto',
                data: resultado
            })

        } catch (error) {
            console.error(error)
            res.status(500).send('Error al registrar movimiento')
        }
    }
    async registrarSalida(req, res) {
        try {
            const { id_insumo, cantidad, descripcion, responsable } = req.body

            const resultado = await MovimientosModel.registrarSalida({
                id_insumo,
                cantidad,
                descripcion,
                responsable
            })

            // Si el modelo devuelve un error controlado
            if (resultado && resultado.error) {
                return res.status(400).json({
                    success: false,
                    msg: resultado.error
                })
            }

            // Si todo salió bien
            return res.status(201).json({
                success: true,
                msg: 'Insumo consumido correctamente',
                data: resultado
            })

        } catch (error) {
            console.error('Error en consumir el producto:', error.message)

            if (error.message.includes('Stock insuficiente')) {
                return res.status(400).json({
                    success: false,
                    msg: 'Stock insuficiente'
                })
            }

            return res.status(500).json({
                success: false,
                msg: 'Error interno al registrar salida',
                error: error.message
            })
        }
    }

}

module.exports = new MovimientosController()
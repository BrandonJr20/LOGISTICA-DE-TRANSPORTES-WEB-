const insumoMantenimientoModel = require('../models/insumoMantModel')

class InsumoMantenimientoController {

    async obtenerMantenimientosActivos(req, res) {
        try {
            const data = await insumoMantenimientoModel.obtenerMantenimientosActivos()
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener mantenimientos activos,', error: error.message
            })
        }
    }
    async obtenerProductos(req, res) {
        try {
            const data = await insumoMantenimientoModel.obtenerProductos()
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener productos,', error: error.message
            })
        }
    }
    async obtenerInsumosPorMantenimiento(req, res) {
        try {
            const data = await insumoMantenimientoModel.obtenerInsumosPorMantenimiento()
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener el historial de insumos asignados,', error: error.message
            })
        }
    }

    async asignarMultiplesInsumos(req, res) {
        try {
            const { id_mantenimiento, insumos, responsable } = req.body;

            // Validaciones
            if (!id_mantenimiento || !insumos || !responsable) {
                return res.status(400).json({
                    success: false,
                    msg: 'Faltan campos obligatorios: id_mantenimiento, insumos o responsable'
                });
            }

            if (!Array.isArray(insumos) || insumos.length === 0) {
                return res.status(400).json({
                    success: false,
                    msg: 'El campo insumos debe ser un array con al menos un elemento'
                });
            }

            // Validar estructura de cada insumo
            for (let i = 0; i < insumos.length; i++) {
                const insumo = insumos[i];
                if (!insumo.id_insumo || !insumo.cantidad_usada) {
                    return res.status(400).json({
                        success: false,
                        msg: `Insumo en posición ${i}: faltan id_insumo o cantidad_usada`
                    });
                }
                if (parseInt(insumo.cantidad_usada) <= 0) {
                    return res.status(400).json({
                        success: false,
                        msg: `Insumo en posición ${i}: la cantidad debe ser mayor a cero`
                    });
                }
            }

            const resultado = await insumoMantenimientoModel.asignarMultiplesInsumos({
                id_mantenimiento: parseInt(id_mantenimiento),
                insumos,
                responsable
            });

            res.status(201).json({
                success: true,
                msg: 'Insumos asignados correctamente al mantenimiento',
                data: resultado.data
            });

        } catch (error) {
            console.error('Error en asignarMultiplesInsumos:', error.message);

            if (error.message.includes('mantenimiento no existe') || error.message.includes('finalizado')) {
                return res.status(404).json({
                    success: false,
                    msg: 'El mantenimiento no existe o ya está finalizado'
                });
            }

            if (error.message.includes('insumos no existen') || error.message.includes('inactivos')) {
                return res.status(404).json({
                    success: false,
                    msg: 'Uno o más insumos no existen o están inactivos'
                });
            }

            if (error.message.includes('Stock insuficiente')) {
                return res.status(400).json({
                    success: false,
                    msg: error.message
                });
            }

            res.status(500).json({
                success: false,
                msg: 'Error interno al asignar insumos',
                error: error.message
            });
        }
    }
}

module.exports = new InsumoMantenimientoController()
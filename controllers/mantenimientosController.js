const MantenimientoModel = require('../models/mantenimientosModel');

class MantenimientoController {
    async asignarMantenimiento(req, res) {
        try {
            const { id_unidad, id_tipomantenimiento, descripcion, kilometraje } = req.body;

            // Validaciones básicas
            if (!id_unidad || !id_tipomantenimiento || !kilometraje) {
                return res.status(400).json({
                    success: false,
                    msg: 'Faltan campos obligatorios: id_unidad, id_tipomantenimiento o kilometraje'
                });
            }

            const resultado = await MantenimientoModel.asignarMantenimiento({
                id_unidad,
                id_tipomantenimiento,
                descripcion: descripcion || '',
                kilometraje
            });

            res.status(201).json({
                success: true,
                msg: 'Unidad asignada correctamente a mantenimiento.',
                data: resultado
            });

        } catch (error) {
            console.error('Error en asignarMantenimiento:', error.message);

            if (error.message.includes('La unidad ya está en mantenimiento')) {
                return res.status(409).json({
                    success: false,
                    msg: error.message
                });
            }

            res.status(500).json({
                success: false,
                msg: 'Error interno al asignar unidad al mantenimiento.',
                error: error.message
            });
        }
    }

    async finalizarMantenimiento(req, res) {
        try {
            const { id_unidad } = req.body;

            if (!id_unidad) {
                return res.status(400).json({
                    success: false,
                    msg: 'Faltan campos obligatorios: id_unidad o costo'
                });
            }

            const resultado = await MantenimientoModel.finalizarMantenimiento({
                id_unidad
            });

            if (!resultado.success) {
                return res.status(404).json(resultado);
            }

            res.status(200).json({
                success: true,
                msg: 'Mantenimiento finalizado correctamente.',
                data: resultado.data
            });

        } catch (error) {
            console.error('Error en finalizarMantenimiento:', error.message);
            res.status(500).json({
                success: false,
                msg: 'Error interno al finalizar mantenimiento.',
                error: error.message
            });
        }
    }

    async getHistorial(req, res) {
        try {
            const historial = await MantenimientoModel.obtenerHistorial();
            res.status(200).json(historial);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener historial de mantenimientos', error: error.message });
        }
    }

    async getMantenimientosActivos(req, res){
        try {
            const activos = await MantenimientoModel.obtenerMantenimientosActivos();
            res.status(200).json(activos);
        } catch (error) {
            res.status(500).json({ mensaje: 'Error al obtener mantenimientos activos', error: error.message });
        }
    }
    
   async getTiposMantenimiento(req, res){
    try {
        const tipos = await MantenimientoModel.obtenerTiposMantenimiento();
        res.status(200).json(tipos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener tipos de mantenimiento', error: error.message });
    }
};
}

module.exports = new MantenimientoController();
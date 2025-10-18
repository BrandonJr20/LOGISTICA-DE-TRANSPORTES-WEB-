const entregasModel = require('../models/entregasModel');

class EntregasController {

    async obtenerEntregas(req, res) {
        try {
            const data = await entregasModel.obtenerEntregas();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener entregas', 
                error: error.message
            });
        }
    }

    async obtenerEntregasPorConductor(req, res) {
        try {
            const { id_usuario } = req.params;
            const data = await entregasModel.obtenerEntregasPorConductor(id_usuario);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener entregas del conductor', 
                error: error.message
            });
        }
    }

    async obtenerTiposEntrega(req, res) {
        try {
            const data = await entregasModel.obtenerTiposEntrega();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener tipos de entrega', 
                error: error.message
            });
        }
    }

    async obtenerAsignacionConductor(req, res) {
        try {
            const { id_usuario } = req.params;
            const data = await entregasModel.obtenerAsignacionConductor(id_usuario);
            
            if (!data) {
                return res.status(404).json({
                    mensaje: 'El conductor no tiene una unidad asignada actualmente'
                });
            }
            
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener asignación del conductor', 
                error: error.message
            });
        }
    }

    async registrarEntrega(req, res) {
        try {
            const { 
                id_unidad, 
                id_usuario, 
                fecha_salida, 
                fecha_llegada_estimada, 
                destino, 
                kilometraje_inicial, 
                id_tipo_entrega 
            } = req.body;

            // Validaciones
            if (!id_unidad || !id_usuario || !fecha_salida || !fecha_llegada_estimada || !destino || !kilometraje_inicial || !id_tipo_entrega) {
                return res.status(400).json({
                    success: false,
                    msg: 'Faltan campos obligatorios'
                });
            }

            if (parseFloat(kilometraje_inicial) <= 0) {
                return res.status(400).json({
                    success: false,
                    msg: 'El kilometraje inicial debe ser mayor a cero'
                });
            }

            const resultado = await entregasModel.registrarEntrega({
                id_unidad: parseInt(id_unidad),
                id_usuario: parseInt(id_usuario),
                fecha_salida,
                fecha_llegada_estimada,
                destino,
                kilometraje_inicial: parseFloat(kilometraje_inicial),
                id_tipo_entrega: parseInt(id_tipo_entrega)
            });

            res.status(201).json({
                success: true,
                msg: 'Entrega registrada correctamente',
                data: resultado.data
            });

        } catch (error) {
            console.error('Error en registrarEntrega:', error.message);
            res.status(500).json({
                success: false,
                msg: 'Error interno al registrar entrega',
                error: error.message
            });
        }
    }

    async finalizarEntrega(req, res) {
        try {
            const { id_entrega, fecha_llegada_real, kilometraje_final } = req.body;

            // Validaciones
            if (!id_entrega || !fecha_llegada_real || !kilometraje_final) {
                return res.status(400).json({
                    success: false,
                    msg: 'Faltan campos obligatorios'
                });
            }

            if (parseFloat(kilometraje_final) <= 0) {
                return res.status(400).json({
                    success: false,
                    msg: 'El kilometraje final debe ser mayor a cero'
                });
            }

            const resultado = await entregasModel.finalizarEntrega({
                id_entrega: parseInt(id_entrega),
                fecha_llegada_real,
                kilometraje_final: parseFloat(kilometraje_final)
            });

            res.status(200).json({
                success: true,
                msg: 'Entrega finalizada correctamente',
                data: resultado.data
            });

        } catch (error) {
            console.error('Error en finalizarEntrega:', error.message);
            res.status(500).json({
                success: false,
                msg: 'Error interno al finalizar entrega',
                error: error.message
            });
        }
    }
}

module.exports = new EntregasController();
const consumosModel = require('../models/consumosModel');

class ConsumosController {

    async obtenerConsumos(req, res) {
        try {
            const data = await consumosModel.obtenerConsumos();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener consumos',
                error: error.message
            });
        }
    }

    async obtenerConsumosPorUsuario(req, res) {
        try {
            const { id_usuario } = req.params;
            const data = await consumosModel.obtenerConsumosPorUsuario(parseInt(id_usuario));
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener consumos del usuario',
                error: error.message
            });
        }
    }

    async obtenerTiposCombustible(req, res) {
        try {
            const data = await consumosModel.obtenerTiposCombustible();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener tipos de combustible',
                error: error.message
            });
        }
    }

    async obtenerUltimoKilometraje(req, res) {
        try {
            const { id_unidad } = req.params;
            const data = await consumosModel.obtenerUltimoKilometraje(parseInt(id_unidad));
            
            if (!data) {
                return res.status(404).json({
                    mensaje: 'No hay registros de kilometraje para esta unidad'
                });
            }
            
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener último kilometraje',
                error: error.message
            });
        }
    }

    async obtenerAsignacionUsuario(req, res) {
        try {
            const { id_usuario } = req.params;
            const data = await consumosModel.obtenerAsignacionUsuario(id_usuario);
            
            if (!data) {
                return res.status(404).json({
                    mensaje: 'El usuario no tiene una unidad asignada actualmente'
                });
            }
            
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener asignación del usuario',
                error: error.message
            });
        }
    }

    async registrarConsumo(req, res) {
        try {
            const {
                id_unidad,
                id_conductor,
                fecha_consumo,
                kilometraje_anterior,
                kilometraje_actual,
                litros_cargados,
                costo_total,
                tipo_combustible,
                nombre_estacion,
                direccion_estacion
            } = req.body;

            // Validaciones
            if (!id_unidad || !id_conductor || !fecha_consumo || !kilometraje_anterior || 
                !kilometraje_actual || !litros_cargados || !costo_total) {
                return res.status(400).json({
                    success: false,
                    msg: `faltan campos obligatorios`,
                });
            }

            if (parseFloat(kilometraje_actual) <= parseFloat(kilometraje_anterior)) {
                return res.status(400).json({
                    success: false,
                    msg: 'El kilometraje actual debe ser mayor al anterior'
                });
            }

            if (parseFloat(litros_cargados) <= 0 || parseFloat(costo_total) <= 0) {
                return res.status(400).json({
                    success: false,
                    msg: 'Los litros y el precio deben ser mayores a cero'
                });
            }

            const resultado = await consumosModel.registrarConsumo({
                id_unidad: parseInt(id_unidad),
                id_conductor: parseInt(id_conductor),
                fecha_consumo,
                kilometraje_anterior: parseFloat(kilometraje_anterior),
                kilometraje_actual: parseFloat(kilometraje_actual),
                litros: parseFloat(litros_cargados),
                costo_total: parseFloat(costo_total),
                tipo_combustible: tipo_combustible ? parseInt(tipo_combustible) : null,
                nombre_estacion: nombre_estacion || null,
                direccion_estacion: direccion_estacion || null
            });

            res.status(201).json({
                success: true,
                msg: 'Consumo registrado correctamente',
                data: resultado.data
            });

        } catch (error) {
            console.error('Error en registrarConsumo:', error.message);
            res.status(500).json({
                success: false,
                msg: 'Error interno al registrar consumo',
                error: error.message
            });
        }
    }
}

module.exports = new ConsumosController();

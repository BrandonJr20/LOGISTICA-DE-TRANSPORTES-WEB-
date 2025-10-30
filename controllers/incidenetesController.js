const incidentesModel = require('../models/incidentesModel');

class IncidentesController {

    async obtenerIncidentes(req, res) {
        try {
            const data = await incidentesModel.obtenerIncidentes();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener incidentes',
                error: error.message
            });
        }
    }

    async obtenerIncidentesPorUsuario(req, res) {
        try {
            const { id_usuario } = req.params;
            const data = await incidentesModel.obtenerIncidentesPorUsuario(parseInt(id_usuario));
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener incidentes del usuario',
                error: error.message
            });
        }
    }

    async obtenerTiposIncidente(req, res) {
        try {
            const data = await incidentesModel.obtenerTiposIncidente();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al obtener tipos de incidente',
                error: error.message
            });
        }
    }

    async obtenerAsignacionUsuario(req, res) {
        try {
            const { id_usuario } = req.params;
            const data = await incidentesModel.obtenerAsignacionUsuario(parseInt(id_usuario));

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

    async registrarIncidente(req, res) {
        try {
            const {
                id_unidad,
                id_conductor,
                fecha,
                descripcion,
                id_tipo_incidente,
                lugar
            } = req.body;

            // Validaciones
            if (!id_unidad || !id_conductor || !fecha || !descripcion || !id_tipo_incidente || !lugar) {
                console.log(id_unidad, id_conductor, fecha, descripcion, id_tipo_incidente, lugar)
                return res.status(400).json({
                    success: false,
                    msg: `Faltan campos obligatorios ${id_unidad}, ${id_conductor}, ${fecha}, ${descripcion}, ${id_tipo_incidente}, ${lugar}`
                });
            }


            const resultado = await incidentesModel.registrarIncidente({
                id_unidad: parseInt(id_unidad),
                id_conductor: parseInt(id_conductor),
                fecha,
                descripcion: descripcion.trim(),
                id_tipo_incidente: parseInt(id_tipo_incidente),
                lugar: lugar.trim()
            });

            res.status(201).json({
                success: true,
                msg: 'Incidente registrado correctamente',
                data: resultado.data
            });

        } catch (error) {
            console.error('Error en registrarIncidente:', error.message);
            res.status(500).json({
                success: false,
                msg: 'Error interno al registrar incidente',
                error: error.message
            });
        }
    }
}

module.exports = new IncidentesController();

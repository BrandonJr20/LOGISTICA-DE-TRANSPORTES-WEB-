const AsignacionModel = require('../models/asignacionesModel');

class AsignacionController {
    async obtenerActivas(req, res) {
        try {
            const data = await AsignacionModel.obtenerAsignacionesActivas();
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener asignaciones activas.')
        }
    }

    async obtenerTodas(req, res) {
        try {
            const data = await AsignacionModel.obtenerTodasAsignaciones();
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener asignaciones activas.');
        }
    }

    async asignarUnidad(req, res) {
        try {
            const { id_conductor, id_unidad, fecha_inicio } = req.body;

            const resultado = await AsignacionModel.asignarUnidad({
                id_conductor,
                id_unidad,
                fecha_inicio
            });

            if (resultado > 0) {
                res.status(400).json({ msg: 'No se pudo asignar la unidad.' });
            } else {
                res.status(201).json({ msg: 'Unidad asignada correctamente.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al asignar unidad.');
        }
    }

    async finalizarAsignacion(req, res) {
        try {
            const { id_asignacion, fecha_fin } = req.body;

            const resultado = await AsignacionModel.finalizarAsignacion({
                id_asignacion,
                fecha_fin
            });

            if (resultado > 0) {
                res.status(404).json({ msg: 'No se encontró la asignación.' });
            } else {
                res.status(200).json({ msg: 'Asignación finalizada correctamente.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al finalizar asignación.');
        }
    }
}

module.exports = new AsignacionController();

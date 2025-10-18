const informacionModel = require('../models/informacionModel')
const bcrypt = require('bcrypt');

class InformacionController {

    async obtenerInformacionConductor(req, res) {
        try {
            const { id_usuario } = req.params;
            const data = await informacionModel.obtenerInformacionConductor(id_usuario);
            if (!data) {
                return res.status(404).json({ msg: 'No se encontró la informacion de tu usuario.' });
            }
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async actualizarInformacionConductor(req, res) {
        try {
            const { id_usuario } = req.params;
            const { nombre_usuario, correo, contrasena, nombre_completo, dui, licencia, telefono, direccion } = req.body;

            if (
                typeof nombre_usuario !== 'string' ||
                typeof correo !== 'string' ||
                typeof contrasena !== 'string' ||
                typeof nombre_completo !== 'string' ||
                typeof dui !== 'string' ||
                typeof licencia !== 'string' ||
                typeof telefono !== 'number' ||
                typeof direccion !== 'string'
            ) {
                return res.status(400).json({ error: 'Datos inválidos. Verifica los tipos.' });
            }

            const hash = await bcrypt.hash(contrasena, 10)

            const actualizado = await informacionModel.actualizarInformacionConductor(
                id_usuario,
                nombre_usuario,
                correo,
                hash,
                nombre_completo,
                dui,
                licencia,
                telefono,
                direccion
            );
            if (!actualizado) {
                return res.status(404).json({ msg: 'No se encontró la información del conductor.' });
            }
            res.status(200).json({ msg: 'Información del conductor actualizada correctamente.' });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }
}


module.exports = new InformacionController();
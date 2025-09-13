const { Bit } = require('mssql');
const ConductorModel = require('../models/conductoresModel');

class ConductorController {
    async consultar(req, res) {
        try {
            const data = await ConductorModel.obtenerTodos();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async consultarUno(req, res) {
        try {
            const { id } = req.params;
            const data = await ConductorModel.obtenerPorId(parseInt(id));

            if (!data) {
                return res.status(404).json({ msg: 'No se encontró el registro.' });
            }

            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    // async consultarActivos(req, res) {
    //     try {
    //         const estado = req.params.estado === '1' ? 1 : 0;
    //         const data = await ConductorModel.obtenerActivos(estado);

    //         if (!data) {
    //             return res.status(404).json({ msg: 'No se encontró el registro.' });
    //         }

    //         res.status(200).json(data);
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).send(err.message);
    //     }
    // }

    async ingresar(req, res) {
        try {
            const { id_usuario, nombre_completo, dui, licencia, telefono, direccion } = req.body;

            // Validaciones básicas
            if (
                typeof id_usuario !== 'number' ||
                typeof nombre_completo !== 'string' ||
                typeof dui !== 'string' ||
                typeof licencia !== 'string' ||
                typeof telefono !== 'string' ||
                typeof direccion !== 'string'
            ) {
                return res.status(400).json({ error: 'Datos inválidos. Verifica los tipos.' });
            }

            const insertado = await ConductorModel.insertar({ id_usuario, nombre_completo, dui, licencia, telefono, direccion });
            res.status(201).json({ id: insertado[0]?.id_conductor });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { id_usuario, nombre_completo, dui, licencia, telefono, direccion, fecha_ingreso, estado } = req.body;

            console.log(req.body);
            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            console.log(id);

            if (
                typeof id_usuario !== 'number' ||
                typeof nombre_completo !== 'string' ||
                typeof dui !== 'string' ||
                typeof licencia !== 'string' ||
                typeof telefono !== 'string' ||
                typeof direccion !== 'string' ||
                !(fecha_ingreso === null || typeof fecha_ingreso === 'string') ||  // Validación corregida
                (typeof estado !== 'number' && typeof estado !== 'boolean')
            ) {
                return res.status(400).json({ error: 'Datos inválidos. Verifica los tipos.' });
            }

            const estadoNum = typeof estado === 'boolean' ? (estado ? 1 : 0) : estado;

            const filasAfectadas = await ConductorModel.actualizar({
                id: parseInt(id),
                id_usuario,
                nombre_completo,
                dui,
                licencia,
                telefono,
                direccion,
                fecha_ingreso,
                estado: estadoNum
            });

            if (filasAfectadas === 0) {
                return res.status(404).json({ msg: 'No se encontró el registro para actualizar.' });
            }

            res.status(200).json({ msg: 'Registro actualizado correctamente.' });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }


    async eliminar(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            const filasAfectadas = await ConductorModel.eliminar(parseInt(id));

            if (filasAfectadas === 0) {
                return res.status(404).json({ msg: 'No se encontró el registro para eliminar.' });
            }

            res.status(200).json({ msg: 'Registro dado de baja correctamente.' });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }
}

module.exports = new ConductorController();

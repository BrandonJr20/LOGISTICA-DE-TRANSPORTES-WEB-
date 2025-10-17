const { Bit } = require('mssql');
const VehiculoModel = require('../models/vehiculosModel');

class VehiculosController {
    async consultar(req, res) {
        try {
            const data = await VehiculoModel.obtenerTodos();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async consultarUno(req, res) {
        try {
            const { id } = req.params;
            const data = await VehiculoModel.obtenerPorId(parseInt(id));

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
            const { placa, marca, modelo, anio, kilometraje, fecha_adquisicion, tipoUnidad } = req.body;

            // Validaciones básicas
            console.log(req.body)
            if (
                typeof placa !== 'string' ||
                typeof marca !== 'string' ||
                typeof modelo !== 'string' ||
                typeof anio !== 'number' ||
                // typeof estado !== 'string' || --- SP_CREARUNIDAD YA ASIGNA COMO OPERATIVO
                typeof kilometraje !== 'number' ||
                typeof fecha_adquisicion !== 'string' ||
                typeof tipoUnidad !== 'string'
            ) {
                return res.status(400).json({ error: 'Datos inválidos. Verifica los tipos.' });
            }

            const insertado = await VehiculoModel.insertar({ placa, marca, modelo, anio, kilometraje, fecha_adquisicion, tipoUnidad });
            res.status(201).json({ id: insertado[0]?.id_unidad });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { placa, marca, modelo, anio, estado, /*kilometraje,*/ fecha_adquisicion, tipoUnidad } = req.body;

            console.log(id);
            console.log(req.body);
            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            if (
                typeof placa !== 'string' ||
                typeof marca !== 'string' ||
                typeof modelo !== 'string' ||
                typeof anio !== 'number' ||
                typeof estado !== 'string' ||
                // typeof kilometraje !== 'number' ||
                typeof fecha_adquisicion !== 'string' ||
                typeof tipoUnidad !== 'string'
            ) {
                return res.status(400).json({ error: 'Datos inválidos. Verifica los tipos.' });
            }

            const filasAfectadas = await VehiculoModel.actualizar({
                id: parseInt(id),
                placa,
                marca,
                modelo,
                anio,
                estado,
                // kilometraje,
                fecha_adquisicion,
                tipoUnidad
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

            const filasAfectadas = await VehiculoModel.eliminar(parseInt(id));

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

module.exports = new VehiculosController();

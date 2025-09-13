const EjemploModel = require('../models/ejemploModel');

class EjemploController {
    async consultar(req, res) {
        try {
            const data = await EjemploModel.obtenerTodos();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async consultarUno(req, res) {
        try {
            const { id } = req.params;
            const data = await EjemploModel.obtenerPorId(parseInt(id));

            if (!data) {
                return res.status(404).json({ msg: 'No se encontró el registro.' });
            }

            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async ingresar(req, res) {
        try {
            const { nombre, estado } = req.body;

            if (typeof nombre !== 'string' || typeof estado !== 'string') {
                return res.status(400).json({ error: 'Nombre y estado deben ser cadenas de texto válidas.' });
            }

            const insertado = await EjemploModel.insertar(nombre, estado);
            res.status(201).json({ id: insertado.id });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, estado } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            if (typeof nombre !== 'string' || typeof estado !== 'string') {
                return res.status(400).json({ error: 'Nombre y estado deben ser cadenas de texto válidas.' });
            }

            const filasAfectadas = await EjemploModel.actualizar(parseInt(id), nombre, estado);

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

            const filasAfectadas = await EjemploModel.eliminar(parseInt(id));

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

module.exports = new EjemploController();

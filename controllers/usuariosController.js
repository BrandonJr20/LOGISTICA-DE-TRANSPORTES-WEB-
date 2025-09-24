const { Bit } = require('mssql');
const bcrypt = require('bcrypt');
const UsuarioModel = require('../models/usuariosModel');
const secret_key = process.env.SECRET_KEY
const jwt = require('jsonwebtoken');

class UsuariosController {
    async consultar(req, res) {
        try {
            const data = await UsuarioModel.obtenerTodos();
            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async consultarUno(req, res) {
        try {
            const { id } = req.params;
            const data = await UsuarioModel.obtenerPorId(parseInt(id));

            if (!data) {
                return res.status(404).json({ msg: 'No se encontró el registro.' });
            }

            res.status(200).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async consultarActivos(req, res) {
        try {
            const activo = req.params.activo === '1' ? 1 : 0;
            const data = await UsuarioModel.obtenerActivos(activo);

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
            const { nombre_usuario, correo, contrasena, rol, activo } = req.body;

            // Validaciones básicas
            if (
                typeof nombre_usuario !== 'string' ||
                typeof correo !== 'string' ||
                typeof contrasena !== 'string' ||
                typeof rol !== 'string' ||
                typeof activo !== 'number'
            ) {
                return res.status(400).json({ error: 'Datos inválidos. Verifica los tipos.' });
            }

            const hash = await bcrypt.hash(contrasena, 10)

            const insertado = await UsuarioModel.insertar(
                { 
                    nombre_usuario, 
                    correo, 
                    contrasena: hash, 
                    rol, 
                    activo 
                });
            res.status(201).json({ id_conductor: insertado.id_usuario || insertado.id });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre_usuario, correo, contrasena, rol, activo } = req.body;

            console.log(req.body)
            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            if (
                typeof nombre_usuario !== 'string' ||
                typeof correo !== 'string' ||
                typeof contrasena !== 'string' ||
                typeof rol !== 'string' ||
                (typeof activo !== 'number' && typeof activo !== 'boolean')
            ) {
                return res.status(400).json({ error: 'Datos inválidos. Verifica los tipos.' });
            }

            const hash = await bcrypt.hash(contrasena, 10)

            const activoNum = typeof activo === 'boolean' ? (activo ? 1 : 0) : activo;

            const filasAfectadas = await UsuarioModel.actualizar(parseInt(id), nombre_usuario, correo, hash, rol, activoNum);

            if (filasAfectadas === 0) {
                return res.status(404).json({ msg: 'No se encontró el registro para actualizar.' });
            }

            res.status(200).json({ msg: 'Registro actualizado correctamente.' });
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    async eliminar(req, res) { //Deshabilitar usuario no eliminar - Se elimina manualmente en la BD
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            const filasAfectadas = await UsuarioModel.eliminar(parseInt(id));

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

module.exports = new UsuariosController();

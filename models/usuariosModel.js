const db = require('../database/config');

const UsuarioModel = {
    async obtenerTodos() {
        const request = new db.sql.Request();
        const result = await request.execute('sp_ConsultarUsuarios');
        return result.recordset;
    },

    async obtenerPorId(id) {
        const request = new db.sql.Request();
        request.input('id_usuario', db.sql.Int, id);
        const result = await request.execute('sp_ConsultarUsuariosId');
        return result.recordset[0];
    },

    async obtenerActivos(estado) {
        const request = new db.sql.Request();
        request.input('estado', db.sql.Bit, estado);
        const result = await request.execute('sp_ConsultarUsuariosActivos');
        return result.recordset;
    },

    async insertar({ nombre_usuario, correo, contrasena, rol, estado }) {
        const request = new db.sql.Request();
        request.input('nombre_usuario', db.sql.VarChar(50), nombre_usuario);
        request.input('correo', db.sql.VarChar(100), correo);
        request.input('contrasena', db.sql.VarChar(255), contrasena);
        request.input('rol', db.sql.VarChar(20), rol);
        request.input('estado', db.sql.Bit, estado);

        const result = await request.execute('sp_CrearUsuario');
        return result.recordset[0];
    },

    async actualizar(id, nombre_usuario, correo, contrasena, rol, activo) {
        const request = new db.sql.Request();
        request.input('id_usuario', db.sql.Int, id)
        request.input('nombre_usuario', db.sql.VarChar(50), nombre_usuario);
        request.input('correo', db.sql.VarChar(100), correo);
        request.input('contrasena', db.sql.VarChar(255), contrasena);
        request.input('rol', db.sql.VarChar(20), rol);
        request.input('activo', db.sql.Bit, activo);
        const result = await request.execute('sp_ActualizarUsuario');
        return result.rowsAffected[0];
    },

    async eliminar(id) {
        const request = new db.sql.Request();
        request.input('id_usuario', db.sql.Int, id);
        const result = await request.execute('sp_EliminarUsuario');
        return result.rowsAffected[0];
    },
}

module.exports = UsuarioModel;

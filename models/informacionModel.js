const { MAX } = require('mssql');
const db = require('../database/config');

const informacionModel = {
    async obtenerInformacionConductor(id_usuario) {
        const request = new db.sql.Request();
        request.input('id_usuario', db.sql.Int, id_usuario);
        const result = await request.execute('sp_ConsultarInfoUsuario');
        return result.recordset[0];
    },
    async actualizarInformacionConductor(id_usuario, nombre_usuario, correo, contrasena, nombre_completo, dui, licencia, telefono, direccion) {
        const request = new db.sql.Request();
        request.input('id_usuario', db.sql.Int, id_usuario);
        request.input('nombre_usuario', db.sql.VarChar(50), nombre_usuario);
        request.input('correo', db.sql.VarChar(100), correo);
        request.input('contrasena', db.sql.VarChar(255), contrasena);
        request.input('nombre_completo', db.sql.VarChar(255), nombre_completo);
        request.input('dui', db.sql.VarChar(20), dui);
        request.input('licencia', db.sql.VarChar(20), licencia);
        request.input('telefono', db.sql.Int, telefono);
        request.input('direccion', db.sql.VarChar(255), direccion);
        const result = await request.execute('sp_ActualizarInformacionUsuario');
        return result.rowsAffected[0];
    }
}

module.exports = informacionModel;
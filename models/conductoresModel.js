const db = require('../database/config');

const ConductorModel = {
    async obtenerTodos() {
        const request = new db.sql.Request();
        const result = await request.execute('sp_ConsultarConductores');
        return result.recordset;
    },

    async obtenerPorId(id) {
        const request = new db.sql.Request();
        request.input('id_conductor', db.sql.Int, id);
        const result = await request.execute('sp_ConsultarConductorPorId');
        return result.recordset[0];
    },

    // async obtenerActivos(estado) {
    //     const request = new db.sql.Request();
    //     request.input('estado', db.sql.Bit, estado);
    //     const result = await request.execute('sp_ConsultarUsuariosActivos');
    //     return result.recordset;
    // },

    async insertar({ id_usuario, nombre_completo, dui, licencia, telefono, direccion }) {
        const request = new db.sql.Request();
        request.input('id_usuario', db.sql.Int, id_usuario);
        request.input('nombre_completo', db.sql.VarChar(100), nombre_completo);
        request.input('dui', db.sql.VarChar(20), dui);
        request.input('licencia', db.sql.VarChar(20), licencia);
        request.input('telefono', db.sql.VarChar(20), telefono);
        request.input('direccion', db.sql.Text, direccion);


        const result = await request.execute('sp_CrearConductor');
        return result.recordset;
    },

    async actualizar( { id, id_usuario, nombre_completo, dui, licencia, telefono, direccion, fecha_ingreso, activo } ) {
        const request = new db.sql.Request();
        request.input('id_conductor', db.sql.Int, id)
        request.input('id_usuario', db.sql.Int, id_usuario)
        request.input('nombre_completo', db.sql.VarChar(100), nombre_completo);
        request.input('dui', db.sql.VarChar(20), dui);
        request.input('licencia', db.sql.VarChar(20), licencia);
        request.input('telefono', db.sql.VarChar(20), telefono);
        request.input('direccion', db.sql.Text, direccion);
        request.input('fecha_ingreso', db.sql.Date, fecha_ingreso)
        request.input('activo', db.sql.Bit, activo);
        const result = await request.execute('sp_ActualizarConductor');
        return result.rowsAffected[0];
    },

    async eliminar(id) {
        const request = new db.sql.Request();
        request.input('id_conductor', db.sql.Int, id);
        const result = await request.execute('sp_EliminarConductor');
        return result.rowsAffected[0];
    }
};

module.exports = ConductorModel;

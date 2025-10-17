const db = require('../database/config');

const VehiculoModel = {
    async obtenerTodos() {
        const request = new db.sql.Request();
        const result = await request.execute('sp_ConsultarUnidades');
        return result.recordset;
    },

    async obtenerPorId(id) {
        const request = new db.sql.Request();
        request.input('id_unidad', db.sql.Int, id);
        const result = await request.execute('sp_ConsultarUnidadId');
        return result.recordset[0];
    },

    // async obtenerActivos(estado) {
    //     const request = new db.sql.Request();
    //     request.input('estado', db.sql.Bit, estado);
    //     const result = await request.execute('sp_ConsultarUsuariosActivos');
    //     return result.recordset;
    // },

    async insertar({ placa, marca, modelo, anio, kilometraje, fecha_adquisicion, tipoUnidad }) {
        const request = new db.sql.Request();
        request.input('placa', db.sql.VarChar(20), placa);
        request.input('marca', db.sql.VarChar(50), marca);
        request.input('modelo', db.sql.VarChar(50), modelo);
        request.input('anio', db.sql.Int, anio);
        // request.input('estado', db.sql.VarChar(30), estado); ---- SP_CREARUNIDAD YA ASIGNA COMO OPERATIVO
        request.input('kilometraje', db.sql.Int, kilometraje);
        request.input('fecha_adquisicion', db.sql.Date, fecha_adquisicion);
        request.input('tipoUnidad', db.sql.Char(1), tipoUnidad);


        const result = await request.execute('sp_CrearUnidad');
        return result.recordset;
    },

    async actualizar({ id, placa, marca, modelo, anio, estado, /*kilometraje,*/ fecha_adquisicion, tipoUnidad }) {
        const request = new db.sql.Request();
        request.input('id_unidad', db.sql.Int, id)
        request.input('placa', db.sql.VarChar(20), placa);
        request.input('marca', db.sql.VarChar(50), marca);
        request.input('modelo', db.sql.VarChar(50), modelo);
        request.input('anio', db.sql.Int, anio);
        request.input('estado', db.sql.VarChar(30), estado);
        // request.input('kilometraje', db.sql.Int, kilometraje);
        request.input('fecha_adquisicion', db.sql.Date, fecha_adquisicion);
        request.input('tipoUnidad', db.sql.Char(1), tipoUnidad);
        const result = await request.execute('sp_ActualizarUnidad');
        return result.rowsAffected[0];
    },

    async eliminar(id) {
        const request = new db.sql.Request();
        request.input('id_unidad', db.sql.Int, id);
        const result = await request.execute('sp_EliminarUnidad');
        return result.rowsAffected[0];
    }
};

module.exports = VehiculoModel;

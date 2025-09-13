const db = require('../database/config');

const AsignacionModel = {
    async obtenerAsignacionesActivas() {
        const request = new db.sql.Request();
        const result = await request.execute('sp_ConsultarAsignacionesActivas');
        return result.recordset;
    },

    async obtenerTodasAsignaciones() {
        const request = new db.sql.Request();
        const result = await request.execute('sp_ConsultarTodasAsignaciones');
        return result.recordset;
    },

    async asignarUnidad({ id_conductor, id_unidad, fecha_inicio }) {
        const request = new db.sql.Request();
        request.input('id_conductor', db.sql.Int, id_conductor);
        request.input('id_unidad', db.sql.Int, id_unidad);
        request.input('fecha_inicio', db.sql.DateTime, fecha_inicio);

        const result = await request.execute('sp_AsignarUnidadAConductor');
        return result.rowsAffected[0];
    },

    async finalizarAsignacion({ id_asignacion, fecha_fin }) {
        const request = new db.sql.Request();
        request.input('id_asignacion', db.sql.Int, id_asignacion);
        request.input('fecha_fin', db.sql.DateTime, fecha_fin);

        const result = await request.execute('sp_FinalizarAsignacion');
        return result.rowsAffected[0];
    }
};

module.exports = AsignacionModel;

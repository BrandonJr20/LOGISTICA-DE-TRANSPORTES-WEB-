const db = require('../database/config');

const incidentesModel = {
    async obtenerIncidentes() {
        try {
            const request = new db.sql.Request();
            const result = await request.execute('sp_listarIncidentes');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener los incidentes: ' + error.message);
        }
    },

    async obtenerIncidentesPorUsuario(id_usuario) {
        try {
            const request = new db.sql.Request();
            request.input('id_usuario', db.sql.Int, id_usuario);
            const result = await request.execute('sp_obtenerIncidentesPorConductor');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener incidentes del usuario: ' + error.message);
        }
    },

    async obtenerTiposIncidente() {
        try {
            const request = new db.sql.Request();
            const result = await request.execute('tipo_incidente');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener tipos de incidente: ' + error.message);
        }
    },

    async obtenerAsignacionUsuario(id_usuario) {
        try {
            const request = new db.sql.Request();
            request.input('id_usuario', db.sql.Int, id_usuario);
            const result = await request.execute('sp_obtenerAsignacionConductorIncidente');
            return result.recordset[0];
        } catch (error) {
            throw new Error('Error al obtener asignación del usuario: ' + error.message);
        }
    },

    async registrarIncidente(data) {
        try {
            const request = new db.sql.Request();
            request.input('id_unidad', db.sql.Int, data.id_unidad);
            request.input('id_conductor', db.sql.Int, data.id_conductor);
            request.input('fecha', db.sql.DateTime, data.fecha);
            request.input('descripcion', db.sql.Text, data.descripcion);
            request.input('id_tipo_incidente', db.sql.Int, data.id_tipo_incidente);
            request.input('lugar', db.sql.VarChar(200), data.lugar);

            const result = await request.execute('sp_registrarIncidente');
            return {
                success: true,
                data: result.recordset[0]
            };
        } catch (error) {
            console.error('Error en registrarIncidente:', error.message);
            throw error;
        }
    }
};

module.exports = incidentesModel;

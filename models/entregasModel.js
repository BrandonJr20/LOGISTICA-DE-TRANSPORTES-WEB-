const db = require('../database/config');

const entregasModel = {
    async obtenerEntregas() {
        try {
            const request = new db.sql.Request();
            const result = await request.execute('sp_listarEntregas');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener las entregas: ' + error.message);
        }
    },

    async obtenerEntregasPorConductor(id_usuario) {
        try {
            const request = new db.sql.Request();
            request.input('id_usuario', db.sql.Int, id_usuario);
            const result = await request.execute('sp_obtenerEntregasPorConductor');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener entregas del conductor: ' + error.message);
        }
    },

    async obtenerTiposEntrega() {
        try {
            const request = new db.sql.Request();
            const result = await request.execute('sp_obtenerTiposEntrega');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener tipos de entrega: ' + error.message);
        }
    },

    async obtenerAsignacionConductor(id_usuario) {
        try {
            const request = new db.sql.Request();
            request.input('id_usuario', db.sql.Int, id_usuario);
            const result = await request.execute('sp_obtenerAsignacionConductorConsumo');
            return result.recordset[0];
        } catch (error) {
            throw new Error('Error al obtener asignación del conductor: ' + error.message);
        }
    },

    async registrarEntrega(data) {
        try {
            const request = new db.sql.Request();
            request.input('id_unidad', db.sql.Int, data.id_unidad);
            request.input('id_usuario', db.sql.Int, data.id_usuario);
            request.input('fecha_salida', db.sql.DateTime, data.fecha_salida);
            request.input('fecha_llegada_estimada', db.sql.DateTime, data.fecha_llegada_estimada);
            request.input('destino', db.sql.VarChar(200), data.destino);
            request.input('kilometraje_inicial', db.sql.Decimal(10, 2), data.kilometraje_inicial);
            request.input('id_tipo_entrega', db.sql.Int, data.id_tipo_entrega);

            const result = await request.execute('sp_registrarEntrega');
            return {
                success: true,
                data: result.recordset[0]
            };
        } catch (error) {
            console.error('Error en registrarEntrega:', error.message);
            throw error;
        }
    },

    async finalizarEntrega(data) {
        try {
            const request = new db.sql.Request();
            request.input('id_entrega', db.sql.Int, data.id_entrega);
            request.input('fecha_llegada_real', db.sql.DateTime, data.fecha_llegada_real);
            request.input('kilometraje_final', db.sql.Decimal(10, 2), data.kilometraje_final);

            const result = await request.execute('sp_finalizarEntrega');
            return {
                success: true,
                data: result.recordset[0]
            };
        } catch (error) {
            console.error('Error en finalizarEntrega:', error.message);
            throw error;
        }
    }
};

module.exports = entregasModel;
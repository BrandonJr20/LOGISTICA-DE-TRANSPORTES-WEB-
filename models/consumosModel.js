const db = require('../database/config');

const consumosModel = {
    async obtenerConsumos() {
        try {
            const request = new db.sql.Request();
            const result = await request.execute('sp_listarConsumos');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener los consumos: ' + error.message);
        }
    },

    async obtenerConsumosPorUsuario(id_usuario) {
        try {
            const request = new db.sql.Request();
            request.input('id_usuario', db.sql.Int, id_usuario);
            const result = await request.execute('[sp_obtenerConsumosPorConductor]');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener consumos del usuario: ' + error.message);
        }
    },

    async obtenerTiposCombustible() {
        try {
            const request = new db.sql.Request();
            const result = await request.execute('sp_obtenerTiposCombustible');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener tipos de combustible: ' + error.message);
        }
    },

    async obtenerUltimoKilometraje(id_unidad) {
        try {
            const request = new db.sql.Request();
            request.input('id_unidad', db.sql.Int, id_unidad);
            const result = await request.execute('sp_obtenerUltimoKilometraje');
            return result.recordset[0];
        } catch (error) {
            throw new Error('Error al obtener último kilometraje: ' + error.message);
        }
    },

    async obtenerAsignacionUsuario(id_usuario) {
        try {
            const request = new db.sql.Request();
            request.input('id_usuario', db.sql.Int, id_usuario);
            const result = await request.execute('sp_obtenerAsignacionConductor');
            return result.recordset[0];
        } catch (error) {
            throw new Error('Error al obtener asignación del usuario: ' + error.message);
        }
    },

    async registrarConsumo(data) {
        try {
            const request = new db.sql.Request();
            request.input('id_unidad', db.sql.Int, data.id_unidad);
            request.input('id_conductor', db.sql.Int, data.id_conductor);
            request.input('fecha_consumo', db.sql.DateTime, data.fecha_consumo);
            request.input('kilometraje_anterior', db.sql.Decimal(10, 2), data.kilometraje_anterior);
            request.input('kilometraje_actual', db.sql.Decimal(10, 2), data.kilometraje_actual);
            request.input('litros', db.sql.Decimal(10, 2), data.litros);
            request.input('costo_total', db.sql.Decimal(10, 2), data.costo_total);
            request.input('tipo_combustible', db.sql.Int, data.tipo_combustible || null);
            request.input('nombre_estacion', db.sql.VarChar(50), data.nombre_estacion || null);
            request.input('direccion_estacion', db.sql.VarChar(50), data.direccion_estacion || null);

            const result = await request.execute('sp_registrarConsumo');
            return {
                success: true,
                data: result.recordset[0]
            };
        } catch (error) {
            console.error('Error en registrarConsumo:', error.message);
            throw error;
        }
    }
};

module.exports = consumosModel;

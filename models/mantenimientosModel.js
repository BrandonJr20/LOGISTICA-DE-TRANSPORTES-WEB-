const db = require('../database/config');

const MantenimientoModel = {
    async asignarMantenimiento({ id_unidad, id_tipomantenimiento, descripcion, kilometraje }) {
        try {
            const request = new db.sql.Request();
            request.input('id_unidad', db.sql.Int, id_unidad);
            request.input('id_tipomantenimiento', db.sql.Int, id_tipomantenimiento);
            request.input('descripcion', db.sql.Text, descripcion);
            request.input('kilometraje', db.sql.Int, kilometraje);

            const result = await request.execute('sp_AsignarMantenimiento');

            return {
                success: true,
                data: {
                    rowsAffected: result.rowsAffected[0],
                    recordset: result.recordset || []
                }
            };

        } catch (error) {
            console.error('Error en modelo asignarMantenimiento:', error.message);
            throw error;
        }
    },

    async finalizarMantenimiento({ id_unidad, costo }) {
        try {
            const request = new db.sql.Request();
            request.input('id_unidad', db.sql.Int, id_unidad);
            request.input('costo', db.sql.Decimal(10, 2), costo);

            const result = await request.execute('sp_FinalizarMantenimiento');

            if (result.rowsAffected[0] === 0) {
                return {
                    success: false,
                    msg: 'No se encontró mantenimiento activo para esta unidad o no se pudo actualizar'
                };
            }

            return {
                success: true,
                data: {
                    rowsAffected: result.rowsAffected[0],
                    recordset: result.recordset || []
                }
            };

        } catch (error) {
            console.error('Error en modelo finalizarMantenimiento:', error.message);
            throw error;
        }
    },

    async obtenerHistorial() {
        try {
            const request = new db.sql.Request();
            const result = await request.execute('obtenerHistorialMantenimiento');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener el historial de mantenimientos: ' + error.message);
        }
    },

    async obtenerMantenimientosActivos() {
        try {
            const request = new db.sql.Request();
            const result = await request.execute('obtenerMantenimientosActivos');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener mantenimientos activos: ' + error.message);
        }
    },

    async obtenerTiposMantenimiento() {
        try {
            const request = new db.sql.Request();
            const result = await request.execute('obtenerTiposMantenimiento');
            return result.recordset;
        } catch (error) {
            throw new Error('Error al obtener los tipos de mantenimiento: ' + error.message);
        }
    }
}

module.exports = MantenimientoModel;
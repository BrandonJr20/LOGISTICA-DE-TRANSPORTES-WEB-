const db = require('../database/config')

const insumoMantenimientoModel = {
    async obtenerMantenimientosActivos() {
        try {
            const request = new db.sql.Request()
            const result = await request.execute('obtenerMantenimientosActivos')
            return result.recordset
        } catch (error) {
            throw new Error('Error al obtener los mantenimientos' + error.message)
        }
    },
    async obtenerProductos() {
        try {
            const request = new db.sql.Request()
            const result = await request.execute('sp_ObtenerProductosActivos')
            return result.recordset
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message)
        }
    },
    async obtenerInsumosPorMantenimiento() {
        try {
            const request = new db.sql.Request()
            const result = await request.execute('sp_ObtenerHistorialInsumosMantenimiento')
            return result.recordset
        } catch (error) {
            throw new Error('Error al obtener los movimientos por insumo' + error.message)
        }
    },
    async asignarMultiplesInsumos({ id_mantenimiento, insumos, responsable }) {
        try {
            const request = new db.sql.Request();
            request.input('id_mantenimiento', db.sql.Int, id_mantenimiento);
            request.input('insumos', db.sql.NVarChar(db.sql.MAX), JSON.stringify(insumos));
            request.input('responsable', db.sql.VarChar(100), responsable);

            const result = await request.execute('sp_AsignarMultiplesInsumos');

            return {
                success: true,
                data: result.recordset[0]
            };
        } catch (error) {
            console.error('Error en asignarMultiplesInsumos:', error.message);
            throw error;
        }
    }
}

module.exports = insumoMantenimientoModel
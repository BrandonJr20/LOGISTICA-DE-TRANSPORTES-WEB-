const db = require('../database/config')

const MovimientosModel ={
    async obtenerMovimientos(){
        const request = new db.sql.Request()
        const result = await request.execute('sp_ObtenerHistorialMovimientos')
        return result.recordset
    }, 
    async obtenerProductos(){
        const request = new db.sql.Request()
        const result = await request.execute('sp_ObtenerProductosActivos')
        return result.recordset
    },
    async registrarMovimiento({id_insumo, cantidad, descripcion, responsable}){
        const request = new db.sql.Request()
        request.input('id_insumo', db.sql.Int, id_insumo)
        request.input('cantidad', db.sql.Int, cantidad)
        request.input('descripcion', db.sql.VarChar(255), descripcion)
        request.input('responsable', db.sql.VarChar(100), responsable)
        const result = await request.execute('sp_RegistrarMovimientoEntrada')
        return result.rowsAffected[0]
        
    },
    async registrarSalida({id_insumo, cantidad, descripcion, responsable}){
        const request = new db.sql.Request()
        request.input('id_insumo', db.sql.Int, id_insumo)
        request.input('cantidad', db.sql.Int, cantidad)
        request.input('descripcion', db.sql.VarChar(255), descripcion)
        request.input('responsable', db.sql.VarChar(100), responsable)
        const result = await request.execute('sp_RegistrarMovimientoSalida')
        return result.rowsAffected[0]
    }
}

module.exports = MovimientosModel
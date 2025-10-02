const db = require('../database/config')

const InventarioModel = {
    async obtenerInventario(){
        const request = new db.sql.Request()
        const result = await request.execute('sp_ObtenerInventario')
        return result.recordset
    },

    async obtenerTiposProducto(){
        const request = new db.sql.Request()
        const result = await request.execute('sp_ObtenerTiposProducto')
        return result.recordset
    },
    async alertasStockBajo(){
        const request = new db.sql.Request()
        const result = await request.execute('sp_ObtenerAlertasStock')
        return result.recordset
    },
    async obtenerProductoId(id_insumo){
        const request = new db.sql.Request()
        request.input('id_insumo', db.sql.Int, id_insumo)
        const result = await request.execute('sp_ObtenerProductoPorId')
        return result.recordset
    },
    async agregarProducto({nombre_insumo, tipo, descripcion, stock_actual, stock_minimo, proveedor}){
        const request = new db.sql.Request()
        request.input('nombre_insumo', db.sql.VarChar(100), nombre_insumo)
        request.input('tipo', db.sql.Int, tipo)
        request.input('descripcion', db.sql.VarChar(255), descripcion)
        request.input('stock_actual', db.sql.Int, stock_actual)
        request.input('stock_minimo', db.sql.Int, stock_minimo)
        request.input('proveedor', db.sql.VarChar(100), proveedor)
        const result = await request.execute('sp_AgregarProducto')
        return result.rowsAffected[0]
    },
    async actualizarProducto({id_insumo, nombre_insumo, tipo, descripcion, stock_actual, stock_minimo, proveedor, estado}){
        const request = new db.sql.Request()
        request.input('id_insumo', db.sql.Int, id_insumo)
        request.input('nombre_insumo', db.sql.VarChar(100), nombre_insumo)
        request.input('tipo', db.sql.Int, tipo)
        request.input('descripcion', db.sql.VarChar(255), descripcion)
        request.input('stock_actual', db.sql.Int, stock_actual)
        request.input('stock_minimo', db.sql.Int, stock_minimo)
        request.input('proveedor', db.sql.VarChar(100), proveedor)
        request.input('estado', db.sql.Bit, 1)
        const result = await request.execute('sp_ActualizarProducto')
        return result.rowsAffected[0]
    },
    async cambiarEstadoProducto({id_insumo, estado}){
        const request = new db.sql.Request()
        request.input('id_insumo', db.sql.Int, id_insumo)
        request.input('estado', db.sql.Bit, estado)
        const result = await request.execute('sp_CambiarEstadoProducto')
        return result.rowsAffected[0]
    }
}   

module.exports = InventarioModel;
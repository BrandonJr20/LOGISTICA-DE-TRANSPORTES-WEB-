const db = require('../database/config');

const EjemploModel = {
    async obtenerTodos() {
        const request = new db.sql.Request();
        const result = await request.execute('sp_ConsultarEjemplos');
        return result.recordset;
    },

    async obtenerPorId(id) {
        const request = new db.sql.Request();
        request.input('id', db.sql.Int, id);
        const result = await request.query('SELECT * FROM ejemplo WHERE id = @id');
        return result.recordset[0];
    },

    async insertar(nombre, estado) {
        const request = new db.sql.Request();
        request.input('nombre', db.sql.VarChar, nombre);
        request.input('estado', db.sql.VarChar, estado);
        const result = await request.query(`
            INSERT INTO ejemplo (nombre, estado)
            OUTPUT INSERTED.id
            VALUES (@nombre, @estado)
        `);
        return result.recordset[0];
    },

    async actualizar(id, nombre, estado) {
        const request = new db.sql.Request();
        request.input('id', db.sql.Int, id);
        request.input('nombre', db.sql.VarChar, nombre);
        request.input('estado', db.sql.VarChar, estado);
        const result = await request.query(`
            UPDATE ejemplo
            SET nombre = @nombre, estado = @estado
            WHERE id = @id
        `);
        return result.rowsAffected[0];
    },

    async eliminar(id) {
        const request = new db.sql.Request();
        request.input('id', db.sql.Int, id);
        const result = await request.query(`
            UPDATE ejemplo
            SET estado = 0
            WHERE id = @id
        `);
        return result.rowsAffected[0];
    }
};

module.exports = EjemploModel;

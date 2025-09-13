const db = require('../database/config');

const authUsuarioModel = {
  async loginUsuario(nombre_usuario) {
    try {
      const request = new db.sql.Request();
      request.input('nombre_usuario', db.sql.VarChar(50), nombre_usuario);
      
      const result = await request.execute('sp_loginUsuario');
      
      if (result.recordset.length === 0) {
        return null;
      }
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error en loginUsuario:', error);
      throw error;
    }
  },

  // NUEVA: Función para actualizar estado de conexión
  async actualizarEstado(id_usuario, estado) {
    try {
      const request = new db.sql.Request();
      request.input('id_usuario', db.sql.Int, id_usuario);
      request.input('estado', db.sql.Bit, estado);
      
      const result = await request.execute('sp_actualizarEstadoUsuario');
      return result.recordset[0];
    } catch (error) {
      console.error('Error en actualizarEstado:', error)
      throw error
    }
  }
}

module.exports = authUsuarioModel;
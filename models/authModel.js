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

  // Función específica para cerrar sesión
  async cerrarSesionUsuario(id_usuario) {
    try {
      console.log('Cerrando sesión para usuario ID:', id_usuario);
      
      const request = new db.sql.Request();
      request.input('id_usuario', db.sql.Int, id_usuario);
      
      const result = await request.execute('sp_cerrarSesionUsuario');
      
      console.log('MODEL: Resultado del SP cerrar sesión:', result.recordset);
      
      return result.recordset[0];
    } catch (error) {
      console.error('MODEL: Error en cerrarSesionUsuario:', error);
      throw error;
    }
  }
};

module.exports = authUsuarioModel;

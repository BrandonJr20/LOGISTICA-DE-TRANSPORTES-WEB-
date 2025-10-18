const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UsuarioModel = require('../models/authModel');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

async function loginUsuario(req, res) {
  const { nombre_usuario, contrasena } = req.body;

  if (!nombre_usuario || !contrasena) {
    return res.status(400).json({ 
      success: false, 
      mensaje: 'Usuario y contraseña son requeridos' 
    });
  }

  try {
    // 1. Obtener usuario
    const usuario = await UsuarioModel.loginUsuario(nombre_usuario);
    
    if (!usuario) {
      return res.status(401).json({ 
        success: false, 
        mensaje: 'Credenciales inválidas' 
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario inactivo. Contacta al administrador'
      });
    }

    // 2. Comparar contraseña hasheada
    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!match) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // 3. Generar token
    const token = jwt.sign(
      {
        foto_perfil: usuario.foto_perfil,
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        rol: usuario.rol
      },
      secretKey,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      mensaje: 'Login exitoso',
      token,
      usuario: {
        foto_perfil: usuario.foto_perfil,
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        correo: usuario.correo,
        rol: usuario.rol,
        estado: usuario.estado,
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error interno del servidor' 
    });
  }
}

// Función para cerrar sesión
async function cerrarSesion(req, res) {
  try {
    console.log('Cerrando sesión para usuario:', req.usuario);
    
    const { id } = req.usuario; // Del token JWT decodificado

    // Llamar al SP para cerrar sesión (actualiza estado = 0)
    const resultado = await UsuarioModel.cerrarSesionUsuario(id);
    
    console.log('Resultado del SP:', resultado);

    res.json({
      success: true,
      mensaje: 'Sesión cerrada correctamente',
      data: resultado
    });

  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al cerrar sesión'
    });
  }
}

module.exports = { loginUsuario, cerrarSesion };
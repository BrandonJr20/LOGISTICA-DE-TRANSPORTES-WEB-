const bcrypt = require('bcrypt');

async function hashearContrasenas() {
  const saltRounds = 10;
  
  try {
    // Para usuarios 1 y 2 (contraseña "123")
    const hash123 = await bcrypt.hash('123', saltRounds);
    console.log('UPDATE usuarios SET contrasena = \'' + hash123 + '\' WHERE id_usuario IN (1, 2);');
    
    // Para usuario 3 (contraseña "MWilson")  
    const hashMWilson = await bcrypt.hash('MWilson', saltRounds);
    console.log('UPDATE usuarios SET contrasena = \'' + hashMWilson + '\' WHERE id_usuario = 3;');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

hashearContrasenas();
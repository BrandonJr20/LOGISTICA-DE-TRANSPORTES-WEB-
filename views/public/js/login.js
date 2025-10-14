document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre_usuario = document.getElementById('nombre_usuario').value.trim();
  const contrasena = document.getElementById('contrasena').value;
  const errorElement = document.getElementById('errorMensaje');
  
  errorElement.innerText = '';

  if (!nombre_usuario || !contrasena) {
    errorElement.innerText = 'Por favor ingresa usuario y contraseña';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre_usuario, contrasena })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      await mostrarDialogo(`Bienvenido ${data.usuario.nombre_usuario} (rol: ${data.usuario.rol})`);

      if (data.usuario.rol === 'admin') {
        // Ruta absoluta desde la raíz del servidor
        window.location.href = '/views/admin.html';
      } else {
        // Ruta absoluta hacia conductor.html
        window.location.href = '/views/conductor.html';
      }
    } else {
      errorElement.innerText = data.mensaje || 'Error en el login';
    }
  } catch (error) {
    console.error('Error en el frontend:', error);
    errorElement.innerText = 'Error al conectar con el servidor';
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formUsuario');

    const apiUrl = 'http://localhost:3000/informacion';

    // Al cargar la página, obtener información
    obtenerInformacion();

    // Enviar formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const id = usuario.id;

        const data = {
            nombre_usuario: document.getElementById('nombre_usuario').value,
            correo: document.getElementById('correo').value,
            contrasena: document.getElementById('contrasena').value,
            nombre_completo: document.getElementById('nombre_completo').value,
            dui: document.getElementById('dui').value,
            licencia: document.getElementById('licencia').value,
            telefono: parseInt(document.getElementById('telefono').value),
            direccion: document.getElementById('direccion').value,
        };

        try {
            if (await mostrarDialogoConfirmacion('¿Estás seguro de actualizar tu información?')) {
                await mostrarDialogo('Información actualizada correctamente');
                await fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            } else {
                await mostrarDialogo('Información no actualizada');

            }
        } catch (err) {
            console.error('Error al actualizar información:', err);
            mostrarDialogo('Ocurrió un error al actualizar la información.');
        }
    });

    // Función para obtener información del usuario
    async function obtenerInformacion() {
        try {
            const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
            const id = usuario.id

            const res = await fetch(`${apiUrl}/${id}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.msg || 'Error al obtener información');

            // Rellenar el formulario con la información obtenida
            document.getElementById('nombre_usuario').value = data.nombre_usuario || '';
            document.getElementById('correo').value = data.correo || '';
            
            document.getElementById('nombre_completo').value = data.nombre_completo || '';
            document.getElementById('dui').value = data.dui || '';
            document.getElementById('licencia').value = data.licencia || '';
            document.getElementById('telefono').value = data.telefono || '';
            document.getElementById('direccion').value = data.direccion || '';
        } catch (err) {
            console.error('Error al obtener la información:', err);
        }
    }
});

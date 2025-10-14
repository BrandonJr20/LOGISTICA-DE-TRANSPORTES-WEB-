document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formUsuario');
    const tablaBody = document.querySelector('#tablaUsuarios tbody');

    const apiUrl = 'http://localhost:3000/usuarios'; // Ajusta si tu ruta base es distinta

    // Cargar todos los usuarios al cargar la página
    obtenerUsuarios();

    // Enviar formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('id_usuario').value;
        const datos = {
            nombre_usuario: document.getElementById('nombre_usuario').value,
            correo: document.getElementById('correo').value,
            contrasena: document.getElementById('contrasena').value,
            rol: document.getElementById('rol').value,
            activo: parseInt(document.getElementById('activo').value)
        };

        try {
            if (id) {
                // Actualizar
                if (await mostrarDialogoConfirmacion('¿Estás seguro de crear este usuario?')) {
                    await mostrarDialogo('Usuario creado correctamente');
                    await fetch(`${apiUrl}/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datos)
                    });
                } else {
                    await mostrarDialogo('Usuario no actualizado');
                }
            } else {
                // Insertar
                if (await mostrarDialogoConfirmacion('¿Estás seguro de crear este usuario?')) {
                    await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datos)
                    });
                    await mostrarDialogo('Usuario creado correctamente');
                } else {
                    await mostrarDialogo('Usuario no creado');
                }
            }

            form.reset();
            document.getElementById('id_usuario').value = '';
            obtenerUsuarios();
        } catch (err) {
            await mostrarDialogo('Error al guardar usuario', err);
            console.error('Error al guardar usuario:', err);
        }
    });

    // Obtener todos los usuarios
    async function obtenerUsuarios() {
        try {
            const res = await fetch(apiUrl);
            const usuarios = await res.json();

            tablaBody.innerHTML = '';

            usuarios.forEach(usuario => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <td>${usuario.id_usuario}</td>
                    <td>${usuario.nombre_usuario}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.rol}</td>
                    <td>${usuario.activo ? 'Habilitado' : 'Inhabilitado'}</td>
                    <td>
                        <button class="editar" data-id="${usuario.id_usuario}">Editar</button>
                        <button class="eliminar" data-id="${usuario.id_usuario}">Eliminar</button>
                    </td>
                `;

                tablaBody.appendChild(tr);
            });

            agregarEventosAcciones();
        } catch (err) {
            await mostrarDialogo('Error al obtener usuarios', err);
            console.error('Error al obtener usuarios:', err);
        }
    }

    // Agregar eventos a botones editar y eliminar
    function agregarEventosAcciones() {
        document.querySelectorAll('.editar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                try {
                    const res = await fetch(`${apiUrl}/${id}`);
                    const usuario = await res.json();

                    document.getElementById('id_usuario').value = usuario.id_usuario;
                    document.getElementById('nombre_usuario').value = usuario.nombre_usuario;
                    document.getElementById('correo').value = usuario.correo;
                    document.getElementById('contrasena').value = usuario.contrasena;
                    document.getElementById('rol').value = usuario.rol;
                    document.getElementById('activo').value = usuario.activo ? 1 : 0;

                    console.log(usuario)
                } catch (err) {
                    await mostrarDialogo('Error al cargar usuario para editar', err);
                    console.error('Error al cargar usuario para editar:', err);
                }
            });
        });

        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (
                    await mostrarDialogoConfirmacion('¿Estás seguro de eliminar este usuario?')) {
                    try {
                        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
                        await mostrarDialogo('Usuario eliminado correctamente');
                        obtenerUsuarios();
                    } catch (err) {
                        await mostrarDialogo('Error al eliminar usuario', err);
                        console.error('Error al eliminar usuario:', err);
                    }
                }
            });
        });
    }
});

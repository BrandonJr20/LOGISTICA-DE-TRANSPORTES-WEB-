document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formConductor');
    const tablaBody = document.querySelector('#tablaConductores tbody');

    const apiUrl = 'http://localhost:3000/conductores'; // Ajusta según tu ruta base

    // Cargar todos los conductores al cargar la página
    obtenerConductores();

    // Enviar formulario
    form.addEventListener('submit', async (a) => {
        a.preventDefault();

        const id = document.getElementById('id_conductor').value;
        const datos = {
            id_usuario: parseInt(document.getElementById('id_usuario_conductor').value),
            nombre_completo: document.getElementById('nombre_completo').value,
            dui: document.getElementById('dui').value,
            licencia: document.getElementById('licencia').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            fecha_ingreso: formatearFechaDate(document.getElementById('fecha_ingreso').value), // formato YYYY-MM-DD
            activo: parseInt(document.getElementById('activo_conductor').value) // 1 o 0
        };

        try {
            if (id) {
                // Actualizar
                if (await mostrarDialogoConfirmacion('¿Estás seguro de actualizar este conductor?')) {
                    await fetch(`${apiUrl}/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datos)
                    });
                    await mostrarDialogo('Conductor actualizado correctamente');
                } else {
                    await mostrarDialogo('Conductor no actualizado');
                }
            } else {
                // Insertar
                if (await mostrarDialogoConfirmacion('¿Estás seguro de crear este conductor?')) {
                    await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datos)
                    });
                    await mostrarDialogo('Conductor creado correctamente');
                } else {
                    await mostrarDialogo('Conductor no creado');
                }
            }
            form.reset();
            document.getElementById('id_conductor').value = '';
            obtenerConductores();
        } catch (err) {
            await mostrarDialogo('Error al guardar conductor', err);
            console.error('Error al guardar conductor:', err);
        }
    });

    // Obtener todos los conductores
    async function obtenerConductores() {
        try {
            const res = await fetch(apiUrl);
            const conductores = await res.json();

            tablaBody.innerHTML = '';

            conductores.forEach(conductor => {
                const tr = document.createElement('tr');

                tr.innerHTML = `
                    <!--<td>${conductor.id_conductor}</td>-->
                    <!--<td>${conductor.id_usuario}</td>-->
                    <td>${conductor.nombre_completo}</td>
                    <td>${conductor.dui}</td>
                    <td>${conductor.licencia}</td>
                    <td>${conductor.telefono}</td>
                    <td>${conductor.direccion}</td>
                    <td>${formatearFechaDate(conductor.fecha_ingreso)}</td>
                    <td>${conductor.activo_conductor ? 'Habilitado' : 'Inhabilitado'}</td>
                    <td>
                        <button class="editar conductor" data-id="${conductor.id_conductor}">Editar</button>
                        <button class="eliminar conductor" data-id="${conductor.id_conductor}">Eliminar</button>
                    </td>
                `;
                tablaBody.appendChild(tr);
            });

            agregarEventosAcciones();
        } catch (err) {
            await mostrarDialogo('Error al obtener conductores', err);
            console.error('Error al obtener conductores:', err);
        }
    }

    // Agregar eventos a botones editar y eliminar
    function agregarEventosAcciones() {
        document.querySelectorAll('.editar').forEach(btn => {
            btn.addEventListener('click', async (a) => {
                const id = a.target.dataset.id;
                try {
                    const res = await fetch(`${apiUrl}/${id}`);
                    const conductor = await res.json();

                    document.getElementById('id_conductor').value = conductor.id_conductor;
                    document.getElementById('id_usuario_conductor').value = conductor.id_usuario;
                    document.getElementById('nombre_completo').value = conductor.nombre_completo;
                    document.getElementById('dui').value = conductor.dui;
                    document.getElementById('licencia').value = conductor.licencia;
                    document.getElementById('telefono').value = conductor.telefono;
                    document.getElementById('direccion').value = conductor.direccion;
                    document.getElementById('fecha_ingreso').value = formatearFechaDate(conductor.fecha_ingreso);
                    document.getElementById('activo_conductor').value = conductor.activo_conductor ? 1 : 0;
                } catch (err) {
                    await mostrarDialogo('Error al cargar conductor para editar', err);
                    console.error('Error al cargar conductor para editar:', err);
                }
            });
        });

        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', async (a) => {
                const id = a.target.dataset.id;
                if (
                    await mostrarDialogoConfirmacion('¿Estás seguro de eliminar este conductor? Esta acción no se puede deshacer.')) {
                    try {
                        await fetch(`
                            ${apiUrl}/${id}`, 
                            { method: 'DELETE' }
                        );
                        await mostrarDialogo('Conductor eliminado correctamente');
                        obtenerConductores();
                        location.reload()
                    } catch (err) {
                        await mostrarDialogo('Error al eliminar conductor', err);
                        console.error('Error al eliminar conductor:', err);
                    }
                }
            });
        });
    }
});

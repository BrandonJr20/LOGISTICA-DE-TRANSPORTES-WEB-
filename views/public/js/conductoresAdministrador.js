document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formConductor');
    const tablaBody = document.querySelector('#tablaConductores tbody');

    const apiUrl = 'http://localhost:3000/conductores'; // Ajusta según tu ruta base

    // Cargar todos los conductores al cargar la página
    obtenerConductores();

    // Enviar formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('id_conductor').value;
        const datos = {
            id_usuario: parseInt(document.getElementById('id_usuario_conductor').value),
            nombre_completo: document.getElementById('nombre_completo').value,
            dui: document.getElementById('dui').value,
            licencia: document.getElementById('licencia').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            fecha_ingreso: document.getElementById('fecha_ingreso').value, // formato YYYY-MM-DD
            estado: parseInt(document.getElementById('estado_conductor').value) // 1 o 0
        };

        try {
            if (id) {
                // Actualizar
                await fetch(`${apiUrl}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
            } else {
                // Insertar
                await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
            }

            form.reset();
            document.getElementById('id_conductor').value = '';
            obtenerConductores();
        } catch (err) {
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
                    <td>${conductor.id_conductor}</td>
                    <td>${conductor.id_usuario}</td>
                    <td>${conductor.nombre_completo}</td>
                    <td>${conductor.dui}</td>
                    <td>${conductor.licencia}</td>
                    <td>${conductor.telefono}</td>
                    <td>${conductor.direccion}</td>
                    <td>${conductor.fecha_ingreso}</td>
                    <td>${conductor.estado_conductor  ? 'Activo' : 'Inactivo'}</td>
                    <td>
                        <button class="editar" data-id="${conductor.id_conductor}">Editar</button>
                        <button class="eliminar" data-id="${conductor.id_conductor}">Eliminar</button>
                    </td>
                `;

                tablaBody.appendChild(tr);
            });

            agregarEventosAcciones();
        } catch (err) {
            console.error('Error al obtener conductores:', err);
        }
    }

    // Agregar eventos a botones editar y eliminar
    function agregarEventosAcciones() {
        document.querySelectorAll('.editar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                try {
                    const res = await fetch(`${apiUrl}/${id}`);
                    const conductor = await res.json();

                    document.getElementById('id_conductor').value = conductor.id_conductor;
                    document.getElementById('id_usuario').value = conductor.id_usuario;
                    document.getElementById('nombre_completo').value = conductor.nombre_completo;
                    document.getElementById('dui').value = conductor.dui;
                    document.getElementById('licencia').value = conductor.licencia;
                    document.getElementById('telefono').value = conductor.telefono;
                    document.getElementById('direccion').value = conductor.direccion;
                    document.getElementById('fecha_ingreso').value = conductor.fecha_ingreso;
                    document.getElementById('estado').value = conductor.estado ? 1 : 0;
                } catch (err) {
                    console.error('Error al cargar conductor para editar:', err);
                }
            });
        });

        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (confirm('¿Estás seguro de eliminar este conductor?')) {
                    try {
                        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
                        obtenerConductores();
                        location.reload()
                    } catch (err) {
                        console.error('Error al eliminar conductor:', err);
                    }
                }
            });
        });
    }
});

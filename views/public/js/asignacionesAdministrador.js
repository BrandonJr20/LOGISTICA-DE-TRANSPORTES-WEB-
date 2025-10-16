document.addEventListener('DOMContentLoaded', () => {
    cargarConductores();
    cargarUnidades();
    obtenerAsignacionesTodas();
    obtenerAsignacionesActivas();

    document.getElementById('formAsignacion').addEventListener('submit', async (e) => {
        e.preventDefault();

        const id_conductor = document.getElementById('id_conductor_asignacion').value;
        const id_unidad = document.getElementById('id_unidad_asignacion').value;
        const fecha_inicio = document.getElementById('fecha_inicio').value;

        if (await mostrarDialogoConfirmacion(`¿Estás seguro de asignar la unidad ${id_unidad} al conductor ${id_conductor}?`)) {
            try {
                const res = await fetch('http://localhost:3000/asignaciones/asignar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_conductor, id_unidad, fecha_inicio })
                });

                const data = await res.json();

                // Manejo centralizado según el código HTTP
                switch (res.status) {
                    case 201:
                        await mostrarDialogo(` ${data.msg}`);
                        break;
                    case 400:
                        await mostrarDialogo(` ${data.msg}`);
                        break;
                    case 500:
                        await mostrarDialogo(`${data.error}`);
                        break;
                    default:
                        await mostrarDialogo(` Error desconocido (${res.status})`);
                }

            } catch (err) {
                console.error('Error de conexión:', err);
                await mostrarDialogo('No se pudo conectar con el servidor.');
            }
        } else {
            await mostrarDialogo('Asignación cancelada.');
        }

        e.target.reset();
        obtenerAsignacionesActivas();
        obtenerHistorial();
    });
});


async function cargarConductores() {
    const res = await fetch('http://localhost:3000/conductores');
    const conductores = await res.json();
    const select = document.getElementById('id_conductor_asignacion');
    select.innerHTML = '<option value="">Seleccione</option>';
    conductores.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id_conductor;
        option.textContent = c.nombre_completo;
        select.appendChild(option);
    });
}

async function cargarUnidades() {
    const res = await fetch('http://localhost:3000/vehiculos/'); // Ajustá esta ruta según tengas
    const unidades = await res.json();
    const select = document.getElementById('id_unidad_asignacion');
    select.innerHTML = '<option value="">Seleccione</option>';
    unidades.forEach(u => {
        const option = document.createElement('option');
        option.value = u.id_unidad;
        option.textContent = u.placa;
        select.appendChild(option);
    });
}

async function obtenerAsignacionesActivas() {
    const res = await fetch('http://localhost:3000/asignaciones/consultaractivas');
    const data = await res.json();
    const tbody = document.querySelector('#tablaHistorial tbody');
    tbody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.id_asignacion}</td>
            <td>${row.nombre_completo}</td>
            <td>${row.placa}</td>
            <td>${formatearFechaDate(row.fecha_inicio)}</td>
            <td><button onclick="finalizarAsignacion(${row.id_asignacion})" class="finalizar">Finalizar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

async function obtenerAsignacionesTodas() {
    const res = await fetch('http://localhost:3000/asignaciones/consultartodos');
    const data = await res.json();
    const tbody = document.querySelector('#tablaActivas tbody');
    tbody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.id_asignacion}</td>
            <td>${row.nombre_completo}</td>
            <td>${row.placa}</td>
            <td>${formatearFechaDate(row.fecha_inicio)}</td>
            <td>${formatearFechaDate(row.fecha_fin)}</td>
        `;
        tbody.appendChild(tr);
    });
}


async function finalizarAsignacion(id_asignacion) {
    
    if (await mostrarDialogoConfirmacion(`¿Estás seguro de finalizar la asignación ${id_asignacion}?`)) {
        try {
            const fecha_fin = formatearFechaDate(new Date());
            const res = await fetch('http://localhost:3000/asignaciones/finalizar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_asignacion, fecha_fin })
            });
            const data = await res.json();
            switch (res.status) {
                case 200:
                    await mostrarDialogo(` ${data.msg}`);
                    break;  
                case 400:
                    await mostrarDialogo(` ${data.msg}`);
                    break;
                case 500:
                    await mostrarDialogo(`${data.error}`);
                    break;  
                default:
                    await mostrarDialogo(` Error desconocido (${res.status})`);
            }
        } catch (err) {
            await mostrarDialogo('No se pudo conectar con el servidor.', err);
        }
    } else {
        await mostrarDialogo('Finalización cancelada.');
    }

    obtenerAsignacionesActivas();
    obtenerAsignacionesTodas();
}

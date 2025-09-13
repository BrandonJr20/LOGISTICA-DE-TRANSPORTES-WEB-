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

        const res = await fetch('http://localhost:3000/asignaciones/asignar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_conductor, id_unidad, fecha_inicio })
        });

        const data = await res.json();
        alert(data.msg);
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
            <td>${new Date(row.fecha_inicio).toLocaleString()}</td>
            <td><button onclick="finalizarAsignacion(${row.id_asignacion})">Finalizar</button></td>
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
            <td>${new Date(row.fecha_inicio).toLocaleString()}</td>
            <td>${(row.fecha_inicio).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}


async function finalizarAsignacion(id_asignacion) {
    const fecha_fin = new Date().toISOString();
    const res = await fetch('http://localhost:3000/asignaciones/finalizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_asignacion, fecha_fin })
    });

    const data = await res.json();
    alert(data.msg);
    obtenerAsignacionesActivas();
    obtenerAsignacionesTodas();
}

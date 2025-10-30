document.addEventListener('DOMContentLoaded', () => {
    obtenerIncidentesPorUsuario();
    obtenerTiposIncidente();

    const btnModal = document.getElementById('modalIncidente');
    const dialog = document.getElementById('registrarIncidente');
    const btnCancelar = document.getElementById('btnCancelarIncidente');
    const form = document.getElementById('formIncidente');

    btnModal.addEventListener('click', async () => {
        await cargarAsignacionUsuario();
        dialog.showModal();
    });

    btnCancelar.addEventListener('click', () => {
        form.reset();
        dialog.close();
    });

    form.addEventListener('submit', registrarIncidente);
});

let tiposIncidente = [];

async function obtenerIncidentesPorUsuario() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const id_usuario = usuario.id;

        const res = await fetch(`http://localhost:3000/incidentes/usuario/${id_usuario}`);
        const incidentes = await res.json();
        const tbody = document.querySelector('#tablaIncidentesDetalle tbody');
        tbody.innerHTML = '';

        if (incidentes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">No hay incidentes registrados</td></tr>';
        } else {
            incidentes.forEach(incidente => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${incidente.id_unidad}</td>
                    <td>${incidente.placa}</td>
                    <td>${incidente.nombre_completo}</td>
                    <td>${formatearFechaDatetime(incidente.fecha_incidente)}</td>
                    <td>${incidente.descripcion}</td>
                    <td>${incidente.lugar}</td>
                    <td>${incidente.tipo_incidente}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error al obtener incidentes:', error);
        await mostrarDialogo('Error al cargar incidentes');
    }
}

async function obtenerTiposIncidente() {
    try {
        const res = await fetch('http://localhost:3000/incidentes/tipos');
        tiposIncidente = await res.json();
        const select = document.getElementById('tipo_incidente');
        
        select.innerHTML = '<option value="">Seleccione</option>';
        tiposIncidente.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id_incidente;
            option.textContent = tipo.descripcion;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al obtener tipos de incidente:', error);
    }
}

async function cargarAsignacionUsuario() {
    try {
        // Obtener ID del usuario desde localStorage
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const id_usuario = usuario.id;

        if (!id_usuario) {
            await mostrarDialogo('No se pudo obtener la información del usuario');
            return;
        }

        const res = await fetch(`http://localhost:3000/incidentes/asignacion/${id_usuario}`);
        
        if (!res.ok) {
            await mostrarDialogo('No tienes una unidad asignada actualmente');
            return;
        }

        const asignacion = await res.json();
        console.log(asignacion)

        // Llenar campos del formulario
        document.getElementById('id_unidad_incidente').value = asignacion.id_unidad;
        document.getElementById('id_conductor_incidente').value = asignacion.id_conductor;
        document.getElementById('placa_incidente').value = asignacion.placa;
        document.getElementById('nombre_conductor_incidente').value = asignacion.nombre_completo;

    } catch (error) {
        console.error('Error al cargar asignación:', error);
        await mostrarDialogo('Error al cargar información de la unidad asignada');
    }
}

async function registrarIncidente(e) {
    e.preventDefault();

    const data = {
        id_unidad: parseInt(document.getElementById('id_unidad_incidente').value),
        id_conductor: parseInt(document.getElementById('id_conductor_incidente').value),
        fecha: document.getElementById('fecha_incidente').value,
        descripcion: document.getElementById('descripcion').value,
        id_tipo_incidente: parseInt(document.getElementById('tipo_incidente').value),
        lugar: document.getElementById('lugar').value.trim()
    };

    // Validación de fecha (no puede ser futura)
    const fechaIncidente = new Date(data.fecha_incidente);
    const ahora = new Date();
    if (fechaIncidente > ahora) {
        await mostrarDialogo('La fecha del incidente no puede ser futura');
        return;
    }

    try {
        if (await mostrarDialogoConfirmacion('¿Está seguro de registrar este incidente?')) {
            const res = await fetch('http://localhost:3000/incidentes/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.success) {
                await mostrarDialogo(result.msg || 'Incidente registrado correctamente');
                document.getElementById('formIncidente').reset();
                document.getElementById('registrarIncidente').close();
                await obtenerIncidentes();
            } else {
                await mostrarDialogo('Error: ' + (result.msg || 'No se pudo registrar el incidente'));
            }
        }
    } catch (error) {
        console.error('Error al registrar incidente:', error);
        await mostrarDialogo('Error al registrar incidente. Por favor intente nuevamente.');
    }
    obtenerIncidentesPorUsuario()
}

// Ver detalle completo del incidente
async function verDetalleIncidente(id_incidente) {
    try {
        const res = await fetch('http://localhost:3000/incidentes');
        const incidentes = await res.json();
        const incidente = incidentes.find(i => i.id_incidente === id_incidente);
        
        if (incidente) {
            const mensaje = `
                <strong>Incidente #${incidente.id_incidente}</strong><br><br>
                <strong>Unidad:</strong> ${incidente.placa}<br>
                <strong>Conductor:</strong> ${incidente.nombre_conductor}<br>
                <strong>Fecha:</strong> ${formatearFechaDatetime(incidente.fecha_incidente)}<br>
                <strong>Tipo:</strong> ${incidente.tipo_incidente}<br>
                <strong>Lugar:</strong> ${incidente.lugar}<br><br>
                <strong>Descripción:</strong><br>
                ${incidente.descripcion}
            `;
            await mostrarDialogoHTML(mensaje);
        }
    } catch (error) {
        console.error('Error al ver detalle:', error);
        await mostrarDialogo('Error al cargar el detalle del incidente');
    }
}

// Función auxiliar para formatear fechas
function formatearFechaDatetime(fecha) {
    if (!fecha) return '—';
    const date = new Date(fecha);
    return date.toLocaleString('es-GT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}


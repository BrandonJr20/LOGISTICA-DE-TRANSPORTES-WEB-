document.addEventListener('DOMContentLoaded', () => {
    obtenerEntregasPorConductor();
    obtenerTiposEntrega();

    const btnModal = document.getElementById('modalEntrega');
    const dialog = document.getElementById('registrarEntrega');
    const btnCancelar = document.getElementById('btnCancelarEntrega');
    const form = document.getElementById('formEntrega');

    btnModal.addEventListener('click', async () => {
        await cargarAsignacionConductor();
        dialog.showModal();
    });

    btnCancelar.addEventListener('click', () => {
        form.reset();
        dialog.close();
    });

    form.addEventListener('submit', registrarEntrega);
});

let tiposEntrega = [];

async function obtenerEntregasPorConductor() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const id_usuario = usuario.id;
        const res = await fetch(`http://localhost:3000/entregas/conductor/${id_usuario}`);
        const entregas = await res.json();
        const tbody = document.querySelector('#tablaEntregas tbody');
        tbody.innerHTML = '';

        if (entregas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="11">No hay entregas registradas</td></tr>';
        } else {
            entregas.forEach(entrega => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${entrega.id_unidad}</td>
                    <td>${entrega.placa}</td>
                    <td>${entrega.nombre_completo}</td>
                    <td>${formatearFechaDatetime(entrega.fecha_salida)}</td>
                    <td>${formatearFechaDatetime(entrega.fecha_llegada_estimada)}</td>
                    <td>${entrega.fecha_llegada_real ? formatearFechaDatetime(entrega.fecha_llegada_real) : '—'}</td>
                    <td>${entrega.destino}</td>
                    <td>${entrega.kilometraje_inicial} km</td>
                    <td>${entrega.kilometraje_final ? entrega.kilometraje_final + ' km' : '—'}</td>
                    <td>${entrega.tipo_entrega}</td>
                    <td><span class="badge ${entrega.estado === 'En curso' ? 'badge-warning' : 'badge-success'}">${entrega.estado}</span></td>
                    <td>
                        ${entrega.estado === 'En curso' ? 
                            `<button onclick="finalizarEntrega(${entrega.id_entrega}, ${entrega.kilometraje_inicial})" class="btn-finalizar">Finalizar</button>` 
                            : '—'
                        }
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error al obtener entregas:', error);
        mostrarDialogo('Error al cargar entregas');
    }
}

async function obtenerTiposEntrega() {
    try {
        const res = await fetch('http://localhost:3000/entregas/tipos');
        tiposEntrega = await res.json();
        const select = document.getElementById('tipo_entrega');
        
        select.innerHTML = '<option value="">Seleccione</option>';
        tiposEntrega.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id_tipo_entrega;
            option.textContent = tipo.descripcion;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al obtener tipos de entrega:', error);
    }
}

async function cargarAsignacionConductor() {
    try {
        // Obtener ID del conductor desde localStorage
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const id_usuario = usuario.id;

        if (!id_usuario) {
            await mostrarDialogo('No se pudo obtener la información del conductor');
            return;
        }

        const res = await fetch(`http://localhost:3000/entregas/asignacion/${id_usuario}`);
        
        if (!res.ok) {
            await mostrarDialogo('No tienes una unidad asignada actualmente');
            return;
        }

        const asignacion = await res.json();

        // Llenar campos del formulario
        document.getElementById('id_unidad').value = asignacion.id_unidad;
        document.getElementById('placa').value = asignacion.placa;
        document.getElementById('id_usuario').value = id_usuario;
        document.getElementById('nombre_conductor').value = asignacion.nombre_completo;
        document.getElementById('kilometraje_inicial').value = asignacion.kilometraje_actual;

    } catch (error) {
        console.error('Error al cargar asignación:', error);
        await mostrarDialogo('Error al cargar información de la unidad asignada');
    }
}

async function registrarEntrega(e) {
    e.preventDefault();

    const data = {
        id_unidad: parseInt(document.getElementById('id_unidad').value),
        id_usuario: parseInt(document.getElementById('id_usuario').value),
        fecha_salida: document.getElementById('fecha_salida').value,
        fecha_llegada_estimada: document.getElementById('fecha_llegada_estimada').value,
        destino: document.getElementById('destino').value,
        kilometraje_inicial: parseFloat(document.getElementById('kilometraje_inicial').value),
        id_tipo_entrega: parseInt(document.getElementById('tipo_entrega').value)
    };

    // Validaciones adicionales
    if (new Date(data.fecha_llegada_estimada) <= new Date(data.fecha_salida)) {
        await mostrarDialogo('La fecha de llegada estimada debe ser posterior a la fecha de salida');
        return;
    }

    try {
        if (await mostrarDialogoConfirmacion('¿Está seguro de registrar esta entrega?')) {
            const res = await fetch('http://localhost:3000/entregas/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.success) {
                await mostrarDialogo(result.msg || 'Entrega registrada correctamente');
                document.getElementById('formEntrega').reset();
                document.getElementById('registrarEntrega').close();
                await obtenerEntregasPorConductor();
            } else {
                await mostrarDialogo('Error: ' + (result.msg || 'No se pudo registrar la entrega'));
            }
        }
    } catch (error) {
        console.error('Error al registrar entrega:', error);
        await mostrarDialogo('Error al registrar entrega. Por favor intente nuevamente.');
    }
}

async function finalizarEntrega(id_entrega, kilometraje_inicial) {
    const fecha_llegada_real = new Date()
    console.log
    
    const kilometraje_final = await mostrarDialogoInput(
        'Ingrese el kilometraje final:', 
        'Ejemplo: 15000'
    );
    
    if (!kilometraje_final) {
        await mostrarDialogo('Operación cancelada');
        return;
    }

    const km_final = parseFloat(kilometraje_final);
    if (isNaN(km_final) || km_final <= kilometraje_inicial) {
        await mostrarDialogo('El kilometraje final debe ser mayor al inicial');
        return;
    }


    if (!fecha_llegada_real || !kilometraje_final) {
        await mostrarDialogo('Debe completar todos los campos');
        return;
    }

    const data = {
        id_entrega,
        fecha_llegada_real,
        kilometraje_final: km_final
    };

    try {
        if (await mostrarDialogoConfirmacion('¿Está seguro de finalizar esta entrega?')) {
            const res = await fetch('http://localhost:3000/entregas/finalizar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.success) {
                await mostrarDialogo(result.msg || 'Entrega finalizada correctamente');
                await obtenerEntregas();
            } else {
                await mostrarDialogo('Error: ' + (result.msg || 'No se pudo finalizar la entrega'));
            }
        }
    } catch (error) {
        console.error('Error al finalizar entrega:', error);
        await mostrarDialogo('Error al finalizar entrega. Por favor intente nuevamente.');
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
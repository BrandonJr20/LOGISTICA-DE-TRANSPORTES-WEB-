document.addEventListener('DOMContentLoaded', () => {
    obtenerConsumosPorUsuario();
    obtenerTiposCombustible();

    const btnModal = document.getElementById('modalConsumo');
    const dialog = document.getElementById('registrarConsumo');
    const btnCancelar = document.getElementById('btnCancelarConsumo');
    const form = document.getElementById('formConsumo');

    btnModal.addEventListener('click', async () => {
        await obtenerAsignacionUsuario();
        dialog.showModal();
    });

    btnCancelar.addEventListener('click', () => {
        form.reset();
        dialog.close();
    });

    form.addEventListener('submit', registrarConsumo);

    // Evento para actualizar kilometraje anterior cuando cambia la unidad
    document.getElementById('id_unidad_consumo')?.addEventListener('change', async (e) => {
        if (e.target.value) {
            await cargarUltimoKilometraje(e.target.value);
        }
    });
});

let tiposCombustible = [];

async function obtenerConsumosPorUsuario() {
    try {

        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const id_usuario = usuario.id;
        
        const res = await fetch(`http://localhost:3000/consumos/usuario/${id_usuario}`);
        const consumos = await res.json();
        const tbody = document.querySelector('#tablaConsumos tbody');
        tbody.innerHTML = '';

        if (consumos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9">No hay consumos registrados</td></tr>';
        } else {
            consumos.forEach(consumo => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${consumo.id_unidad}</td>
                    <td>${consumo.placa}</td>
                    <td>${consumo.nombre_completo}</td>
                    <td>${formatearFechaDatetime(consumo.fecha_consumo)}</td>
                    <td>${consumo.kilometraje_anterior} km</td>
                    <td>${consumo.kilometraje_actual} km</td>
                    <td>${consumo.galones_cargados}</td>
                    <td>Q${parseFloat(consumo.precio_galon).toFixed(2)}</td>
                    <td>${consumo.tipo_combustible}</td>
                    <td>Q${parseFloat(consumo.costo_total).toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error al obtener consumos:', error);
        await mostrarDialogo('Error al cargar consumos');
    }
}

async function obtenerTiposCombustible() {
    try {
        const res = await fetch('http://localhost:3000/consumos/tipos-combustible');
        tiposCombustible = await res.json();
        const select = document.getElementById('tipo_combustible');

        if (select) {
            select.innerHTML = '<option value="">Seleccione</option>';
            tiposCombustible.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.id_tipo_combustible;
                option.textContent = tipo.descripcion;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error al obtener tipos de combustible:', error);
    }
}

async function obtenerAsignacionUsuario() {
    try {
        // Obtener ID del conductor desde localStorage
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const id_usuario = usuario.id;

        if (!id_usuario) {
            await mostrarDialogo('No se pudo obtener la información del conductor');
            return;
        }

        const res = await fetch(`http://localhost:3000/consumos/asignacion/${id_usuario}`);

        if (!res.ok) {
            await mostrarDialogo('No tienes una unidad asignada actualmente');
            return;
        }

        const asignacion = await res.json();
        console.log(asignacion)

        // Llenar campos del formulario
        document.getElementById('id_unidad_consumo').value = asignacion.id_unidad;
        document.getElementById('id_conductor').value = asignacion.id_conductor;
        document.getElementById('placa_consumo').value = asignacion.placa;
        document.getElementById('nombre_conductor_consumo').value = asignacion.nombre_completo;
        document.getElementById('kilometraje_anterior').value = asignacion.kilometraje_actual;

    } catch (error) {
        console.error('Error al cargar asignación:', error);
        await mostrarDialogo('Error al cargar información de la unidad asignada');
    }
}

async function cargarUltimoKilometraje(id_unidad) {
    try {
        const res = await fetch(`http://localhost:3000/consumos/ultimo-kilometraje/${id_unidad}`);

        if (res.ok) {
            const data = await res.json();
            document.getElementById('kilometraje_anterior').value = data.ultimo_kilometraje || 0;
        } else {
            // Si no hay registros previos, usar 0
            document.getElementById('kilometraje_anterior').value = 0;
        }
    } catch (error) {
        console.error('Error al cargar último kilometraje:', error);
        document.getElementById('kilometraje_anterior').value = 0;
    }
}

async function registrarConsumo(e) {
    e.preventDefault();

    const data = {
        id_unidad: parseInt(document.getElementById('id_unidad_consumo').value),
        id_conductor: parseInt(document.getElementById('id_conductor').value),
        fecha_consumo: document.getElementById('fecha_consumo').value,
        kilometraje_anterior: parseFloat(document.getElementById('kilometraje_anterior').value),
        kilometraje_actual: parseFloat(document.getElementById('kilometraje_actual').value),
        litros_cargados: parseFloat(document.getElementById('litros_cargados').value),
        costo_total: parseFloat(document.getElementById('costo_total').value),
        tipo_combustible: parseInt(document.getElementById('tipo_combustible').value),
        nombre_estacion: document.getElementById('nombre_estacion').value,
        direccion_estacion: document.getElementById('direccion_estacion').value
    };

    // Validaciones adicionales
    if (data.kilometraje_actual <= data.kilometraje_anterior) {
        await mostrarDialogo('El kilometraje actual debe ser mayor al anterior');
        return;
    }

    if (data.litros_cargados <= 0 || data.precio_por_litro <= 0) {
        await mostrarDialogo('Los litros y el precio deben ser mayores a cero');
        return;
    }

    // Calcular y mostrar costo total antes de confirmar
    const confirmar = await mostrarDialogoConfirmacion(
        `¿Está seguro de registrar este consumo?\n\nCosto total: Q${costo_total.value}`
    );

    if (!confirmar) {
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/consumos/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            await mostrarDialogo(result.msg || 'Consumo registrado correctamente');
            document.getElementById('formConsumo').reset();
            document.getElementById('registrarConsumo').close();
            await obtenerConsumosPorUsuario();
        } else {
            await mostrarDialogo('Error: ' + (result.msg || 'No se pudo registrar el consumo'));
        }
    } catch (error) {
        console.error('Error al registrar consumo:', error);
        await mostrarDialogo('Error al registrar consumo. Por favor intente nuevamente.');
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

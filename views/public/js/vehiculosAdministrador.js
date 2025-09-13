document.addEventListener('DOMContentLoaded', () => {
    const tabla = document.querySelector('#tablaVehiculos tbody');
    const form = document.querySelector('#formVehiculo');
    const cancelarBtn = document.getElementById('cancelarEdicion');

    const inputId = document.getElementById('id_unidad');
    const inputPlaca = document.getElementById('placa');
    const inputMarca = document.getElementById('marca');
    const inputModelo = document.getElementById('modelo');
    const inputAnio = document.getElementById('anio');
    const inputKilometraje = document.getElementById('kilometraje');
    const inputFecha = document.getElementById('fecha_adquisicion');
    const inputTipo = document.getElementById('tipoUnidad');
    const inputEstado = document.getElementById('estado_vehiculo');

    const urlBase = 'http://localhost:3000/vehiculos';

    const limpiarFormulario = () => {
        form.reset();
        inputId.value = '';
        cancelarBtn.style.display = 'none';
        inputEstado.style.display = 'none';
    };

    const llenarFormulario = (vehiculo) => {
        inputId.value = vehiculo.id_unidad;
        inputPlaca.value = vehiculo.placa;
        inputMarca.value = vehiculo.marca;
        inputModelo.value = vehiculo.modelo;
        inputAnio.value = vehiculo.anio;
        inputKilometraje.value = vehiculo.kilometraje;
        inputFecha.value = vehiculo.fecha_adquisicion.split('T')[0];
        inputTipo.value = vehiculo.tipoUnidad;
        inputEstado.value = vehiculo.estado;
        inputEstado.style.display = 'inline-block';
        cancelarBtn.style.display = 'inline-block';
    };

    const renderizarTabla = (vehiculos) => {
        tabla.innerHTML = '';
        vehiculos.forEach(vehiculo => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${vehiculo.id_unidad}</td>
                <td>${vehiculo.placa}</td>
                <td>${vehiculo.marca}</td>
                <td>${vehiculo.modelo}</td>
                <td>${vehiculo.anio}</td>
                <td>${vehiculo.kilometraje}</td>
                <td>${vehiculo.fecha_adquisicion.split('T')[0]}</td>
                <td>${vehiculo.tipoUnidad}</td>
                <td>${vehiculo.estado}</td>
                <td>
                    <button onclick="editarVehiculo(${vehiculo.id_unidad})">Editar</button>
                    <button onclick="eliminarVehiculo(${vehiculo.id_unidad})">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    };

    const obtenerVehiculos = async () => {
        try {
            const res = await fetch(urlBase);
            const data = await res.json();
            renderizarTabla(data);
        } catch (err) {
            console.error('Error al obtener vehículos:', err);
        }
    };

    window.editarVehiculo = async (id) => {
        try {
            const res = await fetch(`${urlBase}/${id}`);
            const vehiculo = await res.json();
            llenarFormulario(vehiculo);
        } catch (err) {
            console.error('Error al obtener vehículo:', err);
        }
    };

    window.eliminarVehiculo = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;
        try {
            const res = await fetch(`${urlBase}/${id}`, { method: 'DELETE' });
            const data = await res.json();
            alert(data.msg);
            await obtenerVehiculos();
        } catch (err) {
            console.error('Error al eliminar vehículo:', err);
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const vehiculo = {
            placa: inputPlaca.value,
            marca: inputMarca.value,
            modelo: inputModelo.value,
            anio: parseInt(inputAnio.value),
            estado: inputEstado.value,
            kilometraje: parseInt(inputKilometraje.value),
            fecha_adquisicion: inputFecha.value,
            tipoUnidad: inputTipo.value
        };

        const id = inputId.value;

        if (id) {
            vehiculo.estado = inputEstado.value;
        }

        try {
            const res = await fetch(`${urlBase}${id ? `/${id}` : ''}`, {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehiculo)
            });

            const data = await res.json();

            if (res.ok) {
                alert(id ? 'Vehículo actualizado' : 'Vehículo registrado');
                limpiarFormulario();
                await obtenerVehiculos();
            } else {
                alert(data.error || data.msg || 'Error en la operación');
            }
        } catch (err) {
            console.error('Error al guardar vehículo:', err);
        }
    });

    cancelarBtn.addEventListener('click', limpiarFormulario);

    obtenerVehiculos();
});

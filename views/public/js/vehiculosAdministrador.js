document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#formVehiculo');
    const tabla = document.querySelector('#tablaVehiculos tbody');

    const apiUrl = 'http://localhost:3000/vehiculos';

    obtenerVehiculos()

    function formatearFechaDate(fecha) {
        const d = new Date(fecha).getDate();

        const year = new Date(fecha).getFullYear();
        const month = (new Date(fecha).getMonth() + 1).toString().padStart(2, '0');
        const day = (new Date(fecha).getDate() + 1).toString().padStart(2, '0');

        // new Date(conductor.fecha_ingreso).getDate() + 1).toString().padStart(2, '0')}-${(new Date(conductor.fecha_ingreso).getMonth() + 1).toString().padStart(2, '0')}-${new Date(conductor.fecha_ingreso).getFullYear()

        return `${year}-${month}-${day}`;
    }


    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('id_unidad').value;
        const datos = {
            placa: document.getElementById('placa').value.toUpperCase(),
            marca: document.getElementById('marca').value,
            modelo: document.getElementById('modelo').value,
            anio: parseInt(document.getElementById('anio').value),
            kilometraje: parseInt(document.getElementById('kilometraje').value),
            estado: document.getElementById('estado_vehiculo').value,
            fecha_adquisicion: formatearFechaDate(document.getElementById('fecha_adquisicion').value),
            tipoUnidad: document.getElementById('tipoUnidad').value
        }

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
            document.getElementById('id_unidad').value = '';
            obtenerVehiculos();
        } catch (err) {
            console.error('Error al guardar vehículo:', err);
        }
    })

    async function obtenerVehiculos() {
        try {
            const res = await fetch(apiUrl);
            const vehiculos = await res.json();

            tabla.innerHTML = '';

            vehiculos.forEach(vehiculo => {
                const tr = document.createElement('tr')
                tr.innerHTML = `
                    <td>${vehiculo.id_unidad}</td>
                    <td>${vehiculo.placa}</td>
                    <td>${vehiculo.marca}</td>
                    <td>${vehiculo.modelo}</td>
                    <td>${vehiculo.anio}</td>
                    <td>${vehiculo.kilometraje}</td>
                    <td>${vehiculo.fecha_adquisicion}</td>
                    <td>${vehiculo.tipoUnidad}</td>
                    <td>${vehiculo.estado}</td>
                    <td>
                        <button class="editar-vehiculo" data-id="${vehiculo.id_unidad}">Editar</button>
                        <button class="eliminar-vehiculo" data-id="${vehiculo.id_unidad}">Eliminar</button>
                    </td>`
                tabla.appendChild(tr)
            })

            agregarEventosAcciones();
        } catch (err) {
            console.error('Error al obtener vehículos:', err)
        }
    }

    function agregarEventosAcciones() {
        document.querySelectorAll('.editar-vehiculo').forEach(btn => {
            btn.addEventListener('click', async (a) => {
                const id = a.target.dataset.id;
                try {
                    const res = await fetch(`${apiUrl}/${id}`);
                    const vehiculo = await res.json();

                    document.getElementById('id_unidad').value = vehiculo.id_unidad;
                    document.getElementById('placa').value = vehiculo.placa;
                    document.getElementById('marca').value = vehiculo.marca;
                    document.getElementById('modelo').value = vehiculo.modelo;
                    document.getElementById('anio').value = vehiculo.anio;
                    document.getElementById('kilometraje').value = vehiculo.kilometraje;
                    document.getElementById('fecha_adquisicion').value = formatearFechaDate(vehiculo.fecha_adquisicion);
                    document.getElementById('tipoUnidad').value = vehiculo.tipoUnidad;
                    document.getElementById('estado_vehiculo').value = vehiculo.estado;
                } catch (err) {
                    console.error('Error al cargar vehículo para editar:', err);
                }
            });
        });

        document.querySelectorAll('.eliminar-vehiculo').forEach(boton => {
            boton.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (confirm('¿Estás seguro de eliminar este vehículo?')) {
                    try {
                        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
                        obtenerVehiculos();
                    } catch (err) {
                        console.error('Error al eliminar vehículo:', err);
                    }
                }
            });
        });
    }
});             
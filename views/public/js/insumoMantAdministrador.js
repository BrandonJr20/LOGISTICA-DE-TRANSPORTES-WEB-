document.addEventListener('DOMContentLoaded', () => {
    obtenerMantenimientosActivos()
    obtenerHistorial()

    document.getElementById('btnAgregarInsumo').addEventListener('click', agregarFilaInsumo);

    // Event listener para el formulario
    document.getElementById('formAsignarInsumos').addEventListener('submit', asignarInsumos);
})
let productosDisponibles = [];
let contadorFilas = 0;

async function obtenerMantenimientosActivos() {
    const res = await fetch('http://localhost:3000/insumoMantenimiento/mantenimientos')
    const mantenimientos = await res.json()
    const select = document.getElementById('id_mantenimiento_insumo')
    console.log(mantenimientos)
    select.innerHTML = `<option value ="">Seleccione </option>`
    mantenimientos.forEach(mantenimiento => {
        const option = document.createElement('option')
        option.value = mantenimiento.id_mantenimiento
        option.textContent = mantenimiento.placa
        select.appendChild(option)
    });
}

async function obtenerProductos(selectElement) {
    const res = await fetch('http://localhost:3000/insumoMantenimiento/productos') 
    const productos = await res.json()

    selectElement.innerHTML = `<option value ="">Seleccione </option>`
    productos.forEach(producto => {
        const option = document.createElement('option')
        option.value = producto.id_insumo
        option.textContent = producto.nombre_insumo
        option.dataset.stock = producto.stock_actual // 🔹 guardamos stock
        selectElement.appendChild(option)
    });
}

async function obtenerHistorial(){
    const res = await fetch('http://localhost:3000/insumoMantenimiento/insumosHistorial')
    const historial = await res.json()
    const tbody = document. querySelector('#tablaInsumosMantenimiento tbody')
    tbody.innerHTML = ''
    if(historial.length === 0){
        const row = document.createElement('tr')
        row.innerHTML = `
            <td colspan='7'>No hay elementos </td>
        `
        tbody.appendChild(row)
    }else{
        historial.forEach(movimiento => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
                <td>${movimiento.id_mantenimiento}</td>
                <td>${movimiento.id_unidad}</td>
                <td>${movimiento.placa}</td>
                <td>${movimiento.unidad}</td>
                <td>${movimiento.txt_tipomantenimiento}</td>
                <td>${movimiento.id_insumo}</td>
                <td>${movimiento.nombre_insumo}</td>
                <td>${movimiento.tipo_producto}</td>
                <td>${movimiento.cantidad_usada}</td>
                <td>${movimiento.descripcion_mantenimiento}</td>
                <td>${movimiento.fecha_ini_mantenimiento}</td>
                <td>${movimiento.fecha_fin_mantenimiento}</td>
                <td>${movimiento.kilometraje}</td>
                <td>${movimiento.costo}</td>
                <td>${movimiento.estado_mantenimiento}</td>
            `
            tbody.appendChild(tr)
        })
    }
}

function agregarFilaInsumo() {
    const contenedor = document.getElementById('contenedor-insumos');
    const filaId = `fila-insumo-${contadorFilas++}`;
    
    const div = document.createElement('div');
    div.className = 'fila-insumo';
    div.id = filaId;
    div.innerHTML = `
        <div style="display: flex; gap: 10px; margin-bottom: 10px; align-items: flex-end;">
            <div style="flex: 2;">
                <label>Insumo:</label>
                <select class="select-insumo" required></select>
            </div>
            <div style="flex: 1;">
                <label>Cantidad:</label>
                <input type="number" class="input-cantidad" min="1" required>
            </div>
            <button type="button" class="btnEliminar" onclick="eliminarFilaInsumo('${filaId}')">
                Eliminar
            </button>
        </div>
    `;

    contenedor.appendChild(div);

    // Llenar el select recién creado
    const nuevoSelect = div.querySelector('.select-insumo');
    obtenerProductos(nuevoSelect);
}


function eliminarFilaInsumo(filaId) {
    const fila = document.getElementById(filaId);
    if (fila) {
        fila.remove();
    }
}

async function asignarInsumos(e) {
    e.preventDefault();
    
    const id_mantenimiento = document.getElementById('id_mantenimiento_insumo').value;
    
    if (!id_mantenimiento) {
        alert('Por favor seleccione un mantenimiento');
        return;
    }

    // Recolectar insumos de las filas dinámicas
    const filasInsumos = document.querySelectorAll('.fila-insumo');
    const insumos = [];
    
    // Validar que hay al menos un insumo
    if (filasInsumos.length === 0) {
        alert('Por favor agregue al menos un insumo');
        return;
    }

    // Validar y recolectar datos
    let validacionExitosa = true;
    filasInsumos.forEach((fila, index) => {
        const selectInsumo = fila.querySelector('.select-insumo');
        const inputCantidad = fila.querySelector('.input-cantidad');
        
        const id_insumo = selectInsumo.value;
        const cantidad_usada = parseInt(inputCantidad.value);
        
        if (!id_insumo || !cantidad_usada || cantidad_usada <= 0) {
            alert(`Fila ${index + 1}: Complete todos los campos correctamente`);
            validacionExitosa = false;
            return;
        }
        
        // Validar stock disponible
        const stockDisponible = parseInt(selectInsumo.options[selectInsumo.selectedIndex].dataset.stock);
        if (cantidad_usada > stockDisponible) {
            alert(`Fila ${index + 1}: Stock insuficiente. Disponible: ${stockDisponible}`);
            validacionExitosa = false;
            return;
        }
        
        insumos.push({
            id_insumo: parseInt(id_insumo),
            cantidad_usada: cantidad_usada
        });
    });

    if (!validacionExitosa) {
        return;
    }

    // Pedir nombre del responsable
    if (!responsable || responsable.trim() === '') {
        alert('El nombre del responsable es obligatorio');
        return;
    }

    // Preparar datos
    const data = {
        id_mantenimiento: parseInt(id_mantenimiento),
        insumos: insumos,
        responsable: responsable.trim()
    };

    console.log('Datos a enviar:', data);

    try {
        const res = await fetch('http://localhost:3000/insumoMantenimiento/asignarInsumos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            alert(result.msg || 'Insumos asignados correctamente');
            
            // Limpiar formulario
            document.getElementById('formAsignarInsumos').reset();
            document.getElementById('contenedor-insumos').innerHTML = '';
            contadorFilas = 0;
            
            // Actualizar datos
            await obtenerHistorial();
        } else {
            alert('Error: ' + (result.msg || 'No se pudieron asignar los insumos'));
        }
    } catch (error) {
        console.error('Error al asignar insumos:', error);
        alert('Error al asignar insumos. Por favor intente nuevamente.');
    }
}

// Exponer función globalmente para el onclick del botón eliminar
window.eliminarFilaInsumo = eliminarFilaInsumo;

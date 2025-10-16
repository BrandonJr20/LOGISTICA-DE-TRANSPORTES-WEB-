document.addEventListener('DOMContentLoaded', () => {
    // llamamos a todos las funciones que cargan los datos al iniciar
    obtenerMovimientos()
    cargarProductos()
    alertasStockBajo()

    document.getElementById('responsable_movimiento').value = responsable
    console.log(responsable)
    document.getElementById('formMovimientoInventario').addEventListener('submit', agregarMovimiento)
})

const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
const responsable = usuario.nombre_usuario

async function obtenerMovimientos() {
    const res = await fetch('http://localhost:3000/movimientos/historial')
    const data = await res.json()
    const tbody = document.querySelector('#tablaMovimientos tbody')
    tbody.innerHTML = ''
    if (data.length === 0) {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td colspan="7">No hay movimientos registrados</td>
        `
        tbody.appendChild(row)
    } else {
        data.forEach(movimiento => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
            <td>${movimiento.id_insumo}</td>
            <td>${movimiento.nombre_insumo}</td>
            <td>${movimiento.tipo_movimiento}</td>
            <td>${movimiento.cantidad}</td>
            <td>${movimiento.fecha}</td>
            <td>${movimiento.descripcion}</td>
            <td>${movimiento.responsable}</td>
        `
            tbody.appendChild(tr)
        })
    }
}

async function cargarProductos() {
    const res = await fetch('http://localhost:3000/movimientos/productos')
    const productos = await res.json()
    const select = document.getElementById('producto_movimiento')
    select.innerHTML = '<option value="">Seleccione</option>'
    productos.forEach(producto => {
        const option = document.createElement('option')
        option.value = producto.id_insumo
        option.textContent = producto.nombre_insumo
        select.appendChild(option)
    })
}

async function agregarMovimiento(e) {
    e.preventDefault();

    const data = {
        id_insumo: document.getElementById('producto_movimiento').value,
        // tipo_movimiento: document.getElementById('tipo_movimiento').value,
        cantidad: document.getElementById('cantidad_movimiento').value,
        // fecha: Date.now(),
        descripcion: document.getElementById('descripcion_movimiento').value,
        responsable: document.getElementById('responsable_movimiento').value.trim()
    };

    console.log(data);

    // // Validar stock en salidas
    // if (data.tipo_movimiento === 'Salida') {
    //     const stockActual = await obtenerStockActual(data.id_insumo);
    //     if (parseInt(data.cantidad) > stockActual) {
    //         alert('No hay suficiente stock para realizar la salida');
    //         return;
    //     }
    // }

    // Determinar la URL según el tipo de movimiento 
    let url;
    const tipoMovimiento = document.getElementById('tipo_movimiento').value
    console.log(tipoMovimiento)
    if (tipoMovimiento === 'SALIDA') {
        url = 'http://localhost:3000/movimientos/salidas'
    } else {
        url = 'http://localhost:3000/movimientos/entradas'
    };

    console.log('URL de la solicitud:', url);

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.msg);
    if (result.success) {
        document.getElementById('formMovimientoInventario').reset();
        document.getElementById('responsable_movimiento').value = responsable
        obtenerMovimientos();
        cargarProductos();
    }
}

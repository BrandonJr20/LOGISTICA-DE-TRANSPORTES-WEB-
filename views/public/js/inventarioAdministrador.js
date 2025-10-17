document.addEventListener('DOMContentLoaded', () => {
    // llamamos a todos las funciones que cargan los datos al iniciar\
    obtenerInventario()
    cargarTiposProducto()
    alertasStockBajo()
    document.getElementById('formInventarios').addEventListener('submit', agregarProducto)
})


// Se define las funciones que se van a ejecutar al iniciar la pagina
async function obtenerInventario() {
    const res = await fetch('http://localhost:3000/inventario/consultar')
    const data = await res.json()
    const tbody = document.querySelector('#tablaInventario tbody')
    tbody.innerHTML = ''
    data.forEach(item => {
        const row = document.createElement('tr')
        row.innerHTML = `
                <td>${item.id_insumo}</td>
                <td>${item.nombre_insumo}</td>
                <td>${item.tipo}</td>
                <td>${item.descripion}</td>
                <td>${item.stock_actual}</td>
                <td>${item.stock_minimo}</td>
                <td>${item.costo !== null ? `Q${parseFloat(item.costo).toFixed(2)}` : '—'}</td>
                <td>${item.costo !== null ? `Q${parseFloat(item.costo).toFixed(2)}` : '—'}</td>
                <td>${item.proveedor}</td>
                <td>${item.estado ? 'Activo' : 'Inactivo'}</td>
            `
        tbody.appendChild(row)
    })
}

async function cargarTiposProducto() {
    const res = await fetch('http://localhost:3000/inventario/tipos-producto')
    const tipos = await res.json()
    const select = document.getElementById('tipo_producto')
    select.innerHTML = '<option value="">Seleccione</option>'
    tipos.forEach(t => {
        const option = document.createElement('option')
        option.value = t.id_tipoproducto
        option.textContent = t.descripcion
        select.appendChild(option)
    })
}

async function alertasStockBajo() {
    const res = await fetch('http://localhost:3000/inventario/alertas-stock-bajo')
    const data = await res.json()
    const tbody = document.querySelector('#tablaAlertasStock tbody')
    tbody.innerHTML = ''
    if (data.length === 0) {
        const row = document.createElement('tr')
        row.innerHTML = `
                <td colspan="7">No hay alertas de stock bajo</td>
            `
        tbody.appendChild(row)
    } else {
        data.forEach(item => {
            const row = document.createElement('tr')
            row.innerHTML = `
                <!-- <td>${item.id_insumo}</td> -->
                <td>${item.nombre_insumo}</td>
                <td>${item.stock_actual}</td>
                <td>${item.stock_minimo}</td>
                <td>${item.diferencia}</td>
                <td>${item.proveedor}</td>
                <td>${item.tipo_producto}</td>
            `
            tbody.appendChild(row)
        })
    }
}

async function agregarProducto(e) {
    e.preventDefault()

    const data = {
        nombre_insumo: document.getElementById('nombre_insumo').value,
        tipo: parseInt(document.getElementById('tipo_producto').value),
        descripcion: document.getElementById('descripcion_producto').value,
        stock_actual: parseInt(document.getElementById('stock_actual').value),
        stock_minimo: parseInt(document.getElementById('stock_minimo').value),
        proveedor: document.getElementById('proveedor').value,
        costo: parseFloat(document.getElementById('costo').value)
    }

    if (await mostrarDialogoConfirmacion('¿Estás seguro de agregar este producto?')) {
        await mostrarDialogo('Producto agregado')
        const res = await fetch('http://localhost:3000/inventario/producto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    } else {
        await mostrarDialogo('Producto no agregado')
    }

    const result = await res.json()
    if (result.success) {
        document.getElementById('formInventarios').reset()
        obtenerInventario()
        obtenerMantenimientosActivos()
        alertasStockBajo()
    }
}
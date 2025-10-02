document.addEventListener('DOMContentLoaded', () => {
  obtenerUnidades();
  obtenerTiposMantenimiento();
  obtenerHistorial();

  document.getElementById('formAsignarMantenimiento').addEventListener('submit', asignarMantenimiento);
  document.getElementById('formFinalizarMantenimiento').addEventListener('submit', finalizarMantenimiento);
});

async function obtenerUnidades() {
  const unidadesRes = await fetch('http://localhost:3000/vehiculos/');
  const unidades = await unidadesRes.json();
  const selectAsignar = document.getElementById('id_unidad_mantenimiento');
  selectAsignar.innerHTML = '<option value="">Seleccione</option>';
  unidades.forEach(unidad => {
    selectAsignar.innerHTML += `<option value="${unidad.id_unidad}">${unidad.placa}</option>`;
  });

  const activosRes = await fetch('http://localhost:3000/mantenimientos/activos/');
  const activos = await activosRes.json();
  const selectFinalizar = document.getElementById('id_unidad_finalizar');
  if (Array.isArray(activos) && activos.length > 0) {
    selectFinalizar.innerHTML = '<option value="">Seleccione</option>';
    activos.forEach(unidad => {
      selectFinalizar.innerHTML += `<option value="${unidad.id_unidad}">${unidad.placa}</option>`;
    });
  } else {
    selectFinalizar.innerHTML += `<option value="">No hay unidades en mantenimiento</option>`;
  }
}

async function obtenerTiposMantenimiento() {
  const res = await fetch('http://localhost:3000/mantenimientos/tipos/');
  const tipos = await res.json();
  const select = document.getElementById('id_tipomantenimiento');
  select.innerHTML = '<option value="">Seleccione</option>';
  tipos.forEach(tipo => {
    select.innerHTML += `<option value="${tipo.id_tipomantenimiento}">${tipo.txt_tipomantenimiento}</option>`;
  });
}

async function asignarMantenimiento(e) {
  e.preventDefault();
  const data = {
    id_unidad: parseInt(document.getElementById('id_unidad_mantenimiento').value),
    id_tipomantenimiento: parseInt(document.getElementById('id_tipomantenimiento').value),
    descripcion: document.getElementById('descripcion').value,
    kilometraje: parseInt(document.getElementById('kilometraje_mantenimiento').value)
  };

  console.log(data)
  const res = await fetch('http://localhost:3000/mantenimientos/asignar/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.msg);
  if (result.success) {
    document.getElementById('formAsignarMantenimiento').reset();
    obtenerHistorial();
  }
}

async function finalizarMantenimiento(e) {
  e.preventDefault();
  const data = {
    id_unidad: parseInt(document.getElementById('id_unidad_finalizar').value),
    costo: parseFloat(document.getElementById('costo').value)
  };

  const res = await fetch('http://localhost:3000/mantenimientos/finalizar/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.msg);
  if (result.success) {
    document.getElementById('formFinalizarMantenimiento').reset();
    obtenerHistorial();
  }
}

async function obtenerHistorial() {
  try {
    const res = await fetch('http://localhost:3000/mantenimientos/historial');
    const data = await res.json();

    const tbody = document.querySelector('#tablaHistorial_Mant tbody');
    tbody.innerHTML = '';
    console.log(data);
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.unidad || '—'}</td>
        <td>${row.txt_tipomantenimiento || '—'}</td>
        <td>${row.descripcion || '—'}</td>
        <td>${row.kilometraje ? `${row.kilometraje} km` : '—'}</td>
        <td>${row.fecha_ini_mantenimiento ? new Date(row.fecha_ini_mantenimiento).toLocaleString() : '—'}</td>
        <td>${row.fecha_fin_mantenimiento ? new Date(row.fecha_fin_mantenimiento).toLocaleString() : '—'}</td>
        <td>${row.costo !== null ? `Q${parseFloat(row.costo).toFixed(2)}` : '—'}</td>
        <td>${row.Id_insumos || '—'}</td>
        <td>${row.Descripcion_insumos || '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error al obtener el historial de mantenimientos:', error);
  }
}




function formatearFechaDate(fecha) {
    const d = new Date(fecha).getDate();

    const year = new Date(fecha).getFullYear();
    const month = (new Date(fecha).getMonth() + 1).toString().padStart(2, '0');
    const day = (new Date(fecha).getDate() + 1).toString().padStart(2, '0');

    // new Date(conductor.fecha_ingreso).getDate() + 1).toString().padStart(2, '0')}-${(new Date(conductor.fecha_ingreso).getMonth() + 1).toString().padStart(2, '0')}-${new Date(conductor.fecha_ingreso).getFullYear()

    return `${year}-${month}-${day}`;
}
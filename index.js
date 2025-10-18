require('dotenv').config();
const db = require('./database/config');
const cors = require('cors');
const express = require('express');
const path = require('path'); 
const app = express();

// hostgator

// Routes
const usuariosRoutes = require('./routes/usuariosRoutes');
const conductoresRoutes = require('./routes/conductoresRoute');
const vehiculosRoutes = require('./routes/vehiculosRoutes');
const asignacionesRoutes = require('./routes/asignacionesRoutes');
const mantenimientosRoutes = require('./routes/mantenimientosRoutes');
const ejemploRoutes = require('./routes/ejemploRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes')
const movimientoRoutes = require('./routes/movimientoRoutes') 
const insumoMantenimientoRoutes = require('./routes/insumoMantRoutes')
const authRoutes = require('./routes/authRoutes');
const informacionRoutes = require('./routes/informacionRoutes');
const entregaRoutes = require('./routes/entregasRoutes')
const consumosRoutes = require('./routes/consumosRoutes')

// Middleware
app.use(express.json());
app.use(cors());

// Servir archivos estáticos
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(path.join(__dirname, 'views/public')));

// Database connection
db.connect();

// Routes setup
app.use('/usuarios', usuariosRoutes);
app.use('/conductores', conductoresRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/asignaciones', asignacionesRoutes);
app.use('/mantenimientos', mantenimientosRoutes);
app.use('/ejemplos', ejemploRoutes);
app.use('/inventario', inventarioRoutes);
app.use('/movimientos', movimientoRoutes);
app.use('/insumoMantenimiento', insumoMantenimientoRoutes)
app.use('/login', authRoutes);
app.use('/informacion', informacionRoutes);
app.use('/entregas', entregaRoutes)
app.use('/consumos', consumosRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
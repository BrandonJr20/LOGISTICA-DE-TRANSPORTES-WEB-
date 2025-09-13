const { connect } = require('http2')
const sql = require('mssql')
require('dotenv').config()

const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, //Azure, no voy a trabajar sobre azure
        trustServerCertificate: true // Para desarrollo local
    }
}

module.exports = {
    connect: async () => {
        try {
            await sql.connect(dbSettings)
            console.log('Conexion establecida a SQL Server')
        } catch (error) {
            console.error('Error al intentar conectar a SQL Server', error)
        }
    },
    sql: sql // Exportar el objeto sql para usarlo en otros módulos
}
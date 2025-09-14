# 🚛 LOGÍSTICA DE TRANSPORTES WEB

**Proyecto de graduación orientado a la logística de operaciones y control administrativo de unidades de transporte, conductores, mantenimientos y bonificaciones.**

![Versión](https://img.shields.io/badge/versión-1.0.0-blue.svg)
![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow.svg)
![Licencia](https://img.shields.io/badge/licencia-MIT-green.svg)

---

## Descripción

Sistema web integral para la gestión de operaciones logísticas de transporte, que permite el control y administración de:

- **Conductores y usuarios**
- **Flota vehicular**
- **Mantenimientos programados**
- **Asignaciones y rutas**
- **Bonificaciones y pagos**
- **Sistema de autenticación por roles**

## Características Principales

- **Autenticación segura** con JWT y bcrypt
- **Roles diferenciados** (Administrador/Conductor)
- **Interfaz responsive** con CSS personalizado
- **API RESTful** con Express.js
- **Base de datos SQL Server** con stored procedures
- **Gestión de estados** (conectado/desconectado)
- **Validación de datos** en frontend y backend

## Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **SQL Server** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas

### Frontend
- **HTML5/CSS3/JavaScript** - Tecnologías web estándar
- **CSS Grid/Flexbox** - Layout responsive
- **Fetch API** - Comunicación con el backend
- **Local Storage** - Almacenamiento temporal

## Dependencias

```json
Ejecuta:
    npm install bcrypt bcryptjs body-parser cors dotenv ejs express express-session express-validator jsonwebtoken mssql mysql mysql2 nodemon


{
  "dependencies": {
    "bcrypt": "^6.0.0",
    "bcryptjs": "^3.0.2",
    "body-parser": "^2.2.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "express-session": "^1.18.2",
    "express-validator": "^7.2.1",
    "jsonwebtoken": "^9.0.2",
    "mssql": "^11.0.1",
    "mysql": "^2.18.1",
    "mysql2": "^3.14.5",
    "nodemon": "^3.1.10"
  }
}
```

## Estructura del Proyecto

```
LOGISTICA-DE-TRANSPORTES-WEB/
├── 📁 controllers/          # Controladores de la API
│   ├── authController.js    # Autenticación
│   ├── usuariosController.js
│   ├── conductoresController.js
│   ├── vehiculosController.js
│   └── mantenimientosController.js
├── 📁 models/              # Modelos de datos
│   ├── authModel.js
│   ├── usuariosModel.js
│   └── ...
├── 📁 routes/              # Rutas de la API
│   ├── authRoutes.js
│   ├── usuariosRoutes.js
│   └── ...
├── 📁 middleware/          # Middlewares
│   └── auth.js            # Verificación de tokens
├── 📁 database/           # Configuración de BD
│   └── config.js
├── 📁 views/              # Frontend
│   ├── index.html         # Página de login
│   ├── admin.html         # Panel administrador
│   ├── conductor.html     # Panel conductor
│   └── 📁 public/
│       ├── 📁 css/
│       │   ├── login.css
│       │   └── admin.css
│       └── 📁 js/
│           ├── login.js
│           └── administradoresViews.js
├── 📄 .env                # Variables de entorno
├── 📄 index.js            # Servidor principal
└── 📄 README.md
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- SQL Server
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/LOGISTICA-DE-TRANSPORTES-WEB.git
cd LOGISTICA-DE-TRANSPORTES-WEB
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_SERVER=tu_servidor
DB_NAME=proyecto
PORT=3000
SECRET_KEY=tu_clave_secreta_jwt
```

### 4. Configurar base de datos
Ejecutar los siguientes stored procedures en SQL Server:

```sql
-- -- -- Creacio de tablas 
-- Crear tabla usuarios
USE [proyecto]
GO

/****** Object:  Table [dbo].[Usuarios]    Script Date: 13/09/2025 19:50:52 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Usuarios](
	[id_usuario] [int] IDENTITY(1,1) NOT NULL,
	[nombre_usuario] [varchar](50) NOT NULL,
	[correo] [varchar](100) NOT NULL,
	[contrasena] [varchar](255) NOT NULL,
	[rol] [varchar](20) NOT NULL,
	[estado] [bit] NOT NULL,
	[activo] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_usuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[correo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Usuarios] ADD  DEFAULT ((1)) FOR [estado]
GO

ALTER TABLE [dbo].[Usuarios] ADD  DEFAULT ((0)) FOR [activo]
GO

ALTER TABLE [dbo].[Usuarios]  WITH CHECK ADD  CONSTRAINT [CK_Usuarios_Rol] CHECK  (([rol]='conductor' OR [rol]='admin'))
GO

ALTER TABLE [dbo].[Usuarios] CHECK CONSTRAINT [CK_Usuarios_Rol]
GO

-- Crear tabla conductores
USE [proyecto]
GO

/****** Object:  Table [dbo].[Conductores]    Script Date: 13/09/2025 19:52:02 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Conductores](
	[id_conductor] [int] IDENTITY(1,1) NOT NULL,
	[id_usuario] [int] NOT NULL,
	[nombre_completo] [varchar](100) NOT NULL,
	[dui] [varchar](20) NOT NULL,
	[licencia] [varchar](30) NULL,
	[telefono] [varchar](20) NULL,
	[direccion] [text] NULL,
	[fecha_ingreso] [date] NULL,
	[estado] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id_conductor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[dui] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Conductores] ADD  CONSTRAINT [DF_Conductores_estado]  DEFAULT ((1)) FOR [estado]
GO

ALTER TABLE [dbo].[Conductores]  WITH CHECK ADD FOREIGN KEY([id_usuario])
REFERENCES [dbo].[Usuarios] ([id_usuario])
GO

-- Crear tabla unidades
USE [proyecto]
GO

/****** Object:  Table [dbo].[Unidades]    Script Date: 13/09/2025 19:53:20 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Unidades](
	[id_unidad] [int] IDENTITY(1,1) NOT NULL,
	[placa] [varchar](20) NOT NULL,
	[marca] [varchar](50) NULL,
	[modelo] [varchar](50) NULL,
	[anio] [int] NULL,
	[estado] [varchar](30) NOT NULL,
	[kilometraje] [int] NULL,
	[fecha_adquisicion] [date] NULL,
	[tipoUnidad] [char](1) NULL,
PRIMARY KEY CLUSTERED 
(
	[id_unidad] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[placa] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Unidades]  WITH CHECK ADD  CONSTRAINT [FK_Unidades_TipoUnidad] FOREIGN KEY([tipoUnidad])
REFERENCES [dbo].[TipoUnidad] ([id_tipoUnidad])
GO

ALTER TABLE [dbo].[Unidades] CHECK CONSTRAINT [FK_Unidades_TipoUnidad]
GO

ALTER TABLE [dbo].[Unidades]  WITH CHECK ADD CHECK  (([estado]='fuera_servicio' OR [estado]='en_mantenimiento' OR [estado]='operativo'))
GO

-- Crear tabla tipo unidad
USE [proyecto]
GO

/****** Object:  Table [dbo].[TipoUnidad]    Script Date: 13/09/2025 19:53:59 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TipoUnidad](
	[id_tipoUnidad] [char](1) NOT NULL,
	[txt_tipoUnidad] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id_tipoUnidad] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Crear tabla tipomantenimiento
USE [proyecto]
GO

/****** Object:  Table [dbo].[tipoMantenimiento]    Script Date: 13/09/2025 19:54:31 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tipoMantenimiento](
	[id_tipomantenimiento] [int] IDENTITY(1,1) NOT NULL,
	[txt_tipomantenimiento] [varchar](20) NULL,
	[cantidadKilometros] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_tipomantenimiento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Crear tabla mantenimientoinsumos
USE [proyecto]
GO

/****** Object:  Table [dbo].[Mantenimiento_Insumos]    Script Date: 13/09/2025 19:55:08 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Mantenimiento_Insumos](
	[id_mantenimiento] [int] NOT NULL,
	[id_insumo] [int] NOT NULL,
	[cantidad_usada] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_mantenimiento] ASC,
	[id_insumo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Mantenimiento_Insumos]  WITH CHECK ADD FOREIGN KEY([id_insumo])
REFERENCES [dbo].[Inventario] ([id_insumo])
GO

ALTER TABLE [dbo].[Mantenimiento_Insumos]  WITH CHECK ADD FOREIGN KEY([id_mantenimiento])
REFERENCES [dbo].[Mantenimientos] ([id_mantenimiento])
GO

-- Crear tabla mantenimientos
USE [proyecto]
GO

/****** Object:  Table [dbo].[Mantenimientos]    Script Date: 13/09/2025 19:55:40 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Mantenimientos](
	[id_mantenimiento] [int] IDENTITY(1,1) NOT NULL,
	[id_unidad] [int] NOT NULL,
	[id_tipomantenimiento] [int] NOT NULL,
	[descripcion] [text] NULL,
	[fecha_ini_mantenimiento] [date] NULL,
	[fecha_fin_mantenimiento] [date] NULL,
	[kilometraje] [int] NOT NULL,
	[costo] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_mantenimiento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Mantenimientos]  WITH CHECK ADD FOREIGN KEY([id_unidad])
REFERENCES [dbo].[Unidades] ([id_unidad])
GO

ALTER TABLE [dbo].[Mantenimientos]  WITH CHECK ADD  CONSTRAINT [FK_Mantenimientos_TipoMantenimiento] FOREIGN KEY([id_tipomantenimiento])
REFERENCES [dbo].[tipoMantenimiento] ([id_tipomantenimiento])
GO

ALTER TABLE [dbo].[Mantenimientos] CHECK CONSTRAINT [FK_Mantenimientos_TipoMantenimiento]
GO

-- Crear tabla reportes
USE [proyecto]
GO

/****** Object:  Table [dbo].[Reportes]    Script Date: 13/09/2025 19:56:11 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Reportes](
	[id_reporte] [int] IDENTITY(1,1) NOT NULL,
	[tipo_reporte] [varchar](100) NULL,
	[descripcion] [text] NULL,
	[fecha_generacion] [date] NULL,
	[datos_generales] [text] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_reporte] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-- Crear tabla inventario
USE [proyecto]
GO

/****** Object:  Table [dbo].[Inventario]    Script Date: 13/09/2025 19:56:24 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Inventario](
	[id_insumo] [int] IDENTITY(1,1) NOT NULL,
	[nombre_insumo] [varchar](100) NULL,
	[tipo] [varchar](20) NULL,
	[cantidad] [int] NULL,
	[unidad_medida] [varchar](20) NULL,
	[stock_minimo] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_insumo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Inventario]  WITH CHECK ADD CHECK  (([tipo]='otro' OR [tipo]='lubricante' OR [tipo]='pieza'))
GO

-- Crear tabla bonificaciones
USE [proyecto]
GO

/****** Object:  Table [dbo].[Bonificaciones]    Script Date: 13/09/2025 19:56:44 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Bonificaciones](
	[id_bonificacion] [int] IDENTITY(1,1) NOT NULL,
	[id_conductor] [int] NULL,
	[descripcion] [text] NULL,
	[monto] [decimal](10, 2) NULL,
	[fecha_asignacion] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_bonificacion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Bonificaciones]  WITH CHECK ADD FOREIGN KEY([id_conductor])
REFERENCES [dbo].[Conductores] ([id_conductor])
GO

-- Crear tabla asignaciones
USE [proyecto]
GO

/****** Object:  Table [dbo].[Asignaciones]    Script Date: 13/09/2025 19:56:54 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Asignaciones](
	[id_asignacion] [int] IDENTITY(1,1) NOT NULL,
	[id_conductor] [int] NOT NULL,
	[id_unidad] [int] NOT NULL,
	[fecha_inicio] [date] NOT NULL,
	[fecha_fin] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[id_asignacion] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Asignaciones]  WITH CHECK ADD FOREIGN KEY([id_conductor])
REFERENCES [dbo].[Conductores] ([id_conductor])
GO

ALTER TABLE [dbo].[Asignaciones]  WITH CHECK ADD FOREIGN KEY([id_unidad])
REFERENCES [dbo].[Unidades] ([id_unidad])
GO

-- Store Procedures necesarios
-- HistorialMantenimiento
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[obtenerHistorialMantenimiento]    Script Date: 13/09/2025 19:57:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[obtenerHistorialMantenimiento]
AS
BEGIN
    SELECT 
        m.id_mantenimiento,
        m.id_unidad,
        u.placa,
        u.marca + ' ' + u.modelo AS unidad,
        m.id_tipomantenimiento,
        t.txt_tipomantenimiento,
        m.descripcion,
        m.fecha_ini_mantenimiento,
        m.fecha_fin_mantenimiento,
        m.costo,
        m.kilometraje
    FROM 
        Mantenimientos m
    INNER JOIN 
        tipoMantenimiento t ON m.id_tipomantenimiento = t.id_tipomantenimiento
    INNER JOIN 
        Unidades u ON m.id_unidad = u.id_unidad
    ORDER BY 
        m.fecha_ini_mantenimiento DESC;
END;

-- ObtenerTiposMantenimientos
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[obtenerTiposMantenimiento]    Script Date: 13/09/2025 19:58:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[obtenerTiposMantenimiento]
AS
BEGIN
    SELECT 
        id_tipomantenimiento,
        txt_tipomantenimiento,
        cantidadKilometros
    FROM 
        tipoMantenimiento
    ORDER BY 
        txt_tipomantenimiento;
END;

-- ActualizarConductor
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ActualizarConductor]    Script Date: 13/09/2025 19:58:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ActualizarConductor]
    @id_conductor INT,
    @id_usuario INT,
    @nombre_completo VARCHAR(100),
    @dui VARCHAR(20),
    @licencia VARCHAR(30) = NULL,
    @telefono VARCHAR(20) = NULL,
    @direccion TEXT = NULL,
    @fecha_ingreso DATE = NULL,
    @estado BIT = NULL -- Si no se manda, no se actualiza
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar existencia del conductor
    IF NOT EXISTS (SELECT 1 FROM Conductores WHERE id_conductor = @id_conductor)
    BEGIN
        RAISERROR('El conductor no existe.', 16, 1);
        RETURN;
    END

    -- Validar existencia del usuario
    IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE id_usuario = @id_usuario)
    BEGIN
        RAISERROR('El usuario no existe.', 16, 1);
        RETURN;
    END

    -- Validar rol del usuario
    IF EXISTS (
        SELECT 1 FROM Usuarios WHERE id_usuario = @id_usuario AND rol <> 'conductor'
    )
    BEGIN
        RAISERROR('El usuario no tiene rol de conductor.', 16, 1);
        RETURN;
    END

    -- Validar que el nuevo id_usuario no esté asignado a otro conductor diferente
    IF EXISTS (
        SELECT 1 FROM Conductores 
        WHERE id_usuario = @id_usuario AND id_conductor <> @id_conductor
    )
    BEGIN
        RAISERROR('El usuario ya está asignado a otro conductor.', 16, 1);
        RETURN;
    END

    -- Actualizar conductor
    UPDATE Conductores
    SET 
        id_usuario = @id_usuario,
        nombre_completo = @nombre_completo,
        dui = @dui,
        licencia = @licencia,
        telefono = @telefono,
        direccion = @direccion,
        fecha_ingreso = ISNULL(@fecha_ingreso, fecha_ingreso),
        estado = COALESCE(@estado, estado)
    WHERE id_conductor = @id_conductor;

    PRINT 'Conductor actualizado correctamente.';
END;

-- ActualizarUnidad
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ActualizarUnidad]    Script Date: 13/09/2025 19:59:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ActualizarUnidad]
    @id_unidad INT,
    @placa VARCHAR(20),
    @marca VARCHAR(50),
    @modelo VARCHAR(50),
    @anio INT,
    @tipoUnidad CHAR(1),
    @estado VARCHAR(30),
    @kilometraje INT,
    @fecha_adquisicion DATE
AS
BEGIN
    UPDATE Unidades
    SET placa = @placa,
        marca = @marca,
        modelo = @modelo,
        anio = @anio,
        tipoUnidad = @tipoUnidad,
        estado = @estado,
        kilometraje = @kilometraje,
        fecha_adquisicion = @fecha_adquisicion
    WHERE id_unidad = @id_unidad;
END;

-- ActualizarUsuario
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ActualizarUsuario]    Script Date: 13/09/2025 19:59:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ActualizarUsuario]
    @id_usuario INT,
    @nombre_usuario VARCHAR(50),
    @correo VARCHAR(100),
    @contrasena VARCHAR(255),
    @rol VARCHAR(20),
    @activo bit
AS
BEGIN
    UPDATE Usuarios
    SET nombre_usuario = @nombre_usuario,
        correo = @correo,
        contrasena = @contrasena,
        rol = @rol,
        activo = @activo
    WHERE id_usuario = @id_usuario
END

-- AsignarMantenimiento
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_AsignarMantenimiento]    Script Date: 13/09/2025 19:59:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_AsignarMantenimiento]
    @id_unidad INT,
    @id_tipomantenimiento INT,
    @descripcion TEXT,
    @kilometraje INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validar si la unidad existe
        IF NOT EXISTS (SELECT 1 FROM Unidades WHERE id_unidad = @id_unidad)
        BEGIN
            RAISERROR('La unidad especificada no existe.', 16, 1);
            RETURN;
        END
        
        -- Validar si el tipo de mantenimiento existe
        IF NOT EXISTS (SELECT 1 FROM tipoMantenimiento WHERE id_tipomantenimiento = @id_tipomantenimiento)
        BEGIN
            RAISERROR('El tipo de mantenimiento especificado no existe.', 16, 1);
            RETURN;
        END
        
        -- Validar si la unidad ya está en mantenimiento
        IF EXISTS (
            SELECT 1 FROM Unidades
            WHERE id_unidad = @id_unidad AND estado = 'en_mantenimiento'
        )
        BEGIN
            RAISERROR('La unidad ya está en mantenimiento.', 16, 1);
            RETURN;
        END

        -- Finalizar asignación activa si existe
        UPDATE Asignaciones
        SET fecha_fin = GETDATE()
        WHERE id_unidad = @id_unidad 
          AND fecha_fin IS NULL;

        -- Insertar nuevo registro de mantenimiento con la estructura correcta
        INSERT INTO Mantenimientos (
            id_unidad,
            id_tipomantenimiento,
            descripcion,
            fecha_ini_mantenimiento,
            fecha_fin_mantenimiento,
            costo,
            kilometraje
        )
        VALUES (
            @id_unidad,
            @id_tipomantenimiento,
            @descripcion,
            GETDATE(),  -- Fecha de inicio
            NULL,      -- Fecha de fin (aún no se conoce)
            0.00,      -- Costo inicial
            @kilometraje
        );

        -- Actualizar estado y kilometraje de la unidad
        UPDATE Unidades
        SET estado = 'en_mantenimiento',
            kilometraje = @kilometraje
        WHERE id_unidad = @id_unidad;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;

-- Asingar unidad a conductor
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_AsignarUnidadAConductor]    Script Date: 13/09/2025 20:00:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_AsignarUnidadAConductor]
    @id_conductor INT,
    @id_unidad INT,
    @fecha_inicio DATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar que la unidad exista y esté operativa
    IF NOT EXISTS (
        SELECT 1 FROM Unidades 
        WHERE id_unidad = @id_unidad AND estado = 'operativo'
    )
    BEGIN
        RAISERROR('La unidad no existe o no está operativa.', 16, 1);
        RETURN;
    END;

    -- Verificar si ya hay una asignación activa para esa unidad
    IF EXISTS (
        SELECT 1 FROM Asignaciones
        WHERE id_unidad = @id_unidad AND fecha_fin IS NULL
    )
    BEGIN
        RAISERROR('La unidad ya está asignada actualmente.', 16, 1);
        RETURN;
    END;

    -- Verificar si el conductor está asignado actualmente
    IF EXISTS (
        SELECT 1 FROM Asignaciones
        WHERE id_conductor = @id_conductor AND fecha_fin IS NULL
    )
    BEGIN
        RAISERROR('El conductor ya tiene una unidad asignada actualmente.', 16, 1);
        RETURN;
    END;

    -- Insertar la nueva asignación
    INSERT INTO Asignaciones (id_conductor, id_unidad, fecha_inicio)
    VALUES (@id_conductor, @id_unidad, @fecha_inicio);
END;

-- CerrarSesion
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_cerrarSesionUsuario]    Script Date: 13/09/2025 20:00:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_cerrarSesionUsuario]
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Usuarios WHERE id_usuario = @id_usuario AND estado = 1)
    BEGIN
        UPDATE Usuarios
        SET activo = 0
        WHERE id_usuario = @id_usuario;

        SELECT 'Sesión cerrada correctamente' AS mensaje;
    END
    ELSE
    BEGIN
        SELECT 'Usuario no encontrado o inactivo' AS mensaje;
    END
END

-- ConsultarAsignacionesActivas
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ConsultarAsignacionesActivas]    Script Date: 13/09/2025 20:00:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ConsultarAsignacionesActivas]
AS
BEGIN
    SELECT 
        A.id_asignacion,
        C.nombre_completo,
        U.placa,
        A.fecha_inicio
    FROM Asignaciones A
    JOIN Conductores C ON A.id_conductor = C.id_conductor
    JOIN Unidades U ON A.id_unidad = U.id_unidad
    WHERE A.fecha_fin IS NULL;
END;

-- ConsultarConductores
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ConsultarConductores]    Script Date: 13/09/2025 20:00:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ConsultarConductores]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.id_conductor,
        c.nombre_completo,
        c.dui,
        c.licencia,
        c.telefono,
        c.direccion,
        c.fecha_ingreso,
        c.estado AS estado_conductor,  -- 1 = activo, 0 = inactivo
        u.id_usuario,
        u.nombre_usuario,
        u.correo,
        u.rol,
        u.estado AS estado_usuario     -- 1 = activo, 0 = inactivo
    FROM Conductores c
    INNER JOIN Usuarios u ON c.id_usuario = u.id_usuario;
END;

-- ConsultarConductoresPorId
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ConsultarConductorPorID]    Script Date: 13/09/2025 20:01:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ConsultarConductorPorID]
    @id_conductor INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.id_conductor,
        c.nombre_completo,
        c.dui,
        c.licencia,
        c.telefono,
        c.direccion,
        c.fecha_ingreso,
        c.estado AS estado_conductor,
        u.id_usuario,
        u.nombre_usuario,
        u.correo,
        u.rol,
        u.estado AS estado_usuario
    FROM Conductores c
    INNER JOIN Usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.id_conductor = @id_conductor;
    
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('No se encontró conductor con ese ID.', 16, 1);
    END
END;

-- ConsultarTodasLasAsignaciones
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ConsultarTodasAsignaciones]    Script Date: 13/09/2025 20:01:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ConsultarTodasAsignaciones]
AS
BEGIN
    SELECT 
        A.id_asignacion,
        C.nombre_completo,
        U.placa,
        A.fecha_inicio,
        A.fecha_fin
    FROM Asignaciones A
    JOIN Conductores C ON A.id_conductor = C.id_conductor
    JOIN Unidades U ON A.id_unidad = U.id_unidad;
END;

-- ConsultarUnidades
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ConsultarUnidades]    Script Date: 13/09/2025 20:01:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ConsultarUnidades]
AS
BEGIN
    SELECT u.*, t.txt_tipoUnidad
    FROM Unidades u
    LEFT JOIN TipoUnidad t ON u.tipoUnidad = t.id_tipoUnidad
END;

-- ConsultarUnidadPorId
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ConsultarUnidadId]    Script Date: 13/09/2025 20:02:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ConsultarUnidadId]
    @id_unidad INT
AS
BEGIN
    SELECT u.*, t.txt_tipoUnidad
    FROM Unidades u
    LEFT JOIN TipoUnidad t ON u.tipoUnidad = t.id_tipoUnidad
    WHERE u.id_unidad = @id_unidad;
END;

-- ConsultarUsuarios
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ConsultarUsuarios]    Script Date: 13/09/2025 20:02:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ConsultarUsuarios]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Usuarios
END;

-- ConsultarUsuariosActivos
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ConsultarUsuariosActivos]    Script Date: 13/09/2025 20:02:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ConsultarUsuariosActivos]
    @estado bit
AS
BEGIN
    SELECT * FROM Usuarios WHERE estado = @estado
END

-- ConsultarUsuariosPorId
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_ConsultarUsuariosId]    Script Date: 13/09/2025 20:02:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_ConsultarUsuariosId]
	@id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id_usuario, nombre_usuario, correo, rol, estado
    FROM Usuarios
    WHERE id_usuario = @id_usuario;
END;

-- CrearConductor
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_CrearConductor]    Script Date: 13/09/2025 20:03:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_CrearConductor]
    @id_usuario INT,
    @nombre_completo VARCHAR(100),
    @dui VARCHAR(20),
    @licencia VARCHAR(30) = NULL,
    @telefono VARCHAR(20) = NULL,
    @direccion TEXT = NULL,
    @fecha_ingreso DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar existencia del usuario, que esté activo y tenga rol 'conductor'
    IF NOT EXISTS (
        SELECT 1 
        FROM Usuarios 
        WHERE id_usuario = @id_usuario AND estado = 1 AND rol = 'conductor'
    )
    BEGIN
        RAISERROR('El usuario no existe, está inactivo o no tiene rol de conductor.', 16, 1);
        RETURN;
    END

    -- Validar que no esté ya registrado como conductor
    IF EXISTS (
        SELECT 1 
        FROM Conductores 
        WHERE id_usuario = @id_usuario
    )
    BEGIN
        RAISERROR('Este usuario ya está registrado como conductor.', 16, 1);
        RETURN;
    END

    -- Insertar conductor
    INSERT INTO Conductores (
        id_usuario,
        nombre_completo,
        dui,
        licencia,
        telefono,
        direccion,
        fecha_ingreso,
        estado
    )
    OUTPUT inserted.id_conductor
    VALUES (
        @id_usuario,
        @nombre_completo,
        @dui,
        @licencia,
        @telefono,
        @direccion,
        ISNULL(@fecha_ingreso, GETDATE()),
        1 -- conductor activo
    );

    PRINT 'Conductor registrado correctamente.';
END;

-- CrearUnidad
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_CrearConductor]    Script Date: 13/09/2025 20:03:01 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_CrearConductor]
    @id_usuario INT,
    @nombre_completo VARCHAR(100),
    @dui VARCHAR(20),
    @licencia VARCHAR(30) = NULL,
    @telefono VARCHAR(20) = NULL,
    @direccion TEXT = NULL,
    @fecha_ingreso DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar existencia del usuario, que esté activo y tenga rol 'conductor'
    IF NOT EXISTS (
        SELECT 1 
        FROM Usuarios 
        WHERE id_usuario = @id_usuario AND estado = 1 AND rol = 'conductor'
    )
    BEGIN
        RAISERROR('El usuario no existe, está inactivo o no tiene rol de conductor.', 16, 1);
        RETURN;
    END

    -- Validar que no esté ya registrado como conductor
    IF EXISTS (
        SELECT 1 
        FROM Conductores 
        WHERE id_usuario = @id_usuario
    )
    BEGIN
        RAISERROR('Este usuario ya está registrado como conductor.', 16, 1);
        RETURN;
    END

    -- Insertar conductor
    INSERT INTO Conductores (
        id_usuario,
        nombre_completo,
        dui,
        licencia,
        telefono,
        direccion,
        fecha_ingreso,
        estado
    )
    OUTPUT inserted.id_conductor
    VALUES (
        @id_usuario,
        @nombre_completo,
        @dui,
        @licencia,
        @telefono,
        @direccion,
        ISNULL(@fecha_ingreso, GETDATE()),
        1 -- conductor activo
    );

    PRINT 'Conductor registrado correctamente.';
END;

-- CrearUsuario
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_CrearUsuario]    Script Date: 13/09/2025 20:03:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_CrearUsuario]
    @nombre_usuario VARCHAR(50),
    @correo VARCHAR(100),
    @contrasena VARCHAR(255),
    @rol VARCHAR(20),
    @estado INT
AS
BEGIN
    INSERT INTO Usuarios (nombre_usuario, correo, contrasena, rol, estado)
    OUTPUT INSERTED.id_usuario
    VALUES (@nombre_usuario, @correo, @contrasena, @rol, @estado)
END

-- EliminarConductor - Se refiere a inhabilitarloxd
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_EliminarConductor]    Script Date: 13/09/2025 20:03:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_EliminarConductor]
    @id_conductor INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_usuario INT;

    -- Validar existencia del conductor y obtener el id_usuario
    SELECT @id_usuario = id_usuario 
    FROM Conductores 
    WHERE id_conductor = @id_conductor;

    IF @id_usuario IS NULL
    BEGIN
        RAISERROR('El conductor no existe.', 16, 1);
        RETURN;
    END

    -- Desactivar conductor
    UPDATE Conductores
    SET estado = 0
    WHERE id_conductor = @id_conductor;

    -- Desactivar usuario
    UPDATE Usuarios
    SET estado = 0
    WHERE id_usuario = @id_usuario;

    PRINT 'Conductor y usuario desactivados correctamente.';
END;

-- EliminarUnidad
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_EliminarUnidad]    Script Date: 13/09/2025 20:04:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_EliminarUnidad]
    @id_unidad INT
AS
BEGIN
    UPDATE Unidades
    SET estado = 'fuera_servicio'
    WHERE id_unidad = @id_unidad;
END;

-- EliminarUsuario
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_EliminarUsuario]    Script Date: 13/09/2025 20:04:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_EliminarUsuario]
    @id_usuario INT
AS
BEGIN
    UPDATE Usuarios
    SET estado = 0
    WHERE id_usuario = @id_usuario
END

-- FinalizarAsignacion
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_FinalizarAsignacion]    Script Date: 13/09/2025 20:04:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_FinalizarAsignacion]
    @id_asignacion INT,
    @fecha_fin DATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Asignaciones
    SET fecha_fin = @fecha_fin
    WHERE id_asignacion = @id_asignacion AND fecha_fin IS NULL;

    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Asignación no encontrada o ya finalizada.', 16, 1);
    END
END;

-- FinalizarMantenimiento
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_FinalizarMantenimiento]    Script Date: 13/09/2025 20:04:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_FinalizarMantenimiento]
    @id_unidad INT,
    @costo DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_mantenimiento INT;

    -- Obtener último mantenimiento activo (sin fecha fin)
    SELECT TOP 1 @id_mantenimiento = id_mantenimiento
    FROM Mantenimientos
    WHERE id_unidad = @id_unidad AND fecha_fin_mantenimiento IS NULL
    ORDER BY fecha_ini_mantenimiento DESC;

    -- Verificar si hay mantenimiento activo
    IF @id_mantenimiento IS NULL
    BEGIN
        RAISERROR('No hay mantenimiento activo para esta unidad.', 16, 1);
        RETURN;
    END

    -- Finalizar mantenimiento
    UPDATE Mantenimientos
    SET
        fecha_fin_mantenimiento = GETDATE(),
        costo = @costo
    WHERE id_mantenimiento = @id_mantenimiento;

    -- Actualizar estado de la unidad
    UPDATE Unidades
    SET estado = 'operativo'
    WHERE id_unidad = @id_unidad;
END;

-- LoginUsuario
USE [proyecto]
GO
/****** Object:  StoredProcedure [dbo].[sp_loginUsuario]    Script Date: 13/09/2025 20:05:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_loginUsuario]
    @nombre_usuario NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @id_usuario INT;
    
    -- Buscar el usuario
    SELECT 
        @id_usuario = id_usuario
    FROM usuarios 
    WHERE nombre_usuario = @nombre_usuario;
    
    -- Si el usuario existe, actualizar su estado a "conectado" (1)
    IF @id_usuario IS NOT NULL
    BEGIN
        UPDATE usuarios 
        SET estado = 1 
        WHERE id_usuario = @id_usuario;
    END
    
    -- Devolver los datos del usuario
    SELECT 
        id_usuario as id,       
        nombre_usuario,
        correo,
        contrasena,              
        rol,
        1 as estado,            -- devuelve 1 (conectado) después del update
        activo
    FROM usuarios 
    WHERE nombre_usuario = @nombre_usuario;
END

```

### 5. Iniciar el servicio de nodemon e iniciar el servidor
```bash ctrl + j en visualstudiocode
npx nodemon index.js
http-server
```

## 🚀 Uso

### Acceso al Sistema
1. Usar la primera direccion para ingresar.
2. Usar credenciales:
   - **Admin**: `Bcortez123` / `123`

### Funcionalidades por Rol

#### Administrador
- Gestión completa de usuarios
- Control de vehículos y mantenimientos
- Asignación de rutas
- Reportes y estadísticas
- Gestión de bonificaciones

#### Conductor
- Visualización de asignaciones
- Registro de estados de viaje
- Consulta de vehículo asignado
- Historial de viajes

## Seguridad

- **Autenticación JWT** con tokens de 1 hora
- **Contraseñas hasheadas** con bcrypt
- **Validación de roles** en cada endpoint
- **Gestión de estados** (conectado/desconectado)
- **Validación de entrada** en frontend y backend

## 📊 API Endpoints

### Autenticación
- `POST /login` - Iniciar sesión
- `POST /login/logout` - Cerrar sesión

### Usuarios
- `GET /usuarios` - Listar usuarios
- `POST /usuarios` - Crear usuario
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

### Vehículos
- `GET /vehiculos` - Listar vehículos
- `POST /vehiculos` - Registrar vehículo
- `PUT /vehiculos/:id` - Actualizar vehículo

### v1.0.0 (2025-09-13)
- ✅ Sistema de autenticación completo
- ✅ Panel de administrador funcional
- ✅ Gestión de usuarios y roles
- ✅ Interfaz responsive
- ✅ Integración con SQL Server

## 👥 Autores

- **Brandon Cortez** - *Desarrollo principal* - [BrandonJr20](https://github.com/BrandonJr20)

## 📞 Soporte

Para consultas:
- **Email**: alexander.jncz@gmail.com

## 🙏 Agradecimientos

- Universidad por el apoyo en el proyecto de graduación
- Profesores asesores
- Comunidad de desarrolladores de Node.js

---

⭐ **Si te gusta este proyecto, dale una estrella en GitHub** ⭐
document.addEventListener('DOMContentLoaded', function () {
    // ✅ NUEVO: Verificar autenticación al cargar la página
    verificarAutenticacion();
    
    // Elementos del DOM
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const principalSection = document.getElementById('principal');
    const allSections = document.querySelectorAll('main > section');
    const navLinks = document.querySelectorAll('aside ul li a');
    const cards = document.querySelectorAll('.principal a');

    showInitialView();

    // Función para verificar autenticación
    function verificarAutenticacion() {
        const token = localStorage.getItem('authToken');
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        
        if (!token || !usuario.rol) {
            alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
            window.location.href = '/views/index.html';
            return false;
        }
        
        // Verificar que sea admin (opcional, según tu lógica)
        if (usuario.rol !== 'admin') {
            alert('No tienes permisos para acceder a esta página.');
            window.location.href = '/views/index.html';
            return false;
        }
        
        return true;
    }

    // Mostrar datos del usuario en el sidebar
    function mostrarDatosUsuario() {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        
        // Buscar elementos donde mostrar la info del usuario
        const perfilNombre = document.querySelector('.perfil h3');
        const perfilEmail = document.querySelector('.perfil p');
        
        if (perfilNombre) {
            perfilNombre.textContent = usuario.nombre_usuario || 'Usuario';
        }
        
        if (perfilEmail) {
            perfilEmail.textContent = usuario.correo || '';
        }
        
        console.log('Datos de usuario mostrados:', usuario);
    }

    // Mostrar solo la sección principal al cargar
    function showInitialView() {
        allSections.forEach(section => {
            section.classList.remove('active');
        });
        principalSection.classList.add('active');
        principalSection.style.display = 'grid';
        sidebar.classList.remove('active');

        // Marcar como activo el enlace "Inicio"
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#principal');
        });

        localStorage.setItem('currentSection', 'principal');
        mostrarDatosUsuario(); // Mostrar datos del usuario
    }

    // Mostrar sección específica
    function showSection(sectionId) {
        allSections.forEach(section => {
            section.classList.remove('active');
        });

        if (sectionId === 'principal') {
            showInitialView();
            return;
        }

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            principalSection.style.display = 'none';
        }

        // Activar el sidebar
        sidebar.classList.add('active');

        // Activar el link correspondiente
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });

        localStorage.setItem('currentSection', sectionId);
    }

    // Eventos: clic en las tarjetas
    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            
            // Manejo especial para cerrar sesión
            if (targetId === 'cerrarSesion') {
                cerrarSesion();
                return;
            }
            
            showSection(targetId);
        });
    });

    // Eventos: clic en los enlaces del aside
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
            
            // Manejo especial para cerrar sesión
            if (targetId === 'cerrarSesion') {
                cerrarSesion();
                return;
            }
            
            showSection(targetId);
        });
    });

    // Toggle del menú sidebar
    menuToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });

    // Cerrar el sidebar al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (!sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove('active');
        }
    });

    // Cerrar sesión mejorado
    const logoutCard = document.querySelector('a[href="#cerrarSesion"]');
    if (logoutCard) {
        logoutCard.addEventListener('click', function (e) {
            e.preventDefault();
            cerrarSesion();
        });
    }

    // Función completa para cerrar sesión
    async function cerrarSesion() {
        try {
            console.log('Iniciando proceso de cierre de sesión...');
            
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                console.log('No hay token, redirigiendo al login');
                limpiarDatosLocales();
                window.location.href = '/views/index.html';
                return;
            }

            // Mostrar confirmación al usuario
            const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
            if (!confirmar) {
                return;
            }

            console.log('Enviando petición de logout al servidor...');

            const response = await fetch('/login/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data);

            if (data.success) {
                console.log('Logout exitoso en servidor');
                limpiarDatosLocales();
                alert('Sesión cerrada correctamente');
                window.location.href = './index.html';
            } else {
                console.error('Error en logout del servidor:', data.mensaje);
                // Aún así, limpiar datos locales y redireccionar
                limpiarDatosLocales();
                alert('Sesión cerrada localmente');
                window.location.href = './index.html';
            }
            
        } catch (error) {
            console.error('Error en cerrarSesion:', error);
            
            // En caso de error, forzar logout local
            limpiarDatosLocales();
            alert('Error de conexión. Cerrando sesión localmente.');
            window.location.href = './index.html';
        }
    }

    // Función para limpiar datos locales
    function limpiarDatosLocales() {
        console.log('🔍 Limpiando datos locales...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuario');
        localStorage.removeItem('currentSection');
    }

    // Verificar token cada 5 minutos
    setInterval(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Verificar si el token sigue siendo válido
            fetch('/login/protected', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.log('⚠️ Token expirado, cerrando sesión automáticamente');
                    limpiarDatosLocales();
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    window.location.href = '/views/index.html';
                }
            })
            .catch(error => {
                console.log('⚠️ Error verificando token:', error);
            });
        }
    }, 5 * 60 * 1000); // 5 minutos

    // Detectar cierre de navegador para logout automático
    window.addEventListener('beforeunload', async (event) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                // Usar navigator.sendBeacon para envío confiable al cerrar
                const data = new FormData();
                navigator.sendBeacon('/login/logout', JSON.stringify({}));
            } catch (error) {
                console.log('Error en logout automático:', error);
            }
        }
    });

    // Detectar inactividad del usuario
    let tiempoInactividad = 0;
    const TIEMPO_MAX_INACTIVIDAD = 30 * 60 * 1000; // 30 minutos

    function reiniciarTiempoInactividad() {
        tiempoInactividad = 0;
    }

    // Eventos que indican actividad del usuario
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, reiniciarTiempoInactividad);
    });

    // Verificar inactividad cada minuto
    setInterval(() => {
        tiempoInactividad += 60 * 1000; // 1 minuto
        
        if (tiempoInactividad >= TIEMPO_MAX_INACTIVIDAD) {
            alert('Tu sesión ha expirado por inactividad.');
            cerrarSesion();
        }
    }, 60 * 1000); // Verificar cada minuto

    // Inicializar vista
    const lastSection = localStorage.getItem('currentSection');
    if (lastSection && lastSection !== 'principal') {
        showSection(lastSection);
    } else {
        showInitialView();
    }

    console.log('Sistema de administración inicializado correctamente');
});

// // Función global para cerrar sesión (accesible desde HTML)
// window.cerrarSesion = async function() {
//     try {
//         const token = localStorage.getItem('authToken');
        
//         if (!token) {
//             window.location.href = '/views/index.html';
//             return;
//         }

//         const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');
//         if (!confirmar) return;

//         await fetch('/login/logout', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         localStorage.clear();
//         alert('Sesión cerrada correctamente');
//         window.location.href = 'index.html';
        
//     } catch (error) {
//         console.error('Error:', error);
//         localStorage.clear();
//         window.location.href = './index.html';
//     }
// };
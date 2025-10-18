document.addEventListener('DOMContentLoaded', function () {
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
        console.log('Verificando autenticación, token:', token);
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

        if (!token || !usuario.rol) {
            mostrarDialogo('Sesión expirada. Por favor, inicia sesión nuevamente.');
            window.location.href = '../';
            return false;
        }

        // Verificar que sea admin (opcional, según tu lógica)
        if (usuario.rol !== 'conductor') {
            mostrarDialogo('No tienes permisos para acceder a esta página.');
            window.location.href = '../';
            return false;
        }

        return true;
    }

    // Mostrar datos del usuario en el sidebar
    function mostrarDatosUsuario() {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

        // Buscar elementos donde mostrar la info del usuario
        const perfilNombre = document.querySelector('.perfil h3');

        if (perfilNombre) {
            perfilNombre.textContent = usuario.nombre_usuario || 'Usuario';
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
            console.log(targetSection)
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

    // // Eventos: clic en los enlaces del aside
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');

            // // Manejo especial para cerrar sesión
            // if (targetId === 'cerrarSesion') {
            //     cerrarSesion();
            //     return;
            // }

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

    // Función completa para cerrar sesión
    async function cerrarSesion() {
        try {
            const token = localStorage.getItem('authToken');

            if (!token) {
                limpiarDatosLocales();
                window.location.href = '../';
                return;
            }

            const confirmar = await mostrarDialogoConfirmacion('¿Estás seguro de que deseas cerrar sesión?');
            if (!confirmar) return;

            const response = await fetch('http://localhost:3000/login/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                limpiarDatosLocales();
                await mostrarDialogo('Sesión cerrada correctamente');
                window.location.href = '../';
            } else {
                limpiarDatosLocales();
                await mostrarDialogo('Sesión cerrada localmente (error en servidor)');
                window.location.href = '../';
            }

        } catch (error) {
            limpiarDatosLocales();
            await mostrarDialogo('Error de conexión. Cerrando sesión localmente.');
            window.location.href = '../';
        }
    }


    // Función para limpiar datos locales
    function limpiarDatosLocales() {
        console.log(' Limpiando datos locales...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuario');
        localStorage.removeItem('currentSection');
    }

    setInterval(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            fetch('/login/protected', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        console.log('Token expirado, cerrando sesión automáticamente');
                        limpiarDatosLocales();
                        mostrarDialogo('Tu sesión ha expirado. Serás redirigido al inicio.').then(() => {
                            window.location.href = '../';
                        });
                    }
                })
                .catch(error => {
                    console.log('Error verificando token:', error);
                });
        }
    }, 5 * 60 * 1000);

    // Cierre automático al cerrar navegador
    window.addEventListener('beforeunload', async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                navigator.sendBeacon('/login/logout', JSON.stringify({}));
            } catch (error) {
                console.log('Error en logout automático:', error);
            }
        }
    });

    // Detección de inactividad
    let tiempoInactividad = 0;
    const TIEMPO_MAX_INACTIVIDAD = 30 * 60 * 1000; // 30 minutos

    function reiniciarTiempoInactividad() {
        tiempoInactividad = 0;
    }

    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, reiniciarTiempoInactividad);
    });

    setInterval(() => {
        tiempoInactividad += 60 * 1000;
        if (tiempoInactividad >= TIEMPO_MAX_INACTIVIDAD) {
            mostrarDialogo('Tu sesión ha expirado por inactividad.').then(() => {
                cerrarSesion();
            });
        }
    }, 60 * 1000);


    // Inicializar vista
    const lastSection = localStorage.getItem('currentSection');
    if (lastSection && lastSection !== 'principal') {
        showSection(lastSection);
    } else {
        showInitialView();
    }

    console.log('Sistema de administración inicializado correctamente');

    //funcion para limpiar todos los formularios al cancelar
    document.addEventListener('click', (e) => {
        // si se clickeó un reset / cancelar
        if (
            e.target.matches('button[type="reset"]') ||
            e.target.matches('#btnCancelar') ||
            e.target.closest('.btnCancelar')
        ) {
            e.preventDefault(); // evita comportamiento por defecto para controlar todo

            // const campoKilometraje = document.getElementById('kilometraje')
            // campoKilometraje.readOnly = false; // Hacer el campo editable
            // campoKilometraje.style.backgroundColor = ''; // Restaurar el color de fondo original

            document.querySelectorAll('form').forEach(form => {
                form.reset();
                form.querySelectorAll('input[type="hidden"]').forEach(h => h.value = '');
                // campos concretos que usás en tu HTML
                ['id_conductor', 'id_unidad', 'id_usuario_conductor', 'id_usuario', 'id', 'id_asignacion', 'id_mantenimiento', 'id_insumo', 'id_movimiento'].forEach(key => {
                    const byId = form.querySelector(`#${key}`);
                    const byName = form.querySelector(`[name="${key}"]`);
                    if (byId) byId.value = '';
                    if (byName) byName.value = '';
                });
                form.querySelectorAll('[data-edit-id]').forEach(el => el.removeAttribute('data-edit-id'));
            });

            document.querySelectorAll('form').forEach(form => {
                const submit = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submit) {
                    submit.textContent = 'Guardar';
                    submit.dataset.mode = 'create';
                }
            });

            if (window.currentEditId) window.currentEditId = null;
        }
    });
});

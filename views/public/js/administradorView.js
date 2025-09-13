document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const principalSection = document.getElementById('principal');
    const allSections = document.querySelectorAll('main > section');
    const navLinks = document.querySelectorAll('aside ul li a');
    const cards = document.querySelectorAll('.principal a');

    showInitialView()

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
            showSection(targetId);
        });
    });

    // Eventos: clic en los enlaces del aside
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').replace('#', '');
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

    // Cerrar sesión
    const logoutCard = document.querySelector('a[href="#cerrarSesion"]');
    if (logoutCard) {
        logoutCard.addEventListener('click', function (e) {
            e.preventDefault();
            // Tu lógica de cierre de sesión
            window.location.href = '/logout';
        });
    }

    // Inicializar vista
    const lastSection = localStorage.getItem('currentSection');
    if (lastSection) {
        showSection(lastSection);
    } else {
        showInitialView();
    }
});

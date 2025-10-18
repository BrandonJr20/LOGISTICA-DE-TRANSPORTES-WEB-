// Animación de cierre con promesa
function cerrarDialogoAnimado(dialogo) {
    return new Promise(resolve => {
        dialogo.classList.add('cerrando');
        dialogo.addEventListener('animationend', () => {
            dialogo.classList.remove('cerrando');
            dialogo.close();
            resolve();
        }, { once: true });
    });
}

// Alerta simple (OK)
function mostrarDialogo(mensaje) {
    return new Promise(resolve => {
        const dialogo = document.getElementById('dialogo-alerta');
        const mensajeAlerta = document.getElementById('mensaje-alerta');
        const btnAceptar = document.getElementById('btnAceptarDialogo');
        const btnCancelar = document.getElementById('btnCancelarDialogo');
        const btnCerrar = dialogo.querySelector('.cerrar-alerta');

        mensajeAlerta.textContent = mensaje;
        btnCancelar.style.display = 'none';
        dialogo.showModal();

        const cerrar = async () => {
            await cerrarDialogoAnimado(dialogo);
            resolve();
        };

        btnAceptar.onclick = cerrar;
        btnCerrar.onclick = cerrar;
    });
}

// Alerta de confirmación (Aceptar / Cancelar)
function mostrarDialogoConfirmacion(mensaje) {
    return new Promise(resolve => {
        const dialogo = document.getElementById('dialogo-alerta');
        const mensajeAlerta = document.getElementById('mensaje-alerta');
        const btnAceptar = document.getElementById('btnAceptarDialogo');
        const btnCancelar = document.getElementById('btnCancelarDialogo');
        const btnCerrar = dialogo.querySelector('.cerrar-alerta');

        mensajeAlerta.textContent = mensaje;
        btnCancelar.style.display = 'inline-block';
        dialogo.showModal();

        const confirmar = async () => {
            await cerrarDialogoAnimado(dialogo);
            resolve(true);
        };

        const cancelar = async () => {
            await cerrarDialogoAnimado(dialogo);
            resolve(false);
        };

        btnAceptar.onclick = confirmar;
        btnCancelar.onclick = cancelar;
        btnCerrar.onclick = cancelar;
    });
}

function mostrarDialogoInput(mensaje, placeholder = '') {
    return new Promise(resolve => {
        const dialogo = document.getElementById('dialogo-alerta');
        const mensajeAlerta = document.getElementById('mensaje-alerta');
        const btnAceptar = document.getElementById('btnAceptarDialogo');
        const btnCancelar = document.getElementById('btnCancelarDialogo');
        const btnCerrar = dialogo.querySelector('.cerrar-alerta');
        const dialogoInput = document.getElementById('inputDialogo');
        
        // Configurar el diálogo
        mensajeAlerta.textContent = mensaje;
        btnCancelar.style.display = 'inline-block';

        // Mostrar y configurar el input
        dialogoInput.style.display = 'block';
        dialogoInput.value = ''; // Limpiar valor previo
        dialogoInput.placeholder = placeholder;
        dialogoInput.focus(); // Poner foco en el input

        dialogo.showModal();

        const confirmar = async () => {
            const valorInput = dialogoInput.value.trim();
            dialogoInput.style.display = 'none'; // Ocultar input
            await cerrarDialogoAnimado(dialogo);
            resolve(valorInput); // Devuelve el valor ingresado
        };

        const cancelar = async () => {
            dialogoInput.style.display = 'none'; // Ocultar input
            await cerrarDialogoAnimado(dialogo);
            resolve(null); // Devuelve null si cancela
        };

        // Permitir Enter para confirmar
        dialogoInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                confirmar();
            }
        };

        btnAceptar.onclick = confirmar;
        btnCancelar.onclick = cancelar;
        btnCerrar.onclick = cancelar;
    });
}

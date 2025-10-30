function abrirModal(idModal) {
    document.getElementById(idModal).showModal();

    const modal = document.getElementById(idModal)
    if(modal){
        modal.showModal()

        const btnCancelar = modal.querySelector('.btnCancelar')
        if(btnCancelar){
            btnCancelar.addEventListener('click', () => modal.close())
        }
    }
}

// Botones que abren modales
document.querySelectorAll('.btnAbrirModal' || '.btnEditar').forEach(boton => {
    boton.addEventListener('click', () => {
        const tipo = boton.dataset.tipo; // asumimos que pones data-tipo="entrega" / "consumo" / "incidente"
        abrirModal(`gestion${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    });
});

// SCRIPT DO SPRINT 01

// Abre o modal
function abrirModal() {
    const modal = document.getElementById('modalLogin');
    if (modal && typeof modal, showModal === "function") {
        modal.showModal();
    }
    else {
        alert("Modal não suportado neste navegador")
    }
}
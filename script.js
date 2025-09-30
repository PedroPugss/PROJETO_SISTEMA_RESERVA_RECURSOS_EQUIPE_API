// SCRIPT DO SPRINT 01

// Abre o modal
function abrirLogin() {
    const modal = document.getElementById('modalLogin');
    if (modal && typeof modal.showModal === "function") {
        modal.showModal();
    }
    else {
        alert("Modal não suportado neste navegador")
    }
}

// Rola suavemente até formulário rápido
function rolarParaRapido() {
    const formRapido = document.querySelector('.formRapido');
    if (formRapido) {
        formRapido.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// Validação simples da reserva rápida
(function inicializarValidacao() {
    const form = document.querySelector('.formRapido');
    if (!form) return;

    const seletorRecurso = form.querySelector('select');
    const campoData = form.querySelector('input[type = "date"]');
    const campoInicio = form.querySelector('input[placeholder = "Início"]');
    const campoFim = form.querySelector('input[placeholder = "Fim"]');

    // Remover a marcação de erro ao digitar / mudar
    [seletorRecurso, campoData, campoInicio, campoFim].forEach(el => {
        if (!el) return;

        el.addEventListener('input', () => el.style.borderColor = "");
        el.addEventListener('change', () => el.style.borderColor = "");
    });

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        let valido = true;

        // Valida recurso selecionado
        if (seletorRecurso && seletorRecurso.selectIndex === 0) {
            seletorRecurso.style.borderColor = 'red';
            valido = false;
        }

        // Valida data
        if (campoData && !campoData.value) {
            campoData.style.borderColor = 'red'
            valido = false;
        }

        // Valida horários
        const hInicio = campoInicio?.value || "";
        const hFim = campoFim?.value || "";

        if (!hInicio) {
            campoInicio.style.borderColor = 'red';
            valido = false;
        }
        if (!hFim) {
            campoFim.style.borderColor = 'red';
            valido = false;
        }

        if (hInicio && hFim && hFim <= hInicio) {
            campoInicio.style.borderColor = 'red';
            campoFim.style.borderColor = 'red';

            alert("O horário final não compatível com o horário inicial!");
            return;
        }

        if (!valido) {
            alert("Por favor, preencha todos os campos obrigatórios");
            return;
        }

        // Simulação (sucesso)
        alert("Reserva simulada com sucesso! Integração real será feita nos próximos sprints");
        form.reset();
    });
})();
// SCRIPT DO SPRINT 01

// SCRIPT DO SPRINT 02 - Manter o que havia no SPRINT 01 e adicionar fluxo funcional

// 1) Toast acessível (feedback não bloqueante)
// Por que? Substitui o alert() por UX moderna e acessível

const $toast = document.getElementById('toast');
let __toastTimer = null;

function mostrarToast(mensagem, tipo = "OK") {
    // fallback - Se #toast não existir (Ambiente)
    if (!$toast) {
        alert(mensagem);
        return;
    }

    $toast.classList.remove('warn', 'err', 'visivel');

    if (tipo === 'warn') $toast.classList.add('warn');
    if (tipo === 'err') $toast.classList.add('err');

    $toast.textContent = mensagem;

    void $toast.offsetWidth;
    $toast.classList.add('visivel')

    clearTimeout(__toastTimer);

    __toastTimer = setTimeout(() => $toast.classList.remove('visivel'), 20);
}

/*
======================================================
====== Funções originais - SPRINT 01 (Mantidas) ======
======================================================
*/

// Abre o modal
function abrirLogin() {
    const modal = document.getElementById('modalLogin');
    if (modal && typeof modal.showModal === "function") {
        modal.showModal();
    }
    else {
        // Alteração SPRINT 02: Usar toast no lugar de alert()
        mostrarToast("Modal não suportado neste navegador", 'warn');
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
// Fluxo do SPRINT 02 - Login, Pesquisa, Solicitar
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

            // Alteração SPRINT 02 - Trocar o alert pelo toast
            mostrarToast("O horário final precisa ser maior que o horário inicial", 'warn');
            return;
        }
        if (!valido) {
            mostrarToast("Por favor, preencha todos os campos obrigatórios", 'warn');
            return;
        }

        // Simulação (sucesso)
        mostrarToast("Reserva simulada com sucesso! Fluxo rápido/legado");
        form.reset();
    });
})();

/*
========================================================================
======              Ajudantes e estado (SPRINT 02)                ======
====== ---------------------------------------------------------- ======
====== Por que? Preparar o 'estado mínimo' e leitura por FormData ======
========================================================================
*/

// Alteração SPRINT 02: helper para transformar FormData em objeto
function dadosDoForm(form) {
    return Object.fromEntries(new FormData(form).entries());
}

// Alteração SPRINT 02: Estado mínimo de aplicação (simulado)
let usuarioAtual = null; // {login, professor: boolean}
let ultimoFiltroPesquisa = null; // {recurso, data, horario}

const reservas = []; // Histórico em memória

/*
==========================================================
======      Menu ativo por Hash (Acessibilidade)    ======
====== -------------------------------------------- ======
====== Por que? Destacar a seção atual sem roteador ======
==========================================================
*/

// Alteração do SPRINT 02: Destacar links ativos do menu
const menuLinks = document.querySelectorAll('.menu a, header, .acoesNav a');

function atualizarMenuAtivo() {
    const hash = location.hash || '#secLogin';
    menuLinks.forEach(a => {
        const ativo = a.getAttribute('href') === hash;
        a.setAttribute('aria-current', ativo ? 'true' : 'false');
    });
}

window.addEventListener('hashchange', atualizarMenuAtivo);
document.addEventListener('DOMContentLoaded', atualizarMenuAtivo);

/*
===================================================================================================================================================
======                                    Fluxo Login, Pesquisa, Solicitar e Histórico (SPRINT 02)                                           ======
====== ------------------------------------------------------------------------------------------------------------------------------------- ======
====== Por que? Implementar o fluxo da SPRINT 02, com RN simulada: Usuários cujo login contêm "prof" com aprovação automática na solicitação ======
===================================================================================================================================================
*/

// Alteração do SPRINT 02: Seletores das seções
const formLogin = document.getElementById('formLogin');
const formPesquisa = document.getElementById('formPesquisa');
const formSolicitar = document.getElementById('formSolicitar');
const listaReservas = document.getElementById('listaReservas');

/*
=====================================
====== SPRINT 3 - Regras novas ======
=====================================
*/

// Adiciona 1h ao horário 'HH:MM' para fim padrão
function adicionar1Hora(hhmm) {
    const [h, m] = (hhmm || "00:00").split(":").map(Number);
    const d = new Date();

    d.setHours(h, m, 0, 0);
    d.setMinutes(d.getMinutes() + 60);

    return d.toTimeString().slice(0, 5);
}

// Adiciona RN2 (Detecção de conflitos)

// Não há conflito, quando um termina antes do outro terminar
function hConflito({ recursoId, data, horaInicio, horaFim }) {
    const existentes = repo.get(DB_KEYS.reservas).filter(r => r.recursoId === recursoId && r.data === data && r.status !== 'cancelada');
    return existentes.some(r => !(r.horaFim <= horaInicio || r.horaInicio >= horaFim));
}

// Render a partir do Banco (localStorage)
function renderItemReservaPersistida(r, recursosMap = null) {
    if (!listaReservas) return;

    const recursos = recursosMap || Object.fromEntries(repo.get(DB_KEYS.recursos).map(rr => [rr.id, rr.nome]));
    const quando = `${r.data.split("-").reverse().join('/')} - ${(r.horaInicio) - (r.horaFim)}`;
    const li = document.createElement('li');
    const simbolo = r.status === 'aprovada' ? 'ticado' : r.status === 'cancelada' ? 'xis' : 'ampulheta';

    li.innerHTML = `
        <span><strong>${recursos[r.recursoId] || r.recursoId}</strong> - ${quando}</span>
        <span>${simbolo} ${r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
    `;

    if (r.status === 'cancelada') {
        li.setAttribute('aria-disabled', 'true');
    }

    // Cancelamento 'Click para cancelar'
    li.addEventListener('click', () => {
        if (r.status === 'cancelada') return;

        r.status = 'cancelada';
        repo.updateById(DB_KEYS.reservas, r.id, () => r);
        li.lastElementChild.textContent = 'xis Cancelada';
        li.setAttribute('aria-disabled', 'true')

        mostrarToast("Reserva cancelada", 'warn');
    });

    listaReservas.appendChild(li);
}

// 1. Login

// Valida credenciais simples e define perfil simulado
formLogin?.addEventListener('submit', (e) => {
    e.preventDefault();

    const { usuario, senha } = dadosDoForm(formLogin);

    if (!usuario || (senha || '').length < 3) {
        mostrarToast("Usuário / Senha inválidos (mín 3 caracteres)");
        return;
    }

    const professor = /prof/i.test(usuario); // RN4
    usuarioAtual = { login: usuario, professor };

    mostrarToast(`Bem-vindo, ${usuarioAtual.login}!`);
    location.hash = '#secPesquisa';
    atualizarMenuAtivo();
});

// 2. Pesquisar disponibilidade

// Guarda filtro de pesquisa (Simulação de disponibilidade)
formPesquisa?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!usuarioAtual) {
        mostrarToast("Faça login antes de pesquisar", 'warn');
        location.hash = '#secLogin';
        atualizarMenuAtivo();
        return;
    }

    const { recurso, data, hora } = dadosDoForm(formPesquisa);
    if (!recurso || !data || !hora) {
        mostrarToast("Preencha recurso, data e horário", 'warn');
        return;
    }

    ultimoFiltroPesquisa = { recurso: Number(recurso), data, hora }; // SPRINT 3 - Guardar ID
    const quando = new Date(`${data}T${hora}`).toLocaleDateString('pt-br');

    mostrarToast(`Disponível: ${recurso} em ${quando}`);
    location.hash = '#secSolicitar';
    atualizarMenuAtivo();
});

// 3. Solicitar reserva

// Aplica RN simulada e registra no histórico
formSolicitar?.addEventListener('submit', (e) => {
    e.preventDefault;

    if (!usuarioAtual) {
        mostrarToast("Faça login antes de solicitar", 'warn');

        location.hash = '#secLogin';

        atualizarMenuAtivo();
        return;
    }
    if (!ultimoFiltroPesquisa) {
        mostrarToast("Pesquise a disponibilidade antes de solicitar", 'warn');

        location.hash = '#secPesquisa';

        atualizarMenuAtivo();
        return;
    }

    const { justificativa } = dadosDoForm(formSolicitar);
    if (!justificativa) {
        mostrarToast("Descreva a justificativa", 'warn');
        return;
    }

    // SPRINT 3 - Monta objeto completo para persistência
    const recursoId = Number(ultimoFiltroPesquisa.recurso);
    const data = ultimoFiltroPesquisa.data;
    const horaInicio = ultimoFiltroPesquisa.hora;
    const horaFim = adicionar1Hora(horaInicio);

    if (hConflito({ recursoId, data, horaInicio, horaFim })) {
        mostrarToast("Conflito: Já existe reserva neste intervalo para este recurso", 'err');
    }

    // RN4 - Se login contêm "prof", aprova automáticamente
    const status = usuarioAtual.professor ? 'aprovada' : 'pendente';

    const nova = {
        // ...ultimoFiltroPesquisa,
        // SPRINT 3
        id: Date.now(),
        recursoId,
        usuarioId: usuarioAtual.login,
        justificativa,
        status,
        // autor: usuarioAtual.login
    };

    repo.push(DB_KEYS.reservas, nova); // Persistência
    renderItemReservaPersistida(nova); // Atualização da UI

    reservas.push(nova);
    renderItemReserva(nova);

    mostrarToast(status === 'aprovada' ? "Reserva aprovada automáticamente" : "Reserva enviada para análise");

    formSolicitar.reset()
    location.hash = '#secHistorico';

    atualizarMenuAtivo();
});

// 4. Renderização do histórico

// Lista simples(Sem <template> para que não quebre o HTML)
function renderItemReserva({ recurso, data, hora, justificativa, status }) {
    if (!listaReservas) return;

    const li = document.createElement('li');
    const quando = new Date(`${data}T${hora}`).toLocaleString('pt-br');

    li.innerHTML = `
        <span><strong>${recurso}</strong> - ${quando}</span>
        <span>${status === 'aprovada' ? "Aprovada" : status === "cancelada" ? 'Cancelada' : "Pendente"}</span>
    `;

    // Clique para cancelar
    li.addEventListener('click', () => {
        // Impedir recancelamento
        if (li.dataset.status === 'cancelada') return

        li.dataset.status = 'cancelada';
        li.lastElementChild.textContent = 'Cancelada';

        mostrarToast("Reserva cancelada", warn);
    });

    listaReservas.appendChild(li);
}

/*
==========================================================================
======                  Ajustes finais de Arranque                  ======
====== ------------------------------------------------------------ ======
====== Por que? Garantir que link ativo apareça já na carga inicial ======
==========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    atualizarMenuAtivo();
});